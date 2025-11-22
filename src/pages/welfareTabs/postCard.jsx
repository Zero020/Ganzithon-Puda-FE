// src/components/PostCard/PostCard.jsx
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

  const { productId, name, imageUrl, address, endTime, count } =
    post;
  
  const isReserved = (count === 0);

  // D-DAY 계산
  let dDayLabel = '';
  let dateLabel = '';
  let diffDays = null;

  if (endTime) {
    const deadlineDate = new Date(endTime);
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

  const [image, setImageUrl] = useState(imageUrl ?? defaultFoodImage);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const handleClickCard = () => {
    navigate(`/welfare/detail/${productId}`);
  };

  const handleReserveClick = async (e) => {
    e.stopPropagation(); // 카드 클릭 막기
    if (isReserved || isSubmitting) return;
    setOpenModal(true);
  };

  return (
    <div className={styles.postCard} onClick={handleClickCard}>
      <div className={styles.imageWrap}>
        <img
          src={image || null}
          alt={name}
          className={styles.foodImg}
          onError={() => setImageUrl(defaultFoodImage)}
        />

        <button
          className={`${styles.reserveBtn} ${
            isReserved ? styles.reserveBtnDone : ''
          }`}
          disabled={isReserved}
          onClick={handleReserveClick}
        >
          {isReserved ? '✓ 예약 완료' : '예약하기'}
        </button>
      </div>

      <div className={styles.infoBox}>
        <div className={styles.foodName}>{name}</div>
        <img
          src={quantityIcon}
          alt="quantity"
          className={styles.quantityIcon}
        />
        <div className={styles.quantity}>{count}</div>
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

      <div className={styles.address}>{address}</div>

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

            // ⭐ 부모에게 "예약 완료됨" 전달 → 목록 새로고침
            if (onReserved) onReserved();
            
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
