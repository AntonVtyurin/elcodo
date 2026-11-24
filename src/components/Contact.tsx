import { useState } from 'react';
import { Send, MessageSquare, Copy, Check, Mail } from 'lucide-react';
import { SITE_CONFIG, getTelegramUrl, getMaxUrl } from '@/config/site';

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE_CONFIG.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.location.href = `mailto:${SITE_CONFIG.email}`;
    }
  };

  const telegramLink = getTelegramUrl(
    'Здравствуйте! Хочу обсудить обслуживание электрохозяйства или провести аудит объекта.'
  );

  return (
    <section className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-5 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-amber-500/25 bg-[#11131C] p-8 text-center sm:p-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 h-56 w-[36rem] -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl"
          />

          <h2 className="relative text-balance text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
            Готовы навести порядок в электрохозяйстве вашего офиса?
          </h2>
          <p className="relative mx-auto mt-5 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            Пришлите фото вашего электрощита или план помещения в MAX, Telegram или на
            почту — проведем экспресс-оценку и подберем формат обслуживания.
          </p>

          <div className="relative mt-9 flex flex-col flex-wrap items-center justify-center gap-3.5 sm:flex-row">
            <a
              href={getMaxUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-4 text-base font-bold text-[#090A0F] shadow-[0_8px_32px_rgba(245,158,11,0.35)] transition-all hover:bg-amber-400 sm:w-auto"
            >
              <MessageSquare className="h-5 w-5" />
              Написать в MAX
            </a>

            <a
              href={telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-6 py-4 text-base font-semibold text-zinc-100 transition-all hover:border-amber-500/40 hover:text-amber-400 sm:w-auto"
            >
              <Send className="h-5 w-5 text-amber-400" />
              Написать в Telegram
            </a>

            <button
              type="button"
              onClick={copyEmail}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-6 py-4 text-base font-semibold text-zinc-100 transition-all hover:border-amber-500/40 hover:text-amber-400 sm:w-auto"
            >
              {copied ? (
                <Check className="h-5 w-5 text-emerald-400" />
              ) : (
                <Copy className="h-5 w-5" />
              )}
              {copied ? 'Адрес скопирован' : `Скопировать ${SITE_CONFIG.email}`}
            </button>
          </div>

          <a
            href={`mailto:${SITE_CONFIG.email}`}
            className="relative mt-6 inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-amber-400"
          >
            <Mail className="h-4 w-4" />
            {SITE_CONFIG.email}
          </a>

          {/*
            ─────────────────────────────────────────────────────────────
            ФОРМА ОБРАТНОЙ СВЯЗИ (152-ФЗ) — включить позже при необходимости.

            <form className="mx-auto mt-10 max-w-md text-left">
              <label className="block text-sm font-medium text-zinc-300" htmlFor="name">Ваше имя</label>
              <input id="name" name="name" type="text" required
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-amber-500/50 focus:outline-none"
                placeholder="Как к вам обращаться" />

              <label className="mt-4 block text-sm font-medium text-zinc-300" htmlFor="contact">Телефон или Telegram</label>
              <input id="contact" name="contact" type="text" required
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-amber-500/50 focus:outline-none"
                placeholder="+7 (___) ___-__-__ или @username" />

              <label className="mt-4 block text-sm font-medium text-zinc-300" htmlFor="message">Объект / задача</label>
              <textarea id="message" name="message" rows={3}
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-amber-500/50 focus:outline-none"
                placeholder="Площадь офиса, район, краткое описание" />

              <label className="mt-4 flex items-start gap-3 text-xs leading-relaxed text-zinc-400">
                <input type="checkbox" name="consent" required
                  className="mt-0.5 h-4 w-4 rounded border-white/20 bg-transparent accent-amber-500" />
                Соглашаюсь с обработкой персональных данных в соответствии с{' '}
                <a href="#" className="text-amber-400 underline">Политикой конфиденциальности</a> (152-ФЗ)
              </label>

              <button type="submit"
                className="mt-5 w-full rounded-xl bg-amber-500 px-6 py-3.5 text-sm font-bold text-[#090A0F] transition-colors hover:bg-amber-400">
                Отправить заявку
              </button>
            </form>
            ─────────────────────────────────────────────────────────────
          */}
        </div>
      </div>
    </section>
  );
}
