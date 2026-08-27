import { ParsedAd } from '../ai/ai-parser.types';
import { CreateVacancyDto } from '../vacancies/dto/create-vacancy.dto';

const orNull = <T>(value: T | null | undefined): T | undefined => value ?? undefined;

/**
 * Map a parsed advertisement to a single create payload. Multi-value fields
 * (positions, locations, phones) stay as lists on the one vacancy — the ad
 * is never split. `title` is the primary position, for a clean card headline.
 */
export const parsedAdToDto = (
  ad: ParsedAd,
  sourceText: string,
): CreateVacancyDto => ({
  title: ad.positions[0] ?? 'Nomsiz vakansiya',
  positions: ad.positions,
  company: orNull(ad.company),
  workType: orNull(ad.workType),
  locations: ad.locations,
  gender: orNull(ad.gender),
  salaryMin: orNull(ad.salaryMin),
  salaryMax: orNull(ad.salaryMax),
  currency: orNull(ad.currency),
  category: ad.category,
  ageRange: orNull(ad.ageRange),
  workSchedule: orNull(ad.workSchedule),
  address: orNull(ad.address),
  benefits: ad.benefits,
  requirements: ad.requirements,
  phones: ad.phones,
  contactTelegram: orNull(ad.contactTelegram),
  applyLink: orNull(ad.applyLink),
  sourceText,
});
