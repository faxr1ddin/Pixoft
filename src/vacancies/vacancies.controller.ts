import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryVacanciesDto } from './dto/query-vacancies.dto';
import { VacanciesService } from './vacancies.service';

@ApiTags('Vacancies')
@Controller('v1/vacancies')
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active vacancies with pagination and filters' })
  findAll(@Query() query: QueryVacanciesDto) {
    return this.vacanciesService.findAll(query);
  }
}
