import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  VACANCY_DETAIL_SELECT,
  VACANCY_LIST_SELECT,
} from './constants/vacancy-select';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';

@Injectable()
export class VacanciesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.vacancy.findMany({
      where: { isActive: true },
      select: VACANCY_LIST_SELECT,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const vacancy = await this.prisma.vacancy.findFirst({
      where: { id, isActive: true },
      select: VACANCY_DETAIL_SELECT,
    });

    if (!vacancy) {
      throw new NotFoundException();
    }

    return vacancy;
  }

  async update(id: string, dto: UpdateVacancyDto) {
    await this.findOne(id);

    return this.prisma.vacancy.update({
      where: { id },
      data: dto,
      select: VACANCY_DETAIL_SELECT,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.vacancy.update({
      where: { id },
      data: { isActive: false },
    });

    return { success: true };
  }
}
