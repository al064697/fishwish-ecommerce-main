'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const PDFDownloadButton = dynamic(() => import('./PDFDownloadButton'), { ssr: false });
type LastOrderItem = {
    id: number;
    name: string;
    presentation: string;
    price: number;
    quantity: number;
};

type LastOrder = {
    id?: number;
    customerName: string;
    total: number;
    items: LastOrderItem[];
};

function OrderConfirmationContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get('id') ?? '';
    const totalFromUrl = Number(searchParams.get('total') || 0);
    const [lastOrder, setLastOrder] = useState<LastOrder | null>(null);

    useEffect(() => {
        const saved = sessionStorage.getItem('fishwish-last-order');
        if (!saved) return;
        try {
            setLastOrder(JSON.parse(saved));
        } catch {
            sessionStorage.removeItem('fishwish-last-order');
        }
    }, []);

    const total = lastOrder?.total || totalFromUrl;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
            <div className="bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-lg max-w-2xl w-full text-center">
                {/* Checkmark */}
                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-4xl font-bold text-[#003087] dark:text-[#00A3E0] mb-4">¡Pedido Confirmado!</h1>

                <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
                    Tu pedido fue registrado correctamente. Nos pondremos en contacto para coordinar la entrega.
                </p>

                {/* Order number */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-2xl mb-8 border border-gray-100 dark:border-gray-600">
                    <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold mb-1">
                        Número de Pedido
                    </p>
                    <p className="text-3xl font-mono text-[#00A3E0] font-bold">
                        #{orderId || 'PENDIENTE'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                        Fecha: {new Date().toLocaleDateString('es-MX', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </p>
                </div>

                {/* Order detail */}
                {lastOrder && (
                    <div className="mb-8 text-left">
                        <div className="mb-4 rounded-2xl border border-blue-100 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Cliente</p>
                            <p className="font-bold text-gray-900 dark:text-white">{lastOrder.customerName}</p>
                        </div>

                        <div className="rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                            {lastOrder.items.map((item) => (
                                <div key={item.id} className="flex justify-between gap-4 border-b border-gray-100 dark:border-gray-700 p-4 last:border-b-0">
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">{item.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.presentation} x{item.quantity}</p>
                                    </div>
                                    <p className="font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                                        ${(item.price * item.quantity).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Total */}
                {total > 0 && (
                    <div className="mb-8 flex justify-between rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 p-5 text-lg font-bold">
                        <span className="text-gray-800 dark:text-gray-100">Total</span>
                        <span className="text-green-700 dark:text-green-400">
                            ${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                        </span>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {lastOrder && total > 0 && (
                        <PDFDownloadButton order={lastOrder} orderId={orderId} total={total} />
                    )}
                    <button
                        onClick={() => router.push('/productos')}
                        className="w-full sm:w-auto px-8 py-4 bg-[#00A3E0] hover:bg-[#0088c2] text-white rounded-xl font-bold transition-colors"
                    >
                        Seguir comprando
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="w-full sm:w-auto px-8 py-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl font-bold transition-colors"
                    >
                        Volver al inicio
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function OrderConfirmation() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <p className="text-gray-600 dark:text-gray-300">Cargando confirmación...</p>
            </div>
        }>
            <OrderConfirmationContent />
        </Suspense>
    );
}
