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
import { VacanciesService } from '../vacancies/vacancies.service';
import { parsedAdToDtos } from './vacancy-mapper';

const escapeHtml = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

@Injectable()
export class BotService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(BotService.name);
  private bot?: Telegraf;

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
          ? "Assalomu alaykum! Vakansiya e'lonini yuboring — men uni avtomatik chop etaman.\n\nO'chirish uchun: /delete <id>"
          : 'Kechirasiz, bu bot faqat administratorlar uchun.',
      ),
    );

    bot.command('delete', (ctx) => this.handleDelete(ctx));

    bot.on('text', async (ctx) => {
      if (ctx.message.text.startsWith('/')) return;
      if (!this.isAdmin(ctx.from?.id)) {
        await ctx.reply("Ruxsat yo'q.");
        return;
      }
      await this.handleAd(ctx, ctx.message.text);
    });
  }

  private async handleAd(ctx: any, sourceText: string) {
    const notice = await ctx.reply('⏳ Tahlil qilinmoqda...');
    try {
      const parsed = await this.aiParser.parse(sourceText);
      const dtos = parsedAdToDtos(parsed, sourceText);

      const created: { title: string; id: string }[] = [];
      for (const dto of dtos) {
        const vacancy = await this.vacanciesService.create(dto);
        created.push({ title: dto.title, id: vacancy.id });
      }

      await ctx.telegram.deleteMessage(ctx.chat.id, notice.message_id);

      const lines = created
        .map((v, i) => `${i + 1}. ${escapeHtml(v.title)}\n<code>${v.id}</code>`)
        .join('\n\n');
      await ctx.replyWithHTML(
        `✅ ${created.length} ta vakansiya chop etildi.\n\n${lines}`,
      );
    } catch (error) {
      this.logger.error(`Parse/create failed: ${error}`);
      await ctx.reply("Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.");
    }
  }

  private async handleDelete(ctx: any) {
    if (!this.isAdmin(ctx.from?.id)) {
      await ctx.reply("Ruxsat yo'q.");
      return;
    }

    const ids = ctx.message.text.trim().split(/\s+/).slice(1);
    if (ids.length === 0) {
      await ctx.reply('Foydalanish: /delete <id> [<id> ...]');
      return;
    }

    const results: string[] = [];
    for (const id of ids) {
      try {
        await this.vacanciesService.remove(id);
        results.push(`🗑 <code>${escapeHtml(id)}</code> — o'chirildi`);
      } catch (error) {
        const notFound = error instanceof NotFoundException;
        if (!notFound) this.logger.error(`Delete failed: ${error}`);
        results.push(
          `⚠️ <code>${escapeHtml(id)}</code> — ${
            notFound ? 'topilmadi' : 'xatolik'
          }`,
        );
      }
    }

    await ctx.replyWithHTML(results.join('\n'));
  }
}
