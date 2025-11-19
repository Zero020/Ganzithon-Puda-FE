import { useState } from 'react';
import FoodItemForm from './foodItemForm.jsx';
import './store_foodRegister.css';
import { createFoods } from '@/api/storeApi';

function createEmptyItem() {
  return {
    id: crypto.randomUUID(), // 임시 id
    foodName: '',
    description: '',
    quantity: 1,
    expireDate: '',
    deadlineDate: '',
    images: [],
    previewImages: [],
  };
}

export default function StoreFoodRegister() {
  const [items, setItems] = useState([createEmptyItem()]);
  const [submitting, setSubmitting] = useState(false);

  const handleChangeItem = (id, newItem) => {
    setItems((prev) => prev.map((it) => (it.id === id ? newItem : it)));
  };

  const handleAddItem = () => {
    setItems((prev) => [...prev, createEmptyItem()]);
  };

  const handleRemoveItem = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleSubmitAll = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const hasEmpty = items.some(
      (it) => !it.foodName || !it.quantity || !it.deadlineDate,
    );
    if (hasEmpty) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      await createFoods(items);

      alert('음식이 등록되었습니다.');
      setItems([createEmptyItem()]); //등록 후 초기화
    } catch (err) {
      console.error(err);
      alert(err.message || '등록에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="food-register" onSubmit={handleSubmitAll}>
      <header className="food-register-header">
        <h1 className="store-name">행복베이커리</h1>
        <p className="store-address">서울특별시 종로구 세종대로 175</p>
      </header>

      {/* 품목 리스트 – 세로 스크롤 */}
      <div className="food-items-scroll">
        {items.map((item, index) => (
          <FoodItemForm
            key={item.id}
            index={index}
            totalCount={items.length}
            item={item}
            onChange={(newItem) => handleChangeItem(item.id, newItem)}
            onRemove={() => handleRemoveItem(item.id)}
          />
        ))}
      </div>

      {/* 하단 버튼 영역 */}
      <div className="food-register-footer">
        <button
          type="button"
          className="btn-secondary"
          onClick={handleAddItem}
        >
          품목 추가
        </button>

        <button
          type="submit"
          className="btn-primary"
          disabled={submitting || items.length === 0}
        >
          {submitting ? '등록 중...' : '모두 등록하기'}
        </button>
      </div>
    </form>
  );
}
