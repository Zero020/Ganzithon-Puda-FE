import { useState, useEffect, useMemo } from 'react';
import styles from './welfare_reservation.module.css';
import logo from '@/assets/logo3.svg';
import ReceiptCertModal from './receiptCertModal.jsx';
import ReviewWriteModal from './reviewWriteModal.jsx';

// API
import { loadReservation } from '@/api/welfareApi.js';

// "2025-11-25T23:59:59Z" -> "2025.11.25"
function formatExpirationDate(dateString) {
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

// reservedAt -> 섹션 키용(YYYY-MM-DD)
function getDateKey(dateString) {
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return 'invalid';
  return d.toISOString().split('T')[0]; // "2025-11-12"
}

// reservedAt -> "11월 12일"
function formatReservedLabel(dateString) {
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('ko-KR', {
    month: 'long', // "11월"
    day: 'numeric', // "12일"
  });
}

export default function WelfareReservation() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isReceiptModalOpen, setReceiptModalOpen] = useState(false);
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [receiptImage, setReceiptImage] = useState(null);

  // 상단에 표시할 현재 연/월
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  // 선택된 연/월 (필터용) – 초기값: 이번 달
  const [yearMonthFilter, setYearMonthFilter] = useState({
    year: currentYear,
    month: currentMonth,
  });

  // 드롭다운 열림 여부
  const [isMonthOpen, setIsMonthOpen] = useState(false);

  useEffect(() => {
    setLoading(true);

    loadReservation()
      .then((data) => {
        setPosts(data || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  //예약 데이터에서 실제로 존재하는 연/월 목록 뽑기 (드롭다운용)
  const availableMonths = useMemo(() => {
    const map = new Map();

    posts.forEach((item) => {
      const d = new Date(item.reservedAt);
      if (Number.isNaN(d.getTime())) return;
      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      const key = `${y}-${String(m).padStart(2, '0')}`;
      if (!map.has(key)) {
        map.set(key, { year: y, month: m });
      }
    });

    // 최신 달이 위로 오도록 정렬
    return Array.from(map.values()).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
  }, [posts]);

  // 선택된 연/월 기준으로 posts 필터링
  const filteredPosts = useMemo(() => {
    const { year, month } = yearMonthFilter;

    return posts.filter((item) => {
      const d = new Date(item.reservedAt);
      if (Number.isNaN(d.getTime())) return false;
      return (
        d.getFullYear() === year &&
        d.getMonth() + 1 === month
      );
    });
  }, [posts, yearMonthFilter]);

  // 날짜별 그룹화 (reservedAt 기준)
  const grouped = filteredPosts.reduce((acc, item) => {
    const key = getDateKey(item.reservedAt);
    if (!acc[key]) {
      acc[key] = {
        label: formatReservedLabel(item.reservedAt),
        items: [],
      };
    }
    acc[key].items.push(item);
    return acc;
  }, {});

  // 날짜 내림차순 정렬 (최근 날짜 위로)
  const sortedDateKeys = Object.keys(grouped).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  const handleOpenStep1 = () => {
    setReceiptModalOpen(true);
  };

  const handleReceiptNext = (file) => {
    setReceiptImage(file); // 필요하면 저장
    setReceiptModalOpen(false);
    setReviewModalOpen(true); // 2단계 오픈
  };

  const handleReviewPrev = () => {
    setReviewModalOpen(false);
    setReceiptModalOpen(true); // 다시 1단계로
  };

  const handleReviewSubmit = ({ text, photos }) => {
    console.log('리뷰 내용:', text);
    console.log('추가 사진:', photos);
    console.log('영수증 이미지:', receiptImage);
    setReviewModalOpen(false);
    // TODO: 서버에 리뷰 등록 API 호출
  };

  // 🔹 월 선택 시
  const handleSelectMonth = (ym) => {
    setYearMonthFilter(ym);
    setIsMonthOpen(false);
  };

  const hasNoData = !loading && filteredPosts.length === 0;

  return (
    <div className={styles.welfareReservationContainer}>
      {/* 상단 헤더 */}
      <div className={styles.topHeader}>
        <img src={logo} alt="Logo" className={styles.logo} />
      </div>
      {/* <div className={styles.topHeaderText}>예약 현황</div> */}

      {/* 연/월 표시 + 드롭다운 */}
      <div className={styles.monthWrapper}>
        <button
          type="button"
          className={styles.monthHeader}
          onClick={() => setIsMonthOpen((prev) => !prev)}
        >
          <span>
            {yearMonthFilter.year}년 {yearMonthFilter.month}월
          </span>
          <span className={styles.monthArrow}>▼</span>
        </button>

        {isMonthOpen && (
          <div className={styles.monthDropdown}>
            {availableMonths.length === 0 && (
              <div className={styles.monthEmpty}>표시할 달이 없습니다.</div>
            )}

            {availableMonths.map((ym) => (
              <button
                key={`${ym.year}-${ym.month}`}
                type="button"
                className={styles.monthOption}
                onClick={() => handleSelectMonth(ym)}
              >
                {ym.year}년 {ym.month}월
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 컬럼 헤더 */}
      <div className={styles.reservationTableHeader}>
        <div>가게명</div>
        <div>마감기한</div>
        <div>상태</div>
      </div>
      <hr className={styles.divider} />

      {/* 로딩 / 빈 상태 / 리스트 */}
      {loading ? (
        <div className={styles.loading}>로딩 중...</div>
      ) : hasNoData ? (
        <div className={styles.empty}>예약 내역이 없습니다.</div>
      ) : (
        <div className={styles.reservationList}>
          {sortedDateKeys.map((dateKey) => {
            const section = grouped[dateKey];
            return (
              <div key={dateKey} className={styles.dateSection}>
                {/* 날짜 헤더: 예) 11월 12일 */}
                <div className={styles.dateLabel}>{section.label}</div>

                {/* 해당 날짜의 예약들 */}
                {section.items.map((item) => (
                  <div key={item.marketId}>
                    <div className={styles.row}>
                      <div className={styles.cellStore}>{item.storeName}</div>
                      <div className={styles.cellDeadline}>
                        {formatExpirationDate(item.expirationDate)}
                      </div>
                      <div className={styles.cellStatus}>
                        {item.isReviewed ? (
                          <button
                            type="button"
                            className={`${styles.statusButton} ${styles.statusDone}`}
                            onClick={() => {}}
                          >
                            ✓ 작성 완료
                          </button>
                        ) : (
                          <button
                            type="button"
                            className={`${styles.statusButton} ${styles.statusTodo}`}
                            onClick={() => handleOpenStep1()}
                          >
                            리뷰작성
                          </button>
                        )}
                      </div>
                    </div>
                    <hr className={styles.sectionDivider} />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      <ReceiptCertModal
        open={isReceiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        onNext={handleReceiptNext}
      />

      <ReviewWriteModal
        open={isReviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onPrev={handleReviewPrev}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
}
