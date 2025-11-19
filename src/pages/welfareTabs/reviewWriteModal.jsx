import { useEffect, useState } from 'react';
import styles from './reviewWriteModal.module.css';
import UploadIcon from '@/assets/icon_upload.svg';

const MAX_LENGTH = 200;
const MAX_PHOTOS = 3; // 첨부 최대 개수(원하면 조절 가능)

export default function ReviewWriteModal({
  open,
  onClose,
  onPrev, // "이전" 버튼 클릭
  onSubmit, // 리뷰 등록
}) {
  const [isVisible, setIsVisible] = useState(open);
  const [isClosing, setIsClosing] = useState(false);

  const [reviewText, setReviewText] = useState('');
  const [photos, setPhotos] = useState([]); // 첨부 사진들
  // photos: [{ id, file, url }]

  const trimmed = reviewText.trim();
  const canSubmit = trimmed.length > 0 && trimmed.length <= MAX_LENGTH;

  // 모달 열기/닫기 + 초기화
  useEffect(() => {
    if (open) {
      // 모달 열릴 때
      setIsVisible(true);
      setIsClosing(false);

      setReviewText('');

      // 이전 사진 URL 정리 + 비우기
      setPhotos((prev) => {
        prev.forEach((p) => URL.revokeObjectURL(p.url));
        return [];
      });
    } else {
      // 모달 닫힐 때: 애니메이션 후 언마운트
      setIsClosing(true);

      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsClosing(false);

        setPhotos((prev) => {
          prev.forEach((p) => URL.revokeObjectURL(p.url));
          return [];
        });
      }, 250); // modalSlideDown 시간

      return () => clearTimeout(timer);
    }
  }, [open]);

  // 컴포넌트 자체가 언마운트될 때도 URL 정리
  useEffect(() => {
    return () => {
      setPhotos((prev) => {
        prev.forEach((p) => URL.revokeObjectURL(p.url));
        return [];
      });
    };
  }, []);

  if (!isVisible) return null;

  const handleCloseClick = () => {
    if (onClose) onClose();
  };

  const handlePrevClick = () => {
    if (onPrev) onPrev();
  };

  const handleSubmitClick = () => {
    if (!canSubmit) return;
    if (onSubmit) {
      onSubmit({
        text: trimmed,
        photos, // [{ id, file, url }]
      });
    }
  };

  const handleTextChange = (e) => {
    const value = e.target.value;
    if (value.length > MAX_LENGTH) return;
    setReviewText(value);
  };

  // 여러 장 첨부
  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setPhotos((prev) => {
      const remain = [...prev];
      const spaceLeft = MAX_PHOTOS - remain.length;
      if (spaceLeft <= 0) return prev; // 이미 꽉 찼으면 추가 안 함

      const selected = files.slice(0, spaceLeft);

      const newItems = selected.map((file, index) => ({
        id: `${Date.now()}-${index}`,
        file,
        url: URL.createObjectURL(file),
      }));

      return [...remain, ...newItems];
    });

    // 같은 파일을 다시 선택할 수 있도록 초기화
    e.target.value = '';
  };

  // 개별 사진 삭제
  const handleRemovePhoto = (id) => {
    setPhotos((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) {
        URL.revokeObjectURL(target.url);
      }
      return prev.filter((p) => p.id !== id);
    });
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
          >
            ×
          </button>
        </div>

        {/* 설명 */}
        <p className={styles.description}>기부 경험을 공유해주세요</p>

        {/* 단계 표시: 1은 회색, 2는 활성 */}
        <div className={styles.stepper}>
          <div className={styles.stepCircle}>1</div>
          <div className={styles.stepLine} />
          <div className={`${styles.stepCircle} ${styles.stepCircleActive}`}>
            2
          </div>
        </div>

        {/* 리뷰 텍스트 입력 */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>
            리뷰 작성 <span className={styles.requiredMark}>*</span>
          </label>
          <div className={styles.textareaWrapper}>
            <textarea
              className={styles.textarea}
              placeholder="200자 이내"
              value={reviewText}
              onChange={handleTextChange}
            />
            <div className={styles.charCount}>
              {trimmed.length}/{MAX_LENGTH}
            </div>
          </div>
        </div>

        {/* 사진 첨부 (선택) */}
        <div className={styles.fieldGroup}>
          <div className={styles.fieldLabel}>사진 첨부 (선택)</div>

          <div className={styles.imageContainer}>
            {/* 미리보기 리스트 */}
            {photos.length > 0 && (
              <div className={styles.photoPreviewList}>
                {photos.map((p) => (
                  <div key={p.id} className={styles.photoPreviewItem}>
                    <img
                      src={p.url}
                      alt="첨부 이미지 미리보기"
                      className={styles.photoPreviewImage}
                    />
                    <button
                      type="button"
                      className={styles.photoRemoveButton}
                      onClick={() => handleRemovePhoto(p.id)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 업로드 박스 */}
            <label className={styles.photoUploadBox}>
              <input
                type="file"
                accept="image/*"
                multiple
                className={styles.fileInput}
                onChange={handlePhotoChange}
                disabled={photos.length >= MAX_PHOTOS}
              />
              <img
                src={UploadIcon}
                alt="Upload"
                className={styles.uploadIcon}
              />
              <div className={styles.uploadText}>
                {photos.length > 0
                  ? `${photos.length} / ${MAX_PHOTOS} 선택됨`
                  : '사진 추가'}
              </div>
            </label>
          </div>
        </div>

        {/* 푸터 버튼 */}
        <div className={styles.footer}>
          <button
            type="button"
            className={styles.buttonSecondary}
            onClick={handlePrevClick}
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
            리뷰 등록
          </button>
        </div>
      </div>
    </div>
  );
}
