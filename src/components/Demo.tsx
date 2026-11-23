import { useMemo, useState } from 'react';
import {
  Shield,
  Plug,
  Lightbulb,
  Coffee,
  Server,
  Zap,
  Send,
  BadgeCheck,
  Lock,
} from 'lucide-react';
import SectionHeading from './SectionHeading';

interface Point {
  id: string;
  name: string;
  zone: string;
  group: string;
  breaker: string;
  status: string;
  statusOk: boolean;
  x: number; // проценты плана
  y: number;
  icon: typeof Plug;
}

const POINTS: Point[] = [
  { id: 'shield1', name: 'Щит №1 (Вводной)', zone: 'Приемная', group: 'Ввод', breaker: 'QF1 · 63 А', status: 'Норма', statusOk: true, x: 8, y: 42, icon: Shield },
  { id: 'socket14', name: 'Розетка #14', zone: 'Кабинет 2', group: 'Группа розеток', breaker: 'QF3 · 16 А', status: 'Нагрев контакта', statusOk: false, x: 62, y: 32, icon: Plug },
  { id: 'light04', name: 'Светильник #04', zone: 'Переговорная', group: 'Освещение', breaker: 'QF4 · 10 А', status: 'Норма', statusOk: true, x: 62, y: 76, icon: Lightbulb },
  { id: 'coffee02', name: 'Линия кофемашины #02', zone: 'Кухня', group: 'Кухня', breaker: 'QF5 · 25 А', status: 'Высокая нагрузка', statusOk: false, x: 30, y: 76, icon: Coffee },
  { id: 'rack01', name: 'Серверная стойка #01', zone: 'Серверная', group: 'ИБП / серверная', breaker: 'QF2 · 32 А', status: 'Норма', statusOk: true, x: 30, y: 12, icon: Server },
  { id: 'socket08', name: 'Розетка #08', zone: 'Кабинет 1', group: 'Группа розеток', breaker: 'QF6 · 16 А', status: 'Норма', statusOk: true, x: 8, y: 12, icon: Zap },
];

const ISSUES = ['Нет питания', 'Греется / искрит', 'Мигает свет'];

const ROOMS = [
  { label: 'Серверная', x: 6, y: 4, w: 22, h: 20 },
  { label: 'Кабинет 1', x: 6, y: 26, w: 22, h: 32 },
  { label: 'Приемная', x: 6, y: 60, w: 22, h: 36 },
  { label: 'Кухня', x: 30, y: 60, w: 34, h: 36 },
  { label: 'Переговорная', x: 52, y: 58, w: 42, h: 38 },
  { label: 'Кабинет 2', x: 30, y: 4, w: 64, h: 52 },
];

