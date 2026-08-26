import { ParsedVacancy } from './ai-parser.types';

/**
 * Port for the AI extraction engine. The application depends on this
 * interface, not on any specific provider (Claude, Gemini, Ollama…),
 * so implementations can be swapped without touching business logic.
 */
export interface AiParser {
  parse(sourceText: string): Promise<ParsedVacancy>;
}

/** DI token for the active AiParser implementation. */
export const AI_PARSER = Symbol('AI_PARSER');
