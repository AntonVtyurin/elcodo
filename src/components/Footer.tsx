import { Zap, MessageCircle, Send } from 'lucide-react';
import {
  SITE_CONFIG,
  formatRequisites,
  getMaxUrl,
  getTelegramUrl,
} from '@/config/site';

interface FooterProps {
  onOpenPrivacy: () => void;
}

export default function Footer({ onOpenPrivacy }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.08] py-12">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <a href="#" className="inline-flex items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-400">
              <Zap className="h-3.5 w-3.5" strokeWidth={2.4} />
            </span>
            <span className="font-mono text-sm font-bold tracking-[0.22em] text-white">
              {SITE_CONFIG.brand.toUpperCase()}
            </span>
          </a>

          <p className="max-w-2xl text-sm leading-relaxed text-zinc-300">
            © {currentYear} {SITE_CONFIG.brand} ({SITE_CONFIG.domain}) • Инженерное
            обслуживание электроустановок в СПб
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
            <a
              href={getMaxUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-amber-400 transition-colors hover:text-amber-300"
            >
              <MessageCircle className="h-4 w-4" />
              Написать в MAX
            </a>
            <span className="text-zinc-600">•</span>
            <a
              href={getTelegramUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-zinc-300 transition-colors hover:text-white"
            >
              <Send className="h-3.5 w-3.5 text-zinc-400" />
              Telegram
            </a>
            <span className="text-zinc-600">•</span>
            <a
              href={'mailto:' + SITE_CONFIG.email}
              className="font-mono text-zinc-300 transition-colors hover:text-amber-400"
            >
              {SITE_CONFIG.email}
            </a>
          </div>

          <p className="font-mono text-xs text-zinc-400">
            Реквизиты: {formatRequisites()}
          </p>

          <button
            type="button"
            onClick={onOpenPrivacy}
            className="text-sm text-zinc-300 underline decoration-zinc-600 underline-offset-4 transition-colors hover:text-amber-400"
          >
            Политика конфиденциальности
          </button>

          <p className="max-w-xl text-xs leading-relaxed text-zinc-400">
            Информация на сайте не является публичной офертой (ст. 437 ГК РФ).
          </p>
        </div>
      </div>
    </footer>
  );
}
