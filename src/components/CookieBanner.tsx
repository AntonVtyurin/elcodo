import { useEffect, useState } from 'react';
import { Cookie } from 'lucide-react';

const KEY = 'elcodo-cookie-consent';

export default function CookieBanner() {
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
    <div className="fade-up fixed inset-x-4 bottom-4 z-50 mx-auto max-w-xl rounded-2xl border border-white/[0.08] bg-[#11131C]/95 p-5 shadow-[0_16px_48px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2">
      <div className="flex items-start gap-4">
        <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
        <p className="text-sm leading-relaxed text-zinc-400">
          Мы используем файлы cookie, чтобы сайт работал корректно. Продолжая пользоваться
          сайтом, вы соглашаетесь с этим.
        </p>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="text-xs text-zinc-500 underline decoration-zinc-700 underline-offset-2 hover:text-zinc-300"
        >
          Подробнее
        </a>
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
