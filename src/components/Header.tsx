import { useEffect, useState } from 'react';
import { Menu, X, Send, Zap } from 'lucide-react';

const NAV = [
  { href: '#approach', label: 'Подход Win-Win' },
  { href: '#pricing', label: 'Тарифы и зоны' },
  { href: '#demo', label: 'Демо SVG-карты' },
  { href: '#faq', label: 'FAQ' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#090A0F]/80 backdrop-blur-xl border-b border-white/[0.08]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <a href="#top" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg border border-amber-500/30 bg-amber-500/10">
            <Zap className="h-5 w-5 text-amber-400" strokeWidth={2.2} />
          </span>
          <span className="leading-tight">
            <span className="block font-mono text-lg font-bold tracking-[0.22em] text-white">
              ELCODO
            </span>
            <span className="block text-[11px] font-medium tracking-wide text-zinc-400">
              Инженерный консалтинг СПб
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-zinc-300 transition-colors hover:text-amber-400"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="https://t.me"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-lg border border-amber-500/60 px-4 py-2.5 text-sm font-semibold text-amber-400 transition-all hover:bg-amber-500/10 hover:shadow-[0_0_24px_rgba(245,158,11,0.25)] sm:inline-flex"
          >
            <Send className="h-4 w-4" />
            Обсудить объект
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Меню"
            className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-zinc-300 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/[0.08] bg-[#090A0F]/95 px-5 pb-5 pt-2 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/5 hover:text-amber-400"
              >
                {item.label}
              </a>
            ))}
            <a
              href="https://t.me"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg border border-amber-500/60 px-4 py-3 text-sm font-semibold text-amber-400"
            >
              <Send className="h-4 w-4" />
              Обсудить объект в Telegram
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
