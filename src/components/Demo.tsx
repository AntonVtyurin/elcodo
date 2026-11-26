import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Zap,
  ShieldCheck,
  FileSpreadsheet,
  Send,
  Copy,
  Check,
  MapPin,
  Cpu,
  AlertCircle,
  QrCode,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { getMaxUrl, getTelegramUrl } from '../config/site';

export type NetworkType = 'panel' | 'power' | 'light';

export interface NodePassport {
  code: string;
  shield: string;
  network: NetworkType;
  zone: string;
  line: string;
  breaker: string;
  cableAndRcd: string;
  defaultIssue: string;
}

const COMMON_ISSUES = [
  'Тепловизор и протяжка клемм',
  'Выбивает автомат или УЗО',
  'Неисправность розетки / нагрев',
  'Мерцание света / тест БАП',
  'Балансировка фаз и заземление',
  'Автоматика вентиляции / кровли',
];

const NODES_DATA: NodePassport[] = [
  {
    code: 'ВРУ-1',
    shield: 'ВРУ-1',
    network: 'panel',
    zone: 'Электрощитовая (ввод)',
    line: 'Вводной узел и учёт электроэнергии',
    breaker: 'QF1 · 3P 63 А (характеристика C)',
    cableAndRcd: 'ВВГнг-LS 5×16 · УЗМ-51М / ОПН',
    defaultIssue: 'Тепловизор и протяжка клемм',
  },
  {
    code: 'ЩР-2',
    shield: 'ЩР-2',
    network: 'panel',
    zone: 'Опенспейс / Переговорная (распред. щит)',
    line: 'Групповой щит крыла Б и наружных потребителей',
    breaker: 'QS1 · 3P 40 А (вводной рубильник)',
    cableAndRcd: 'ВВГнг-LS 5×10 · Кросс-модуль и шины N/PE',
    defaultIssue: 'Тепловизор и протяжка клемм',
  },
  {
    code: 'Гр. 1',
    shield: 'ВРУ-1',
    network: 'power',
    zone: 'Опенспейс · Рабочие места',
    line: 'Розеточная сеть (ряд А–Б, 14 постов)',
    breaker: 'QF3 · 1P 16 А (характеристика B)',
    cableAndRcd: 'ВВГнг-LS 3×2.5 · Дифавтомат 30 мА (тип A)',
    defaultIssue: 'Выбивает автомат или УЗО',
  },
  {
    code: 'Гр. 2',
    shield: 'ВРУ-1',
    network: 'light',
    zone: 'Опенспейс · Основная зона',
    line: 'Рабочее и дежурное LED-освещение',
    breaker: 'QF4 · 1P 10 А (характеристика B)',
    cableAndRcd: 'ВВГнг-LS 3×1.5 · Автоматика управления светом',
    defaultIssue: 'Мерцание света / тест БАП',
  },
  {
    code: 'Гр. 3',
    shield: 'ВРУ-1',
    network: 'power',
    zone: 'Серверная и слаботочный узел',
    line: 'Выделенная линия стойки и ИБП',
    breaker: 'QF5 · 1P 25 А (характеристика C)',
    cableAndRcd: 'ВВГнг-LS 3×4.0 · Селективное УЗО 30 мА',
    defaultIssue: 'Балансировка фаз и заземление',
  },
  {
    code: 'Гр. 4',
    shield: 'ЩР-2',
    network: 'power',
    zone: 'Кухня / Кофе-пойнт',
    line: 'Розеточная группа (кофемашина, СВЧ)',
    breaker: 'QF2 · 1P 16 А (характеристика C)',
    cableAndRcd: 'ВВГнг-LS 3×2.5 · УЗО 10 мА (мокрая зона)',
    defaultIssue: 'Неисправность розетки / нагрев',
  },
  {
    code: 'Гр. 5',
    shield: 'ЩР-2',
    network: 'light',
    zone: 'Переговорная и коридор',
    line: 'Основное и аварийное освещение (БАП)',
    breaker: 'QF3 · 1P 10 А (характеристика B)',
    cableAndRcd: 'ВВГнг-LS 3×1.5 · Контроль блоков аварийного питания',
    defaultIssue: 'Мерцание света / тест БАП',
  },
  {
    code: 'Гр. 6',
    shield: 'ЩР-2',
    network: 'power',
    zone: 'Кровля / Наружный блок',
    line: 'Приточная вентиляция и обогрев водостоков',
    breaker: 'QF4 · 3P 20 А (характеристика C)',
    cableAndRcd: 'ВВГнг-LS 5×4.0 · УЗО 30 мА + контактор',
    defaultIssue: 'Автоматика вентиляции / кровли',
  },
];

const normalizeCode = (raw: string) =>
  raw.replace(/\u00a0/g, ' ').replace(/\s+/g, '').toLowerCase();
