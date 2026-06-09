'use client';

import { useTheme } from './ThemeProvider';
import { useEffect, useState } from 'react';
import { SunFill, MoonFill, Display } from 'react-bootstrap-icons';

type ThemeOption = { value: 'light' | 'dark' | 'system'; label: string; icon: React.ReactNode };

const options: ThemeOption[] = [
  { value: 'light',  label: 'Claro',  icon: <SunFill size={15} /> },
  { value: 'dark',   label: 'Oscuro', icon: <MoonFill size={15} /> },
  { value: 'system', label: 'Auto',   icon: <Display size={15} /> },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;

  const currentIdx = options.findIndex(o => o.value === theme);
  const current = options[currentIdx === -1 ? 2 : currentIdx]!;
  const next = options[(options.indexOf(current) + 1) % options.length]!;

  return (
    <button
      onClick={() => setTheme(next.value)}
      title={`Cambiar a modo ${next.label}`}
      className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl transition-all text-sm font-medium text-white"
    >
      <span className="flex items-center">{current.icon}</span>
      <span className="hidden sm:inline">{current.label}</span>
    </button>
  );
}
