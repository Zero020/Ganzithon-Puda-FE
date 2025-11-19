import { useNavigate } from 'react-router-dom';
import logoImage from '@/assets/logo.svg';
import logoName from '@/assets/logo2.svg';
import icon_cta_store from '@/assets/landing_cta_store.svg';
import icon_cta_welfare from '@/assets/landing_cta_welfare.svg';
import banner_img from '@/assets/landing_banner_img.png';

import './landing.css';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* 1. 로고 섹션 */}
      <section className="landing-logo-wrapper">
        <img src={logoImage} alt="로고 이미지" className="landing-logo-image" />
        <img src={logoName} alt="로고 이름" className="landing-logo-name" />
      </section>

      {/* 2. 배너 섹션 */}
      {/* <section className="landing-banner">
        <img src={banner_img} alt="소개 이미지" className="banner-img" />
      </section> */}

      {/* 3. CTA 섹션 */}
      <section className="landing-cta">
        <h2 className="landing-question">무엇을 하러 오셨나요?</h2>
        <div className="landing-buttons">
          <button
            className="cta-button"
            onClick={() => navigate('/store/login')}
          >
            <img src={icon_cta_store} alt="가게 로그인" />
          </button>
          <button
            className="cta-button"
            onClick={() => navigate('/welfare/login')}
          >
            <img src={icon_cta_welfare} alt="복지시설 로그인" />
          </button>
        </div>
      </section>

      {/* 4. 하단 통계 섹션 */}
      {/* <section className="landing-stats">
        <button className="stat-card">
          1,234건<br />
          <span className="small-text">누적 기부</span>
        </button>
        <button className="stat-card">
          89곳<br />
          <span className="small-text">참여 가게</span>
        </button>
        <button className="stat-card">
          46곳<br />
          <span className="small-text">복지시설</span>
        </button>
      </section> */}
    </div>
  );
}
