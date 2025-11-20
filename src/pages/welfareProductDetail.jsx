import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import styles from './welfareDetail.module.css';
import backIcon from '@/assets/icon_back.svg';
import defaultFoodImage from '@/assets/default_food_image.png';

import {
  fetchCenterProductDetail,
  fetchMarketReviews,
} from '@/api/welfareApi';

import FoodInfoSection from './welfareDetail/foodInfoSection';
import ReviewSection from './welfareDetail/reviewSection';

export default function WelfareProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [detail, setDetail] = useState(null);
  const [marketReviews, setMarketReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setErrorMsg('');

        // 상품 상세
        const product = await fetchCenterProductDetail(productId);

        // 2마켓 리뷰 (marketId 필요)
        const reviewsByMarket = await fetchMarketReviews(product.marketId);

        setDetail(product);
        setMarketReviews(reviewsByMarket);
      } catch (err) {
        console.error(err);
        setErrorMsg(err.message || '상세 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [productId]);

  if (loading) {
    return <div className={styles.detailPage}>불러오는 중...</div>;
  }

  if (errorMsg || !detail) {
    return <div className={styles.detailPage}>{errorMsg || '데이터가 없습니다.'}</div>;
  }

  const mainImage = detail.imageUrl || defaultFoodImage;

  // 리뷰 개수
  const totalReviewCount = marketReviews.length;


  return (
    <div className={styles.detailPage}>
      {/* 상단 헤더 */}
      <header className={styles.header}>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate(-1)}
        >
          <img src={backIcon} alt="뒤로가기" />
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
        <img src={mainImage} alt={detail.productName} className={styles.mainImage} />
      </div>

      {/* 음식 정보 섹션 */}
      <FoodInfoSection detail={detail} />

      {/* 리뷰 섹션 */}
      <ReviewSection
        reviews={marketReviews || []}
        totalCount={totalReviewCount}
      />
    </div>
  );
}
