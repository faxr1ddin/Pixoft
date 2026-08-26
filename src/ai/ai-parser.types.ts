export const WORK_TYPES = [
  "To'liq stavka",
  'Yarim stavka',
  'Masofaviy',
  'Vaqtinchalik',
] as const;

export const GENDERS = ['Erkak', 'Ayol'] as const;

export const CATEGORIES = ['IT', 'Savdo', 'Xizmat', 'Boshqa'] as const;

export type WorkType = (typeof WORK_TYPES)[number];
export type Gender = (typeof GENDERS)[number];
export type Category = (typeof CATEGORIES)[number];

/**
 * The structured result of parsing a raw job advertisement.
 * Every field the ad does not clearly state is null (or [] for lists) —
 * the parser never guesses. `category` is the one allowed classification.
 */
export interface ParsedVacancy {
  title: string | null;
  company: string | null;
  workType: WorkType | null;
  location: string | null;
  gender: Gender | null;
  salaryMin: number | null;
  salaryMax: number | null;
  category: Category;
  ageRange: string | null;
  workSchedule: string | null;
  address: string | null;
  benefits: string[];
  requirements: string[];
  contactPhone: string | null;
  contactTelegram: string | null;
  applyLink: string | null;
}
