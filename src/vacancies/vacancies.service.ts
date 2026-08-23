import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryVacanciesDto } from './dto/query-vacancies.dto';

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
}
