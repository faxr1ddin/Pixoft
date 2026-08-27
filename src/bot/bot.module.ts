import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { VacanciesModule } from '../vacancies/vacancies.module';
import { BotService } from './bot.service';

@Module({
  imports: [AiModule, VacanciesModule],
  providers: [BotService],
})
export class BotModule {}
