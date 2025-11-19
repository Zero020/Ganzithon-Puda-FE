import './foodItemForm.css';
import uploadIcon from '@/assets/icon_upload.svg';
import { useState, useEffect } from 'react';

export default function FoodItemForm({
  index,
  totalCount,
  item,
  onChange,
  onRemove,
}) {
  const [previewUrls, setPreviewUrls] = useState([]);

  const handleFieldChange = (field, value) => {
    onChange({
      ...item,
      [field]: value,
    });
  };

  //이미지
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    onChange({
      ...item,
      images: files,
    });
  };

  //미리보기용 변환
  useEffect(() => {
    if (!item.images || item.images.length === 0) {
      setPreviewUrls([]);
      return;
    }

    const urls = item.images.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [item.images]);

  return (
    <section className="food-item">
      {/* 상단 품목 번호 */}
      <div className="food-item-header">
        <div className="food-item-index-area">
          <span>
            품목 {index + 1} / {totalCount}
          </span>
        </div>
        {totalCount > 1 && (
          <button type="button" className="food-item-remove" onClick={onRemove}>
            삭제
          </button>
        )}
      </div>

      {/*음식 이미지 업로드 / 미리보기*/}
      <div className="food-item-body">
        <div className="field">
          <label className="field-label">음식 사진</label>
          <div className="food-photo-box">
            {/* 미리보기 썸네일들 */}
            {previewUrls.length > 0 && (
              <div className="food-photo-preview-list">
                {previewUrls.map((url, idx) => (
                  <div key={idx} className="food-photo-preview-item">
                    <img
                      src={url}
                      alt={`선택한 이미지 ${idx + 1}`}
                      className="food-photo-preview-img"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* 업로드 버튼 영역 */}
            <label className="upload-area">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                hidden
              />

              <img src={uploadIcon} alt="업로드 아이콘" />
              <span className="upload-text">
                {previewUrls.length > 0 ? '이미지 변경' : '이미지 선택'}
              </span>
            </label>
          </div>
        </div>

        {/* 음식명 */}
        <div className="field">
          <label className="field-label">음식명</label>
          <input
            className="field-input"
            type="text"
            placeholder="예: 식빵 & 크루아상"
            value={item.foodName}
            onChange={(e) => handleFieldChange('foodName', e.target.value)}
          />
        </div>

        {/* 음식 설명 */}
        <div className="field">
          <label className="field-label">음식설명</label>
          <input
            className="field-input"
            type="text"
            placeholder="예: 오후 3시에 구운 따끈따끈한 빵"
            value={item.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
          />
        </div>

        {/* 수량 */}
        <div className="field">
          <label className="field-label">수량 (인분)</label>
          <div className="quantity-box">
            <button
              type="button"
              className="qty-btn"
              onClick={() =>
                handleFieldChange('quantity', Math.max(1, item.quantity - 1))
              }
            >
              -
            </button>
            <span className="qty-value">{item.quantity}</span>
            <button
              type="button"
              className="qty-btn"
              onClick={() => handleFieldChange('quantity', item.quantity + 1)}
            >
              +
            </button>
          </div>
        </div>

        {/* 유통기한 */}
        <div className="field">
          <label className="field-label">유통기한</label>
          <input
            className="field-input"
            type="date"
            value={item.expireDate || ''}
            onChange={(e) => handleFieldChange('expireDate', e.target.value)}
          />
        </div>

        {/* 마감기한 */}
        <div className="field">
          <label className="field-label">마감기한</label>
          <input
            className="field-input"
            type="date"
            value={item.deadlineDate || ''}
            onChange={(e) => handleFieldChange('deadlineDate', e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}
