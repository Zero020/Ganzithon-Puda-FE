import { useState } from 'react';
import WelfareHome from './welfareTabs/welfare_home.jsx';
import WelfareReservation from './welfareTabs/welfare_reservation.jsx';
import styles from './welfareLayout.module.css';

import iconHomeSelected from '@/assets/icon_home_selected.svg';
import iconHomeUnselected from '@/assets/icon_home_unselected.svg';
import iconClockSelected from '@/assets/icon_clock_selected.svg';
import iconClockUnselected from '@/assets/icon_clock_unselected.svg';

export default function WelfareLayout() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'reserve'

  return (
    <div className={styles.layout}>
      <div
        className={`${styles.pages} ${
          activeTab === 'home'
            ? styles['pages--home']
            : styles['pages--reserve']
        }`}
      >
        <div className={styles.page}>
          <WelfareReservation />
        </div>

        <div className={styles.page}>
          <WelfareHome />
        </div>
      </div>

      <nav className={styles.nav}>
        <button
          type="button"
          className={`${styles.navItem} ${
            activeTab === 'reserve' ? styles['navItem--active'] : ''
          }`}
          onClick={() => setActiveTab('reserve')}
        >
          <img
            src={
              activeTab === 'reserve' ? iconClockSelected : iconClockUnselected
            }
            alt="예약 현황"
          />
          <span className={styles.navText}>예약 현황</span>
        </button>

        <button
          type="button"
          className={`${styles.navItem} ${
            activeTab === 'home' ? styles['navItem--active'] : ''
          }`}
          onClick={() => setActiveTab('home')}
        >
          <img
            src={activeTab === 'home' ? iconHomeSelected : iconHomeUnselected}
            alt="홈"
          />
          <span className={styles.navText}>홈</span>
        </button>

        <div
          className={`${styles.indicator} ${
            activeTab === 'home'
              ? styles['indicator--home']
              : styles['indicator--reserve']
          }`}
        />
      </nav>
    </div>
  );
}
