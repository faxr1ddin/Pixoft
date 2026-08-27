import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { AI_PARSER, AiParser } from '../ai/ai-parser.interface';
import { AdInput } from '../ai/ai-parser.types';
import { VacanciesService } from '../vacancies/vacancies.service';
import { parsedAdToDto } from './vacancy-mapper';

@Injectable()
export class BotService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(BotService.name);
  private bot?: Telegraf;

  /** Admin ids that sent /delete and whose next message is the id to delete. */
  private readonly awaitingDelete = new Set<number>();

  private readonly adminIds = new Set(
    (process.env.ADMIN_IDS ?? '')
      .split(',')
      .map((id) => Number(id.trim()))
      .filter((id) => Number.isInteger(id)),
  );

  constructor(
    @Inject(AI_PARSER) private readonly aiParser: AiParser,
    private readonly vacanciesService: VacanciesService,
  ) {}

  onModuleInit() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      this.logger.warn('TELEGRAM_BOT_TOKEN not set — Telegram bot disabled');
      return;
    }

    this.bot = new Telegraf(token);
    this.registerHandlers(this.bot);
    void this.bot
      .launch()
      .catch((error) => this.logger.error(`Bot launch failed: ${error}`));
    this.logger.log('Telegram bot started');
  }

  onModuleDestroy() {
    this.bot?.stop('SIGTERM');
  }

  private isAdmin(id?: number): boolean {
    return id !== undefined && this.adminIds.has(id);
  }

  private registerHandlers(bot: Telegraf) {
    bot.start((ctx) =>
      ctx.reply(
        this.isAdmin(ctx.from?.id)
          ? "Assalomu alaykum! Vakansiya e'lonini matn yoki rasm ko'rinishida yuboring — men uni avtomatik chop etaman.\n\nO'chirish uchun: /delete"
          : 'Kechirasiz, bu bot faqat administratorlar uchun.',
      ),
    );

    bot.command('delete', async (ctx) => {
      if (!(await this.guardAdmin(ctx))) return;
      this.awaitingDelete.add(ctx.from.id);
      await ctx.reply("O'chirmoqchi bo'lgan vakansiya ID raqamini yuboring:");
    });

    bot.on('text', async (ctx) => {
      if (ctx.message.text.startsWith('/')) return;
      if (!(await this.guardAdmin(ctx))) return;

      if (this.awaitingDelete.has(ctx.from.id)) {
        this.awaitingDelete.delete(ctx.from.id);
        await this.deleteByCode(ctx, ctx.message.text.trim());
        return;
      }

      await this.createAndReply(ctx, { text: ctx.message.text });
    });

    bot.on('photo', async (ctx) => {
      if (!(await this.guardAdmin(ctx))) return;
      const image = await this.downloadPhoto(ctx);
      if (!image) {
        await ctx.reply("Rasmni o'qib bo'lmadi. Iltimos, qaytadan yuboring.");
        return;
      }
      await this.createAndReply(ctx, { image, text: ctx.message.caption });
    });
  }

  private async guardAdmin(ctx: any): Promise<boolean> {
    if (this.isAdmin(ctx.from?.id)) return true;
    await ctx.reply("Ruxsat yo'q.");
    return false;
  }

  private async downloadPhoto(
    ctx: any,
  ): Promise<{ base64: string; mimeType: string } | null> {
    try {
      const photos = ctx.message.photo;
      const fileId = photos[photos.length - 1].file_id;
      const link = await ctx.telegram.getFileLink(fileId);
      const res = await fetch(link.toString());
      const buffer = Buffer.from(await res.arrayBuffer());
      return { base64: buffer.toString('base64'), mimeType: 'image/jpeg' };
    } catch (error) {
      this.logger.error(`Photo download failed: ${error}`);
      return null;
    }
  }

  private async createAndReply(ctx: any, input: AdInput) {
    const notice = await ctx.reply('⏳ Tahlil qilinmoqda...');
    try {
      const parsed = await this.aiParser.parse(input);
      const dto = parsedAdToDto(parsed, input.text ?? '');
      const vacancy = await this.vacanciesService.create(dto);

      await ctx.telegram.deleteMessage(ctx.chat.id, notice.message_id);
      await ctx.replyWithHTML(
        `✅ Vakansiya chop etildi.\nID: <b>${vacancy.code}</b>`,
      );
    } catch (error) {
      this.logger.error(`Parse/create failed: ${error}`);
      await ctx.reply("Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.");
    }
  }

  private async deleteByCode(ctx: any, input: string) {
    const code = Number(input);
    if (!Number.isInteger(code) || code <= 0) {
      await ctx.reply("Noto'g'ri ID. Faqat raqam kiriting, masalan: 3");
      return;
    }

    try {
      await this.vacanciesService.removeByCode(code);
      await ctx.replyWithHTML(`🗑 <b>${code}</b>-vakansiya o'chirildi.`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        await ctx.reply(`${code}-ID bo'yicha vakansiya topilmadi.`);
      } else {
        this.logger.error(`Delete failed: ${error}`);
        await ctx.reply('Xatolik yuz berdi.');
      }
    }
  }
}
