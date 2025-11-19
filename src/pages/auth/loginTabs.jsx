import storeActiveIcon from '@/assets/icon_store_active.svg';
import storeInactiveIcon from '@/assets/icon_store_inactive.svg';
import welfareActiveIcon from '@/assets/icon_welfare_active.svg';
import welfareInactiveIcon from '@/assets/icon_welfare_inactive.svg';
import './loginTabs.css';

export default function LoginTabs({ userType, onChange }) {
  const isStore = userType === 'store';

  return (
    <div className="login-tabs">
      {/* 가게 탭 */}
      <button
        type="button"
        className={`login-tab ${isStore ? 'active' : ''}`}
        onClick={() => onChange('store')}
      >
        <img
          src={isStore ? storeActiveIcon : storeInactiveIcon}
          alt="가게"
          className="login-tab-icon"
        />
        <span>가게</span>
      </button>

      {/* 복지시설 탭 */}
      <button
        type="button"
        className={`login-tab ${!isStore ? 'active' : ''}`}
        onClick={() => onChange('welfare')}
      >
        <img
          src={!isStore ? welfareActiveIcon : welfareInactiveIcon}
          alt="복지시설"
          className="login-tab-icon"
        />
        <span>복지시설</span>
      </button>
    </div>
  );
}
