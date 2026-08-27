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
 * The structured result of parsing one raw advertisement into a single
 * vacancy. A post may name several roles, cities and phones, so those are
 * lists on the one vacancy — the ad is never split. Every field the ad does
 * not clearly state is null (or [] for lists); the parser never guesses.
 * `category` is the one allowed classification.
 */
export interface ParsedAd {
  positions: string[];
  company: string | null;
  workType: WorkType | null;
  locations: string[];
  gender: Gender | null;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: Currency | null;
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

/** Input to the parser: free text, an image, or an image with a caption. */
export interface AdInput {
  text?: string;
  image?: { base64: string; mimeType: string };
}
