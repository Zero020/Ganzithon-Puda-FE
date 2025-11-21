import styles from '../welfareDetail.module.css';

function formatEndDate(endTime) {
  if (!endTime) return '';
  // 마감시간 -> 2025-11-15"
  const [y, m, d] = endTime.split('-');
  return `${y}.${m}.${d}`;
}

export default function FoodInfoSection({ detail }) {
  const formattedEndTime = formatEndDate(detail.endTime);

  return (
    <section className={styles.foodInfoSection}>
      <div className={styles.foodInfoRow}>
        <div>
          <div className={styles.foodName}>{detail.productName}</div>
          <div className={styles.foodDescription}>{detail.productDescription}</div>
        </div>
        <div className={styles.remainingCount}>
          남은 수량 {detail.count}
        </div>
      </div>

      <div className={styles.foodDeadlineRow}>
        <span className={styles.deadlineLabel}>마감기한</span>
        <span className={styles.deadlineValue}>{formattedEndTime}</span>
      </div>
    </section>
  );
}
