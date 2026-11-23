import { Handshake, Crosshair, FileCheck, Calculator } from 'lucide-react';
import SectionHeading from './SectionHeading';

const CARDS = [
  {
    icon: Handshake,
    title: 'Модель Win-Win',
    text: 'Вы не тратите время на объяснения новым электрикам, где находится щит. Мы проводим глубокий первичный аудит, оцифровываем схемы и дальше поддерживаем объект в идеальном состоянии без авралов.',
  },
  {
    icon: Crosshair,
    title: 'Точная диагностика с первого визита — без бюрократии',
    text: 'Опыт проектирования сложных инженерных сетей и экспертизы документации в сочетании с IT-подходом позволяет быстро находить первопричину проблемы — без многомесячных согласований там, где нужно надежное решение «здесь и сейчас».',
  },
  {
    icon: FileCheck,
    title: 'Порядок в документах и проверках',
    text: 'Ведем журналы по электрохозяйству, актуальные однолинейные схемы щитов, проверяем проекты от строителей и готовим объект к проверкам арендодателя или контролирующих органов.',
  },
  {
    icon: Calculator,
    title: 'Прозрачный расчет (ФЛ / СЗ / ИП)',
    text: 'Официальный договор, безналичный расчет для юрлиц и закрывающие акты для бухгалтерии (без НДС), фиксированная подписка без скрытых доплат.',
  },
];

export default function Approach() {
  return (
    <section id="approach" className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          title="Персональный сервис вместо случайных мастеров"
          subtitle="Мы берем на обслуживание ограниченное число объектов в Петербурге, чтобы глубоко знать каждый из них."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
          {CARDS.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="glass-card group relative overflow-hidden rounded-2xl p-7 transition-all duration-300 hover:border-amber-500/30 lg:p-8"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-amber-500/[0.06] blur-2xl transition-opacity duration-300 group-hover:opacity-150"
              />
              <span className="grid h-12 w-12 place-items-center rounded-xl border border-amber-500/25 bg-amber-500/10">
                <Icon className="h-6 w-6 text-amber-400" strokeWidth={1.8} />
              </span>
              <h3 className="mt-5 text-lg font-bold leading-snug text-white">{title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-zinc-400">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
