import { useState } from 'react';
import StoreHome from './storeTabs/store_home.jsx';
import StoreFoodRegister from './storeTabs/store_foodRegister.jsx';
import './storeLayout.css';

import iconHomeSelected from '@/assets/icon_home_selected.svg';
import iconHomeUnselected from '@/assets/icon_home_unselected.svg';
import iconAddSelected from '@/assets/icon_add_selected.svg';
import iconAddUnselected from '@/assets/icon_add_unselected.svg';

export default function StoreLayout() {
  const [activeTab, setActiveTab] = useState('home'); // 홈탭 or 등록탭

    return (
    <div className="store-layout">
      {/* 위쪽: 두 개의 페이지(200%) */}
      <div className={`store-pages ${activeTab}`}>
        {/* 왼쪽: 예약 현황 / 목록 */}
        <div className="store-page">
          <StoreHome />
        </div>

        {/* 오른쪽: 음식 등록 */}
        <div className="store-page">
          <StoreFoodRegister />
        </div>
      </div>

      {/* 아래 탭 네비게이션 */}
      <nav className="store-nav">
        <button
          type="button"
          className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <img
            src={activeTab === 'home' ? iconHomeSelected : iconHomeUnselected}
            alt="예약 현황"
          />
          <span className="nav-text">예약 현황</span>
        </button>

        <button
          type="button"
          className={`nav-item ${activeTab === 'register' ? 'active' : ''}`}
          onClick={() => setActiveTab('register')}
        >
          <img
            src={
              activeTab === 'register'
                ? iconAddSelected
                : iconAddUnselected
            }
            alt="음식 등록"
          />
          <span className="nav-text">음식 등록</span>
        </button>

        <div className={`nav-indicator ${activeTab}`} />
      </nav>
    </div>
  );
}
