import { useState } from 'react';
import { Send, Check, Building2, MapPin } from 'lucide-react';
import SectionHeading from './SectionHeading';

type Zone = 'base' | 'premium';

interface Plan {
  id: string;
  name: string;
  basePrice: number;
  audience: string;
  features: string[];
  highlighted?: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'Базовый',
    basePrice: 5000,
    audience: 'Малые офисы, студии, кофейни и шоурумы (до 100 м²)',
    features: [
      '1 плановый визит в квартал (протяжка клемм, тепловизор, осмотр)',
      'Спеццена на аварийный выезд 2 000 ₽ (вместо 4 500 ₽)',
      'Прием заявок в Telegram',
    ],
  },
  {
    id: 'business',
    name: 'Бизнес-ЭХ',
    basePrice: 12000,
    audience: 'Офисы, медцентры, клиники и салоны (100–300 м²)',
    highlighted: true,
    features: [
      'Ежемесячный плановый ППР',
      '1 экстренный выезд включен (далее по 2 000 ₽)',
      'Ведение журналов ЭХ и однолинейных схем',
      'Подготовка к проверкам',
      'Цифровой паспорт щита',
    ],
  },
  {
    id: 'consulting',
    name: 'Цифровой консалтинг',
    basePrice: 22000,
    audience: 'IT-офисы, коворкинги, рестораны и загородные резиденции',
    features: [
      'Всё из тарифа «Бизнес-ЭХ»',
      '2 экстренных выезда включены',
      'Расчеты нагрузок и ребалансировка фаз',
      'Отказоустойчивая автоматика (астротаймеры, резервирование, интеграция с Алисой без зависимости от сети)',
      'Интерактивная SVG-карта объекта с QR-кодом',
    ],
  },
];

const fmt = (n: number) => n.toLocaleString('ru-RU');

export default function Pricing() {
  const [zone, setZone] = useState<Zone>('base');

  return (
    <section id="pricing" className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          title="Прозрачная подписка под масштаб вашего бизнеса"
          subtitle="Выберите зону обслуживания — цены пересчитаются автоматически."
        />

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => setZone('base')}
            className={`inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-all duration-300 ${
              zone === 'base'
                ? 'border-amber-500/60 bg-amber-500/10 text-amber-400 shadow-[0_0_24px_rgba(245,158,11,0.15)]'
                : 'border-white/10 bg-white/[0.03] text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Building2 className="h-4 w-4" />
            Базовая зона (Петроградка, В.О., Выборгская, Центр)
            <span className="font-mono text-xs opacity-80">×1.0</span>
          </button>
          <button
            type="button"
            onClick={() => setZone('premium')}
            className={`inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-all duration-300 ${
              zone === 'premium'
                ? 'border-amber-500/60 bg-amber-500/10 text-amber-400 shadow-[0_0_24px_rgba(245,158,11,0.15)]'
                : 'border-white/10 bg-white/[0.03] text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <MapPin className="h-4 w-4" />
            Премиум-зона (Лисий Нос, Ольгино, Лахта)
            <span className="font-mono text-xs opacity-80">×1.3</span>
          </button>
        </div>

        <div className="mt-12 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => {
            const price = Math.round(plan.basePrice * (zone === 'premium' ? 1.3 : 1));
            return (
              <article
                key={plan.id}
                className={`relative flex flex-col rounded-2xl p-7 transition-all duration-300 lg:p-8 ${
                  plan.highlighted
                    ? 'border border-amber-500/50 bg-[#11131C] shadow-[0_0_48px_rgba(245,158,11,0.14)] lg:-my-3 lg:py-11'
                    : 'glass-card hover:border-white/20'
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-amber-500 px-4 py-1.5 text-xs font-bold text-[#090A0F]">
                    Оптимальный выбор
                  </span>
                )}

                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <p className="mt-4 font-mono">
                  <span className="text-4xl font-bold tracking-tight text-white transition-all duration-300">
                    {fmt(price)} ₽
                  </span>
                  <span className="ml-2 text-sm text-zinc-500">/ мес</span>
                </p>
                {zone === 'premium' && (
                  <p className="mt-1 font-mono text-xs text-amber-400/80 fade-up">
                    {fmt(plan.basePrice)} ₽ × 1.3
                  </p>
                )}

                <p className="mt-5 text-sm leading-relaxed text-zinc-400">{plan.audience}</p>

                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-3 text-sm leading-relaxed text-zinc-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" strokeWidth={2.5} />
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-8 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold transition-all ${
                    plan.highlighted
                      ? 'bg-amber-500 text-[#090A0F] shadow-[0_6px_24px_rgba(245,158,11,0.35)] hover:bg-amber-400'
                      : 'border border-amber-500/50 text-amber-400 hover:bg-amber-500/10'
                  }`}
                >
                  <Send className="h-4 w-4" />
                  Выбрать «{plan.name}»
                </a>
              </article>
            );
          })}
        </div>

        <p className="mx-auto mt-10 max-w-4xl text-center text-sm leading-relaxed text-zinc-500">
          Первичный аудит, лазерный обмер помещения и отрисовка интерактивной SVG-карты
          выполняются как разовый старт (от 15 000 ₽) или бесплатно при оплате подписки от
          6 месяцев. Расходные материалы оплачиваются по чекам.
        </p>
      </div>
    </section>
  );
}
