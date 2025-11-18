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
  const [search, setSearch] = useState(''); //검색어

  //최신순으로 리스트 불러오기
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchStoreData();

      const sorted = [...data].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setSections(sorted);
      setLoading(false);
    };

    load();
  }, []);

  //검색어로 필터링
  const filteredSections = useMemo(() => {
    if (!search.trim()) return sections;

    const keyword = search.trim().toLowerCase();

    return sections
      .map((section) => ({
        ...section,
        reservations: section.reservations.filter((r) =>
          r.centerName.toLowerCase().includes(keyword)
        ),
      }))
      .filter((section) => section.reservations.length > 0);
  }, [search, sections]);

  const hasNoResult = !loading && filteredSections.length === 0;

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
