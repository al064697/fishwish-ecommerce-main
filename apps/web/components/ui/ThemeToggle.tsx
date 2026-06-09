'use client';

import { useTheme } from './ThemeProvider';
import { useEffect, useState } from 'react';

const options: { value: 'light' | 'dark' | 'system'; label: string; icon: string }[] = [
  { value: 'light',  label: 'Claro',  icon: '☀️' },
  { value: 'dark',   label: 'Oscuro', icon: '🌙' },
  { value: 'system', label: 'Auto',   icon: '💻' },
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
      <span>{current.icon}</span>
      <span className="hidden sm:inline">{current.label}</span>
    </button>
  );
}
