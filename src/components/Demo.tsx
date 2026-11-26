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
  MessageSquarePlus,
  Search,
  X,
  ChevronDown,
} from 'lucide-react';
import { getMaxUrl, getTelegramUrl } from '../config/site';
import {
  OBJECT_INFO,
  ROOM_CIRCUITS,
  SYMPTOMS,
  SymptomId,
  TIME_SLOTS,
  TaskItem,
  VisitType,
} from '../data/qrDemoData';

const [DEFAULT_TIME_SLOT] = TIME_SLOTS;
const [DEFAULT_ROOM] = ROOM_CIRCUITS;
const [DEFAULT_SYMPTOM] = SYMPTOMS;

const buildTaskItem = (roomId: string, symptomId: SymptomId): TaskItem => {
  const room = ROOM_CIRCUITS.find((r) => r.id === roomId) ?? DEFAULT_ROOM;
  const sym = SYMPTOMS.find((s) => s.id === symptomId) ?? DEFAULT_SYMPTOM;
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

const formatDateRu = (isoDate: string) => {
  if (!isoDate) return '';
  const [y, m, d] = isoDate.split('-');
  return y && m && d ? `${d}.${m}.${y}` : isoDate;
};
export const Demo: React.FC = () => {
  const [visitType, setVisitType] = useState<VisitType>('planned');
  const [preferredDate, setPreferredDate] = useState<string>('');
  const [preferredTime, setPreferredTime] = useState<string>(DEFAULT_TIME_SLOT);
  const [selectedRoomId, setSelectedRoomId] = useState<string>(DEFAULT_ROOM.id);
  const [roomMenuOpen, setRoomMenuOpen] = useState<boolean>(false);
  const [roomSearch, setRoomSearch] = useState<string>('');
  const [selectedSymptom, setSelectedSymptom] = useState<SymptomId>(DEFAULT_SYMPTOM.id);
  const [noKeys, setNoKeys] = useState<boolean>(true);
  const [comment, setComment] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  const filteredRooms = useMemo(() => {
    const q = roomSearch.trim().toLowerCase();
    if (!q) return ROOM_CIRCUITS;
    return ROOM_CIRCUITS.filter((r) => r.roomName.toLowerCase().includes(q));
  }, [roomSearch]);

  const activeRoom = useMemo(
    () => ROOM_CIRCUITS.find((r) => r.id === selectedRoomId) ?? DEFAULT_ROOM,
    [selectedRoomId]
  );

  const activeSymptomObj = useMemo(
    () => SYMPTOMS.find((s) => s.id === selectedSymptom) ?? DEFAULT_SYMPTOM,
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
        ? `🚨 ВНЕПЛАНОВЫЙ ВЫЕЗД (в течение 24 ч) · ${OBJECT_INFO.name}`
        : `📋 ПЛАНОВЫЙ ВЫЕЗД (по графику ТО) · ${OBJECT_INFO.name}`;

    const lines = effectiveTasks.map(
      (t, idx) =>
        `${idx + 1}. ${t.roomName} — ${t.symptomLabel}\n   └ Паспорт: ${t.shield} · ${t.breaker} (${t.cable})`
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

    const trimmedComment = comment.trim();
    if (trimmedComment) {
      parts.push(`Комментарий: ${trimmedComment}`);
    }

    return parts.join('\n');
  }, [visitType, preferredDate, preferredTime, effectiveTasks, noKeys, comment]);

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
            QR-заявка
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Отсканируйте QR-код на ресепшен или дверце щита, выберите режим выезда и отметьте
            задачи по помещениям — система сама подставит в заявку нужный щит, номинал автомата и
            кабель.
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
            <div className="mb-5 pb-4 border-b border-slate-800/70">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                    1. Выезд
                  </span>
                  <span className="text-xs text-slate-400 mt-0.5 block">
                    {visitType === 'emergency'
                      ? 'Реакция и выезд дежурного инженера в течение 24 часов'
                      : 'Укажите удобную дату и время или оставьте по графику ТО'}
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
                    <label
                      htmlFor="preferred-date"
                      className="block text-[11px] font-medium text-slate-400 mb-1"
                    >
                      Желаемая дата
                    </label>
                    <input
                      id="preferred-date"
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-slate-100 outline-none transition-colors [color-scheme:dark]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="preferred-time"
                      className="block text-[11px] font-medium text-slate-400 mb-1"
                    >
                      Удобное время
                    </label>
                    <div className="relative">
                      <select
                        id="preferred-time"
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        className="w-full appearance-none truncate bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-lg pl-3 pr-8 py-1.5 text-xs sm:text-sm text-slate-100 outline-none transition-colors"
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
                2. Помещение и проблема
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
                      {activeRoom.roomName}
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      ({activeRoom.shield})
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
                        placeholder="Введите название помещения..."
                        autoFocus
                        className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-lg pl-8 pr-7 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 outline-none"
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
                      {filteredRooms.length > 0 ? (
                        filteredRooms.map((room) => {
                          const isSelected = room.id === activeRoom.id;
                          return (
                            <button
                              key={room.id}
                              type="button"
                              onClick={() => {
                                setSelectedRoomId(room.id);
                                setRoomMenuOpen(false);
                                setRoomSearch('');
                              }}
                              className={`w-full flex items-center justify-between px-3.5 py-2 text-xs sm:text-sm text-left transition-colors ${
                                isSelected
                                  ? 'bg-amber-500/15 text-amber-300 font-semibold'
                                  : 'text-slate-200 hover:bg-slate-900'
                              }`}
                            >
                              <span>{room.roomName}</span>
                              <span className="text-xs font-mono text-slate-500">
                                {room.shield}
                              </span>
                            </button>
                          );
                        })
                      ) : (
                        <div className="px-3.5 py-3 text-xs text-slate-500 text-center">
                          Помещение не найдено
                        </div>
                      )}
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
                <div className="text-xs text-slate-500 py-3 px-3 mb-3 text-center border border-dashed border-slate-800 rounded-lg">
                  Если пунктов несколько — нажимайте «Добавить в список». Иначе в заявку пойдёт
                  выбранное выше: {activeRoom.roomName}
                </div>
              )}

              <div className="mb-3 pt-2 border-t border-slate-800/80">
                <label
                  htmlFor="client-comment"
                  className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-1.5"
                >
                  <MessageSquarePlus className="w-3.5 h-3.5 text-amber-400" />
                  <span>Комментарий для инженера (необязательно)</span>
                </label>
                <input
                  id="client-comment"
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Например: просьба приехать в течение 3 часов"
                  className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-colors"
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
              <span>Готовая ведомость для инженера</span>
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
