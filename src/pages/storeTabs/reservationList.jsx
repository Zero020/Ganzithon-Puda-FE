import ReservationRow from './reservation_row.jsx';
import './reservationList_row.css';

function formatDateLabel(dateStr) {
  const today = new Date();
  const y = new Date();
  y.setDate(today.getDate() - 1);

  const todayStr = today.toISOString().slice(0, 10);
  const yStr = y.toISOString().slice(0, 10);

  if (dateStr === todayStr) return '오늘';
  if (dateStr === yStr) return '어제';

  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(
    2,
    '0',
  )}.${String(d.getDate()).padStart(2, '0')}`;
}

export default function ReservationList({ sections }) {
  return (
    <div className="store-reservation-list">
      {sections.map((section) => (
        <section key={section.date} className="store-date-section">
          <h2 className="store-date-label">{formatDateLabel(section.date)}</h2>

          {section.reservations.map((reservation) => (
            <ReservationRow
              key={reservation.reservationId}
              reservation={reservation}
            />
          ))}
        </section>
      ))}
    </div>
  );
}
