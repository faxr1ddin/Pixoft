export const WORK_TYPES = [
  "To'liq stavka",
  'Yarim stavka',
  'Masofaviy',
  'Vaqtinchalik',
] as const;

export const GENDERS = ['Erkak', 'Ayol'] as const;

export const CATEGORIES = ['IT', 'Savdo', 'Xizmat', 'Boshqa'] as const;

export const CURRENCIES = ['UZS', 'USD'] as const;

export type WorkType = (typeof WORK_TYPES)[number];
export type Gender = (typeof GENDERS)[number];
export type Category = (typeof CATEGORIES)[number];
export type Currency = (typeof CURRENCIES)[number];

/** Guard against a malformed response producing an absurd array. */
export const MAX_LIST_ITEMS = 30;

/**
 * One role within a vacancy. A post may advertise several roles that differ
 * in gender, age, salary or requirements (e.g. gendered sections), so these
 * attributes live on the role, not the vacancy. Fields the ad does not state
 * are null (or [] for lists); the parser never guesses.
 */
export interface ParsedRole {
  title: string;
  gender: Gender | null;
  ageRange: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: Currency | null;
  requirements: string[];
}

/**
 * The structured result of parsing one advertisement into a single vacancy.
 * `roles` holds one or more positions; everything else is shared across them
 * (company, locations, schedule, benefits, contacts). The ad is never split.
 */
export interface ParsedAd {
  roles: ParsedRole[];
  company: string | null;
  category: Category;
  workType: WorkType | null;
  locations: string[];
  workSchedule: string | null;
  address: string | null;
  description: string | null;
  benefits: string[];
  phones: string[];
  contactTelegram: string | null;
  applyLink: string | null;
}

/** Input to the parser: free text, an image, or an image with a caption. */
export interface AdInput {
  text?: string;
  image?: { base64: string; mimeType: string };
}
