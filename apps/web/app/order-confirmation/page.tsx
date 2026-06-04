'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';

function OrderConfirmationContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get('id');

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
                    Tu pedido ha sido procesado exitosamente. Recibirás un correo con los detalles en breve.
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

                <button
                    onClick={() => router.push('/')}
                    className="w-full sm:w-auto px-8 py-4 bg-[#00A3E0] hover:bg-[#0088c2] text-white rounded-xl font-bold transition-colors"
                >
                    Volver a la tienda
                </button>
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