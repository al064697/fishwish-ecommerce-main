'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

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
    const orderId = searchParams.get('id');
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="bg-white p-10 rounded-3xl shadow-lg max-w-2xl w-full text-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-4xl font-bold text-[#003087] mb-4">¡Pedido Confirmado!</h1>
                
                <p className="text-gray-600 text-lg mb-8">
                    Tu pedido fue registrado correctamente. Nos pondremos en contacto para coordinar la entrega.
                </p>

                <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100">
                    <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-1">
                        Número de Pedido
                    </p>
                    <p className="text-3xl font-mono text-[#00A3E0] font-bold">
                        #{orderId || 'PENDIENTE'}
                    </p>
                    <p className="text-sm text-gray-500 mt-4">
                        Fecha: {new Date().toLocaleDateString('es-MX', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </p>
                </div>

                {lastOrder && (
                    <div className="mb-8 text-left">
                        <div className="mb-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                            <p className="text-sm text-gray-600">Cliente</p>
                            <p className="font-bold text-gray-900">{lastOrder.customerName}</p>
                        </div>

                        <div className="rounded-2xl border border-gray-100 overflow-hidden">
                            {lastOrder.items.map((item) => (
                                <div key={item.id} className="flex justify-between gap-4 border-b border-gray-100 p-4 last:border-b-0">
                                    <div>
                                        <p className="font-semibold text-gray-900">{item.name}</p>
                                        <p className="text-sm text-gray-500">{item.presentation} x{item.quantity}</p>
                                    </div>
                                    <p className="font-semibold text-gray-900 whitespace-nowrap">
                                        ${(item.price * item.quantity).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {total > 0 && (
                    <div className="mb-8 flex justify-between rounded-2xl bg-green-50 p-5 text-lg font-bold">
                        <span>Total</span>
                        <span className="text-green-700">
                            ${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                        </span>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => router.push('/productos')}
                        className="w-full sm:w-auto px-8 py-4 bg-[#00A3E0] hover:bg-[#0088c2] text-white rounded-xl font-bold transition-colors"
                    >
                        Seguir comprando
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="w-full sm:w-auto px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-bold transition-colors"
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
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><p>Cargando confirmación...</p></div>}>
            <OrderConfirmationContent />
        </Suspense>
    );
}
