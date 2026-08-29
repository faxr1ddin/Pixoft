import { Prisma } from '@prisma/client';

/** Fields returned by the list endpoint (GET /vacancies). */
export const VACANCY_LIST_SELECT = {
  id: true,
  code: true,
  title: true,
  company: true,
  companyLogo: true,
  category: true,
  workType: true,
  locations: true,
  createdAt: true,
  roles: {
    select: {
      title: true,
      gender: true,
      salaryMin: true,
      salaryMax: true,
      currency: true,
    },
  },
} satisfies Prisma.VacancySelect;

/** Fields returned by the detail endpoint (GET /vacancies/:id). */
export const VACANCY_DETAIL_SELECT = {
  ...VACANCY_LIST_SELECT,
  workSchedule: true,
  address: true,
  description: true,
  benefits: true,
  phones: true,
  contactTelegram: true,
  applyLink: true,
  roles: {
    select: {
      id: true,
      title: true,
      gender: true,
      ageRange: true,
      salaryMin: true,
      salaryMax: true,
      currency: true,
      requirements: true,
    },
  },
} satisfies Prisma.VacancySelect;