export const Demo: React.FC = () => {
  const [svgMarkup, setSvgMarkup] = useState<string>('');
  const [selectedCode, setSelectedCode] = useState<string>('ВРУ-1');
  const [selectedIssue, setSelectedIssue] = useState<string>(COMMON_ISSUES[0]);
  const [networkFilter, setNetworkFilter] = useState<'all' | 'power' | 'light'>('all');
  const [shieldFilter, setShieldFilter] = useState<string>('all');
  const [copied, setCopied] = useState(false);

  const svgContainerRef = useRef<HTMLDivElement | null>(null);

  const nodeMap = useMemo(() => {
    const map = new Map<string, NodePassport>();
    NODES_DATA.forEach((n) => map.set(normalizeCode(n.code), n));
    return map;
  }, []);

  const shieldsList = useMemo(
    () => Array.from(new Set(NODES_DATA.map((n) => n.shield))),
    []
  );

  const activeNode =
    NODES_DATA.find((n) => normalizeCode(n.code) === normalizeCode(selectedCode)) ||
    NODES_DATA[0];

  useEffect(() => {
    const url = `${import.meta.env.BASE_URL}plans/demo-office.svg`;
    fetch(url)
      .then((res) => (res.ok ? res.text() : Promise.reject()))
      .then((text) => setSvgMarkup(text))
      .catch(() => setSvgMarkup(''));
  }, []);

  useEffect(() => {
    const container = svgContainerRef.current;
    if (!container || !svgMarkup) return;

    const svgEl = container.querySelector('svg');
    if (!svgEl) return;

    svgEl.removeAttribute('width');
    svgEl.removeAttribute('height');
    svgEl.classList.add('w-full', 'h-auto', 'block', 'select-none');

    const shapes = Array.from(svgEl.querySelectorAll('rect, ellipse, circle')).filter(
      (el) => {
        const w = parseFloat(el.getAttribute('width') || '0');
        const rx = parseFloat(el.getAttribute('rx') || el.getAttribute('r') || '0');
        return (w > 0 && w < 115) || (rx > 0 && rx < 60);
      }
    );

    const getShapeCenter = (el: Element) => {
      const tag = el.tagName.toLowerCase();
      if (tag === 'rect') {
        const x = parseFloat(el.getAttribute('x') || '0');
        const y = parseFloat(el.getAttribute('y') || '0');
        const w = parseFloat(el.getAttribute('width') || '0');
        const h = parseFloat(el.getAttribute('height') || '0');
        return { cx: x + w / 2, cy: y + h / 2 };
      }
      return {
        cx: parseFloat(el.getAttribute('cx') || '0'),
        cy: parseFloat(el.getAttribute('cy') || '0'),
      };
    };

    const textEls = Array.from(svgEl.querySelectorAll('text'));
    const cleanups: Array<() => void> = [];

    textEls.forEach((textEl) => {
      const rawText = (textEl.textContent || '').trim();
      const matchedNode = nodeMap.get(normalizeCode(rawText));
      if (!matchedNode) return;

      const tx = parseFloat(textEl.getAttribute('x') || '0');
      const ty = parseFloat(textEl.getAttribute('y') || '0');

      let bestShape: SVGElement | null = null;
      let minDist = Infinity;
      shapes.forEach((sh) => {
        const { cx, cy } = getShapeCenter(sh);
        const dist = Math.hypot(cx - tx, cy - ty);
        if (dist < minDist) {
          minDist = dist;
          bestShape = sh as SVGElement;
        }
      });

      const labelGroup = (textEl.closest('g') || textEl) as SVGElement;
      const htmlLabels = Array.from(
        labelGroup.querySelectorAll<HTMLElement>('foreignObject div')
      );

      const matchesNetwork =
        matchedNode.network === 'panel' ||
        networkFilter === 'all' ||
        matchedNode.network === networkFilter;

      const matchesShield =
        shieldFilter === 'all' || matchedNode.shield === shieldFilter;

      const isVisible = matchesNetwork && matchesShield;
      const isSelected =
        normalizeCode(matchedNode.code) === normalizeCode(activeNode.code);

      const textColor = isSelected
        ? '#0f172a'
        : matchedNode.network === 'panel'
          ? '#fbbf24'
          : '#e2e8f0';

      const targets: SVGElement[] = [labelGroup];
      if (bestShape) {
        targets.push(bestShape);
        if (isSelected) {
          (bestShape as SVGElement).setAttribute('fill', '#f59e0b');
          (bestShape as SVGElement).setAttribute('stroke', '#fde68a');
        } else if (matchedNode.network === 'panel') {
          (bestShape as SVGElement).setAttribute('fill', '#1e293b');
          (bestShape as SVGElement).setAttribute('stroke', '#f59e0b');
        } else {
          (bestShape as SVGElement).setAttribute('fill', '#1e293b');
          (bestShape as SVGElement).setAttribute('stroke', '#64748b');
        }
      }

      textEl.setAttribute('fill', textColor);
      htmlLabels.forEach((div) => {
        div.style.color = textColor;
        div.style.backgroundColor = 'transparent';
      });

      const onClick = () => {
        setSelectedCode(matchedNode.code);
        setSelectedIssue(matchedNode.defaultIssue);
      };

      targets.forEach((el) => {
        el.style.cursor = 'pointer';
        el.style.transition = 'opacity 0.2s ease';
        el.style.opacity = isVisible ? '1' : '0.14';
        el.style.pointerEvents = isVisible ? 'all' : 'none';
        el.addEventListener('click', onClick);
        cleanups.push(() => el.removeEventListener('click', onClick));
      });
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [svgMarkup, activeNode.code, networkFilter, shieldFilter, nodeMap]);
  const requestText = [
    `Заявка с паспорта объекта (Элкодо):`,
    `• Узел: ${activeNode.code} (${activeNode.shield}) — ${activeNode.zone}`,
    `• Линия: ${activeNode.line}`,
    `• Защита: ${activeNode.breaker} (${activeNode.cableAndRcd})`,
    `• Задача: ${selectedIssue}`,
  ].join('\n');

  const maxHref = getMaxUrl();
  const telegramHref = getTelegramUrl(requestText);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(requestText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="demo" className="py-20 bg-slate-950 text-slate-100 border-t border-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-4">
            <QrCode className="w-3.5 h-3.5" />
            <span>Цифровой паспорт щита · Пример после аудита</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Интерактивный паспорт объекта и быстрая заявка
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            После обследования мы оцифровываем однолинейную схему и привязываем каждый автомат к
            помещению. Сотруднику на месте не нужно разбираться в электротехнике — достаточно
            выбрать зону на плане и отправить готовую сводку инженеру.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                <span>План-схема: Офис БЦ «Петровский», 3 этаж</span>
              </div>
              <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded">
                DWG / SVG · Актуализировано
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-xs">
              <div className="inline-flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                <Layers className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
                {(
                  [
                    { id: 'all', label: 'Все сети' },
                    { id: 'power', label: 'Розетки и сила' },
                    { id: 'light', label: 'Освещение' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setNetworkFilter(tab.id)}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                      networkFilter === tab.id
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="inline-flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  type="button"
                  onClick={() => setShieldFilter('all')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    shieldFilter === 'all'
                      ? 'bg-slate-800 text-amber-400'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Все щиты
                </button>
                {shieldsList.map((sh) => (
                  <button
                    key={sh}
                    type="button"
                    onClick={() => setShieldFilter(sh)}
                    className={`px-2.5 py-1 rounded-md font-mono font-medium transition-colors ${
                      shieldFilter === sh
                        ? 'bg-slate-800 text-amber-400'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {sh}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative bg-slate-950 border border-slate-800/90 rounded-xl p-4 mb-5">
              {svgMarkup ? (
                <div ref={svgContainerRef} dangerouslySetInnerHTML={{ __html: svgMarkup }} />
              ) : (
                <div className="py-16 text-center text-xs text-slate-500 font-mono">
                  Поместите экспортированный файл в public/plans/demo-office.svg
                </div>
              )}
            </div>
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 sm:p-5">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
                  Паспортные данные · {activeNode.code} ({activeNode.shield})
                </span>
                <span className="text-xs text-slate-400">Нажмите на метку на схеме</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm">
                <div className="bg-slate-900/90 border border-slate-800/80 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>Зона обслуживания</span>
                  </div>
                  <div className="font-medium text-slate-100">{activeNode.zone}</div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800/80 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Группа / линия</span>
                  </div>
                  <div className="font-medium text-slate-100">{activeNode.line}</div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800/80 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <Cpu className="w-3.5 h-3.5 text-amber-400" />
                    <span>Автомат в щите</span>
                  </div>
                  <div className="font-mono text-xs sm:text-sm text-amber-300">
                    {activeNode.breaker}
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800/80 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Кабель и дифзащита</span>
                  </div>
                  <div className="font-mono text-xs sm:text-sm text-slate-200">
                    {activeNode.cableAndRcd}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6">
            <div className="flex items-center gap-2 text-sm font-medium text-white pb-4 mb-5 border-b border-slate-800">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Формирование заявки дежурному инженеру</span>
            </div>

            <div className="mb-5">
              <label
                htmlFor="issue-select"
                className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-2"
              >
                1. Выберите задачу или неисправность
              </label>
              <div className="relative">
                <select
                  id="issue-select"
                  value={selectedIssue}
                  onChange={(e) => setSelectedIssue(e.target.value)}
                  className="w-full appearance-none truncate bg-slate-950 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl pl-3.5 pr-10 py-2.5 text-sm text-slate-100 outline-none transition-colors"
                >
                  {COMMON_ISSUES.map((issue) => (
                    <option key={issue} value={issue}>
                      {issue}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  2. Готовая сводка для отправки
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Скопировано</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Копировать текст</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                {requestText}
              </pre>
            </div>

            <div className="space-y-3">
              <a
                href={maxHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Отправить заявку в MAX</span>
              </a>

              <a
                href={telegramHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-700 transition-colors"
              >
                <span>Отправить в Telegram</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
