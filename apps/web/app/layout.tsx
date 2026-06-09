import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import './globals.css';

export const metadata: Metadata = {
  title: 'FishWish - Snacks Naturales para Mascotas',
  description: 'Snacks naturales hechos con subproductos pesqueros de Campeche',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}