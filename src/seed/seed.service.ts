import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onApplicationBootstrap() {
    const count = await this.prisma.vacancy.count();
    if (count > 0) return;

    await this.prisma.vacancy.createMany({
      data: [
        {
          title: "iOS Developer",
          company: "Najot Ta'lim",
          workType: "To'liq stavka",
          location: "Toshkent",
          salaryMin: 8000000,
          salaryMax: 15000000,
          category: "IT",
          ageRange: "20-35",
          workSchedule: "Dushanba-Juma, 09:00-18:00",
          address: "Mirzo Ulug'bek tumani, Universitet ko'chasi 2",
          benefits: ["MacBook Pro beriladi", "Sug'urta", "Korporativ ovqatlanish"],
          requirements: ["Swift / SwiftUI bilimi", "UIKit tajribasi", "1 yildan ortiq tajriba", "Git bilishi"],
          contactPhone: "+998712345678",
          contactTelegram: "@najot_hr",
          isActive: true,
        },
        {
          title: "Savdo menejeri",
          company: "Artel Electronics",
          workType: "To'liq stavka",
          location: "Andijon",
          gender: "Erkak",
          salaryMin: 3000000,
          salaryMax: 6000000,
          category: "Savdo",
          ageRange: "22-40",
          workSchedule: "Dushanba-Shanba, 09:00-17:00",
          address: "Andijon sh., Mustaqillik ko'chasi 15",
          benefits: ["Oylik bonus", "Korporativ telefon", "Transport xarajatlari qoplanadi"],
          requirements: ["Savdo sohasida 2 yil tajriba", "Muloqot ko'nikmalari"],
          contactPhone: "+998742345678",
          isActive: true,
        },
        {
          title: "Oshpaz",
          company: "Mimino Restaurant",
          workType: "To'liq stavka",
          location: "Samarqand",
          salaryMin: 4000000,
          category: "Xizmat",
          ageRange: "25-50",
          workSchedule: "2/2 smenali ish tartibi",
          address: "Samarqand sh., Registon ko'chasi 8",
          benefits: ["Ish joyi ovqatlanish", "Forma beriladi"],
          requirements: ["Milliy taomlar tayyorlash tajribasi", "Sanitariya sertifikati"],
          contactPhone: "+998662345678",
          contactTelegram: "@mimino_hr",
          isActive: true,
        },
      ],
    });

    this.logger.log('Seeded 3 vacancies');
  }
}
