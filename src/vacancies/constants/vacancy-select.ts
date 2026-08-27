import { Prisma } from '@prisma/client';

/** Fields returned by the list endpoint (GET /vacancies). */
export const VACANCY_LIST_SELECT = {
  id: true,
  title: true,
  positions: true,
  company: true,
  companyLogo: true,
  category: true,
  workType: true,
  locations: true,
  gender: true,
  salaryMin: true,
  salaryMax: true,
  currency: true,
  createdAt: true,
} satisfies Prisma.VacancySelect;

/** Fields returned by the detail endpoint (GET /vacancies/:id). */
export const VACANCY_DETAIL_SELECT = {
  ...VACANCY_LIST_SELECT,
  ageRange: true,
  workSchedule: true,
  address: true,
  requirements: true,
  benefits: true,
  phones: true,
  contactTelegram: true,
  applyLink: true,
} satisfies Prisma.VacancySelect;
