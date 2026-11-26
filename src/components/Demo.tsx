import React, { useMemo, useState } from 'react';
import {
  Send,
  Copy,
  Check,
  QrCode,
  AlertTriangle,
  KeyRound,
  Building2,
  Plus,
  Trash2,
  CalendarClock,
  Siren,
  ClipboardList,
} from 'lucide-react';
import { getMaxUrl, getTelegramUrl } from '../config/site';

type VisitType = 'planned' | 'emergency';
type SymptomId = 'light' | 'sockets' | 'spark' | 'breaker';

interface LineSpec {
  breaker: string;
  cable: string;
  description: string;
}

interface RoomCircuit {
  id: string;
  roomName: string;
  shield: string;
  shieldLocation: string;
  lightLine: LineSpec;
  powerLine: LineSpec;
}

interface TaskItem {
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

const OBJECT_INFO = {
  name: 'Офис БЦ «Петровский», 3 этаж',
  lastAudit: 'ТО и тепловизор: 12.11.2026',
};

const SYMPTOMS: { id: SymptomId; label: string; urgent?: boolean }[] = [
  { id: 'light', label: 'Мигает / не горит свет' },
  { id: 'sockets', label: 'Не работает розетка' },
  { id: 'spark', label: 'Искрит / греется', urgent: true },
  { id: 'breaker', label: 'Выбивает автомат', urgent: true },
];

const ROOM_CIRCUITS: RoomCircuit[] = [
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
const buildTaskItem = (roomId: string, symptomId: SymptomId): TaskItem => {
  const room = ROOM_CIRCUITS.find((r) => r.id === roomId) || ROOM_CIRCUITS;
  const sym = SYMPTOMS.find((s) => s.id === symptomId) || SYMPTOMS;
  const line = symptomId === 'light' ? room.lightLine : room.powerLine;

  return {
    uid: `${room.id}-${sym.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    roomId: room.id,
    roomName: room.roomName,
    symptomId: sym.id,
    symptomLabel: sym.label,
    urgent: Boolean(sym.urgent),
    shield: room.shield,
    breaker: line.breaker,
    cable: line.cable,
  };
};

export const Demo: React.FC = () => {
  const [visitType, setVisitType] = useState<VisitType>('planned');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('meeting');
  const [selectedSymptom, setSelectedSymptom] = useState<SymptomId>('spark');
  const [noKeys, setNoKeys] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const [tasks, setTasks] = useState<TaskItem[]>(() => [
    buildTaskItem('kitchen', 'light'),
    buildTaskItem('corridor', 'sockets'),
  ]);

  const activeRoom = useMemo(
    () => ROOM_CIRCUITS.find((r) => r.id === selectedRoomId) || ROOM_CIRCUITS,
    [selectedRoomId]
  );

  const activeSymptomObj = useMemo(
    () => SYMPTOMS.find((s) => s.id === selectedSymptom) || SYMPTOMS,
    [selectedSymptom]
  );

  const previewLine =
    selectedSymptom === 'light' ? activeRoom.lightLine : activeRoom.powerLine;

  const handleAddTask = () => {
    const newItem = buildTaskItem(selectedRoomId, selectedSymptom);
    setTasks((prev) => [...prev, newItem]);
    if (newItem.urgent) {
      setVisitType('emergency');
    }
  };

  const handleRemoveTask = (uid: string) => {
    setTasks((prev) => prev.filter((item) => item.uid !== uid));
  };

  const effectiveTasks = useMemo(() => {
    if (tasks.length > 0) return tasks;
    return [buildTaskItem(selectedRoomId, selectedSymptom)];
  }, [tasks, selectedRoomId, selectedSymptom]);

  const requestText = useMemo(() => {
    const header =
      visitType === 'emergency'
        ? `🚨 СРОЧНЫЙ ВЫЕЗД (${OBJECT_INFO.name})`
        : `📋 ПЛАНОВЫЙ ВЫЕЗД (${OBJECT_INFO.name})`;

    const lines = effectiveTasks.map(
      (t, idx) =>
        `${idx + 1}. ${t.roomName} — ${t.symptomLabel}\n   └ Паспорт: ${t.shield} · ${t.breaker} (${t.cable})`
    );

    const accessNote = noKeys
      ? 'Доступ: ключей от щитовой на месте нет'
      : 'Доступ: ключи от щитовой на месте';

    return [header, '', ...lines, '', accessNote].join('\n');
  }, [visitType, effectiveTasks, noKeys]);

  const maxHref = getMaxUrl();
  const telegramHref = getTelegramUrl(requestText);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(requestText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };
  return (
    <section id="demo" className="py-20 bg-slate-950 text-slate-100 border-t border-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-4">
            <QrCode className="w-3.5 h-3.5" />
            <span>Цифровой QR-паспорт объекта · Тариф «Бизнес»</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Сборщик заявки по QR-коду: от аврала до планового ТО
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Администратор сканирует QR-код на ресепшен, выбирает режим выезда и набирает список
            задач по помещениям. Система сама привязывает каждую точку к щиту и автомату из
            паспорта объекта.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-slate-800">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>{OBJECT_INFO.name}</span>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded">
                {OBJECT_INFO.lastAudit}
              </span>
            </div>

            {/* Компактный переключатель: Выезд: Плановый / Срочный */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                1. Выезд
              </span>
              <div className="inline-flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setVisitType('planned')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    visitType === 'planned'
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <CalendarClock className="w-3.5 h-3.5" />
                  <span>Плановый</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVisitType('emergency')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    visitType === 'emergency'
                      ? 'bg-red-500 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Siren className="w-3.5 h-3.5" />
                  <span>Срочный</span>
                </button>
              </div>
            </div>

            {/* Выбор помещения и симптома */}
            <div className="mb-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
                2. Помещение и проблема
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                {ROOM_CIRCUITS.map((room) => {
                  const isSelected = room.id === activeRoom.id;
                  return (
                    <button
                      key={room.id}
                      type="button"
                      onClick={() => setSelectedRoomId(room.id)}
                      className={`px-3 py-2.5 rounded-xl text-left text-xs sm:text-sm font-medium border transition-all ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-semibold'
                          : 'bg-slate-950/90 text-slate-200 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {room.roomName}
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                {SYMPTOMS.map((sym) => {
                  const isSelected = sym.id === selectedSymptom;
                  return (
                    <button
                      key={sym.id}
                      type="button"
                      onClick={() => setSelectedSymptom(sym.id)}
                      className={`px-3 py-2 rounded-xl text-left text-xs sm:text-sm border transition-all flex items-center justify-between gap-2 ${
                        isSelected
                          ? sym.urgent
                            ? 'bg-red-500/15 text-red-200 border-red-500/60 font-medium'
                            : 'bg-slate-800 text-amber-300 border-amber-500/60 font-medium'
                          : 'bg-slate-950/90 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span>{sym.label}</span>
                      {sym.urgent && (
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 border border-slate-800 rounded-xl p-3">
                <div className="text-xs">
                  <span className="text-slate-400">По паспорту: </span>
                  <span className="font-mono text-amber-300">
                    {activeRoom.shield} · {previewLine.breaker}
                  </span>
                  <span className="text-slate-500 block sm:inline sm:ml-1.5">
                    ({activeRoom.roomName} — {activeSymptomObj.label.toLowerCase()})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAddTask}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-400 font-semibold text-xs border border-amber-500/40 transition-colors shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Добавить в список</span>
                </button>
              </div>
            </div>
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-slate-300 font-semibold">
                  <ClipboardList className="w-4 h-4 text-amber-400" />
                  <span>Набранный список работ ({tasks.length})</span>
                </div>
                {tasks.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setTasks([])}
                    className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    Очистить
                  </button>
                )}
              </div>

              {tasks.length > 0 ? (
                <div className="space-y-2 mb-3">
                  {tasks.map((item, index) => (
                    <div
                      key={item.uid}
                      className="flex items-center justify-between gap-3 bg-slate-900 border border-slate-800/90 rounded-lg px-3 py-2 text-xs"
                    >
                      <div className="min-w-0">
                        <div className="font-medium text-slate-100 truncate">
                          <span className="text-slate-500 mr-1.5">{index + 1}.</span>
                          <span>{item.roomName}</span>
                          <span className="text-slate-500 mx-1.5">—</span>
                          <span className={item.urgent ? 'text-red-300' : 'text-amber-300'}>
                            {item.symptomLabel}
                          </span>
                        </div>
                        <div className="font-mono text-[11px] text-slate-500 truncate">
                          {item.shield} · {item.breaker} ({item.cable})
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveTask(item.uid)}
                        aria-label="Удалить пункт"
                        className="p-1 text-slate-500 hover:text-red-400 transition-colors shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-500 py-3 mb-3 text-center border border-dashed border-slate-800 rounded-lg">
                  Список пуст — в заявку пойдёт текущий выбор ({activeRoom.roomName})
                </div>
              )}

              <label className="flex items-center gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800/80 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={noKeys}
                  onChange={(e) => setNoKeys(e.target.checked)}
                  className="rounded border-slate-600 bg-slate-900 text-amber-500 focus:ring-amber-500"
                />
                <KeyRound className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Ключей от щитовой на месте нет (нужен доступ через охрану)</span>
              </label>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6">
            <div className="flex items-center justify-between gap-2 text-sm font-medium text-white pb-4 mb-5 border-b border-slate-800">
              <span>Готовая ведомость для инженера</span>
              <span
                className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                  visitType === 'emergency'
                    ? 'bg-red-500/15 text-red-300 border border-red-500/30'
                    : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                }`}
              >
                {visitType === 'emergency' ? 'СРОЧНЫЙ ВЫЕЗД' : 'ПЛАНОВЫЙ ВЫЕЗД'}
              </span>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Текст сообщения
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Скопировано</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Копировать текст</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                {requestText}
              </pre>
            </div>

            <div className="space-y-3">
              <a
                href={maxHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Отправить заявку в MAX</span>
              </a>

              <a
                href={telegramHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-700 transition-colors"
              >
                <span>Отправить в Telegram</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
