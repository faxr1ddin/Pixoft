import { ParsedAd } from '../ai/ai-parser.types';
import { CreateVacancyDto } from '../vacancies/dto/create-vacancy.dto';

const orNull = <T>(value: T | null | undefined): T | undefined =>
  value ?? undefined;

const joined = (items: string[]): string | undefined =>
  items.length ? items.join(', ') : undefined;

/**
 * Expand a parsed advertisement into one create payload per position.
 * All positions share the ad's company, salary, locations and contacts;
 * only the title differs. A human confirms the set before it is saved.
 */
export const parsedAdToDtos = (
  ad: ParsedAd,
  sourceText: string,
): CreateVacancyDto[] => {
  const titles = ad.positions.length ? ad.positions : ['Nomsiz vakansiya'];
  const location = joined(ad.locations) ?? 'Belgilanmagan';

  return titles.map((title) => ({
    title,
    company: ad.company ?? 'Belgilanmagan',
    workType: ad.workType ?? "To'liq stavka",
    location,
    gender: orNull(ad.gender),
    salaryMin: orNull(ad.salaryMin),
    salaryMax: orNull(ad.salaryMax),
    category: ad.category,
    ageRange: orNull(ad.ageRange),
    workSchedule: orNull(ad.workSchedule),
    address: orNull(ad.address),
    benefits: ad.benefits,
    requirements: ad.requirements,
    contactPhone: joined(ad.phones),
    contactTelegram: orNull(ad.contactTelegram),
    applyLink: orNull(ad.applyLink),
    sourceText,
  }));
};
