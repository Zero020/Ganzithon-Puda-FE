import { useState } from 'react';

import './PostCard.css';
import deadlineIcon from '@/assets/icon_deadline.svg';
import quantityIcon from '@/assets/icon_quantity.svg';
import defaultFoodImage from '@/assets/default_food_image.png';

export default function PostCard({ post }) {
  const {
    uuid,
    foodName,
    quantity,
    deadline,
    storeId,
    lat,
    lng,
    address,
    addressDetail,
    foodImgs,
    isReserved,
  } = post;

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

  return (
    <div className="post-card">
      <div className="image-wrap">
        <img
          src={imageUrl}
          alt={foodName}
          className="food-img"
          onError={() => setImageUrl(defaultFoodImage)}
        />

        <button
          className={`reserve-btn ${isReserved ? 'done' : ''}`}
          disabled={isReserved}
        >
          {isReserved ? '✓ 예약 완료' : '예약하기'}
        </button>
      </div>

      <div className="infoBox">
        <div className="foodName">{foodName}</div>
        <img src={quantityIcon} alt="quantity" className="quantityIcon" />
        <div className="quantity">{quantity}</div>
      </div>
      <div className="deadline">
        <img src={deadlineIcon} alt="deadline" className="deadlineIcon" />
        <div
          className={`dday ${
            diffDays !== null && diffDays <= 14 ? 'urgent' : 'normal'
          }`}
        >
          {dDayLabel}
        </div>
      </div>
      <div className="address">
        {address} {addressDetail}
      </div>
    </div>
  );
}
