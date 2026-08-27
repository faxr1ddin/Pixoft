import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Markup, Telegraf } from 'telegraf';
import { AI_PARSER, AiParser } from '../ai/ai-parser.interface';
import { ParsedAd } from '../ai/ai-parser.types';
import { VacanciesService } from '../vacancies/vacancies.service';
import { renderPreview } from './preview';
import { parsedAdToDtos } from './vacancy-mapper';

interface Draft {
  sourceText: string;
  parsed: ParsedAd;
}

const previewKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback('✅ Tasdiqlash', 'confirm'),
    Markup.button.callback('✏️ Tahrirlash', 'edit'),
    Markup.button.callback('❌ Bekor qilish', 'cancel'),
  ],
]);

@Injectable()
export class BotService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(BotService.name);
  private readonly drafts = new Map<number, Draft>();
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
          ? "Assalomu alaykum! Vakansiya e'lonini yuboring — men uni tahlil qilib, chop etishga tayyorlayman."
          : "Kechirasiz, bu bot faqat administratorlar uchun.",
      ),
    );

    bot.on('text', async (ctx) => {
      if (ctx.message.text.startsWith('/')) return;
      if (!this.isAdmin(ctx.from?.id)) {
        await ctx.reply("Ruxsat yo'q.");
        return;
      }
      await this.handleAd(ctx, ctx.message.text);
    });

    bot.action('confirm', (ctx) => this.handleConfirm(ctx));
    bot.action('cancel', (ctx) => this.handleCancel(ctx));
    bot.action('edit', (ctx) => this.handleEdit(ctx));
  }

  private async handleAd(ctx: any, sourceText: string) {
    const notice = await ctx.reply('⏳ Tahlil qilinmoqda...');
    try {
      const parsed = await this.aiParser.parse(sourceText);
      this.drafts.set(ctx.from.id, { sourceText, parsed });
      await ctx.telegram.deleteMessage(ctx.chat.id, notice.message_id);
      await ctx.replyWithMarkdown(renderPreview(parsed), previewKeyboard);
    } catch (error) {
      this.logger.error(`Parse failed: ${error}`);
      await ctx.reply('Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
    }
  }

  private async handleConfirm(ctx: any) {
    const draft = this.drafts.get(ctx.from.id);
    if (!draft) {
      await ctx.answerCbQuery('Eskirgan.');
      return;
    }
    try {
      const dtos = parsedAdToDtos(draft.parsed, draft.sourceText);
      for (const dto of dtos) {
        await this.vacanciesService.create(dto);
      }
      this.drafts.delete(ctx.from.id);
      await ctx.editMessageReplyMarkup(undefined);
      await ctx.reply(`✅ ${dtos.length} ta vakansiya chop etildi.`);
      await ctx.answerCbQuery();
    } catch (error) {
      this.logger.error(`Create failed: ${error}`);
      await ctx.answerCbQuery('Xatolik yuz berdi.');
    }
  }

  private async handleCancel(ctx: any) {
    this.drafts.delete(ctx.from.id);
    await ctx.editMessageReplyMarkup(undefined);
    await ctx.reply('❌ Bekor qilindi.');
    await ctx.answerCbQuery();
  }

  private async handleEdit(ctx: any) {
    await ctx.answerCbQuery();
    await ctx.reply(
      "✏️ Tuzatilgan e'lon matnini qaytadan yuboring — men uni qayta tahlil qilaman.",
    );
  }
}
