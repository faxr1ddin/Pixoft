import { Module } from '@nestjs/common';
import { AI_PARSER } from './ai-parser.interface';
import { ClaudeParserService } from './claude-parser.service';

@Module({
  providers: [{ provide: AI_PARSER, useClass: ClaudeParserService }],
  exports: [AI_PARSER],
})
export class AiModule {}
