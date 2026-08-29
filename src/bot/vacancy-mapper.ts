import { ParsedAd, ParsedRole } from '../ai/ai-parser.types';
import { CreateVacancyDto } from '../vacancies/dto/create-vacancy.dto';
import { RoleDto } from '../vacancies/dto/role.dto';

const orNull = <T>(value: T | null | undefined): T | undefined => value ?? undefined;

const toRoleDto = (role: ParsedRole): RoleDto => ({
  title: role.title,
  gender: orNull(role.gender),
  ageRange: orNull(role.ageRange),
  salaryMin: orNull(role.salaryMin),
  salaryMax: orNull(role.salaryMax),
  currency: orNull(role.currency),
  requirements: role.requirements,
});

/**
 * Map a parsed advertisement to a single create payload. Roles keep their own
 * gender/age/salary/requirements; company, locations, benefits and contacts
 * are shared. `title` is the first role, for a clean card headline.
 */
export const parsedAdToDto = (
  ad: ParsedAd,
  sourceText: string,
): CreateVacancyDto => {
  const roles = ad.roles.length
    ? ad.roles.map(toRoleDto)
    : [{ title: 'Nomsiz vakansiya', requirements: [] }];

  return {
    title: roles[0].title,
    roles,
    company: orNull(ad.company),
    category: ad.category,
    workType: orNull(ad.workType),
    locations: ad.locations,
    workSchedule: orNull(ad.workSchedule),
    address: orNull(ad.address),
    description: orNull(ad.description),
    benefits: ad.benefits,
    phones: ad.phones,
    contactTelegram: orNull(ad.contactTelegram),
    applyLink: orNull(ad.applyLink),
    sourceText,
  };
};
