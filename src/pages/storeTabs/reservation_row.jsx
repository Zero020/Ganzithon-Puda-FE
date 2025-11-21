import './reservationList_row.css';
import icon_clock from '@/assets/icon_clock_selected.svg';
import icon_users from '@/assets/icon_people.svg';

// "2025-12-31T23:59:59" → "23:59"
function formatTime(timeStr) {
  const d = new Date(timeStr);
  if (Number.isNaN(d.getTime())) return '';
  return `${String(d.getHours()).padStart(2, '0')}:${String(
    d.getMinutes()
  ).padStart(2, '0')}`;
}

export default function ReservationRow({ reservation }) {
  const { centerName, endTime, count, status } = reservation;

  const timeText = formatTime(endTime);

  // status는 boolean이 아니라 문자열임 ("픽업 전", "작성 완료")
  const isDone = status === '작성 완료';

  const statusLabel = isDone ? '✓ 작성 완료' : '픽업 전';
  const statusClass = isDone ? 'status-done' : 'status-pending';

  return (
    <div className="store-reservation-row">
      {/* 시설명 */}
      <div className="store-reservation-item">
        <p className="store-center-name break-text">
          {centerName || '미지정'}
        </p>
      </div>

      {/* 마감시간 */}
      <div className="store-reservation-item">
        <img src={icon_clock} alt="" className="icon-search" />
        <span className="store-time">{timeText}</span>
      </div>

      {/* 수량 */}
      <div className="store-reservation-item">
        <img src={icon_users} alt="" className="icon-search" />
        <span className="store-quantity">{count}</span>
      </div>

      {/* 상태 버튼 */}
      <div className={`store-reservation-item ${statusClass}`}>
        <button>{statusLabel}</button>
      </div>
    </div>
  );
}
