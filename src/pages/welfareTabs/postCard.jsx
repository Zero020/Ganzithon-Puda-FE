// src/components/PostCard/PostCard.jsx
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './postCard.module.css';
import deadlineIcon from '@/assets/icon_deadline.svg';
import quantityIcon from '@/assets/icon_quantity.svg';
import defaultFoodImage from '@/assets/default_food_image.png';
import ReservationModal from './reservationModal.jsx';

// API
import { createReservation } from '@/api/welfareApi.js';

export default function PostCard({ post, onReserved }) {
  const navigate = useNavigate();

  const { productId, name, imageUrl, address, endTime, count } = post;

  const isReserved = count === 0;

  // ---------------------------
  //  ⭐ 이미지 URL 처리 로직
  // ---------------------------
  const processedImage = imageUrl
    ? `${BASE_URL}${imageUrl}`   // 백엔드가 "/reviews/xxx.jpg" 주면 절대 URL로 변환
    : defaultFoodImage;          // 없으면 기본 이미지

  const [image, setImage] = useState(processedImage);

  // ---------------------------
  // D - DAY 계산 (기존 그대로)
  // ---------------------------
  let dDayLabel = '';
  let dateLabel = '';
  let diffDays = null;

  if (endTime) {
    const deadlineDate = new Date(endTime);
    if (!Number.isNaN(deadlineDate)) {
      const now = new Date();
      const diffMs = deadlineDate.getTime() - now.getTime();
      diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      dateLabel = deadlineDate.toLocaleDateString('ko-KR', {
        month: '2-digit',
        day: '2-digit',
      });

      dDayLabel = diffDays > 14 ? dateLabel : diffDays >= 0 ? `D - ${diffDays}` : '마감';
    }
  }

  const [openModal, setOpenModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClickCard = () => {
    navigate(`/welfare/detail/${productId}`);
  };

  const handleReserveClick = (e) => {
    e.stopPropagation();
    if (isReserved || isSubmitting) return;
    setOpenModal(true);
  };

  return (
    <div className={styles.postCard} onClick={handleClickCard}>
      <div className={styles.imageWrap}>
        <img
          src={image}
          alt={name}
          className={styles.foodImg}
          onError={() => setImage(defaultFoodImage)}  // base64 실패 대비
        />

        <button
          className={`${styles.reserveBtn} ${isReserved ? styles.reserveBtnDone : ''}`}
          disabled={isReserved}
          onClick={handleReserveClick}
        >
          {isReserved ? '✓ 예약 완료' : '예약하기'}
        </button>
      </div>

      <div className={styles.infoBox}>
        <div className={styles.foodName}>{name}</div>
        <img src={quantityIcon} alt="quantity" className={styles.quantityIcon} />
        <div className={styles.quantity}>{count}</div>
      </div>

      <div className={styles.deadline}>
        <img src={deadlineIcon} alt="deadline" className={styles.deadlineIcon} />
        <div
          className={`${styles.dday} ${
            diffDays !== null && diffDays <= 14 ? styles.ddayUrgent : ''
          }`}
        >
          {dDayLabel}
        </div>
      </div>

      <div className={styles.address}>{address}</div>

      {/* 예약 모달 */}
      <ReservationModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxQuantity={count}
        initialQuantity={1}
        noticeText={
          `노쇼 방지를 위해 아래 내용을 꼭 확인해주세요.\n\n` +
          `• 예약 후 방문하지 않으면 다른 분들이 음식을 받지 못할 수 있어요.\n` +
          `• 방문이 어려울 경우 반드시 예약을 취소해주세요.`
        }
        loading={isSubmitting}
        onConfirm={async (selectedCount) => {
          try {
            setIsSubmitting(true);
            const user = JSON.parse(localStorage.getItem('user'));

            await createReservation(productId, user.userId, selectedCount);

            alert('예약이 완료됐어요! 약속한 시간에 꼭 방문해주세요 🙂');

            setOpenModal(false);

            if (onReserved) onReserved(); // 부모에 새로고침 신호
          } catch (err) {
            alert(err.message ?? '예약에 실패했어요. 다시 시도해주세요.');
          } finally {
            setIsSubmitting(false);
          }
        }}
      />
    </div>
  );
}
