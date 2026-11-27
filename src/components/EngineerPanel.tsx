import React, { useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Copy,
  Check,
  Plus,
  Printer,
  RotateCcw,
  Download,
  Upload,
} from 'lucide-react';
import {
  CircuitCategory,
  ObjectSpec,
} from '../data/qrDemoData';

const CATEGORY_LABELS: Record<CircuitCategory, string> = {
  power: 'Сила (розетки)',
  light: 'Свет',
  special: 'Спецлиния',
};

interface EngineerPanelProps {
  activeObj: ObjectSpec;
  allObjects: ObjectSpec[];
  updateActiveObj: (updater: (obj: ObjectSpec) => ObjectSpec) => void;
  onImportObjects: (imported: ObjectSpec[]) => void;
  onResetDemo: () => void;
}

export const EngineerPanel: React.FC<EngineerPanelProps> = ({
  activeObj,
  allObjects,
  updateActiveObj,
  onImportObjects,
  onResetDemo,
}) => {
  const [engineerTab, setEngineerTab] = useState<'spec' | 'builder' | 'qr'>('spec');
  const [codeCopied, setCodeCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(allObjects, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `elcodo-passports-${dateStr}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (
          Array.isArray(parsed) &&
          parsed.length > 0 &&
          parsed.every((item) => item.id && item.name && Array.isArray(item.shields))
        ) {
          onImportObjects(parsed);
        } else {
          alert('Неверный формат файла паспортов Elcodo.');
        }
      } catch {
        alert('Не удалось прочитать JSON-файл.');
      } finally {
        e.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  const [newShieldName, setNewShieldName] = useState('');
  const [newShieldLoc, setNewShieldLoc] = useState('');
  const [newGroupShield, setNewGroupShield] = useState(activeObj.shields[0]?.id ?? '');
  const [newGroupCode, setNewGroupCode] = useState('');
  const [newGroupDevice, setNewGroupDevice] = useState('C16');
  const [newGroupCable, setNewGroupCable] = useState('3×2.5');
  const [newGroupCat, setNewGroupCat] = useState<CircuitCategory>('power');
  const [newRoomName, setNewRoomName] = useState('');

  useEffect(() => {
    if (!activeObj.shields.some((s) => s.id === newGroupShield)) {
      setNewGroupShield(activeObj.shields[0]?.id ?? '');
    }
  }, [activeObj, newGroupShield]);

  const handleAddShield = () => {
    if (!newShieldName.trim()) return;
    const id = `sh-${Date.now().toString(36)}`;
    updateActiveObj((o) => ({
      ...o,
      shields: [
        ...o.shields,
        { id, name: newShieldName.trim(), location: newShieldLoc.trim() || 'Не указано' },
      ],
    }));
    setNewShieldName('');
    setNewShieldLoc('');
  };

  const handleAddGroup = () => {
    if (!newGroupCode.trim() || !newGroupShield) return;
    const id = `g-${Date.now().toString(36)}`;
    updateActiveObj((o) => ({
      ...o,
      groups: [
        ...o.groups,
        {
          id,
          shieldId: newGroupShield,
          code: newGroupCode.trim(),
          device: newGroupDevice.trim() || 'C16',
          cable: newGroupCable.trim() || '3×2.5',
          category: newGroupCat,
        },
      ],
    }));
    setNewGroupCode('');
  };

  const handleAddRoom = () => {
    if (!newRoomName.trim()) return;
    const id = `rm-${Date.now().toString(36)}`;
    updateActiveObj((o) => ({
      ...o,
      rooms: [...o.rooms, { id, name: newRoomName.trim(), groupIds: [] }],
    }));
    setNewRoomName('');
  };

  const toggleRoomGroup = (roomId: string, groupId: string) => {
    updateActiveObj((o) => ({
      ...o,
      rooms: o.rooms.map((r) => {
        if (r.id !== roomId) return r;
        const exists = r.groupIds.includes(groupId);
        return {
          ...r,
          groupIds: exists ? r.groupIds.filter((id) => id !== groupId) : [...r.groupIds, groupId],
        };
      }),
    }));
  };

  const handleCopyTsCode = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(activeObj, null, 2));
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    } catch {
      setCodeCopied(false);
    }
  };

  const baseUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}`
      : 'https://elcodo.ru';
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-800">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setEngineerTab('spec')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
              engineerTab === 'spec'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-950 text-slate-300 border border-slate-800'
            }`}
          >
            1. Спецификация щитов
          </button>
          <button
            type="button"
            onClick={() => setEngineerTab('builder')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
              engineerTab === 'builder'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-950 text-slate-300 border border-slate-800'
            }`}
          >
            2. Конструктор паспорта
          </button>
          <button
            type="button"
            onClick={() => setEngineerTab('qr')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
              engineerTab === 'qr'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-950 text-slate-300 border border-slate-800'
            }`}
          >
            3. QR-наклейки
          </button>
        </div>

        <div className="flex items-center gap-2">
        <button
            type="button"
            onClick={handleExportJson}
            title="Скачать резервную копию всех объектов в JSON"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 hover:border-amber-500 text-xs text-slate-200"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Бэкап</span>
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Восстановить объекты из JSON-бэкапа"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 hover:border-amber-500 text-xs text-slate-200"
          >
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span>Импорт</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImportJson}
            className="hidden"
          />
          <button
            type="button"
            onClick={handleCopyTsCode}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 hover:border-amber-500 text-xs text-amber-400"
          >
            {codeCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{codeCopied ? 'JSON скопирован' : 'Копировать конфиг объекта'}</span>
          </button>
          <button
            type="button"
            onClick={onResetDemo}
            title="Сбросить черновики к исходным примерам"
            className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-500 hover:text-slate-300"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {engineerTab === 'spec' && (
        <div className="space-y-6">
          {activeObj.shields.map((shield) => {
            const shieldGroups = activeObj.groups.filter((g) => g.shieldId === shield.id);
            return (
              <div key={shield.id} className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-amber-400 text-sm">{shield.name}</span>
                  <span className="text-xs text-slate-400">Установка: {shield.location}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/50 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-4">Группа</th>
                        <th className="py-2.5 px-4">Аппарат</th>
                        <th className="py-2.5 px-4">Кабель</th>
                        <th className="py-2.5 px-4">Тип линии</th>
                        <th className="py-2.5 px-4">Питаемые помещения</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70">
                      {shieldGroups.length > 0 ? (
                        shieldGroups.map((g) => {
                          const linkedRooms = activeObj.rooms.filter((r) =>
                            r.groupIds.includes(g.id)
                          );
                          return (
                            <tr key={g.id} className="hover:bg-slate-900/40">
                              <td className="py-2.5 px-4 font-mono font-semibold text-white">
                                {g.code}
                              </td>
                              <td className="py-2.5 px-4 font-mono text-amber-300">{g.device}</td>
                              <td className="py-2.5 px-4 font-mono text-slate-300">{g.cable}</td>
                              <td className="py-2.5 px-4 text-slate-400">
                                {CATEGORY_LABELS[g.category]}
                              </td>
                              <td className="py-2.5 px-4">
                                {linkedRooms.length > 0 ? (
                                  <div className="flex flex-wrap gap-1.5">
                                    {linkedRooms.map((r) => (
                                      <span
                                        key={r.id}
                                        className={`px-2 py-0.5 rounded text-[11px] ${
                                          linkedRooms.length > 1
                                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                            : 'bg-slate-800 text-slate-200'
                                        }`}
                                      >
                                        {r.name}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-slate-600">Резерв / не привязана</span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-4 px-4 text-center text-slate-500">
                            В этом щите пока нет групп — добавьте их во вкладке «Конструктор паспорта»
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {engineerTab === 'builder' && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <label className="block text-xs text-slate-400 mb-1.5">Название объекта</label>
            <input
              type="text"
              value={activeObj.name}
              onChange={(e) => updateActiveObj((o) => ({ ...o, name: e.target.value }))}
              className="w-full sm:w-96 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-amber-500"
            />
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
              Щиты на объекте ({activeObj.shields.length})
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {activeObj.shields.map((s) => (
                <span
                  key={s.id}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs"
                >
                  <strong className="text-amber-400">{s.name}</strong>
                  <span className="text-slate-400">({s.location})</span>
                </span>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Название (напр. ЩР-3)"
                value={newShieldName}
                onChange={(e) => setNewShieldName(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
              />
              <input
                type="text"
                placeholder="Где стоит (напр. Серверная)"
                value={newShieldLoc}
                onChange={(e) => setNewShieldLoc(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
              />
              <button
                type="button"
                onClick={handleAddShield}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500 text-slate-950 font-semibold text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Добавить щит</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
              Добавить группу в щит
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              <select
                value={newGroupShield}
                onChange={(e) => setNewGroupShield(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white"
              >
                {activeObj.shields.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Группа (Гр.8)"
                value={newGroupCode}
                onChange={(e) => setNewGroupCode(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white"
              />
              <input
                type="text"
                placeholder="Автомат (C16)"
                value={newGroupDevice}
                onChange={(e) => setNewGroupDevice(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white"
              />
              <input
                type="text"
                placeholder="Кабель (3×2.5)"
                value={newGroupCable}
                onChange={(e) => setNewGroupCable(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white"
              />
              <select
                value={newGroupCat}
                onChange={(e) => setNewGroupCat(e.target.value as CircuitCategory)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white"
              >
                <option value="power">Сила</option>
                <option value="light">Свет</option>
                <option value="special">Спецлиния</option>
              </select>
              <button
                type="button"
                onClick={handleAddGroup}
                className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-amber-500 text-slate-950 font-semibold text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Группа</span>
              </button>
            </div>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Помещения и привязка групп (кликните по группам помещения)
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Новое помещение..."
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={handleAddRoom}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-semibold text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Добавить</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {activeObj.rooms.map((room) => (
                <div key={room.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                  <div className="font-semibold text-sm text-white mb-2">{room.name}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeObj.groups.map((g) => {
                      const shield = activeObj.shields.find((s) => s.id === g.shieldId);
                      const active = room.groupIds.includes(g.id);
                      return (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => toggleRoomGroup(room.id, g.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-colors ${
                            active
                              ? 'bg-amber-500 text-slate-950 border-amber-400 font-semibold'
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-600'
                          }`}
                        >
                          {shield?.name} · {g.code} ({g.device})
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {engineerTab === 'qr' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-slate-400">
              Сканирование QR-кода помещения сразу откроет форму для этого объекта и комнаты.
            </p>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-semibold text-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Печать наклеек</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeObj.rooms.map((room) => {
              const qrUrl = `${baseUrl}?obj=${activeObj.id}&room=${room.id}#demo`;
              return (
                <div
                  key={room.id}
                  className="bg-white text-slate-950 rounded-xl p-4 flex items-center gap-4 border border-slate-300"
                >
                  <QRCodeSVG value={qrUrl} size={88} level="M" />
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                      ELCODO · QR-ПАСПОРТ
                    </div>
                    <div className="font-bold text-sm truncate">{room.name}</div>
                    <div className="text-[11px] text-slate-600 truncate">{activeObj.name}</div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      Наведите камеру для вызова инженера
                    </div>
                  </div>
                </div>
              );
            })}

            {activeObj.shields.map((shield) => {
              const shieldQrUrl = `${baseUrl}?obj=${activeObj.id}&mode=engineer#demo`;
              return (
                <div
                  key={shield.id}
                  className="bg-slate-950 text-slate-100 rounded-xl p-4 flex items-center gap-4 border border-amber-500/40"
                >
                  <div className="bg-white p-1.5 rounded-lg shrink-0">
                    <QRCodeSVG value={shieldQrUrl} size={76} level="M" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono uppercase text-amber-400">
                      ДЛЯ ИНЖЕНЕРА
                    </div>
                    <div className="font-bold text-sm truncate">Паспорт {shield.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{shield.location}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
