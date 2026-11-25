export interface Requisites {
  entityName: string; // Например: 'Плательщик НПД Иванов И.И.', 'ИП Иванов И.И.' или 'ООО «Элькодо»'
  inn: string;        // 12 цифр для ФЛ/ИП, 10 цифр для ООО
  kpp?: string;       // Опционально: 9 цифр (только для ООО)
  ogrnip?: string;    // Опционально: 15 цифр (для ИП)
  ogrn?: string;      // Опционально: 13 цифр (для ООО)
}

export const SITE_CONFIG = {
  brand: 'Elcodo',
  domain: 'https://elcodo.ru',
  city: 'Санкт-Петербург',
  email: 'elcodo@bk.ru',
  messengers: {
    telegramUsername: 'anton_vtyurin',      // <-- Замени на свой ник в Telegram без @
    maxUrl: 'https://max.ru/c/-75227121870179/AaIKx8ZiUXQ', // <-- Замени на свою прямую ссылку в MAX
  },
  requisites: {
    entityName: 'Плательщик НПД Втюрин Антон Юрьевич', // <-- Впиши свои ФИО
    inn: '110110833420',                              // <-- Впиши свой ИНН
    // При переходе на ИП или ООО просто раскомментируй нужные строки:
    // ogrnip: '326780000000000',
    // ogrn: '1267800000000',
    // kpp: '783901001',
  } as Requisites,
} as const;

// Хелпер автоматически собирает строку реквизитов только из заполненных полей
export function formatRequisites(req: Requisites = SITE_CONFIG.requisites): string {
  const parts = [req.entityName, `ИНН ${req.inn}`];
  if (req.kpp) parts.push(`КПП ${req.kpp}`);
  if (req.ogrnip) parts.push(`ОГРНИП ${req.ogrnip}`);
  if (req.ogrn) parts.push(`ОГРН ${req.ogrn}`);
  return parts.join(' • ');
}

export function getTelegramUrl(prefillText?: string): string {
  const base = `https://t.me/${SITE_CONFIG.messengers.telegramUsername}`;
  if (!prefillText) return base;
  return `${base}?text=${encodeURIComponent(prefillText)}`;
}

export function getMaxUrl(): string {
  return SITE_CONFIG.messengers.maxUrl;
}