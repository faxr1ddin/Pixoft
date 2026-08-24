import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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

  async findAll() {
    return this.prisma.vacancy.findMany({
      where: { isActive: true },
      select: LIST_SELECT,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const vacancy = await this.prisma.vacancy.findFirst({
      where: { id, isActive: true },
      select: DETAIL_SELECT,
    });
    if (!vacancy) throw new NotFoundException();
    return vacancy;
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
