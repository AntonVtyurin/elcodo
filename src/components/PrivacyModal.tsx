import { useEffect } from 'react';
import { X } from 'lucide-react';

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
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Политика конфиденциальности"
    >
      <div
        className="fade-up max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/[0.08] bg-[#11131C] p-7 shadow-2xl sm:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-2xl font-extrabold text-white">Политика конфиденциальности</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 text-zinc-400 transition-colors hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 space-y-5 text-sm leading-relaxed text-zinc-400">
          <p>
            Настоящая Политика обработки персональных данных составлена в соответствии с
            требованиями Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных»
            и определяет порядок обработки персональных данных и меры по обеспечению их
            безопасности, предпринимаемые Оператором.
          </p>
          <div>
            <h3 className="mb-2 font-bold text-white">1. Оператор</h3>
            <p>
              Оператором персональных данных является: <span className="text-zinc-200">[ФИО]</span>,
              ИНН: <span className="font-mono text-zinc-200">[ИНН]</span>. Контакт для обращений
              по вопросам персональных данных: <span className="font-mono text-amber-400">elcodo@bk.ru</span>,
              сайт: <span className="font-mono text-zinc-200">elcodo.ru</span>.
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-bold text-white">2. Состав обрабатываемых данных</h3>
            <p>
              Оператор обрабатывает данные, которые пользователь предоставляет добровольно:
              имя, номер телефона, адрес электронной почты, сведения из сообщений в мессенджерах
              и по электронной почте. Сайт не собирает персональные данные автоматически и не
              использует формы ввода персональных данных без явного согласия пользователя.
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-bold text-white">3. Цели обработки</h3>
            <p>
              Обработка заявок и обращений, консультирование по услугам, заключение и исполнение
              договоров, ответ на вопросы пользователя.
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-bold text-white">4. Правовые основания</h3>
            <p>
              Согласие пользователя, выраженное деактивацией действий или отдельным согласием,
              договоры, к стороной которых является субъект персональных данных, а также
              законодательство РФ.
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-bold text-white">5. Порядок и сроки обработки</h3>
            <p>
              Обработка осуществляется с использованием средств автоматизации и без них.
              Данные обрабатываются до достижения целей обработки либо до отзыва согласия
              пользователем. Отзыв согласия оформляется в письменной форме на адрес
              elcodo@bk.ru.
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-bold text-white">6. Права субъекта персональных данных</h3>
            <p>
              Пользователь имеет право получать сведения об обработке своих персональных данных,
              требовать их уточнения, блокирования или уничтожения, а также отозвать согласие
              на обработку, направив обращение на elcodo@bk.ru.
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-bold text-white">7. Файлы cookie</h3>
            <p>
              Сайт использует файлы cookie для корректной работы интерфейса. Пользователь может
              запретить сохранение cookie в настройках браузера, однако это может ограничить
              работу сайта.
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-bold text-white">8. Изменение политики</h3>
            <p>
              Оператор имеет право вносить изменения в настоящую Политику. Актуальная редакция
              всегда размещена на этой странице.
            </p>
          </div>
          <p className="text-xs text-zinc-600">
            [Шаблонный текст. Перед публикацией заполните плейсхолдеры ФИО и ИНН и при
            необходимости согласуйте с юристом.]
          </p>
        </div>
      </div>
    </div>
  );
}
