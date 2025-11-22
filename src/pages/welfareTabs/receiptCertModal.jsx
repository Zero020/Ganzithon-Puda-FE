import { useState, useEffect } from 'react';
import styles from './receiptCertModal.module.css';
import UploadIcon from '@/assets/icon_upload.svg';

import { checkReceipt } from '@/api/welfareApi.js';

export default function ReceiptCertModal({
  open,
  onClose,
  onNext,
  reservationId, // ⭐ 추가: 어떤 예약인지 필요
}) {
  const [isVisible, setIsVisible] = useState(open);
  const [isClosing, setIsClosing] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [nextStepAllowed, setNextStepAllowed] = useState(false);

  // ⭐ 영수증 검증 진행 중
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      setIsClosing(false);

      // 새로 열릴 때 리셋
      setSelectedFile(null);
      setNextStepAllowed(false);
      setIsChecking(false);
    } else if (!open && isVisible) {
      setIsClosing(true);

      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsClosing(false);
      }, 250);

      return () => clearTimeout(timer);
    }
  }, [open, isVisible]);

  if (!isVisible) return null;

  const handleCloseClick = () => {
    if (onClose) onClose();
  };

  // ⭐ 파일 선택 시 → 바로 영수증 검증 API 호출
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      setNextStepAllowed(false);
      return;
    }

    setSelectedFile(file);

    // 👇 검증 시작
    setIsChecking(true);
    setNextStepAllowed(false);

    try {
      // ⭐ API 호출 (true / false)
      const isValid = await checkReceipt(reservationId, file);

      if (isValid) {
        setNextStepAllowed(true);
      } else {
        setNextStepAllowed(false);
        alert('유효한 영수증이 아닙니다. 다시 업로드해주세요.');
      }
    } catch (error) {
      console.error(error);
      alert('영수증 확인 중 오류가 발생했습니다.');
      setNextStepAllowed(false);
    } finally {
      setIsChecking(false);
    }
  };

  const handleNextClick = () => {
    if (!nextStepAllowed) return;
    if (onNext) onNext(selectedFile);
  };

  return (
    <div
      className={isClosing ? styles.backdropClosing : styles.backdrop}
      onClick={handleCloseClick}
    >
      <div
        className={isClosing ? styles.modalClosing : styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className={styles.header}>
          <h2 className={styles.title}>영수증 인증</h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={handleCloseClick}
          >
            ×
          </button>
        </div>

        <p className={styles.description}>
          영수증을 업로드하여 기부를 인증해주세요
        </p>

        {/* 단계 표시 */}
        <div className={styles.stepper}>
          <div className={`${styles.stepCircle} ${styles.stepCircleActive}`}>
            1
          </div>
          <div className={styles.stepLine} />
          <div className={styles.stepCircle}>2</div>
        </div>

        {/* 업로드 영역 */}
        <div className={styles.sectionLabel}>
          영수증 사진
          <div className={styles.sectionStrongText}>*</div>
        </div>

        <label className={styles.uploadBox}>
          <input
            type="file"
            accept="image/*"
            className={styles.fileInput}
            onChange={handleFileChange}
          />

          <img
            src={UploadIcon}
            alt="Upload Icon"
            className={styles.uploadIcon}
          />

          <div className={styles.uploadText}>
            {isChecking
              ? '영수증 확인 중...'
              : selectedFile
              ? '1개의 파일이 선택되었습니다'
              : '갤러리에서 선택'}
          </div>
        </label>

        {/* 하단 버튼 */}
        <div className={styles.footer}>
          <button
            type="button"
            className={styles.buttonSecondary}
            onClick={handleCloseClick}
          >
            취소
          </button>
          <button
            type="button"
            className={
              nextStepAllowed
                ? styles.buttonPrimary
                : styles.buttonPrimaryDisabled
            }
            disabled={!nextStepAllowed || isChecking}
            onClick={handleNextClick}
          >
            {isChecking ? '확인 중...' : '다음 단계'}
          </button>
        </div>
      </div>
    </div>
  );
}
