import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { BasicAuthGuard } from '../common/guards/basic-auth.guard';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { VacanciesService } from './vacancies.service';

@ApiTags('Vacancies')
@Controller('v1/vacancies')
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active vacancies' })
  findAll() {
    return this.vacanciesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vacancy detail by ID' })
  @ApiParam({ name: 'id', description: 'Vacancy ID' })
  findOne(@Param('id') id: string) {
    return this.vacanciesService.findOne(id);
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  @ApiBasicAuth()
  @ApiOperation({ summary: 'Create a new vacancy (admin only)' })
  create(@Body() dto: CreateVacancyDto) {
    return this.vacanciesService.create(dto);
  }

  @Patch(':id')
  @UseGuards(BasicAuthGuard)
  @ApiBasicAuth()
  @ApiOperation({ summary: 'Update a vacancy (admin only)' })
  @ApiParam({ name: 'id', description: 'Vacancy ID' })
  update(@Param('id') id: string, @Body() dto: UpdateVacancyDto) {
    return this.vacanciesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(BasicAuthGuard)
  @ApiBasicAuth()
  @ApiOperation({ summary: 'Deactivate a vacancy — soft delete (admin only)' })
  @ApiParam({ name: 'id', description: 'Vacancy ID' })
  remove(@Param('id') id: string) {
    return this.vacanciesService.remove(id);
  }
}
