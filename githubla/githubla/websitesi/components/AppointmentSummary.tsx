interface AppointmentSummaryProps {
  subtotal: number;
  tax: number;
  total: number;
}

export default function AppointmentSummary({ subtotal, tax, total }: AppointmentSummaryProps) {
  return (
    <div className="card" style={{ background: 'rgba(255,255,255,.03)' }}>
      <h3>Ödeme Özeti</h3>
      <div style={{ marginTop: '1rem' }}>
        <p>Ara Toplam: <strong>{subtotal.toFixed(2)} TL</strong></p>
        <p>KDV %18: <strong>{tax.toFixed(2)} TL</strong></p>
        <p style={{ marginTop: '0.8rem' }}>Toplam: <strong>{total.toFixed(2)} TL</strong></p>
      </div>
    </div>
  );
}
