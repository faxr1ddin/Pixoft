import Anthropic from '@anthropic-ai/sdk';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { AiParser } from './ai-parser.interface';
import { ParsedVacancy } from './ai-parser.types';
import {
  buildExtractionUserMessage,
  EXTRACTION_SYSTEM_PROMPT,
} from './extraction.prompt';
import { normalizeParsed } from './normalization';

@Injectable()
export class ClaudeParserService implements AiParser {
  private readonly logger = new Logger(ClaudeParserService.name);
  private readonly client = new Anthropic();
  private readonly model = process.env.AI_MODEL ?? 'claude-opus-4-8';

  async parse(sourceText: string): Promise<ParsedVacancy> {
    const text = sourceText?.trim();
    if (!text) {
      throw new InternalServerErrorException('Empty advertisement text');
    }

    let response: Anthropic.Message;
    try {
      response = await this.client.messages.create({
        model: this.model,
        max_tokens: 2000,
        system: EXTRACTION_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: buildExtractionUserMessage(text) }],
      });
    } catch (error) {
      this.logger.error(`AI request failed: ${error}`);
      throw new InternalServerErrorException('AI parsing failed');
    }

    return normalizeParsed(this.extractJson(response));
  }

  /** Pull the first text block, strip any code fences, and JSON.parse it. */
  private extractJson(response: Anthropic.Message): Record<string, unknown> {
    const block = response.content.find((b) => b.type === 'text');
    const raw = block && block.type === 'text' ? block.text : '';
    const cleaned = raw
      .replace(/^\s*```(?:json)?/i, '')
      .replace(/```\s*$/, '')
      .trim();

    try {
      const parsed = JSON.parse(cleaned);
      if (parsed && typeof parsed === 'object') {
        return parsed as Record<string, unknown>;
      }
      throw new Error('AI response was not a JSON object');
    } catch (error) {
      this.logger.error(`Malformed AI JSON: ${error} | raw: ${raw.slice(0, 500)}`);
      throw new InternalServerErrorException('AI returned malformed data');
    }
  }
}
