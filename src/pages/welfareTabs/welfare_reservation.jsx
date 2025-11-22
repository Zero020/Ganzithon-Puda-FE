import { useState, useEffect, useMemo } from 'react';
import styles from './welfare_reservation.module.css';
import logo from '@/assets/logo3.svg';
import icon_clock from '@/assets/icon_clock_selected.svg';
import icon_users from '@/assets/icon_people.svg';
import ReceiptCertModal from './receiptCertModal.jsx';
import ReviewWriteModal from './reviewWriteModal.jsx';

// API
import { loadReservation, patchReservationStatus } from '@/api/welfareApi.js';

// "2025-11-25T23:59:59Z" -> "2025.11.25"
function formatExpirationDate(dateString) {
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

function getDateKey(dateString) {
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return 'invalid';
  return d.toISOString().split('T')[0];
}

function formatReservedLabel(dateString) {
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
  });
}

export default function WelfareReservation() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isReceiptModalOpen, setReceiptModalOpen] = useState(false);
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [receiptImage, setReceiptImage] = useState(null);

  const [activeReservationId, setActiveReservationId] = useState(null);
  const [activeMarketId, setActiveMarketId] = useState(null); // ✅ 추가

  // PATCH 진행 중 reservationId들
  const [pendingIds, setPendingIds] = useState(() => new Set());

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const [yearMonthFilter, setYearMonthFilter] = useState({
    year: currentYear,
    month: currentMonth,
  });
  const [isMonthOpen, setIsMonthOpen] = useState(false);

  const getUser = () => JSON.parse(localStorage.getItem('user') || '{}');
  const getCenterId = () => getUser()?.userId;
  const centerId = getCenterId();

  const refetchReservations = async () => {
    const data = await loadReservation(centerId);
    setPosts(data || []);
  };

  useEffect(() => {
    setLoading(true);

    refetchReservations()
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 예약 데이터에서 존재하는 연/월 목록
  const availableMonths = useMemo(() => {
    const map = new Map();

    posts.forEach((item) => {
      const d = new Date(item.reservationTime);
      if (Number.isNaN(d.getTime())) return;
      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      const key = `${y}-${String(m).padStart(2, '0')}`;
      if (!map.has(key)) map.set(key, { year: y, month: m });
    });

    return Array.from(map.values()).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
  }, [posts]);

  // 선택된 연/월 기준 필터링
  const filteredPosts = useMemo(() => {
    const { year, month } = yearMonthFilter;

    return posts.filter((item) => {
      const d = new Date(item.reservationTime);
      if (Number.isNaN(d.getTime())) return false;
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    });
  }, [posts, yearMonthFilter]);

  // 날짜별 그룹화
  const grouped = filteredPosts.reduce((acc, item) => {
    const key = getDateKey(item.reservationTime);
    if (!acc[key]) {
      acc[key] = {
        label: formatReservedLabel(item.reservationTime),
        items: [],
      };
    }
    acc[key].items.push(item);
    return acc;
  }, {});

  const sortedDateKeys = Object.keys(grouped).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  // Set helpers
  const addPending = (id) =>
    setPendingIds((prev) => new Set(prev).add(id));
  const removePending = (id) =>
    setPendingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  const isPending = (id) => pendingIds.has(id);

  // 1단계: 픽업 완료 버튼 (item 전체 받음)
  const handlePickupComplete = async (item) => {
    const reservationId = item.reservationId;
    if (isPending(reservationId)) return;

    try {
      addPending(reservationId);
      setActiveMarketId(item.marketId); // ✅ marketId 저장

      await patchReservationStatus(reservationId);
      await refetchReservations();
    } catch (err) {
      console.error(err);
      alert('픽업 완료 처리에 실패했습니다.');
    } finally {
      removePending(reservationId);
    }
  };

  // 2단계: 리뷰작성 버튼 → 영수증 모달
  const handleOpenStep1 = (item) => {
    if (isPending(item.reservationId)) return;
    setActiveReservationId(item.reservationId);
    setActiveMarketId(item.marketId); // ✅ marketId 저장
    setReceiptModalOpen(true);
  };

  const handleReceiptNext = (file) => {
    setReceiptImage(file);
    setReceiptModalOpen(false);
    setReviewModalOpen(true);
  };

  const handleReviewPrev = () => {
    setReviewModalOpen(false);
    setReceiptModalOpen(true);
  };

  // 3단계: 리뷰 등록 성공 콜백
  const handleReviewSubmit = async () => {
    if (!activeReservationId || isPending(activeReservationId)) return;

    try {
      addPending(activeReservationId);

      await patchReservationStatus(activeReservationId);
      await refetchReservations();
    } catch (err) {
      console.error(err);
      alert('리뷰 상태 변경에 실패했습니다.');
    } finally {
      removePending(activeReservationId);
      setReviewModalOpen(false);
      setReceiptImage(null);
      setActiveReservationId(null);
      setActiveMarketId(null); // ✅ 초기화
    }
  };

  const handleSelectMonth = (ym) => {
    setYearMonthFilter(ym);
    setIsMonthOpen(false);
  };

  const hasNoData = !loading && filteredPosts.length === 0;

  return (
    <div className={styles.welfareReservationContainer}>
      <div className={styles.topHeader}>
        <img src={logo} alt="Logo" className={styles.logo} />
      </div>

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

      <div className={styles.reservationTableHeader}>
        <div className="coll">가게명</div>
        <div className="coll">마감기한</div>
        <div className="coll">수량</div>
        <div className="coll">상태</div>
      </div>
      <hr className={styles.divider} />

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
                <div className={styles.dateLabel}>{section.label}</div>

                {section.items.map((item) => {
                  const pending = isPending(item.reservationId);

                  return (
                    <div key={item.reservationId}>
                      <div className={styles.row}>
                        <div className={styles.cellStore}>
                          {item.marketName}
                        </div>

                        <div
                          className={`${styles.cellDeadline} ${styles.deadlineCol}`}
                        >
                          <img src={icon_clock} alt="" className="icon-search" />
                          {formatExpirationDate(item.endTime)}
                        </div>

                        <div>
                          <img src={icon_users} alt="" className="icon-search" />
                          {item.count}
                        </div>

                        <div className={styles.cellStatus}>
                          {item.status === '작성 완료' ? (
                            <button
                              type="button"
                              disabled
                              className={`${styles.statusButton} ${styles.statusDone}`}
                            >
                              ✓ 작성 완료
                            </button>
                          ) : item.status === '픽업 완료' ? (
                            <button
                              type="button"
                              disabled={pending}
                              className={`${styles.statusButton} ${styles.statusTodo}`}
                              onClick={() => handleOpenStep1(item)}
                              title="픽업이 완료되었습니다. 리뷰를 작성해주세요."
                            >
                              {pending ? '처리중...' : '리뷰작성'}
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={pending}
                              className={`${styles.statusButton} ${styles.statusTodo}`}
                              onClick={() => handlePickupComplete(item)}
                              title="픽업을 완료하셨나요? 완료 후 버튼을 눌러주세요."
                            >
                              {pending ? '처리중...' : '픽업 완료'}
                            </button>
                          )}
                        </div>
                      </div>
                      <hr className={styles.sectionDivider} />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      <ReceiptCertModal
        open={isReceiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        onNext={handleReceiptNext}
        reservationId={activeReservationId}
      />

      <ReviewWriteModal
        open={isReviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onPrev={handleReviewPrev}
        onSubmit={handleReviewSubmit}
        reservationId={activeReservationId}
        marketId={activeMarketId}   // ✅ 저장해둔 값 전달
        centerId={centerId}
      />
    </div>
  );
}
