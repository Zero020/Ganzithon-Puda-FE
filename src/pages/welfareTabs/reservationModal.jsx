import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './reservationModal.module.css';

export default function ReservationModal({
  open,
  onClose,
  onConfirm,
  maxQuantity = 1,
  initialQuantity = 1,
  noticeText = '',
  loading = false,
}) {
  const [isVisible, setIsVisible] = useState(open);
  const [count, setCount] = useState(initialQuantity);

  // open/close 애니메이션 + 언마운트 타이밍
  useEffect(() => {
    if (open) {
      setIsVisible(true);
      setCount(initialQuantity);
    } else {
      const t = setTimeout(() => setIsVisible(false), 250);
      return () => clearTimeout(t);
    }
  }, [open, initialQuantity]);

  if (!isVisible) return null;

  const handleMinus = () => {
    setCount((prev) => Math.max(1, prev - 1));
  };

  const handlePlus = () => {
    setCount((prev) => Math.min(maxQuantity, prev + 1));
  };

  const handleConfirm = () => {
    if (loading) return;
    if (onConfirm) onConfirm(count);
  };

  return createPortal(
    <div
      className={`${styles.backdrop} ${open ? styles.backdropOpen : ''}`}
      onClick={onClose}
    >
      <div
        className={`${styles.modal} ${open ? styles.modalOpen : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className={styles.header}>
          <h2 className={styles.title}>예약하기</h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            disabled={loading}
          >
            ×
          </button>
        </div>

        {/* 수량 조절 */}
        <div className={styles.counterWrapper}>
          <button
            type="button"
            className={styles.counterBtn}
            onClick={handleMinus}
            disabled={count <= 1 || loading}
          >
            −
          </button>

          <div className={styles.counterValue}>{count}</div>

          <button
            type="button"
            className={styles.counterBtn}
            onClick={handlePlus}
            disabled={count >= maxQuantity || loading}
          >
            +
          </button>
        </div>

        <div className={styles.counterHint}>
          최대 {maxQuantity}개까지 예약할 수 있어요.
        </div>

        {/* 공지사항 */}
        {noticeText && (
          <div className={styles.noticeBox}>
            <div className={styles.noticeTitle}>공지사항</div>
            <div className={styles.noticeText}>{noticeText}</div>
          </div>
        )}

        {/* 하단 버튼 */}
        <div className={styles.footer}>
          <button
            type="button"
            className={styles.buttonSecondary}
            onClick={onClose}
            disabled={loading}
          >
            취소
          </button>
          <button
            type="button"
            className={styles.buttonPrimary}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? '예약 중...' : '예약'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
