import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { QueryVacanciesDto } from './dto/query-vacancies.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { VacanciesService } from './vacancies.service';

@ApiTags('Vacancies')
@Controller('v1/vacancies')
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active vacancies' })
  findAll(@Query() query: QueryVacanciesDto) {
    return this.vacanciesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vacancy detail by ID' })
  @ApiParam({ name: 'id', description: 'Vacancy ID' })
  findOne(@Param('id') id: string) {
    return this.vacanciesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new vacancy' })
  create(@Body() dto: CreateVacancyDto) {
    return this.vacanciesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a vacancy' })
  @ApiParam({ name: 'id', description: 'Vacancy ID' })
  update(@Param('id') id: string, @Body() dto: UpdateVacancyDto) {
    return this.vacanciesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate a vacancy (soft delete)' })
  @ApiParam({ name: 'id', description: 'Vacancy ID' })
  remove(@Param('id') id: string) {
    return this.vacanciesService.remove(id);
  }
}
