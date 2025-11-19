import { useState, useEffect } from 'react';
import styles from './receiptCertModal.module.css';
import UploadIcon from '@/assets/icon_upload.svg';

export default function ReceiptCertModal({ open, onClose, onNext }) {
  const [isVisible, setIsVisible] = useState(open); // DOM에 붙어있는지 여부
  const [isClosing, setIsClosing] = useState(false);
  const [nextStepAllowed, setNextStepAllowed] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (open) {
      // 열릴 때: 바로 렌더 + closing 해제
      setIsVisible(true);
      setIsClosing(false);
      // 새로 열릴 때마다 상태 초기화
      setNextStepAllowed(false);
      setSelectedFile(null);
    } else if (!open && isVisible) {
      // 닫힐 때: 애니메이션만 돌리고, 끝나면 언마운트
      setIsClosing(true);

      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsClosing(false);
      }, 250); // modalSlideDown 0.25s 와 맞추기

      return () => clearTimeout(timer);
    }
  }, [open, isVisible]);

  if (!isVisible) return null;

  const handleCloseClick = () => {
    // 부모에게 "닫아줘" 신호만 보냄
    if (onClose) onClose();
  };

  // 파일 선택 핸들러
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      setNextStepAllowed(false);
      return;
    }
    setSelectedFile(file);
    // TODO: api로 영수증 검증 로직
    setNextStepAllowed(true); // 이미지가 들어온 순간 다음 단계 허용
  };

  // 다음 단계 버튼 클릭
  const handleNextClick = () => {
    if (!nextStepAllowed) return; // 방어 코드
    // 나중에 영수증 판별 로직 들어갈 자리
    // onNext에 파일도 넘기고 싶다면 onNext(selectedFile)로 변경하면 됨
    if (onNext) onNext(selectedFile);
  };

  return (
    <div
      className={isClosing ? styles.backdropClosing : styles.backdrop}
      // 배경을 눌러도 닫고 싶으면:
      onClick={handleCloseClick}
    >
      <div
        className={isClosing ? styles.modalClosing : styles.modal}
        // 모달 내부 클릭 시 버블링 방지
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

        {/* 설명 텍스트 */}
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
          {/* 실제 파일 input 은 숨김 */}
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
            {selectedFile ? '1개의 파일이 선택되었습니다' : '갤러리에서 선택'}
          </div>
        </label>

        {/* 하단 버튼 영역 */}
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
            disabled={!nextStepAllowed}
            onClick={handleNextClick}
          >
            다음 단계
          </button>
        </div>
      </div>
    </div>
  );
}
