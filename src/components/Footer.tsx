import { Shield } from 'lucide-react';
import { SITE_CONFIG, formatRequisites } from '@/config/site';

interface FooterProps {
  onOpenPrivacy: () => void;
}

export default function Footer({ onOpenPrivacy }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.08] py-12">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="inline-flex items-center gap-2">
            <Shield className="h-4 w-4 text-amber-400" />
            <span className="font-mono text-sm font-bold tracking-[0.22em] text-white">
              {SITE_CONFIG.brand.toUpperCase()}
            </span>
          </span>

          <p className="max-w-2xl text-sm leading-relaxed text-zinc-500">
            © {currentYear} {SITE_CONFIG.brand} (elcodo.ru) • Инженерный
            консалтинг и обслуживание электрохозяйства в СПб
          </p>
          <p className="font-mono text-sm text-zinc-400">
            Почта:{' '}
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="text-amber-400 transition-colors hover:text-amber-300"
            >
              {SITE_CONFIG.email}
            </a>
          </p>
          <p className="font-mono text-xs text-zinc-600">
            Реквизиты: {formatRequisites()}
          </p>

          <button
            type="button"
            onClick={onOpenPrivacy}
            className="text-sm text-zinc-400 underline decoration-zinc-700 underline-offset-4 transition-colors hover:text-amber-400"
          >
            Политика конфиденциальности
          </button>

          <p className="max-w-xl text-xs leading-relaxed text-zinc-600">
            Информация на сайте не является публичной офертой (ст. 437 ГК РФ).
          </p>
        </div>
      </div>
    </footer>
  );
}
