import { useEffect } from 'react';
import { X } from 'lucide-react';
import { SITE_CONFIG, formatRequisites } from '@/config/site';

interface PrivacyModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ open, onClose }: PrivacyModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Политика конфиденциальности"
    >
      <div
        className="fade-up max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/15 bg-[#11131C] p-7 shadow-2xl sm:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-2xl font-extrabold text-white">
            Политика конфиденциальности
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/15 text-zinc-300 transition-colors hover:border-amber-500/40 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 space-y-5 text-[15px] leading-relaxed text-zinc-300">
          <p>
            Настоящая Политика обработки персональных данных составлена в соответствии с
            требованиями Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных»
            и определяет порядок обработки персональных данных и меры по обеспечению их
            безопасности, предпринимаемые Оператором.
          </p>

          <div>
            <h3 className="mb-2 font-bold text-white">1. Оператор</h3>
            <p>
              Оператором персональных данных является:{' '}
              <span className="font-mono text-zinc-100">{formatRequisites()}</span>.
              Контакт для обращений по вопросам персональных данных:{' '}
              <a
                href={'mailto:' + SITE_CONFIG.email}
                className="font-mono text-amber-400 transition-colors hover:text-amber-300 hover:underline"
              >
                {SITE_CONFIG.email}
              </a>
              , сайт:{' '}
              <span className="font-mono text-zinc-100">{SITE_CONFIG.domain}</span>.
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-bold text-white">2. Состав обрабатываемых данных</h3>
            <p>
              Оператор обрабатывает данные, которые пользователь предоставляет добровольно:
              имя, номер телефона, адрес электронной почты, наименование организации, а
              также сведения из обращений в мессенджерах MAX и Telegram и по электронной
              почте. Сайт не собирает персональные данные автоматически и не содержит форм
              скрытого сбора данных.
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-bold text-white">3. Цели обработки</h3>
            <p>
              Обработка заявок и обращений, консультирование по инженерным услугам,
              подготовка коммерческих предложений, заключение и исполнение договоров
              оказания услуг.
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-bold text-white">4. Правовые основания</h3>
            <p>
              Согласие пользователя, выраженное конклюдентными действиями (самостоятельным
              направлением обращения в мессенджер MAX, Telegram или на электронную почту)
              либо отдельным согласием, договоры, стороной которых является субъект
              персональных данных, а также законодательство РФ.
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-bold text-white">5. Порядок и сроки обработки</h3>
            <p>
              Персональные данные хранятся на территории РФ и обрабатываются только в срок,
              необходимый для ответа на обращение или исполнения договора. Вы можете в любой
              момент отозвать согласие на обработку, написав на{' '}
              <a
                href={'mailto:' + SITE_CONFIG.email}
                className="font-mono text-amber-400 transition-colors hover:text-amber-300 hover:underline"
              >
                {SITE_CONFIG.email}
              </a>
              .
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-bold text-white">
              6. Права субъекта персональных данных
            </h3>
            <p>
              Пользователь имеет право получать сведения об обработке своих персональных
              данных, требовать их уточнения, блокирования или уничтожения, а также отозвать
              согласие на обработку, направив обращение на{' '}
              <a
                href={'mailto:' + SITE_CONFIG.email}
                className="font-mono text-amber-400 transition-colors hover:text-amber-300 hover:underline"
              >
                {SITE_CONFIG.email}
              </a>
              .
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-bold text-white">
              7. Файлы cookie и локальное хранилище
            </h3>
            <p>
              Сайт не использует рекламные или сторонние аналитические файлы cookie. Для
              корректной работы интерфейса могут применяться исключительно технические
              настройки локального хранилища браузера пользователя.
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-bold text-white">8. Изменение политики</h3>
            <p>
              Оператор имеет право вносить изменения в настоящую Политику. Актуальная
              редакция всегда размещена на сайте по адресу{' '}
              <span className="font-mono text-zinc-100">{SITE_CONFIG.domain}</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
