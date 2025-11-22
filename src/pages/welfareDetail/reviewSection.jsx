const BASE_URL = import.meta.env.VITE_API_BASE_URL;

import styles from '../welfareDetail.module.css';
import defaultFoodImage from '@/assets/default_food_image.png';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = dateStr.split(' ')[0];
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

        {reviews.map((r, idx) => {
          // 🚨 깨진 URL이 절대 들어가지 않도록 세이프 처리
          const imgSrc =
            r.imageUrl && typeof r.imageUrl === 'string'
              ? `${BASE_URL}${r.imageUrl}`
              : defaultFoodImage;

          return (
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

              <div className={styles.reviewImageWrapper}>
                <img
                  src={imgSrc}
                  alt="리뷰 이미지"
                  className={styles.reviewImage}
                  onError={(e) => {
                    e.currentTarget.src = defaultFoodImage;
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
