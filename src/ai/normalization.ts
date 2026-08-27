import {
  CATEGORIES,
  Category,
  CURRENCIES,
  Currency,
  GENDERS,
  Gender,
  MAX_LIST_ITEMS,
  ParsedAd,
  WORK_TYPES,
  WorkType,
} from './ai-parser.types';

const oneOf = <T extends string>(value: unknown, allowed: readonly T[]): T | null =>
  typeof value === 'string' && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : null;

const asString = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const asStringArray = (value: unknown): string[] =>
  Array.isArray(value)
    ? value
        .map(asString)
        .filter((v): v is string => v !== null)
        .slice(0, MAX_LIST_ITEMS)
    : [];

/** Non-negative integer, or null. Floors floats and strips spaces. */
const asAmount = (value: unknown): number | null => {
  const n = typeof value === 'string' ? Number(value.replace(/\s/g, '')) : value;
  return typeof n === 'number' && Number.isFinite(n) && n >= 0
    ? Math.floor(n)
    : null;
};

/** Normalize an Uzbek phone number to +998XXXXXXXXX where possible. */
export const normalizePhone = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 9) return `+998${digits}`;
  if (digits.length === 12 && digits.startsWith('998')) return `+${digits}`;
  return value.trim();
};

/**
 * Coerce a raw AI JSON object into a valid ParsedAd: drop unknown enum
 * values, clamp salaries so min <= max, dedupe phones, and guarantee list
 * fields are clean, bounded arrays.
 */
export const normalizeParsed = (raw: Record<string, unknown>): ParsedAd => {
  let salaryMin = asAmount(raw.salaryMin);
  let salaryMax = asAmount(raw.salaryMax);
  if (salaryMin !== null && salaryMax !== null && salaryMin > salaryMax) {
    [salaryMin, salaryMax] = [salaryMax, salaryMin];
  }

  const hasSalary = salaryMin !== null || salaryMax !== null;
  const currency = hasSalary
    ? oneOf<Currency>(raw.currency, CURRENCIES) ?? 'UZS'
    : null;

  const phones = [...new Set(asStringArray(raw.phones).map(normalizePhone))];

  return {
    positions: asStringArray(raw.positions),
    company: asString(raw.company),
    workType: oneOf<WorkType>(raw.workType, WORK_TYPES),
    locations: asStringArray(raw.locations),
    gender: oneOf<Gender>(raw.gender, GENDERS),
    salaryMin,
    salaryMax,
    currency,
    category: oneOf<Category>(raw.category, CATEGORIES) ?? 'Boshqa',
    ageRange: asString(raw.ageRange),
    workSchedule: asString(raw.workSchedule),
    address: asString(raw.address),
    benefits: asStringArray(raw.benefits),
    requirements: asStringArray(raw.requirements),
    phones,
    contactTelegram: asString(raw.contactTelegram),
    applyLink: asString(raw.applyLink),
  };
};
