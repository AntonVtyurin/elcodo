export type VisitType = 'planned' | 'emergency';
export type SymptomId = 'light' | 'sockets' | 'spark' | 'breaker';

export interface LineSpec {
  breaker: string;
  cable: string;
  description: string;
}

export interface RoomCircuit {
  id: string;
  roomName: string;
  shield: string;
  shieldLocation: string;
  lightLine: LineSpec;
  powerLine: LineSpec;
}

export interface TaskItem {
  uid: string;
  roomId: string;
  roomName: string;
  symptomId: SymptomId;
  symptomLabel: string;
  urgent: boolean;
  shield: string;
  breaker: string;
  cable: string;
}

export const OBJECT_INFO = {
  name: 'Офис БЦ «Петровский», 3 этаж',
  lastAudit: 'ТО и тепловизор: 12.11.2026',
};

export const TIME_SLOTS = [
  'В любое рабочее время',
  '09:00 – 13:00',
  '13:00 – 18:00',
  'После 18:00 (нерабочее время)',
];

export const SYMPTOMS: { id: SymptomId; label: string; urgent?: boolean }[] = [
  { id: 'light', label: 'Мигает / не горит свет' },
  { id: 'sockets', label: 'Не работает розетка' },
  { id: 'spark', label: 'Искрит розетка / выключатель', urgent: true },
  { id: 'breaker', label: 'Выбивает автомат', urgent: true },
];

export const ROOM_CIRCUITS: RoomCircuit[] = [
  {
    id: 'reception',
    roomName: 'Ресепшен',
    shield: 'ЩР-2',
    shieldLocation: 'Коридор у переговорной (ниша у п. 12)',
    lightLine: {
      breaker: 'QF2 · 1P 10 А (B)',
      cable: 'ВВГнг-LS 3×1.5 · БАП',
      description: 'Свет ресепшена и вывеска',
    },
    powerLine: {
      breaker: 'QF1 · 1P 16 А (B)',
      cable: 'ВВГнг-LS 3×2.5 · Дифавтомат 30 мА',
      description: 'Стойка администратора и терминал',
    },
  },
  {
    id: 'openspace',
    roomName: 'Опенспейс',
    shield: 'ВРУ-1',
    shieldLocation: 'Щитовая (п. 04, ключ у охраны)',
    lightLine: {
      breaker: 'QF3 · 1P 10 А (B)',
      cable: 'ВВГнг-LS 3×1.5',
      description: 'LED-линии рабочей зоны',
    },
    powerLine: {
      breaker: 'QF2 · 1P 16 А (B)',
      cable: 'ВВГнг-LS 3×2.5 · Дифавтомат 30 мА',
      description: 'Розеточные лючки (ряд А–Б)',
    },
  },
  {
    id: 'kitchen',
    roomName: 'Кухня',
    shield: 'ЩР-2',
    shieldLocation: 'Коридор у переговорной (ниша у п. 12)',
    lightLine: {
      breaker: 'QF2 · 1P 10 А (B)',
      cable: 'ВВГнг-LS 3×1.5',
      description: 'Освещение кухни и подсветка',
    },
    powerLine: {
      breaker: 'QF4 · 1P 16 А (C)',
      cable: 'ВВГнг-LS 3×2.5 · УЗО 10 мА',
      description: 'Кофемашина, СВЧ и холодильник',
    },
  },
  {
    id: 'corridor',
    roomName: 'Коридор',
    shield: 'ЩР-2',
    shieldLocation: 'Коридор у переговорной (ниша у п. 12)',
    lightLine: {
      breaker: 'QF6 · 1P 10 А (B)',
      cable: 'ВВГнг-LS 3×1.5 · БАП',
      description: 'Коридорное и эвакуационное освещение',
    },
    powerLine: {
      breaker: 'QF7 · 1P 16 А (B)',
      cable: 'ВВГнг-LS 3×2.5 · Дифавтомат 30 мА',
      description: 'Сервисные розетки и кулер',
    },
  },
  {
    id: 'meeting',
    roomName: 'Переговорная',
    shield: 'ЩР-2',
    shieldLocation: 'Коридор у переговорной (ниша у п. 12)',
    lightLine: {
      breaker: 'QF2 · 1P 10 А (B)',
      cable: 'ВВГнг-LS 3×1.5',
      description: 'Свет переговорной комнаты',
    },
    powerLine: {
      breaker: 'QF5 · 1P 16 А (B)',
      cable: 'ВВГнг-LS 3×2.5 · Дифавтомат 30 мА',
      description: 'Лючок стола и ВКС-панель',
    },
  },
  {
    id: 'server',
    roomName: 'Серверная',
    shield: 'ВРУ-1',
    shieldLocation: 'Щитовая (п. 04, ключ у охраны)',
    lightLine: {
      breaker: 'QF3 · 1P 10 А (B)',
      cable: 'ВВГнг-LS 3×1.5',
      description: 'Технический свет серверной',
    },
    powerLine: {
      breaker: 'QF4 · 1P 25 А (C)',
      cable: 'ВВГнг-LS 3×4.0 · УЗО 30 мА',
      description: 'Ввод стойки, ИБП и кондиционер',
    },
  },
];
