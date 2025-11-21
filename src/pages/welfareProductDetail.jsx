import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import styles from './welfareDetail.module.css';
import backIcon from '@/assets/icon_back.svg';
import defaultFoodImage from '@/assets/default_food_image.png';

import { fetchCenterProductDetail} from '@/api/welfareApi';

import FoodInfoSection from './welfareDetail/foodInfoSection';
import ReviewSection from './welfareDetail/reviewSection';

export default function WelfareDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const product = await fetchCenterProductDetail(productId);
        setDetail(product);
      } catch (err) {
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [productId]);

  if (loading) return <div className={styles.detailPage}>불러오는 중...</div>;
  if (errorMsg || !detail)
    return <div className={styles.detailPage}>{errorMsg || '데이터가 없습니다.'}</div>;

  return (
    <div className={styles.detailPage}>
      {/* 상단 헤더 */}
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <img src={backIcon} />
        </button>

        <div className={styles.headerText}>
          <div className={styles.storeName}>{detail.marketName}</div>
          {detail.marketAddress && (
            <div className={styles.storeAddress}>{detail.marketAddress}</div>
          )}
        </div>
      </header>

      {/* 대표 이미지 */}
      <div className={styles.mainImageWrapper}>
        <img
          src={detail.imageUrl || defaultFoodImage}
          className={styles.mainImage}
          alt={detail.productName}
        />
      </div>

      {/* 상품 정보 */}
      <FoodInfoSection detail={detail} />

      {/* 리뷰 */}
      <ReviewSection reviews={detail.reviews || []} />
    </div>
  );
}