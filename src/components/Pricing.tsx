import { useState } from 'react';
import {
  MessageCircle,
  Send,
  Check,
  Building2,
  MapPin,
  Lock,
  ChevronDown,
} from 'lucide-react';
import SectionHeading from './SectionHeading';
import { getMaxUrl, getTelegramUrl } from '@/config/site';

type Zone = 'base' | 'extra';

interface Plan {
  id: 'start' | 'comfort' | 'business';
  name: string;
  basePrice: number;
  audience: string;
  features: readonly string[];
  highlighted?: boolean;
  disabledInExtra?: boolean;
}

const fmt = (n: number) => n.toLocaleString('ru-RU');

function getPlans(zone: Zone): readonly Plan[] {
  const extraVisitPrice = zone === 'extra' ? '3 500 ₽' : '3 000 ₽';
  const comfortSla = zone === 'extra' ? 'до 4 часов' : 'до 3 часов';
  const businessSla =
    zone === 'extra' ? 'до 4 часов (вкл. выходные)' : 'до 2 часов (вкл. выходные)';

  return [
    {
      id: 'start',
      name: 'Старт',
      basePrice: 5000,
      audience: 'Дизайн-бюро, шоурумы, студии и малые офисы (строго 1 щит, до 80 м²)',
      disabledInExtra: true,
      features: [
        '1 плановый визит раз в 2 месяца (протяжка клемм, тепловизор, осмотр щита)',
        '1 внеплановый выезд в месяц в течение 24 ч включён (далее по ' +
          extraVisitPrice +
          ')',
        'Приоритет в графике закреплённого инженера по району',
      ],
    },
    {
      id: 'comfort',
      name: 'Комфорт',
      basePrice: 12000,
      audience: 'Офисы, медцентры, клиники и салоны (1–3 щита, до 250 м²)',
      highlighted: true,
      features: [
        '1 плановый визит в месяц (протяжка клемм, тепловизор, осмотр)',
        'Мелкий ремонт на ТО в цене: замена розеток, автоматов и светильников без доплаты за работу',
        '1 внеплановый выезд в месяц ' +
          comfortSla +
          ' включён (далее по ' +
          extraVisitPrice +
          ')',
        'Со 2-го месяца: ведение журналов ЭХ, инструктаж персонала (I группа) и актуализация схем',
        'Возврат первичного аудита в счёт 7-го месяца подписки',
      ],
    },
    {
      id: 'business',
      name: 'Бизнес',
      basePrice: 22000,
      audience: 'Мини-сети (2–3 точки в районе) или крупные объекты от 4 щитов (>250 м²)',
      features: [
        'Всё из тарифа «Комфорт» (документы и сопровождение с 1-го месяца)',
        '2 внеплановых выезда в месяц ' +
          businessSla +
          ' включены (далее по ' +
          extraVisitPrice +
          ')',
        'Представительство перед УК/ТСЖ и при проверках (МЧС, Ростехнадзор)',
        'Расчёты нагрузок, балансировка фаз и консалтинг по резервированию',
        'Цифровой QR-паспорт объекта и конструктор заявок по помещениям',
      ],
    },
  ];
}
export default function Pricing() {
  const [zone, setZone] = useState<Zone>('base');
  const [expandedPlans, setExpandedPlans] = useState<Record<string, boolean>>({});
  const maxUrl = getMaxUrl();
  const multiplier = zone === 'extra' ? 1.3 : 1;
  const zoneLabel = zone === 'base' ? 'Базовая зона' : 'Экстра-зона';
  const auditMinPrice = Math.round(15000 * multiplier);
  const plans = getPlans(zone);

  const togglePlan = (id: string) => {
    setExpandedPlans((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="pricing" className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          title="Прозрачная подписка под масштаб вашего бизнеса"
          subtitle="Выберите зону обслуживания — цены и скорость выезда пересчитаются автоматически"
        />

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => setZone('base')}
            className={`inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-all duration-300 ${
              zone === 'base'
                ? 'border-amber-500/60 bg-amber-500/10 text-amber-400 shadow-[0_0_24px_rgba(245,158,11,0.15)]'
                : 'border-white/10 bg-white/[0.03] text-zinc-300 hover:border-white/25 hover:text-white'
            }`}
          >
            <Building2 className="h-4 w-4" />
            Базовая зона (П.С., В.О., Центр, Выборгская)
            <span className="font-mono text-xs opacity-80">×1.0</span>
          </button>
          <button
            type="button"
            onClick={() => setZone('extra')}
            className={`inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-all duration-300 ${
              zone === 'extra'
                ? 'border-amber-500/60 bg-amber-500/10 text-amber-400 shadow-[0_0_24px_rgba(245,158,11,0.15)]'
                : 'border-white/10 bg-white/[0.03] text-zinc-300 hover:border-white/25 hover:text-white'
            }`}
          >
            <MapPin className="h-4 w-4" />
            Экстра-зона (Лахта, Ольгино, Лисий Нос)
            <span className="font-mono text-xs opacity-80">×1.3</span>
          </button>
        </div>

        <div className="mt-12 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
          {plans.map((plan) => {
            const isDisabled = zone === 'extra' && Boolean(plan.disabledInExtra);
            const isExpanded = Boolean(expandedPlans[plan.id]);
            const price = Math.round(plan.basePrice * multiplier);
            const telegramHref = getTelegramUrl(
              'Здравствуйте! Интересует тариф «' +
                plan.name +
                '» (' +
                zoneLabel +
                ', ' +
                fmt(price) +
                ' ₽/мес).'
            );

            return (
              <article
                key={plan.id}
                className={`group relative flex flex-col rounded-2xl p-6 transition-all duration-300 sm:p-7 lg:p-8 ${
                  isDisabled
                    ? 'glass-card opacity-55'
                    : plan.highlighted
                      ? 'border border-amber-500/50 bg-[#11131C] shadow-[0_0_48px_rgba(245,158,11,0.14)] hover:border-amber-400/80 lg:-my-3 lg:py-11'
                      : 'glass-card hover:border-amber-500/40 hover:bg-[#11131C]/80'
                }`}
              >
                {plan.highlighted && !isDisabled && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-amber-500 px-4 py-1.5 text-xs font-bold text-[#090A0F]">
                    Оптимальный выбор
                  </span>
                )}

                {isDisabled && (
                  <span className="absolute -top-3.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-white/15 bg-[#11131C] px-3.5 py-1.5 text-xs font-semibold text-zinc-400">
                    <Lock className="h-3 w-3" />
                    Только для базовой зоны
                  </span>
                )}

                <h3 className="text-xl font-bold text-white">{plan.name}</h3>

                {isDisabled ? (
                  <div className="mt-4">
                    <p className="text-lg font-bold text-zinc-400">
                      Недоступно в экстра-зоне
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      Для удалённых районов выберите «Комфорт» или «Бизнес»
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="mt-4 font-mono">
                      <span className="text-4xl font-bold tracking-tight text-white transition-all duration-300">
                        {fmt(price)} ₽
                      </span>
                      <span className="ml-2 text-sm text-zinc-400">/ мес</span>
                    </p>
                    {zone === 'extra' && (
                      <p className="fade-up mt-1 font-mono text-xs text-amber-400/90">
                        {fmt(plan.basePrice)} ₽ × 1.3
                      </p>
                    )}
                  </>
                )}

                <p className="mt-4 text-[15px] leading-relaxed text-zinc-300 lg:mt-5">
                  {plan.audience}
                </p>

                {!isDisabled && (
                  <button
                    type="button"
                    onClick={() => togglePlan(plan.id)}
                    aria-expanded={isExpanded}
                    className="mt-4 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-amber-400 transition-colors hover:text-amber-300 lg:hidden"
                  >
                    <span>
                      {isExpanded
                        ? 'Свернуть состав тарифа'
                        : `Подробнее (${plan.features.length})`}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                )}
                <ul
                  className={`mt-5 flex-1 space-y-3 lg:mt-6 lg:block ${
                    isExpanded ? 'block' : 'hidden'
                  }`}
                >
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex gap-3 text-[15px] leading-relaxed text-zinc-200"
                    >
                      <Check
                        className={`mt-1 h-4 w-4 shrink-0 ${
                          isDisabled ? 'text-zinc-600' : 'text-amber-400'
                        }`}
                        strokeWidth={2.5}
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-col items-center gap-3 lg:mt-8">
                  {isDisabled ? (
                    <button
                      type="button"
                      onClick={() => setZone('base')}
                      className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3.5 text-sm font-semibold text-zinc-300 transition-colors hover:border-amber-500/50 hover:text-amber-400"
                    >
                      Переключить на базовую зону
                    </button>
                  ) : (
                    <>
                      <a
                        href={maxUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold transition-all duration-300 ${
                          plan.highlighted
                            ? 'bg-amber-500 text-[#090A0F] shadow-[0_6px_24px_rgba(245,158,11,0.35)] hover:bg-amber-400'
                            : 'border border-amber-500/50 text-amber-400 group-hover:border-amber-500 group-hover:bg-amber-500 group-hover:text-[#090A0F] group-hover:shadow-[0_6px_24px_rgba(245,158,11,0.35)] hover:!bg-amber-400'
                        }`}
                      >
                        <MessageCircle className="h-4 w-4" />
                        Выбрать «{plan.name}» в MAX
                      </a>
                      <a
                        href={telegramHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 underline-offset-4 transition-colors hover:text-zinc-200 hover:underline"
                      >
                        <Send className="h-3.5 w-3.5 text-zinc-500" />
                        Выбрать в Telegram
                      </a>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <p className="mx-auto mt-10 max-w-4xl text-center text-sm leading-relaxed text-zinc-300">
          Обязательный старт — первичный аудит электрохозяйства (от {fmt(auditMinPrice)} ₽:
          протяжка клемм, прозвонка линий, тепловизор под нагрузкой, маркировка и дефектная
          ведомость). При непрерывном обслуживании на тарифах «Комфорт» или «Бизнес»
          выполняется возврат первичного аудита в счёт 7-го месяца подписки (в пределах
          стоимости одного месяца тарифа). Расходные материалы оплачиваются по чекам.
        </p>
      </div>
    </section>
  );
}
