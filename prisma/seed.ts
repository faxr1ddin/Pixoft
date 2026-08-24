import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.vacancy.count();
  if (count > 0) {
    console.log('Already seeded, skipping');
    return;
  }

  await prisma.vacancy.createMany({
    data: [
      {
        title: 'iOS Developer',
        company: 'Najot Ta\'lim',
        companyLogo: null,
        workType: "To'liq stavka",
        location: 'Toshkent',
        gender: null,
        salaryMin: 8000000,
        salaryMax: 15000000,
        category: 'IT',
        ageRange: '20-35',
        workSchedule: 'Dushanba-Juma, 09:00-18:00',
        address: 'Mirzo Ulug\'bek tumani, Universitet ko\'chasi 2',
        benefits: ['MacBook Pro beriladi', 'Sug\'urta', 'Korporativ ovqatlanish'],
        requirements: ['Swift / SwiftUI bilimi', 'UIKit tajribasi', '1 yildan ortiq tajriba', 'Git bilishi'],
        contactPhone: '+998712345678',
        contactTelegram: '@najot_hr',
        applyLink: null,
        isActive: true,
      },
      {
        title: 'Savdo menejeri',
        company: 'Artel Electronics',
        companyLogo: null,
        workType: "To'liq stavka",
        location: 'Andijon',
        gender: 'Erkak',
        salaryMin: 3000000,
        salaryMax: 6000000,
        category: 'Savdo',
        ageRange: '22-40',
        workSchedule: 'Dushanba-Shanba, 09:00-17:00',
        address: 'Andijon sh., Mustaqillik ko\'chasi 15',
        benefits: ['Oylik bonus', 'Korporativ telefon', 'Transport xarajatlari qoplanadi'],
        requirements: ['Savdo sohasida 2 yil tajriba', 'Muloqot ko\'nikmalari', 'B toifali haydovchilik guvohnomasi'],
        contactPhone: '+998742345678',
        contactTelegram: null,
        applyLink: null,
        isActive: true,
      },
      {
        title: 'Oshpaz',
        company: 'Mimino Restaurant',
        companyLogo: null,
        workType: "To'liq stavka",
        location: 'Samarqand',
        gender: null,
        salaryMin: 4000000,
        salaryMax: null,
        category: 'Xizmat',
        ageRange: '25-50',
        workSchedule: '2/2 smenali ish tartibi',
        address: 'Samarqand sh., Registon ko\'chasi 8',
        benefits: ['Ish joyi ovqatlanish', 'Forma beriladi'],
        requirements: ['Milliy taomlar tayyorlash tajribasi', 'Sanitariya sertifikati', 'Jamoada ishlash ko\'nikmalari'],
        contactPhone: '+998662345678',
        contactTelegram: '@mimino_hr',
        applyLink: null,
        isActive: true,
      },
    ],
  });

  console.log('Seeded 3 vacancies');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
