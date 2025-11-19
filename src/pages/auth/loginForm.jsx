import userIcon from '@/assets/icon_user.svg';
import lockIcon from '@/assets/icon_lock.svg';
import warningIcon from '@/assets/icon_warning.svg';
import './loginForm.css';

export default function LoginForm({
  id,
  password,
  onChangeId,
  onChangePassword,
  onSubmit,
  disabled,
  isError,
}) {
  return (
    <form className="login-form" onSubmit={onSubmit}>
      {/*아이디 입력*/}
      <div className={`input-wrapper ${isError ? 'input-error' : ''}`}>
        <img src={userIcon} alt="" className="input-icon" />
        <input
          type="text"
          value={id}
          onChange={(e) => onChangeId(e.target.value)}
          placeholder="아이디를 입력해주세요"
          autoComplete="current-password"
          className="login-input"
        />
      </div>

      {/*비밀번호 입력*/}
      <div className={`input-wrapper ${isError ? 'input-error' : ''}`}>
        <img src={lockIcon} alt="" className="input-icon" />
        <input
          type="password"
          value={password}
          onChange={(e) => onChangePassword(e.target.value)}
          placeholder="비밀번호를 입력해주세요"
          autoComplete="current-password"
          className="login-input"
        />
      </div>

      {/* 에러 메시지 */}
      {isError && (
        <p className="login-error-text">
          <img src={warningIcon} alt="" className="warningIcon" />
          아이디 또는 비밀번호가 일치하지 않습니다. <br/><span>다시 확인해 주세요.</span>
        </p>
      )}

      {/*로그인 버튼 */}
      <button type="submit" className="login-button" disabled={disabled}>
        로그인
      </button>
    </form>
  );
}
