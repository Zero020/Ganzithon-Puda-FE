import { useEffect, useState } from 'react';
import styles from './reviewWriteModal.module.css';
import UploadIcon from '@/assets/icon_upload.svg';

import { postReview } from '@/api/welfareApi.js';

const MAX_LENGTH = 200;

export default function ReviewWriteModal({
  open,
  onClose,
  onPrev,
  onSubmit,
  reservationId,
  marketId,
  centerId,
}) {
  const [isVisible, setIsVisible] = useState(open);
  const [isClosing, setIsClosing] = useState(false);

  const [reviewText, setReviewText] = useState('');
  const [photo, setPhoto] = useState(null); // ⭐ 단일 사진만 저장 { file, url }
  const [submitting, setSubmitting] = useState(false);

  const trimmed = reviewText.trim();
  const canSubmit = trimmed.length > 0 && trimmed.length <= MAX_LENGTH && !submitting;

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      setIsClosing(false);

      setReviewText('');
      setSubmitting(false);

      if (photo) URL.revokeObjectURL(photo.url);
      setPhoto(null);
    } else {
      setIsClosing(true);

      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsClosing(false);

        if (photo) URL.revokeObjectURL(photo.url);
        setPhoto(null);
      }, 250);

      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    return () => {
      if (photo) URL.revokeObjectURL(photo.url);
    };
  }, []);

  if (!isVisible) return null;

  const handleCloseClick = () => {
    if (onClose) onClose();
  };

  const handlePrevClick = () => {
    if (onPrev) onPrev();
  };

  // 사진 선택 (단일)
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이전 사진 URL 정리
    if (photo) URL.revokeObjectURL(photo.url);

    const url = URL.createObjectURL(file);
    setPhoto({ file, url });

    e.target.value = ''; // 같은 파일 다시 업로드 가능하게
  };

  const handleRemovePhoto = () => {
    if (photo) URL.revokeObjectURL(photo.url);
    setPhoto(null);
  };

  // 실제 리뷰 등록 호출
  const handleSubmitClick = async () => {
    if (!canSubmit) return;

    try {
      setSubmitting(true);

      const imageFile = photo?.file;

      const success = await postReview(
        reservationId,
        marketId,
        centerId,
        trimmed,
        imageFile
      );

      // ⭐ postReview가 true를 반환했을 때
      if (success) {
        alert('리뷰가 정상적으로 작성되었습니다!');

        if (onSubmit) onSubmit(); // 부모에게 성공 알림
        if (onClose) onClose();   // 모달 닫기
        return;
      }

      // ⭐ 혹시 success === false라면
      alert('리뷰 등록에 실패했습니다.');
    } catch (err) {
      console.error(err);
      alert('리뷰 등록 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
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
          <h2 className={styles.title}>리뷰 작성</h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={handleCloseClick}
            disabled={submitting}
          >
            ×
          </button>
        </div>

        <p className={styles.description}>기부 경험을 공유해주세요</p>

        {/* 단계 */}
        <div className={styles.stepper}>
          <div className={styles.stepCircle}>1</div>
          <div className={styles.stepLine} />
          <div className={`${styles.stepCircle} ${styles.stepCircleActive}`}>2</div>
        </div>

        {/* 리뷰 입력 */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>
            리뷰 작성 <span className={styles.requiredMark}>*</span>
          </label>
          <div className={styles.textareaWrapper}>
            <textarea
              className={styles.textarea}
              placeholder="200자 이내"
              value={reviewText}
              onChange={(e) => {
                if (e.target.value.length <= MAX_LENGTH) {
                  setReviewText(e.target.value);
                }
              }}
              disabled={submitting}
            />
            <div className={styles.charCount}>
              {trimmed.length}/{MAX_LENGTH}
            </div>
          </div>
        </div>

        {/* 단일 사진 첨부 */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>사진 첨부 (선택)</label>

          <div className={styles.imageContainer}>
            {photo && (
              <div className={styles.photoPreviewItem}>
                <img src={photo.url} alt="첨부된 이미지" className={styles.photoPreviewImage} />
                <button
                  type="button"
                  className={styles.photoRemoveButton}
                  onClick={handleRemovePhoto}
                  disabled={submitting}
                >
                  ×
                </button>
              </div>
            )}

            {!photo && (
              <label className={styles.photoUploadBox}>
                <input
                  type="file"
                  accept="image/*"
                  className={styles.fileInput}
                  onChange={handlePhotoChange}
                  disabled={submitting}
                />
                <img src={UploadIcon} alt="" className={styles.uploadIcon} />
                <div className={styles.uploadText}>사진 추가</div>
              </label>
            )}
          </div>
        </div>

        {/* 푸터 */}
        <div className={styles.footer}>
          <button
            type="button"
            className={styles.buttonSecondary}
            onClick={handlePrevClick}
            disabled={submitting}
          >
            이전
          </button>
          <button
            type="button"
            className={
              canSubmit ? styles.buttonPrimary : styles.buttonPrimaryDisabled
            }
            disabled={!canSubmit}
            onClick={handleSubmitClick}
          >
            {submitting ? '등록 중...' : '리뷰 등록'}
          </button>
        </div>
      </div>
    </div>
  );
}
