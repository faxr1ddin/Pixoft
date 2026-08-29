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

const HELP =
  "Vakansiya e'lonini matn yoki rasm ko'rinishida yuboring — men uni avtomatik chop etaman.\n\n" +
  "📋 /list — so'nggi vakansiyalar\n" +
  '🗑 /delete — vakansiyani ID bo\'yicha o\'chirish\n' +
  '❌ /cancel — amaldagi jarayonni bekor qilish';

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
    void this.bot.telegram
      .setMyCommands([
        { command: 'list', description: "So'nggi vakansiyalar" },
        { command: 'delete', description: "Vakansiyani o'chirish" },
        { command: 'cancel', description: 'Bekor qilish' },
        { command: 'help', description: 'Yordam' },
      ])
      .catch((error) => this.logger.warn(`setMyCommands failed: ${error}`));
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
          ? `Assalomu alaykum!\n\n${HELP}`
          : 'Kechirasiz, bu bot faqat administratorlar uchun.',
      ),
    );

    bot.help((ctx) => this.guarded(ctx, () => ctx.reply(HELP)));
    bot.command('list', (ctx) => this.guarded(ctx, () => this.handleList(ctx)));
    bot.command('delete', (ctx) =>
      this.guarded(ctx, () => this.handleDeletePrompt(ctx)),
    );
    bot.command('cancel', (ctx) =>
      this.guarded(ctx, () => this.handleCancel(ctx)),
    );

    bot.on('text', (ctx) =>
      this.guarded(ctx, async () => {
        if (ctx.message.text.startsWith('/')) return;
        if (this.awaitingDelete.has(ctx.from.id)) {
          this.awaitingDelete.delete(ctx.from.id);
          await this.deleteByCode(ctx, ctx.message.text.trim());
          return;
        }
        await this.createAndReply(ctx, { text: ctx.message.text });
      }),
    );

    bot.on('photo', (ctx) =>
      this.guarded(ctx, async () => {
        const photos = ctx.message.photo;
        const image = await this.downloadFile(
          ctx,
          photos[photos.length - 1].file_id,
          'image/jpeg',
        );
        await this.handleMedia(ctx, image, ctx.message.caption);
      }),
    );

    bot.on('document', (ctx) =>
      this.guarded(ctx, async () => {
        const doc = ctx.message.document;
        if (!doc.mime_type?.startsWith('image/')) {
          await ctx.reply('Faqat matn yoki rasm qabul qilinadi.');
          return;
        }
        const image = await this.downloadFile(ctx, doc.file_id, doc.mime_type);
        await this.handleMedia(ctx, image, ctx.message.caption);
      }),
    );
  }

  /** Admin gate + top-level error boundary shared by every handler. */
  private async guarded(ctx: any, handler: () => unknown) {
    if (!this.isAdmin(ctx.from?.id)) {
      await ctx.reply("Ruxsat yo'q.");
      return;
    }
    try {
      await handler();
    } catch (error) {
      this.logger.error(`Handler error: ${error}`);
      await ctx.reply("Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.");
    }
  }

  private async handleMedia(
    ctx: any,
    image: { base64: string; mimeType: string } | null,
    caption?: string,
  ) {
    if (!image) {
      await ctx.reply("Rasmni o'qib bo'lmadi. Iltimos, qaytadan yuboring.");
      return;
    }
    await this.createAndReply(ctx, { image, text: caption });
  }

  private async downloadFile(
    ctx: any,
    fileId: string,
    mimeType: string,
  ): Promise<{ base64: string; mimeType: string } | null> {
    try {
      const link = await ctx.telegram.getFileLink(fileId);
      const res = await fetch(link.toString());
      const buffer = Buffer.from(await res.arrayBuffer());
      return { base64: buffer.toString('base64'), mimeType };
    } catch (error) {
      this.logger.error(`File download failed: ${error}`);
      return null;
    }
  }

  private async createAndReply(ctx: any, input: AdInput) {
    const notice = await ctx.reply('⏳ Tahlil qilinmoqda...');
    const parsed = await this.aiParser.parse(input);
    const dto = parsedAdToDto(parsed, input.text ?? '');
    const vacancy = await this.vacanciesService.create(dto);

    await ctx.telegram.deleteMessage(ctx.chat.id, notice.message_id);
    await ctx.replyWithHTML(
      `✅ Vakansiya chop etildi.\nID: <b>${vacancy.code}</b>`,
    );
  }

  private async handleList(ctx: any) {
    const vacancies = await this.vacanciesService.listRecent();
    if (vacancies.length === 0) {
      await ctx.reply("Hozircha vakansiya yo'q.");
      return;
    }
    const lines = vacancies.map((v) => `${v.code} — ${v.title}`).join('\n');
    await ctx.reply(`📋 So'nggi vakansiyalar:\n\n${lines}`);
  }

  private async handleDeletePrompt(ctx: any) {
    this.awaitingDelete.add(ctx.from.id);
    await ctx.reply("O'chirmoqchi bo'lgan vakansiya ID raqamini yuboring:");
  }

  private async handleCancel(ctx: any) {
    const had = this.awaitingDelete.delete(ctx.from.id);
    await ctx.reply(had ? 'Bekor qilindi.' : "Faol amal yo'q.");
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
        throw error;
      }
    }
  }
}
