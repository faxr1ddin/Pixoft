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

/** Max positions/vacancies we create from a single advertisement. */
export const MAX_POSITIONS = 20;

/**
 * The structured result of parsing one raw advertisement. A single post can
 * advertise several positions that share the same company, salary, locations
 * and contacts — so `positions` is a list and each becomes its own vacancy.
 * Every field the ad does not clearly state is null (or [] for lists) — the
 * parser never guesses. `category` is the one allowed classification.
 */
export interface ParsedAd {
  positions: string[];
  company: string | null;
  workType: WorkType | null;
  locations: string[];
  gender: Gender | null;
  salaryMin: number | null;
  salaryMax: number | null;
  category: Category;
  ageRange: string | null;
  workSchedule: string | null;
  address: string | null;
  benefits: string[];
  requirements: string[];
  phones: string[];
  contactTelegram: string | null;
  applyLink: string | null;
}
