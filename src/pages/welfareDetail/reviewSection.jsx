import styles from '../welfareDetail.module.css';

function formatDateOnly(dateTimeStr) {
  if (!dateTimeStr) return '';
  // "2025-11-20 17:08" 또는 "2025-11-20T17:08:00.004388"
  const datePart = dateTimeStr.split(' ')[0]?.split('T')[0];
  const [y, m, d] = datePart.split('-');
  return `${y}.${m}.${d}`;
}

function ReviewItem({ review }) {
  const { centerName, productName, createdAt, content, imageUrl } = review;

  return (
    <div className={styles.reviewItem}>
      <div className={styles.reviewHeader}>
        <div className={styles.reviewTitle}>
          <span className={styles.reviewCenterName}>{centerName}</span>
          {productName && (
            <>
              <span className={styles.reviewDivider}>·</span>
              <span className={styles.reviewProductName}>{productName}</span>
            </>
          )}
        </div>
        <div className={styles.reviewDate}>
          {formatDateOnly(createdAt)}
        </div>
        {/* 리뷰 텍스트 */}
        <div className={styles.reviewContent}>{content}</div>
      </div>

      <div className={styles.reviewBody}>

        {/* 리뷰 이미지 (있을 때만) */}
        {imageUrl && (
          <div className={styles.reviewImageBox}>
            <img
              src={imageUrl}
              alt="리뷰 이미지"
              className={styles.reviewImage}
              
            />
          </div>
        )}
      </div>
    </div>
  );
}


export default function ReviewSection({ reviews, totalCount }) {
  return (
    <section className={styles.reviewSection}>
      <div className={styles.reviewHeaderRow}>
        <span className={styles.reviewTitleMain}>리뷰 {totalCount}</span>
      </div>

      <div className={styles.reviewList}>
        {reviews.length === 0 && (
          <p className={styles.reviewEmpty}>아직 등록된 리뷰가 없습니다.</p>
        )}

        {reviews.map((review, idx) => (
          <ReviewItem key={idx} review={review} />
        ))}
      </div>
    </section>
  );
}
