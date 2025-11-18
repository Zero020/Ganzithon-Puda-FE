import './reservationList_row.css';
import icon_clock from '@/assets/icon_clock_selected.svg';
import icon_users from '@/assets/icon_people.svg';

function formatTime(timeStr) {
  const d = new Date(timeStr);
  return `${String(d.getHours()).padStart(2, '0')}:${String(
    d.getMinutes()
  ).padStart(2, '0')}`;
}

export default function ReservationRow({ reservation }) {
  const { centerName, pickupTime, quantity, status } = reservation;

  const timeText = formatTime(pickupTime);
  const statusLabel = status ? '✓ 픽업완료' : '픽업 전';
  const statusClass = status ? 'status-done' : 'status-pending';

  return (
    <div className="store-reservation-row">
      <div className="store-reservation-item">
        <p className="store-center-name break-text">{centerName}</p>
      </div>

      <div className="store-reservation-item">
        <img src={icon_clock} alt="" className="icon-search" />
        <span className="store-time">{timeText}</span>
      </div>

      <div className="store-reservation-item">
        <img src={icon_users} alt="" className="icon-search" />
        <span className="store-quantity">{quantity}</span>
      </div>
      <div className={`store-reservation-item ${statusClass}`}>
        <button>{statusLabel}</button>
      </div>
    </div>
  );
}
