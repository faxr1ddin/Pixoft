import { Module } from '@nestjs/common';
import { AI_PARSER } from './ai-parser.interface';
import { GeminiParserService } from './gemini-parser.service';

@Module({
  providers: [{ provide: AI_PARSER, useClass: GeminiParserService }],
  exports: [AI_PARSER],
})
export class AiModule {}
