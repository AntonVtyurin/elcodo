import {
  MessageCircle,
  Send,
  MapPin,
  UserCheck,
  FileText,
  Clock,
  ArrowDown,
  type LucideIcon,
} from 'lucide-react';
import { getMaxUrl, getTelegramUrl } from '@/config/site';

interface FeatureItem {
  icon: LucideIcon;
  title: string;
  sub: string;
}

const FEATURES: readonly FeatureItem[] = [
  {
    icon: UserCheck,
    title: 'Один закрепленный инженер',
    sub: 'без текучки мастеров',
  },
  {
    icon: FileText,
    title: 'Документация',
    sub: 'расчеты и схемы',
  },
  {
    icon: MapPin,
    title: 'Плательщик НПД',
    sub: 'безнал для юрлиц без НДС',
  },
  {
    icon: Clock,
    title: 'Выезды без остановки офиса',
    sub: 'вечер и выходные',
  },
];

export default function Hero() {
  const maxUrl = getMaxUrl();
  const telegramUrl = getTelegramUrl(
    'Здравствуйте! Интересует аудит и обслуживание электрики офиса.'
  );

  return (
    <section
      id="top"
      className="relative overflow-hidden pb-16 pt-36 lg:pb-24 lg:pt-44"
    >
      {/* Атмосферный инженерный фон */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 55% at 78% -8%, rgba(245,158,11,0.16), transparent 62%),
            radial-gradient(ellipse 55% 45% at 8% 12%, rgba(217,119,6,0.09), transparent 60%),
            radial-gradient(ellipse 90% 70% at 50% 110%, rgba(17,19,28,0.9), transparent 70%),
            linear-gradient(180deg, rgba(9,10,15,0.20) 0%, rgba(9,10,15,0.72) 60%, #090A0F 100%)
          `,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.45) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.45) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage:
            'radial-gradient(ellipse 80% 65% at 50% 30%, black 25%, transparent 75%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 65% at 50% 30%, black 25%, transparent 75%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/[0.08] px-4 py-1.5 font-mono text-[11px] font-medium tracking-[0.18em] text-amber-400">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-amber-400" />
            ИНДИВИДУАЛЬНЫЙ ПОДХОД • СПБ
          </span>

          <h1 className="mt-7 text-balance text-4xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
            Персональный инженер-электрик и порядок в электрохозяйстве{' '}
            <span className="text-amber-400">для вашего офиса</span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            Абонентское обслуживание по подписке, ведение документации по ЭХ, быстрый
            тепловизионный аудит без лишней бюрократии и интерактивные SVG-карты помещений
            с заявками по QR-коду. Ваш объект ведет один закрепленный инженер-электрик,
            который знает каждый автомат в вашем щите.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={maxUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-7 py-4 text-base font-bold text-[#090A0F] shadow-[0_8px_32px_rgba(245,158,11,0.35)] transition-all hover:bg-amber-400 hover:shadow-[0_8px_40px_rgba(245,158,11,0.5)] sm:w-auto"
            >
              <MessageCircle className="h-5 w-5" />
              Запросить аудит в MAX
            </a>
            <a
              href="#demo"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-7 py-4 text-base font-semibold text-zinc-100 backdrop-blur-sm transition-all hover:border-amber-500/40 hover:text-amber-400 sm:w-auto"
            >
              Попробовать демо SVG-карты
              <ArrowDown className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-4">
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-amber-400"
            >
              <Send className="h-4 w-4 text-zinc-500" />
              Написать в Telegram
            </a>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, sub }) => (
            <div
              key={title}
              className="glass-card rounded-2xl p-6 transition-colors duration-300 hover:border-amber-500/30"
            >
              <Icon className="h-7 w-7 text-amber-400" strokeWidth={1.8} />
              <p className="mt-4 text-base font-bold leading-snug text-white">
                {title}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
                {sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
