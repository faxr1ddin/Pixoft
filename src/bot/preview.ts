import { ParsedAd } from '../ai/ai-parser.types';

const dash = '—';

const groupThousands = (n: number): string =>
  n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

const formatSalary = (min: number | null, max: number | null): string => {
  if (!min && !max) return 'Kelishilgan';
  if (min && max) return `${groupThousands(min)} – ${groupThousands(max)} so'm`;
  if (min) return `${groupThousands(min)} so'm dan`;
  return `${groupThousands(max as number)} so'm gacha`;
};

const bullets = (items: string[]): string =>
  items.length ? items.map((i) => `• ${i}`).join('\n') : dash;

const orDash = (value: string | null): string => value ?? dash;

const list = (items: string[]): string => (items.length ? items.join(', ') : dash);

/** Render a parsed advertisement as the admin preview message. */
export const renderPreview = (ad: ParsedAd): string => {
  const count = ad.positions.length || 1;
  return [
    `📋 *${count} ta vakansiya yaratiladi*`,
    '',
    '💼 *Lavozimlar:*',
    bullets(ad.positions.length ? ad.positions : ['Nomsiz vakansiya']),
    '',
    `🏢 *Kompaniya:* ${orDash(ad.company)}`,
    `📁 *Kategoriya:* ${ad.category}`,
    `🧭 *Ish turi:* ${orDash(ad.workType)}`,
    `👤 *Jins:* ${ad.gender ?? "Farqi yo'q"}`,
    `🎂 *Yosh:* ${orDash(ad.ageRange)}`,
    `💰 *Maosh:* ${formatSalary(ad.salaryMin, ad.salaryMax)}`,
    `📍 *Manzil(lar):* ${list(ad.locations)}`,
    `🕒 *Ish vaqti:* ${orDash(ad.workSchedule)}`,
    `📞 *Telefon(lar):* ${list(ad.phones)}`,
    `✈️ *Telegram:* ${orDash(ad.contactTelegram)}`,
    '',
    '🎁 *Imkoniyatlar:*',
    bullets(ad.benefits),
    '',
    '📋 *Talablar:*',
    bullets(ad.requirements),
  ].join('\n');
};
