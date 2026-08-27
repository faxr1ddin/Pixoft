import { ParsedVacancy } from '../ai/ai-parser.types';

const dash = '—';

const groupThousands = (n: number): string =>
  n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

const formatSalary = (min: number | null, max: number | null): string => {
  if (!min && !max) return 'Kelishilgan';
  if (min && max) return `${groupThousands(min)} – ${groupThousands(max)} so'm`;
  if (min) return `${groupThousands(min)} so'm dan`;
  return `${groupThousands(max as number)} so'm gacha`;
};

const list = (items: string[]): string =>
  items.length ? items.map((i) => `• ${i}`).join('\n') : dash;

/** Render a parsed vacancy as the admin preview message. */
export const renderPreview = (v: ParsedVacancy): string =>
  [
    "📋 *VAKANSIYA KO'RINISHI*",
    '',
    `💼 *Lavozim:* ${v.title ?? dash}`,
    `🏢 *Kompaniya:* ${v.company ?? dash}`,
    `📁 *Kategoriya:* ${v.category}`,
    `🧭 *Ish turi:* ${v.workType ?? dash}`,
    `👤 *Jins:* ${v.gender ?? "Farqi yo'q"}`,
    `🎂 *Yosh:* ${v.ageRange ?? dash}`,
    `💰 *Maosh:* ${formatSalary(v.salaryMin, v.salaryMax)}`,
    `📍 *Manzil:* ${v.location ?? dash}`,
    `🕒 *Ish vaqti:* ${v.workSchedule ?? dash}`,
    '',
    '🎁 *Imkoniyatlar:*',
    list(v.benefits),
    '',
    '📋 *Talablar:*',
    list(v.requirements),
    '',
    `📞 *Telefon:* ${v.contactPhone ?? dash}`,
    `✈️ *Telegram:* ${v.contactTelegram ?? dash}`,
  ].join('\n');
