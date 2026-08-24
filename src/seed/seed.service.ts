import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SEED_VACANCIES } from './seed.data';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onApplicationBootstrap() {
    const count = await this.prisma.vacancy.count();
    if (count > 0) {
      return;
    }

    await this.prisma.vacancy.createMany({ data: SEED_VACANCIES });
    this.logger.log(`Seeded ${SEED_VACANCIES.length} vacancies`);
  }
}
