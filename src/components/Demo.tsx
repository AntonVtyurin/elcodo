import React, { useEffect, useMemo, useState } from 'react';
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
  MessageSquarePlus,
  Search,
  X,
  ChevronDown,
  Wrench,
  UserCheck,
} from 'lucide-react';
import { getMaxUrl, getTelegramUrl } from '../config/site';
import {
  INITIAL_OBJECTS,
  ObjectSpec,
  SYMPTOMS,
  SymptomId,
  TIME_SLOTS,
  TaskItem,
  VisitType,
  resolvePassportSummary,
} from '../data/qrDemoData';
import { EngineerPanel } from './EngineerPanel';

const STORAGE_KEY = 'elcodo_objects_v1';
const [DEFAULT_TIME_SLOT] = TIME_SLOTS;
const [DEFAULT_SYMPTOM] = SYMPTOMS;

const formatDateRu = (isoDate: string) => {
  if (!isoDate) return '';
  const [y, m, d] = isoDate.split('-');
  return y && m && d ? `${d}.${m}.${y}` : isoDate;
};

export const Demo: React.FC = () => {
  const [objects, setObjects] = useState<ObjectSpec[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_OBJECTS;
  });

  const [engineerMode, setEngineerMode] = useState<boolean>(false);
  const [selectedObjId, setSelectedObjId] = useState<string>(objects[0].id);
  const [visitType, setVisitType] = useState<VisitType>('planned');
  const [preferredDate, setPreferredDate] = useState<string>('');
  const [preferredTime, setPreferredTime] = useState<string>(DEFAULT_TIME_SLOT);
  const [selectedRoomId, setSelectedRoomId] = useState<string>(objects[0].rooms[0]?.id ?? '');
  const [roomMenuOpen, setRoomMenuOpen] = useState<boolean>(false);
  const [roomSearch, setRoomSearch] = useState<string>('');
  const [selectedSymptom, setSelectedSymptom] = useState<SymptomId>(DEFAULT_SYMPTOM.id);
  const [noKeys, setNoKeys] = useState<boolean>(true);
  const [comment, setComment] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const objParam = params.get('obj');
    const roomParam = params.get('room');
    const modeParam = params.get('mode');

    if (modeParam === 'engineer') setEngineerMode(true);
    if (objParam) {
      const foundObj = objects.find((o) => o.id === objParam);
      if (foundObj) {
        setSelectedObjId(foundObj.id);
        if (roomParam && foundObj.rooms.some((r) => r.id === roomParam)) {
          setSelectedRoomId(roomParam);
        } else if (foundObj.rooms) {
          setSelectedRoomId(foundObj.rooms[0].id);
        }
      }
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(objects));
    } catch {
      // ignore
    }
  }, [objects]);

  const activeObj = useMemo(
    () => objects.find((o) => o.id === selectedObjId) ?? objects[0],
    [objects, selectedObjId]
  );

  useEffect(() => {
    if (!activeObj.rooms.some((r) => r.id === selectedRoomId)) {
      setSelectedRoomId(activeObj.rooms[0]?.id ?? '');
    }
  }, [activeObj, selectedRoomId]);

  const activeRoom = useMemo(
    () => activeObj.rooms.find((r) => r.id === selectedRoomId) ?? activeObj.rooms[0],
    [activeObj, selectedRoomId]
  );

  const filteredRooms = useMemo(() => {
    const q = roomSearch.trim().toLowerCase();
    if (!q) return activeObj.rooms;
    return activeObj.rooms.filter((r) => r.name.toLowerCase().includes(q));
  }, [activeObj.rooms, roomSearch]);

  const buildItem = (roomId: string, symptomId: SymptomId): TaskItem => {
    const room = activeObj.rooms.find((r) => r.id === roomId) ?? activeObj.rooms[0];
    const sym = SYMPTOMS.find((s) => s.id === symptomId) ?? DEFAULT_SYMPTOM;
    return {
      uid: `${room.id}-${sym.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      roomId: room.id,
      roomName: room.name,
      symptomId: sym.id,
      symptomLabel: sym.label,
      urgent: Boolean(sym.urgent),
      passportSummary: resolvePassportSummary(activeObj, room, sym),
    };
  };

  const handleAddTask = () => {
    if (!activeRoom) return;
    const item = buildItem(activeRoom.id, selectedSymptom);
    setTasks((prev) => [...prev, item]);
    if (item.urgent) setVisitType('emergency');
  };
  const effectiveTasks = useMemo(() => {
    if (tasks.length > 0) return tasks;
    if (!activeRoom) return [];
    return [buildItem(activeRoom.id, selectedSymptom)];
  }, [tasks, activeObj, activeRoom, selectedSymptom]);

  const requestText = useMemo(() => {
    const header =
      visitType === 'emergency'
        ? `🚨 ВНЕПЛАНОВЫЙ ВЫЕЗД (до 24 ч) · ${activeObj.name}`
        : `📋 ПЛАНОВЫЙ ВЫЕЗД (по графику ТО) · ${activeObj.name}`;

    const lines = effectiveTasks.map(
      (t, idx) =>
        `${idx + 1}. ${t.roomName} — ${t.symptomLabel}\n   └ Паспорт: ${t.passportSummary}`
    );

    const parts = [header];
    if (visitType === 'planned') {
      const dateLabel = preferredDate ? formatDateRu(preferredDate) : 'ближайший визит по графику';
      parts.push(`Желаемое время: ${dateLabel}, ${preferredTime.toLowerCase()}`);
    }
    parts.push('', lines.join('\n\n'), '');
    parts.push(
      noKeys
        ? 'Доступ: ключей от щитовой на месте нет'
        : 'Доступ: ключи от щитовой на месте'
    );
    if (comment.trim()) {
      parts.push(`Комментарий: ${comment.trim()}`);
    }
    return parts.join('\n');
  }, [visitType, activeObj.name, effectiveTasks, preferredDate, preferredTime, noKeys, comment]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(requestText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const updateActiveObj = (updater: (obj: ObjectSpec) => ObjectSpec) => {
    setObjects((prev) => prev.map((o) => (o.id === activeObj.id ? updater(o) : o)));
  };

  const handleCreateObject = () => {
    const id = `obj-${Date.now().toString(36)}`;
    const newObj: ObjectSpec = {
      id,
      name: `Новый объект #${objects.length + 1}`,
      lastAudit: 'Черновик паспорта',
      shields: [{ id: `${id}-sh1`, name: 'ЩР-1', location: 'Вводной щит' }],
      groups: [],
      rooms: [],
    };
    setObjects((prev) => [...prev, newObj]);
    setSelectedObjId(id);
  };

  const handleDeleteObject = (objId: string) => {
    const isDemo = INITIAL_OBJECTS.some((demo) => demo.id === objId);
    if (isDemo) return;

    setObjects((prev) => {
      const next = prev.filter((o) => o.id !== objId);
      if (selectedObjId === objId && next.length > 0) {
        setSelectedObjId(next[0].id);
        setTasks([]);
      }
      return next;
    });
  };

  const handleResetDemo = () => {
    localStorage.removeItem(STORAGE_KEY);
    setObjects(INITIAL_OBJECTS);
    setSelectedObjId(INITIAL_OBJECTS[0].id);
  };

  return (
    <section id="demo" className="py-20 bg-slate-950 text-slate-100 border-t border-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-4">
              <QrCode className="w-3.5 h-3.5" />
              <span>Цифровой QR-паспорт объекта · Тариф «Бизнес»</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
              {engineerMode ? 'Паспорт щитов и QR-коды' : 'QR-заявка за 10 секунд'}
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              {engineerMode
                ? 'Инженерный режим: спецификация щитов, заведение новых объектов и генерация QR-наклеек.'
                : 'Выберите помещение и укажите, что случилось — система сама соберёт ведомость для инженера.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEngineerMode((prev) => !prev)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-colors self-start ${
              engineerMode
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {engineerMode ? (
              <>
                <UserCheck className="w-3.5 h-3.5" />
                <span>Вид клиента</span>
              </>
            ) : (
              <>
                <Wrench className="w-3.5 h-3.5" />
                <span>Режим инженера</span>
              </>
            )}
          </button>
        </div>

 <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs text-slate-500 mr-1">Объект:</span>
          {objects.map((obj) => {
            const isDemo = INITIAL_OBJECTS.some((demo) => demo.id === obj.id);
            return (
              <div key={obj.id} className="inline-flex items-center">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedObjId(obj.id);
                    setTasks([]);
                  }}
                  className={`px-3 py-1.5 text-xs font-medium border transition-colors ${
                    engineerMode && !isDemo ? 'rounded-l-lg border-r-0' : 'rounded-lg'
                  } ${
                    obj.id === activeObj.id
                      ? 'bg-slate-800 border-amber-500/50 text-amber-300'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {obj.name}
                </button>
                {engineerMode && !isDemo && (
                  <button
                    type="button"
                    onClick={() => handleDeleteObject(obj.id)}
                    title="Удалить этот объект"
                    className={`px-2 py-1.5 rounded-r-lg border text-slate-500 hover:text-red-400 transition-colors ${
                      obj.id === activeObj.id
                        ? 'bg-slate-800 border-amber-500/50'
                        : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
          {engineerMode && (
            <button
              type="button"
              onClick={handleCreateObject}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Новый объект</span>
            </button>
          )}
        </div>
        {!engineerMode ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-slate-800">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <span>{activeObj.name}</span>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded">
                  {activeObj.lastAudit}
                </span>
              </div>

              <div className="mb-5 pb-4 border-b border-slate-800/70">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                      1. Срочность выезда
                    </span>
                    <span className="text-xs text-slate-400 mt-0.5 block">
                      {visitType === 'emergency'
                        ? 'Выезд дежурного инженера в течение 24 часов'
                        : 'По графику ТО или на удобную дату'}
                    </span>
                  </div>
                  <div className="inline-flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto shrink-0">
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
                      <span>Внеплановый</span>
                    </button>
                  </div>
                </div>

                {visitType === 'planned' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3 pt-3 border-t border-slate-800/60">
                    <div>
                      <label htmlFor="preferred-date" className="block text-[11px] font-medium text-slate-400 mb-1">
                        Желаемая дата
                      </label>
                      <input
                        id="preferred-date"
                        type="date"
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-slate-100 outline-none [color-scheme:dark]"
                      />
                    </div>
                    <div>
                      <label htmlFor="preferred-time" className="block text-[11px] font-medium text-slate-400 mb-1">
                        Удобное время
                      </label>
                      <div className="relative">
                        <select
                          id="preferred-time"
                          value={preferredTime}
                          onChange={(e) => setPreferredTime(e.target.value)}
                          className="w-full appearance-none truncate bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-lg pl-3 pr-8 py-1.5 text-xs sm:text-sm text-slate-100 outline-none"
                        >
                          {TIME_SLOTS.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-5">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  2. Помещение и что случилось
                </div>

                <div className="relative mb-3">
                  <button
                    type="button"
                    onClick={() => setRoomMenuOpen((prev) => !prev)}
                    className="w-full flex items-center justify-between gap-2 bg-slate-950 border border-slate-700 hover:border-amber-500/70 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs text-slate-400">Помещение:</span>
                      <span className="font-semibold text-amber-400 truncate">
                        {activeRoom?.name ?? 'Выберите помещение'}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                        roomMenuOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {roomMenuOpen && (
                    <div className="absolute z-20 left-0 right-0 mt-1.5 bg-slate-950 border border-slate-700 rounded-xl shadow-xl overflow-hidden">
                      <div className="relative p-2 border-b border-slate-800">
                        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={roomSearch}
                          onChange={(e) => setRoomSearch(e.target.value)}
                          placeholder="Поиск помещения..."
                          autoFocus
                          className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-lg pl-8 pr-7 py-1.5 text-xs text-slate-100 outline-none"
                        />
                        {roomSearch && (
                          <button
                            type="button"
                            onClick={() => setRoomSearch('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="max-h-48 overflow-y-auto divide-y divide-slate-800/60">
                        {filteredRooms.map((room) => (
                          <button
                            key={room.id}
                            type="button"
                            onClick={() => {
                              setSelectedRoomId(room.id);
                              setRoomMenuOpen(false);
                              setRoomSearch('');
                            }}
                            className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs sm:text-sm text-left transition-colors ${
                              room.id === activeRoom?.id
                                ? 'bg-amber-500/15 text-amber-300 font-semibold'
                                : 'text-slate-200 hover:bg-slate-900'
                            }`}
                          >
                            <span>{room.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                  {SYMPTOMS.map((sym) => {
                    const isSelected = sym.id === selectedSymptom;
                    return (
                      <button
                        key={sym.id}
                        type="button"
                        onClick={() => setSelectedSymptom(sym.id)}
                        className={`px-3 py-2.5 rounded-xl text-left text-xs sm:text-sm border transition-all flex items-center justify-between gap-2 ${
                          isSelected
                            ? sym.urgent
                              ? 'bg-red-500/15 text-red-200 border-red-500/60 font-medium'
                              : 'bg-slate-800 text-amber-300 border-amber-500/60 font-medium'
                            : 'bg-slate-950/90 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <span>{sym.label}</span>
                        {sym.urgent && <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddTask}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-400 font-semibold text-xs border border-amber-500/40 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Добавить ещё пункт</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-slate-300 font-semibold">
                    <ClipboardList className="w-4 h-4 text-amber-400" />
                    <span>
                      {tasks.length > 0 ? `Задачи в заявке (${tasks.length})` : 'Задача в заявке (текущий выбор)'}
                    </span>
                  </div>
                  {tasks.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setTasks([])}
                      className="text-xs text-slate-500 hover:text-slate-300"
                    >
                      Очистить
                    </button>
                  )}
                </div>

                {tasks.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {tasks.map((item, index) => (
                      <div
                        key={item.uid}
                        className="flex items-center justify-between gap-3 bg-slate-900 border border-slate-800/90 rounded-lg px-3 py-2 text-xs"
                      >
                        <div className="font-medium text-slate-100 truncate">
                          <span className="text-slate-500 mr-1.5">{index + 1}.</span>
                          <span>{item.roomName}</span>
                          <span className="text-slate-500 mx-1.5">—</span>
                          <span className={item.urgent ? 'text-red-300' : 'text-amber-300'}>
                            {item.symptomLabel}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setTasks((prev) => prev.filter((t) => t.uid !== item.uid))}
                          className="p-1 text-slate-500 hover:text-red-400 shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mb-3 pt-2 border-t border-slate-800/80">
                  <label htmlFor="client-comment" className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-1.5">
                    <MessageSquarePlus className="w-3.5 h-3.5 text-amber-400" />
                    <span>Комментарий (необязательно)</span>
                  </label>
                  <input
                    id="client-comment"
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Например: просьба подойти на ресепшен к Ольге"
                    className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-100 outline-none"
                  />
                </div>

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
                <span>Готовая ведомость</span>
                <span
                  className={`whitespace-nowrap shrink-0 text-[11px] font-mono px-2 py-0.5 rounded ${
                    visitType === 'emergency'
                      ? 'bg-red-500/15 text-red-300 border border-red-500/30'
                      : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {visitType === 'emergency' ? 'ВНЕПЛАНОВЫЙ · ДО 24Ч' : 'ПЛАНОВЫЙ ВЫЕЗД'}
                </span>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Текст для инженера
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Скопировано' : 'Копировать текст'}</span>
                  </button>
                </div>
                <pre className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {requestText}
                </pre>
              </div>

              <div className="space-y-3">
                <a
                  href={getMaxUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleCopy}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Отправить заявку в MAX</span>
                </a>
                <p className="text-[11px] text-center text-slate-500">
                  Текст заявки скопируется автоматически — просто вставьте его в диалог с инженером
                </p>

                <a
                  href={getTelegramUrl(requestText)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-700 transition-colors"
                >
                  <span>Отправить в Telegram</span>
                </a>
              </div>
            </div>
          </div>
        ) : (
          <EngineerPanel
            activeObj={activeObj}
            allObjects={objects}
            updateActiveObj={updateActiveObj}
            onImportObjects={(imported) => {
              setObjects(imported);
              setSelectedObjId(imported[0].id);
              setTasks([]);
            }}
            onResetDemo={handleResetDemo}
          />
        )}
      </div>
    </section>
  );
};

export default Demo;
