import { useState } from 'react';
import { Send, MessageCircle, Copy, Check } from 'lucide-react';
import { SITE_CONFIG, getTelegramUrl, getMaxUrl } from '@/config/site';

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE_CONFIG.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.location.href = 'mailto:' + SITE_CONFIG.email;
    }
  };

  const telegramLink = getTelegramUrl(
    'Здравствуйте! Хочу обсудить инженерное обслуживание электроустановок или провести аудит объекта.'
  );

  return (
    <section id="contact" className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-5 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-amber-500/25 bg-[#11131C] p-8 text-center sm:p-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 h-56 w-[36rem] -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl"
          />

          <h2 className="relative text-balance text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
            Готовы навести порядок в электроустановке вашего офиса?
          </h2>
          <p className="relative mx-auto mt-5 max-w-2xl text-base leading-relaxed text-zinc-200 sm:text-lg">
            Пришлите фото вашего электрощита или план помещения в MAX, Telegram или на
            почту — проведем экспресс-оценку и подберем формат обслуживания.
          </p>

          <div className="relative mt-9 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
            <a
              href={getMaxUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-7 py-4 text-base font-bold text-[#090A0F] shadow-[0_8px_32px_rgba(245,158,11,0.35)] transition-all hover:bg-amber-400 sm:w-auto"
            >
              <MessageCircle className="h-5 w-5" />
              Написать в MAX
            </a>

            <button
              type="button"
              onClick={copyEmail}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-6 py-4 text-base font-semibold text-zinc-100 transition-all hover:border-amber-500/40 hover:text-amber-400 sm:w-auto"
            >
              {copied ? (
                <Check className="h-5 w-5 text-emerald-400" />
              ) : (
                <Copy className="h-5 w-5 text-zinc-300" />
              )}
              {copied ? 'Адрес скопирован' : 'Скопировать ' + SITE_CONFIG.email}
            </button>
          </div>

          <div className="relative mt-5 flex justify-center">
            <a
              href={telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-300 transition-colors hover:text-amber-400"
            >
              <Send className="h-4 w-4 text-zinc-400" />
              Написать в Telegram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
