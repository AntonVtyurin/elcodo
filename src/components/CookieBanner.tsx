import { useEffect, useState } from 'react';
import { Cookie } from 'lucide-react';

const KEY = 'elcodo-cookie-consent';

interface CookieBannerProps {
  onOpenPrivacy: () => void;
}

export default function CookieBanner({ onOpenPrivacy }: CookieBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) {
        const t = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(t);
      }
    } catch {
      // localStorage недоступен — баннер просто не показываем
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(KEY, '1');
    } catch {
      // игнорируем
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Уведомление об использовании файлов cookie"
      className="fade-up fixed inset-x-4 bottom-4 z-50 mx-auto max-w-xl rounded-2xl border border-white/15 bg-[#11131C]/95 p-5 shadow-[0_16px_48px_rgba(0,0,0,0.65)] backdrop-blur-xl sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2"
    >
      <div className="flex items-start gap-4">
        <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
        <p className="text-sm leading-relaxed text-zinc-200">
          Мы используем технические файлы cookie и локальное хранилище браузера для
          корректной работы интерфейса. Продолжая пользоваться сайтом, вы соглашаетесь с
          условиями обработки данных.
        </p>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onOpenPrivacy}
          className="text-xs font-medium text-zinc-300 underline decoration-zinc-500 underline-offset-4 transition-colors hover:text-amber-400"
        >
          Подробнее в Политике
        </button>
        <button
          type="button"
          onClick={accept}
          className="rounded-lg bg-amber-500 px-5 py-2 text-sm font-bold text-[#090A0F] transition-colors hover:bg-amber-400"
        >
          Принять
        </button>
      </div>
    </div>
  );
}
