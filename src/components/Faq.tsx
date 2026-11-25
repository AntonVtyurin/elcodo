import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import SectionHeading from './SectionHeading';

interface FaqItem {
  q: string;
  a: string;
}

const FAQ: readonly FaqItem[] = [
  {
    q: 'Как юридически оформляется подписка и закрывающие документы?',
    a: 'Официальный договор оказания услуг, работаем как плательщики НПД. Выставляем счета и закрывающие акты для юрлиц в ЭДО (Контур.Диадок / Госключ) или на бумаге, без НДС — с формированием официального чека ФНС после каждой оплаты.',
  },
  {
    q: 'Кто формально числится ответственным за электрохозяйство при проверках?',
    a: 'По ПТЭЭП для офисов и объектов до 380 В ответственным приказом назначается руководитель или сотрудник заказчика — это полностью законно и без рисков. Всю фактическую инженерную и бумажную часть — ведение журналов ЭХ, актуализацию схем в DWG, маркировку щитов и подготовку к проверкам — ведем мы по договору обслуживания.',
  },
  {
    q: 'В какое время проходят плановые осмотры и замеры?',
    a: 'В согласованные с вами окна, включая вечернее время после 18:30 и выходные дни, чтобы не отвлекать сотрудников и не обесточивать офис в рабочие часы.',
  },
  {
    q: 'Что такое «внеплановый выезд от 3 000 ₽» в тарифе «Старт»?',
    a: 'Это спеццена для подписчиков тарифа «Старт» (3 000 ₽ в базовой зоне и 3 500 ₽ в экстра-зоне вместо стандартных 5 000–6 000 ₽) при сбое питания, срабатывании автоматов или нагреве контактов. Мелкий несрочный ремонт накапливается к плановому визиту — вы не платите за каждый вызов отдельно.',
  },
  {
    q: 'Зачем нужен разовый первичный аудит перед постановкой на обслуживание?',
    a: 'Это быстрый инженерный чекап без многонедельной волокиты: за один визит находим узкие места — перегрев контактов и перекос фаз, маркируем щит и актуализируем однолинейную схему в DWG, при необходимости проверяем смету от строителей и отрисовываем интерактивную SVG-карту помещений.',
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
                  isOpen ? 'border-amber-500/40' : 'hover:border-amber-500/30'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span
                    className={`text-base font-bold leading-snug transition-colors sm:text-[17px] ${
                      isOpen ? 'text-amber-400' : 'text-white'
                    }`}
                  >
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-zinc-300 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-amber-400' : ''
                    }`}
                  />
                </button>
                <div
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-base leading-relaxed text-zinc-200">
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
