import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import SectionHeading from './SectionHeading';

const FAQ = [
  {
    q: 'Как юридически оформляется подписка и закрывающие документы?',
    a: 'Официальный договор оказания услуг. Работаем в удобном формате — ФЛ / СЗ / ИП, выставляем счета и закрывающие акты для юрлиц в ЭДО или на бумаге, без НДС.',
  },
  {
    q: 'Можете ли вы взять на себя функции ответственного за электрохозяйство (ОЭХ)?',
    a: 'Да. По ПТЭЭП берем на себя всю документацию, журналы, схемы и подготовку к проверкам. Формально приказом назначается сотрудник заказчика — это полностью законно и без рисков для проверки. Фактически всю инженерную и «бумажную» часть ведет наш специалист.',
  },
  {
    q: 'В какое время проходят плановые осмотры и замеры?',
    a: 'В согласованные с вами окна, включая вечернее время после 18:30 и выходные дни, чтобы не отвлекать сотрудников и не обесточивать офис в рабочие часы.',
  },
  {
    q: 'Что такое «аварийный выезд за 2 000 ₽» в базовом тарифе?',
    a: 'Это спеццена для подписчиков при потере питания, срабатывании вводных автоматов или нагреве щита. Мелкий несрочный ремонт накапливается к плановому визиту — вы не платите за каждый мелкий вызов отдельно.',
  },
  {
    q: 'Зачем нужен разовый первичный аудит перед постановкой на обслуживание?',
    a: 'Это быстрый инженерный чекап без многонедельной волокиты: за один визит находим узкие места — перегрев контактов и перекос фаз, приводим схему щита в порядок, при необходимости проверяем проект или смету от ваших строителей и оцифровываем план помещения в SVG.',
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-5 lg:px-8">
        <SectionHeading title="Частые вопросы" />

        <div className="mt-12 space-y-3">
          {FAQ.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className={`glass-card overflow-hidden rounded-2xl transition-colors duration-300 ${
                  isOpen ? 'border-amber-500/30' : ''
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span
                    className={`text-[15px] font-bold leading-snug transition-colors sm:text-base ${
                      isOpen ? 'text-amber-400' : 'text-white'
                    }`}
                  >
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-zinc-500 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-amber-400' : ''
                    }`}
                  />
                </button>
                <div
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-[15px] leading-relaxed text-zinc-400">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
