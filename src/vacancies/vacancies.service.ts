import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  VACANCY_DETAIL_SELECT,
  VACANCY_LIST_SELECT,
} from './constants/vacancy-select';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';

@Injectable()
export class VacanciesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateVacancyDto) {
    const { roles, ...rest } = dto;
    return this.prisma.vacancy.create({
      data: { ...rest, roles: { create: roles } },
      select: VACANCY_DETAIL_SELECT,
    });
  }

  findAll() {
    return this.prisma.vacancy.findMany({
      where: { isActive: true },
      select: VACANCY_LIST_SELECT,
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Compact recent list (code + title) for the bot's /list command. */
  listRecent(limit = 20) {
    return this.prisma.vacancy.findMany({
      where: { isActive: true },
      select: { code: true, title: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
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

    const { roles, ...rest } = dto;
    return this.prisma.vacancy.update({
      where: { id },
      data: {
        ...rest,
        ...(roles && { roles: { deleteMany: {}, create: roles } }),
      },
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

  /** Soft-delete by the human-friendly sequential code (used by the bot). */
  async removeByCode(code: number) {
    const vacancy = await this.prisma.vacancy.findFirst({
      where: { code, isActive: true },
      select: { id: true },
    });

    if (!vacancy) {
      throw new NotFoundException();
    }

    await this.prisma.vacancy.update({
      where: { id: vacancy.id },
      data: { isActive: false },
    });

    return { success: true };
  }
}
