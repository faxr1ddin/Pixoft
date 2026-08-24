import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
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

  @Get(':id')
  @ApiOperation({ summary: 'Get vacancy detail by ID' })
  @ApiParam({ name: 'id', description: 'Vacancy ID' })
  findOne(@Param('id') id: string) {
    return this.vacanciesService.findOne(id);
  }
}
