import styles from '../welfareDetail.module.css';
import defaultFoodImage from '@/assets/default_food_image.png';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = dateStr.split(' ')[0]; // yyyy-MM-dd
  const [y, m, d] = date.split('-');
  return `${y}.${m}.${d}`;
}

export default function ReviewSection({ reviews }) {
  return (
    <section className={styles.reviewSection}>
      <div className={styles.reviewHeaderRow}>
        <span className={styles.reviewTitleMain}>리뷰 {reviews.length}</span>
      </div>

      <div className={styles.reviewList}>
        {reviews.length === 0 && (
          <p className={styles.reviewEmpty}>아직 등록된 리뷰가 없습니다.</p>
        )}

        {reviews.map((r, idx) => (
          <div key={idx} className={styles.reviewItem}>
            <div className={styles.reviewHeader}>
              <div className={styles.reviewTitle}>
                <span className={styles.reviewCenterName}>{r.centerName}</span>
                <span className={styles.reviewDivider}>·</span>
                <span className={styles.reviewProductName}>{r.productName}</span>
              </div>
              <div className={styles.reviewDate}>{formatDate(r.createdAt)}</div>
            <div className={styles.reviewContent}>{r.content}</div>
              
            </div>


            {/* 이미지 자리 */}
            <div className={styles.reviewImageWrapper}>
              <img
                src={r.imageUrl || defaultFoodImage}
                alt="review"
                className={styles.reviewImage}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}