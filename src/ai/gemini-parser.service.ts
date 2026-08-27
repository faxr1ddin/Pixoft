import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { AiParser } from './ai-parser.interface';
import { ParsedAd } from './ai-parser.types';
import {
  buildExtractionUserMessage,
  EXTRACTION_SYSTEM_PROMPT,
} from './extraction.prompt';
import { normalizeParsed } from './normalization';

const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * Free-tier AI parser backed by Google Gemini (Google AI Studio).
 * Uses plain fetch — no SDK, no cost. Get a free key at aistudio.google.com.
 */
@Injectable()
export class GeminiParserService implements AiParser {
  private readonly logger = new Logger(GeminiParserService.name);
  private readonly model = process.env.AI_MODEL ?? 'gemini-3.6-flash';
  private readonly apiKey = process.env.GEMINI_API_KEY ?? '';

  async parse(sourceText: string): Promise<ParsedAd> {
    const text = sourceText?.trim();
    if (!text) {
      throw new InternalServerErrorException('Empty advertisement text');
    }
    if (!this.apiKey) {
      throw new InternalServerErrorException('GEMINI_API_KEY is not set');
    }

    const raw = await this.request(text);
    return normalizeParsed(this.extractJson(raw));
  }

  private async request(text: string): Promise<string> {
    const url = `${API_BASE}/${this.model}:generateContent?key=${this.apiKey}`;
    const body = {
      systemInstruction: { parts: [{ text: EXTRACTION_SYSTEM_PROMPT }] },
      contents: [{ parts: [{ text: buildExtractionUserMessage(text) }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0,
        maxOutputTokens: 2048,
      },
    };

    let response: Response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch (error) {
      this.logger.error(`Gemini request failed: ${error}`);
      throw new InternalServerErrorException('AI parsing failed');
    }

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      this.logger.error(`Gemini HTTP ${response.status}: ${detail.slice(0, 300)}`);
      throw new InternalServerErrorException('AI parsing failed');
    }

    const data = (await response.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  }

  private extractJson(raw: string): Record<string, unknown> {
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
