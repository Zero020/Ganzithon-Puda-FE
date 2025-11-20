// src/components/PostCard/PostCard.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './postCard.module.css';
import deadlineIcon from '@/assets/icon_deadline.svg';
import quantityIcon from '@/assets/icon_quantity.svg';
import defaultFoodImage from '@/assets/default_food_image.png';

export default function PostCard({ post }) {
  const navigate = useNavigate();

  const {
    postId,
    productId,
    foodName,
    quantity,
    deadline,
    address,
    addressDetail,
    foodImgs,
    isReserved,
  } = post;

  const effectiveProductId = productId ?? postId;

  // D-DAY 계산
  let dDayLabel = '';
  let dateLabel = '';
  let diffDays = null;

  if (deadline) {
    const deadlineDate = new Date(deadline);
    if (!Number.isNaN(deadlineDate)) {
      const now = new Date();
      const diffMs = deadlineDate.getTime() - now.getTime();
      diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      // 날짜 라벨 (MM.DD) 먼저 구해두기
      dateLabel = deadlineDate.toLocaleDateString('ko-KR', {
        month: '2-digit',
        day: '2-digit',
      });

      // 14일 이상 남았으면 날짜로 표시
      if (diffDays > 14) {
        dDayLabel = dateLabel;
      } else {
        dDayLabel = diffDays >= 0 ? `D - ${diffDays}` : '마감';
      }
    }
  }

  const [imageUrl, setImageUrl] = useState(foodImgs?.[0] ?? defaultFoodImage);

  const handleClickCard = () => {
    navigate(`/welfare/detail/${effectiveProductId}`);
  };

  return (
    <div className={styles.postCard} onClick={handleClickCard}>
      <div className={styles.imageWrap}>
        <img
          src={imageUrl}
          alt={foodName}
          className={styles.foodImg}
          onError={() => setImageUrl(defaultFoodImage)}
        />

        <button
          className={`${styles.reserveBtn} ${
            isReserved ? styles.reserveBtnDone : ''
          }`}
          disabled={isReserved}
        >
          {isReserved ? '✓ 예약 완료' : '예약하기'}
        </button>
      </div>

      <div className={styles.infoBox}>
        <div className={styles.foodName}>{foodName}</div>
        <img
          src={quantityIcon}
          alt="quantity"
          className={styles.quantityIcon}
        />
        <div className={styles.quantity}>{quantity}</div>
      </div>

      <div className={styles.deadline}>
        <img
          src={deadlineIcon}
          alt="deadline"
          className={styles.deadlineIcon}
        />
        <div
          className={`${styles.dday} ${
            diffDays !== null && diffDays <= 14 ? styles.ddayUrgent : ''
          }`}
        >
          {dDayLabel}
        </div>
      </div>

      <div className={styles.address}>
        {address} {addressDetail}
      </div>
    </div>
  );
}
