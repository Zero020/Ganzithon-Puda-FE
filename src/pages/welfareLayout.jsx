import { useState } from 'react';
import WelfareHome from './welfareTabs/welfare_home.jsx';
import WelfareReservation from './welfareTabs/welfare_reservation.jsx';
import './welfareLayout.css';
import iconHomeSelected from '@/assets/icon_home_selected.svg';
import iconHomeUnselected from '@/assets/icon_home_unselected.svg';
import iconClockSelected from '@/assets/icon_clock_selected.svg';
import iconClockUnselected from '@/assets/icon_clock_unselected.svg';

export default function WelfareLayout() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'reserve'

  return (
    <div className="welfare-layout">
      {/* 🔹 위쪽(컨텐츠 영역) */}
      <div className={`welfare-pages ${activeTab}`}>
        {/* 왼쪽: 예약 현황 */}
        <div className="welfare-page">
          <WelfareReservation />
        </div>

        {/* 오른쪽: 홈 */}
        <div className="welfare-page">
          <WelfareHome />
        </div>
      </div>

      {/* 🔹 아래 내비게이션 바 */}
      <nav className="welfare-nav">
        <button
          type="button"
          className={`nav-item ${activeTab === 'reserve' ? 'active' : ''}`}
          onClick={() => setActiveTab('reserve')}
        >
          <img
            src={
              activeTab === 'reserve' ? iconClockSelected : iconClockUnselected
            }
            alt="예약 현황"
          />
          <span className="nav-text">예약 현황</span>
        </button>

        <button
          type="button"
          className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <img
            src={activeTab === 'home' ? iconHomeSelected : iconHomeUnselected}
            alt="홈"
          />
          <span className="nav-text">홈</span>
        </button>

        {/* 위에 주황색 바 (스크린샷 위에 있는 그 선) */}
        <div className={`nav-indicator ${activeTab}`} />
      </nav>
    </div>
  );
}