export default function Demo() {
  const [selectedId, setSelectedId] = useState('socket14');
  const [issue, setIssue] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const selected = useMemo(
    () => POINTS.find((p) => p.id === selectedId) ?? POINTS[0],
    [selectedId]
  );

  const pick = (id: string) => {
    setSelectedId(id);
    setIssue(null);
    setSent(false);
  };

  const send = () => {
    if (!issue) return;
    setSent(true);
  };

  return (
    <section id="demo" className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          title="Как работают заявки по QR-коду на интерактивной карте"
          subtitle="Сотрудник наводит камеру на QR-наклейку у щитка, выбирает точку на плане офиса — и инженер мгновенно получает точный номер автомата в Telegram."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* SVG-план офиса */}
          <div className="glass-card overflow-hidden rounded-2xl p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-xs tracking-widest text-zinc-500">
                PLAN // OFFICE-01 · SVG
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-amber-400">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-amber-400" />
                LIVE
              </span>
            </div>

            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/[0.08] bg-[#0C0E16]">
              {/* инженерная сетка */}
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
                  backgroundSize: '28px 28px',
                }}
              />

              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden>
                {ROOMS.map((r) => (
                  <g key={r.label}>
                    <rect
                      x={r.x}
                      y={r.y}
                      width={r.w}
                      height={r.h}
                      rx="1.4"
                      fill="rgba(255,255,255,0.025)"
                      stroke="rgba(255,255,255,0.18)"
                      strokeWidth="0.35"
                    />
                  </g>
                ))}
              </svg>

              {/* подписи комнат */}
              {ROOMS.map((r) => (
                <span
                  key={r.label}
                  className="pointer-events-none absolute font-mono text-[9px] uppercase tracking-widest text-zinc-500 sm:text-[10px]"
                  style={{ left: `${r.x + 1.5}%`, top: `${r.y + 1.5}%` }}
                >
                  {r.label}
                </span>
              ))}

              {/* точки */}
              {POINTS.map((p) => {
                const active = p.id === selectedId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => pick(p.id)}
                    aria-label={p.name}
                    className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                    style={{ left: `${p.x + 4}%`, top: `${p.y + 4}%` }}
                  >
                    <span
                      className={`relative grid h-8 w-8 place-items-center rounded-full border transition-all duration-300 sm:h-9 sm:w-9 ${
                        active
                          ? 'border-amber-400 bg-amber-500/25 text-amber-300 pulse-dot'
                          : 'border-white/20 bg-[#11131C]/90 text-zinc-400 hover:border-amber-500/50 hover:text-amber-400'
                      }`}
                    >
                      <p.icon className="h-4 w-4" strokeWidth={2} />
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="mt-4 text-xs leading-relaxed text-zinc-500">
              Нажмите на точку на плане — справа откроются данные точки и симулятор заявки.
            </p>
          </div>

          {/* Панель инспектора */}
          <div className="flex flex-col gap-6">
            <div className="glass-card rounded-2xl p-6 lg:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs tracking-widest text-zinc-500">ТОЧКА ОБЪЕКТА</p>
                  <h3 className="mt-1.5 text-xl font-bold text-white">{selected.name}</h3>
                </div>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    selected.statusOk
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                      : 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                  }`}
                >
                  {selected.status}
                </span>
              </div>

              <dl className="mt-5 grid grid-cols-2 gap-3 font-mono text-sm">
                {[
                  ['Зона', selected.zone],
                  ['Группа в щите', selected.group],
                  ['Автомат', selected.breaker],
                  ['QR-токен', `a3f-…-${selected.id.slice(0, 4).toUpperCase()}`],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5">
                    <dt className="text-[11px] uppercase tracking-wider text-zinc-500">{k}</dt>
                    <dd className="mt-0.5 text-zinc-200">{v}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-6 font-mono text-xs tracking-widest text-zinc-500">ТИП ПРОБЛЕМЫ</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {ISSUES.map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setIssue(i);
                      setSent(false);
                    }}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                      issue === i
                        ? 'border-amber-500/60 bg-amber-500/10 text-amber-400'
                        : 'border-white/10 bg-white/[0.03] text-zinc-300 hover:border-white/25'
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={send}
                disabled={!issue}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3.5 text-sm font-bold text-[#090A0F] shadow-[0_6px_24px_rgba(245,158,11,0.3)] transition-all hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
              >
                <Send className="h-4 w-4" />
                Отправить тестовую заявку
              </button>
              {!issue && (
                <p className="mt-2 text-center text-xs text-zinc-500">
                  Сначала выберите тип проблемы
                </p>
              )}
            </div>

            {/* Симулятор Telegram */}
            {sent && issue && (
              <div className="glass-card fade-up rounded-2xl p-6 lg:p-7">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-[#2AABEE]/20 text-[#2AABEE]">
                      <Send className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-white">Elcodo · Заявки</p>
                      <p className="text-xs text-zinc-500">Telegram-бот объекта</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-zinc-500">сейчас</span>
                </div>

                <div className="mt-4 rounded-xl rounded-tl-sm border border-white/[0.08] bg-white/[0.04] p-4 text-sm leading-relaxed text-zinc-200">
                  <p className="font-mono text-xs text-amber-400">⚡ НОВАЯ ЗАЯВКА ПО QR</p>
                  <p className="mt-2">
                    <span className="text-zinc-500">Точка:</span> {selected.name}
                  </p>
                  <p>
                    <span className="text-zinc-500">Зона:</span> {selected.zone}
                  </p>
                  <p>
                    <span className="text-zinc-500">Автомат:</span> {selected.breaker} ({selected.group})
                  </p>
                  <p>
                    <span className="text-zinc-500">Проблема:</span> {issue}
                  </p>
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Заявка доставлена закрепленному инженеру
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Плашка безопасности */}
        <div className="glass-card mt-8 flex items-start gap-4 rounded-2xl p-6">
          <Lock className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
          <p className="text-sm leading-relaxed text-zinc-400">
            <span className="font-semibold text-zinc-200">Безопасность данных:</span> карта
            объекта не индексируется поисковиками, не содержит конфиденциальных названий и
            открывается только по уникальному крипто-токену (UUID) с QR-наклейки с проверкой
            PIN-кода.
          </p>
        </div>
      </div>
    </section>
  );
}
