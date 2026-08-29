import {
  CATEGORIES,
  Category,
  CURRENCIES,
  Currency,
  GENDERS,
  Gender,
  MAX_LIST_ITEMS,
  ParsedAd,
  ParsedRole,
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

const normalizeRole = (raw: Record<string, unknown>): ParsedRole => {
  let salaryMin = asAmount(raw.salaryMin);
  let salaryMax = asAmount(raw.salaryMax);
  if (salaryMin !== null && salaryMax !== null && salaryMin > salaryMax) {
    [salaryMin, salaryMax] = [salaryMax, salaryMin];
  }
  const hasSalary = salaryMin !== null || salaryMax !== null;

  return {
    title: asString(raw.title) ?? 'Nomsiz lavozim',
    gender: oneOf<Gender>(raw.gender, GENDERS),
    ageRange: asString(raw.ageRange),
    salaryMin,
    salaryMax,
    currency: hasSalary ? oneOf<Currency>(raw.currency, CURRENCIES) ?? 'UZS' : null,
    requirements: asStringArray(raw.requirements),
  };
};

/**
 * Coerce a raw AI JSON object into a valid ParsedAd: normalize each role,
 * drop unknown enum values, dedupe phones, and bound every list.
 */
export const normalizeParsed = (raw: Record<string, unknown>): ParsedAd => {
  const rawRoles = Array.isArray(raw.roles) ? raw.roles : [];
  const roles = rawRoles
    .filter((r): r is Record<string, unknown> => !!r && typeof r === 'object')
    .slice(0, MAX_LIST_ITEMS)
    .map(normalizeRole);

  const phones = [...new Set(asStringArray(raw.phones).map(normalizePhone))];

  return {
    roles,
    company: asString(raw.company),
    category: oneOf<Category>(raw.category, CATEGORIES) ?? 'Boshqa',
    workType: oneOf<WorkType>(raw.workType, WORK_TYPES),
    locations: asStringArray(raw.locations),
    workSchedule: asString(raw.workSchedule),
    address: asString(raw.address),
    description: asString(raw.description),
    benefits: asStringArray(raw.benefits),
    phones,
    contactTelegram: asString(raw.contactTelegram),
    applyLink: asString(raw.applyLink),
  };
};
