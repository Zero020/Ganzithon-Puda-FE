import { useEffect, useState, useMemo } from 'react';
import { fetchStoreData } from '@/api/storeApi';
import './store_home.css';
import logo from '@/assets/logo3.svg';
import SearchBar from './searchBar.jsx';
import ReservationList from './reservationList.jsx';

// storeLayout의 좌 슬라이드
export default function StoreHome() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(''); // 검색어

  // 현재 연/월
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  // 선택된 연/월 (초기값 = 이번 달)
  const [yearMonthFilter, setYearMonthFilter] = useState({
    year: currentYear,
    month: currentMonth,
  });

  // 드롭다운 열림 상태
  const [isMonthOpen, setIsMonthOpen] = useState(false);

  // 최신순으로 리스트 불러오기
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchStoreData();

      const sorted = [...data].sort(
        (a, b) => new Date(b.date) - new Date(a.date),
      );
      setSections(sorted);
      setLoading(false);
    };

    load();
  }, []);

  // sections에서 실제로 존재하는 연/월 목록 뽑기 (드롭다운용)
  const availableMonths = useMemo(() => {
    const map = new Map();

    sections.forEach((section) => {
      const d = new Date(section.date);
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
  }, [sections]);

  // 연/월 + 검색어로 필터링
  const filteredSections = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    const { year, month } = yearMonthFilter;

    // 1) 먼저 연/월로 필터
    const byMonth = sections.filter((section) => {
      const d = new Date(section.date);
      if (Number.isNaN(d.getTime())) return false;
      return (
        d.getFullYear() === year &&
        d.getMonth() + 1 === month
      );
    });

    // 2) 검색어 없으면 여기까지만
    if (!keyword) return byMonth;

    // 3) 검색어 있으면 시설명으로 한 번 더 필터
    return byMonth
      .map((section) => ({
        ...section,
        reservations: section.reservations.filter((r) =>
          r.centerName.toLowerCase().includes(keyword),
        ),
      }))
      .filter((section) => section.reservations.length > 0);
  }, [sections, search, yearMonthFilter]);

  const hasNoResult = !loading && filteredSections.length === 0;

  // 월 선택 클릭 핸들러
  const handleSelectMonth = (ym) => {
    setYearMonthFilter(ym);
    setIsMonthOpen(false);
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <div className="header-logo">
          <img src={logo} alt="Logo" className="logo" />
        </div>

        <div className="header-searchBar">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="시설명을 검색해보세요."
          />
        </div>
      </div>

      {/* 월 표시 + 드롭다운 */}
      <div className="home-month-wrapper">
        <button
          type="button"
          className="home-month-header"
          onClick={() => setIsMonthOpen((prev) => !prev)}
        >
          <span>
            {yearMonthFilter.year}년 {yearMonthFilter.month}월
          </span>
          <span className="home-month-arrow">▼</span>
        </button>

        {isMonthOpen && (
          <div className="home-month-dropdown">
            {availableMonths.length === 0 && (
              <div className="home-month-empty">표시할 달이 없습니다.</div>
            )}

            {availableMonths.map((ym) => (
              <button
                key={`${ym.year}-${ym.month}`}
                type="button"
                className="home-month-option"
                onClick={() => handleSelectMonth(ym)}
              >
                {ym.year}년 {ym.month}월
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="home-content">
        <div className="store-table-header">
          <span className="col">시설명</span>
          <span className="col">마감시간</span>
          <span className="col">수량</span>
          <span className="col">상태</span>
        </div>

        {loading && <p className="store-state-text">불러오는 중...</p>}
        {hasNoResult && (
          <p className="store-state-text empty">검색 결과가 없습니다.</p>
        )}

        {!loading && !hasNoResult && (
          <ReservationList sections={filteredSections} />
        )}
      </div>
    </div>
  );
}
