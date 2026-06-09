'use client';

type Item = { id: number; name: string; presentation: string; price: number; quantity: number };
type Order = { customerName: string; total: number; items: Item[] };

interface Props {
  order: Order;
  orderId: string;
  total: number;
}

export default function PDFDownloadButton({ order, orderId, total }: Props) {
  async function handleDownload() {
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    const m = 20;

    doc.setFillColor(0, 48, 135);
    doc.rect(0, 0, W, 36, 'F');
    doc.setFillColor(0, 163, 224);
    doc.rect(0, 36, W, 3, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('FishWish', m, 17);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Comprobante de Pedido', m, 28);

    let y = 58;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`Pedido #${orderId || 'PENDIENTE'}`, m, y);
    y += 9;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Fecha: ${new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`,
      m, y,
    );
    y += 7;
    if (order.customerName) {
      doc.text(`Cliente: ${order.customerName}`, m, y);
      y += 7;
    }
    y += 4;

    doc.setFillColor(240, 244, 250);
    doc.rect(m, y - 5, W - m * 2, 11, 'F');
    doc.setTextColor(0, 48, 135);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Producto', m + 2, y + 1);
    doc.text('Pres.', 108, y + 1);
    doc.text('Cant.', 130, y + 1);
    doc.text('Precio', 152, y + 1);
    doc.text('Subtotal', W - m - 2, y + 1, { align: 'right' });
    y += 11;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 30, 30);
    order.items.forEach((item, idx) => {
      if (idx % 2 === 1) {
        doc.setFillColor(249, 250, 251);
        doc.rect(m, y - 5, W - m * 2, 10, 'F');
      }
      doc.setFontSize(9);
      doc.text(item.name, m + 2, y);
      doc.text(item.presentation, 108, y);
      doc.text(String(item.quantity), 132, y);
      doc.text(`$${item.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, 168, y, { align: 'right' });
      doc.text(`$${(item.price * item.quantity).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, W - m - 2, y, { align: 'right' });
      y += 10;
    });

    y += 3;
    doc.setDrawColor(210, 215, 220);
    doc.line(m, y, W - m, y);
    y += 8;

    doc.setFillColor(230, 247, 255);
    doc.rect(m, y - 5, W - m * 2, 13, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(0, 48, 135);
    doc.text('Total', m + 2, y + 3);
    doc.setTextColor(0, 136, 194);
    doc.text(`$${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`, W - m - 2, y + 3, { align: 'right' });

    doc.setFillColor(0, 48, 135);
    doc.rect(0, H - 22, W, 22, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('FishWish — Snacks naturales para mascotas', m, H - 12);
    doc.text('Lerma, Campeche, México  |  hola@fishwish.com.mx', m, H - 5);

    doc.save(`fishwish-pedido-${orderId || 'confirmacion'}.pdf`);
  }

  return (
    <button
      onClick={handleDownload}
      className="w-full sm:w-auto px-8 py-4 bg-[#003087] hover:bg-[#002266] text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h4a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      </svg>
      Descargar PDF
    </button>
  );
}
