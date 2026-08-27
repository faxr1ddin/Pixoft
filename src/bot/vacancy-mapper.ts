import { ParsedVacancy } from '../ai/ai-parser.types';
import { CreateVacancyDto } from '../vacancies/dto/create-vacancy.dto';

/**
 * Map a parsed advertisement to the create payload, filling the model's
 * required fields with safe placeholders when the ad didn't state them.
 * A human confirms these in the preview, so placeholders are never silent.
 */
export const parsedToCreateDto = (
  v: ParsedVacancy,
  sourceText: string,
): CreateVacancyDto => ({
  title: v.title ?? 'Nomsiz vakansiya',
  company: v.company ?? 'Belgilanmagan',
  workType: v.workType ?? "To'liq stavka",
  location: v.location ?? 'Belgilanmagan',
  gender: v.gender ?? undefined,
  salaryMin: v.salaryMin ?? 0,
  salaryMax: v.salaryMax ?? undefined,
  category: v.category,
  ageRange: v.ageRange ?? undefined,
  workSchedule: v.workSchedule ?? undefined,
  address: v.address ?? undefined,
  benefits: v.benefits,
  requirements: v.requirements,
  contactPhone: v.contactPhone ?? undefined,
  contactTelegram: v.contactTelegram ?? undefined,
  applyLink: v.applyLink ?? undefined,
  sourceText,
});
