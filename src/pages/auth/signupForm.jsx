import './signupForm.css';

export default function SignupForm({
  loginId,
  password,
  name,
  address,
  description,
  onChangeLoginId,
  onChangePassword,
  onChangeName,
  onChangeAddress,
  onChangeDescription,
  onSubmit,
  disabled,
  loading,
  userType,
}) {
  const nameLabel = userType === 'store' ? '가게명' : '복지시설명';

  const namePlaceholder =
    userType === 'store' ? '가게 소개글' : '복지시설 소개글';

  return (
    <form className="signup-form" onSubmit={onSubmit}>
      {/* 아이디 */}
      <div>
        <p className="input-name">아이디</p>
        <div className="input-wrapper">
          <input
            type="text"
            value={loginId}
            onChange={(e) => onChangeLoginId(e.target.value)}
            placeholder="2자 이상"
            className="signup-input"
          />
        </div>
      </div>

      {/* 비밀번호 */}
      <div>
        <p className="input-name">비밀번호</p>
        <div className="input-wrapper">
          <input
            type="password"
            value={password}
            onChange={(e) => onChangePassword(e.target.value)}
            placeholder="영문, 숫자, 특수문자 포함 8자 이상"
            className="signup-input"
          />
        </div>
      </div>

      {/* 가게명 / 복지시설명 */}
      <div>
        <p className="input-name">{nameLabel}</p>
        <div className="input-wrapper">
          <input
            type="text"
            value={name}
            onChange={(e) => onChangeName(e.target.value)}
            placeholder="예: 행복 베이커리"
            className="signup-input"
          />
        </div>
      </div>

      {/* 주소 */}
      <div>
        <p className="input-name">주소</p>
        <div className="input-wrapper">
          <input
            type="text"
            value={address}
            onChange={(e) => onChangeAddress(e.target.value)}
            placeholder="예: 서울시 성북구 00길"
            className="signup-input"
          />
        </div>
      </div>

      {/* 소개글 */}
      <div>
        <p className="input-name">소개글</p>
        <div className="textarea-wrapper">
          <textarea
            id="소개글"
            value={description}
            onChange={(e) => onChangeDescription(e.target.value)}
            placeholder={`${namePlaceholder} 200자 이내로 작성해주세요`}
            className="signup-textarea"
            rows={3}
          />
        </div>{' '}
      </div>

      {/* 회원가입 버튼 */}
      <button type="submit" className="signup-button" disabled={disabled}>
        {loading ? '회원가입 중...' : '회원가입'}
      </button>
    </form>
  );
}
