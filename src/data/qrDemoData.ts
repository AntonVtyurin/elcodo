export type VisitType = 'planned' | 'emergency';
export type CircuitCategory = 'power' | 'light' | 'special';
export type SymptomId = 'light' | 'power' | 'breaker' | 'other';

export interface ShieldSpec {
  id: string;
  name: string;
  location: string;
}

export interface ShieldGroup {
  id: string;
  shieldId: string;
  code: string;
  device: string;
  cable: string;
  category: CircuitCategory;
}

export interface RoomSpec {
  id: string;
  name: string;
  groupIds: string[];
}

export interface ObjectSpec {
  id: string;
  name: string;
  lastAudit: string;
  shields: ShieldSpec[];
  groups: ShieldGroup[];
  rooms: RoomSpec[];
}

export interface SymptomOption {
  id: SymptomId;
  label: string;
  category?: CircuitCategory;
  urgent?: boolean;
}

export interface TaskItem {
  uid: string;
  roomId: string;
  roomName: string;
  symptomId: SymptomId;
  symptomLabel: string;
  urgent: boolean;
  passportSummary: string;
}

export const TIME_SLOTS: string[] = [
  'В течение дня (10:00 – 18:00)',
  'Утро (09:00 – 12:00)',
  'День (12:00 – 15:00)',
  'Вечер (15:00 – 19:00)',
  'После 19:00 / выходной (по согласованию)',
];

export const SYMPTOMS: SymptomOption[] = [
  { id: 'light', label: 'Свет не горит / мигает', category: 'light' },
  { id: 'power', label: 'Не работают розетки', category: 'power' },
  { id: 'breaker', label: 'Выбивает автомат / запах', urgent: true },
  { id: 'other', label: 'Другая задача по электрике' },
];

export const INITIAL_OBJECTS: ObjectSpec[] = [
  {
    id: 'office',
    name: 'Офис (пример · 2 щита)',
    lastAudit: 'Паспорт актуален',
    shields: [
      { id: 'off-sh1', name: 'ЩР-1', location: 'Входная зона / коридор' },
      { id: 'off-sh2', name: 'ЩР-2', location: 'Кухня / подсобка' },
    ],
    groups: [
      { id: 'off-g1', shieldId: 'off-sh1', code: 'Гр.1', device: 'C16', cable: '3×2.5', category: 'power' },
      { id: 'off-g2', shieldId: 'off-sh1', code: 'Гр.2', device: 'B10', cable: '3×1.5', category: 'light' },
      { id: 'off-g3', shieldId: 'off-sh1', code: 'Гр.3', device: 'B10', cable: '3×1.5', category: 'light' },
      { id: 'off-g4', shieldId: 'off-sh2', code: 'Гр.4', device: 'АВДТ C16/30мА', cable: '3×2.5', category: 'power' },
      { id: 'off-g5', shieldId: 'off-sh2', code: 'Гр.5', device: 'B10', cable: '3×1.5', category: 'light' },
      { id: 'off-g6', shieldId: 'off-sh2', code: 'Гр.6', device: 'C16', cable: '3×2.5', category: 'power' },
    ],
    rooms: [
      { id: 'hall', name: 'Вывеска + коридор', groupIds: ['off-g1', 'off-g2'] },
      { id: 'wc', name: 'Санузел (с/у)', groupIds: ['off-g3'] },
      { id: 'kitchen', name: 'Кухня', groupIds: ['off-g3', 'off-g4'] },
      { id: 'cabinet', name: 'Кабинет', groupIds: ['off-g5', 'off-g6'] },
    ],
  },
  {
    id: 'apartment',
    name: 'Квартира (пример · 1 щит)',
    lastAudit: 'Паспорт актуален',
    shields: [
      { id: 'apt-sh1', name: 'ЩР-1', location: 'Прихожая' },
    ],
    groups: [
      { id: 'apt-g1', shieldId: 'apt-sh1', code: 'Гр.1', device: 'C16', cable: '3×2.5', category: 'power' },
      { id: 'apt-g2', shieldId: 'apt-sh1', code: 'Гр.2', device: 'B10', cable: '3×1.5', category: 'light' },
      { id: 'apt-g3', shieldId: 'apt-sh1', code: 'Гр.3', device: 'C16', cable: '3×2.5', category: 'power' },
      { id: 'apt-g4', shieldId: 'apt-sh1', code: 'Гр.4', device: 'B10', cable: '3×1.5', category: 'light' },
      { id: 'apt-g5', shieldId: 'apt-sh1', code: 'Гр.5', device: 'АВДТ C16/30мА', cable: '3×2.5', category: 'power' },
      { id: 'apt-g6', shieldId: 'apt-sh1', code: 'Гр.6', device: 'B10', cable: '3×1.5', category: 'light' },
      { id: 'apt-g7', shieldId: 'apt-sh1', code: 'Гр.7', device: 'C16', cable: '3×2.5', category: 'power' },
    ],
    rooms: [
      { id: 'kids', name: 'Детская', groupIds: ['apt-g1', 'apt-g2'] },
      { id: 'room', name: 'Комната', groupIds: ['apt-g3', 'apt-g4'] },
      { id: 'corridor-wc', name: 'Коридор + с/у', groupIds: ['apt-g5', 'apt-g6'] },
      { id: 'apt-kitchen', name: 'Кухня', groupIds: ['apt-g7', 'apt-g4'] },
    ],
  },
];

export function resolvePassportSummary(
  obj: ObjectSpec,
  room: RoomSpec,
  symptom: SymptomOption
): string {
  const roomGroups = obj.groups.filter((g) => room.groupIds.includes(g.id));
  const matched = symptom.category
    ? roomGroups.filter((g) => g.category === symptom.category)
    : roomGroups;

  const targetGroups = matched.length > 0 ? matched : roomGroups;
  if (targetGroups.length === 0) return 'Группы не привязаны';

  return targetGroups
    .map((g) => {
      const shield = obj.shields.find((s) => s.id === g.shieldId);
      const sharedRooms = obj.rooms
        .filter((r) => r.id !== room.id && r.groupIds.includes(g.id))
        .map((r) => r.name);
      const sharedNote =
        sharedRooms.length > 0 ? ` · также питает: ${sharedRooms.join(', ')}` : '';
      return `${shield ? shield.name + ' · ' : ''}${g.code} (${g.device}, ${g.cable}${sharedNote})`;
    })
    .join('; ');
}
