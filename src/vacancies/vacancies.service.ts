import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { QueryVacanciesDto } from './dto/query-vacancies.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';

const LIST_SELECT = {
  id: true,
  title: true,
  company: true,
  companyLogo: true,
  category: true,
  workType: true,
  location: true,
  gender: true,
  salaryMin: true,
  salaryMax: true,
  createdAt: true,
};

const DETAIL_SELECT = {
  id: true,
  title: true,
  company: true,
  companyLogo: true,
  category: true,
  workType: true,
  location: true,
  gender: true,
  salaryMin: true,
  salaryMax: true,
  ageRange: true,
  workSchedule: true,
  address: true,
  requirements: true,
  benefits: true,
  contactPhone: true,
  contactTelegram: true,
  applyLink: true,
  createdAt: true,
};

@Injectable()
export class VacanciesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryVacanciesDto) {
    const { limit, cursor, search, category, workType, location, gender } = query;

    const where = {
      isActive: true,
      ...(category && { category }),
      ...(workType && { workType }),
      ...(location && { location }),
      ...(gender && { gender }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { company: { contains: search, mode: 'insensitive' as const } },
          { location: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const vacancies = await this.prisma.vacancy.findMany({
      where,
      select: LIST_SELECT,
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    });

    const hasMore = vacancies.length > limit;
    const data = vacancies.slice(0, limit);

    return {
      data,
      cursor: hasMore ? data[data.length - 1].id : null,
      hasMore,
    };
  }

  async findOne(id: string) {
    const vacancy = await this.prisma.vacancy.findFirst({
      where: { id, isActive: true },
      select: DETAIL_SELECT,
    });
    if (!vacancy) throw new NotFoundException();
    return vacancy;
  }

  async create(dto: CreateVacancyDto) {
    return this.prisma.vacancy.create({ data: dto, select: DETAIL_SELECT });
  }

  async update(id: string, dto: UpdateVacancyDto) {
    await this.findOne(id);
    return this.prisma.vacancy.update({
      where: { id },
      data: dto,
      select: DETAIL_SELECT,
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
