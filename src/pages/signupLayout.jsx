import { useState, useEffect } from 'react';
import { useNavigate, useParams} from 'react-router-dom';
import LoginTabs from './auth/loginTabs';
import SignupForm from './auth/signupForm';
import backBtn from '@/assets/icon_back.svg';
import logo3 from '@/assets/logo3.svg';
import './signupLayout.css';
import { signupMarket, signupCenter } from '@/api/authApi';

const USER_TYPES = {
  STORE: 'store',
  WELFARE: 'welfare',
};

export default function SignupLayout() {
  const navigate = useNavigate();
  const { type } = useParams(); //탭에 따라 주소 변경을 위해 타입가져오기
  const [userType, setUserType] = useState(type || USER_TYPES.STORE);

  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(false); //회원가입 후 로딩
  const [error, setError] = useState(null); //입력값 에러 처리

  useEffect(() => {
    if (type && type !== userType) {
      // 유효한 값인지 확인
      if (Object.values(USER_TYPES).includes(type)) {
        setUserType(type);
      }
    }
  }, [type, userType]);

  const handleUserTypeChange = (newType) => {
    setUserType(newType);
    // URL을 새 타입으로 변경하고 로그인 페이지 유지
    navigate(`/${newType}/signup`, { replace: true });
  };

  //입력값 검증
  const validate = () => {
    const errors = {};

    //아이디: 2자 이상
    if (!loginId.trim()) {
      errors.loginId = '아이디를 입력해주세요.';
    } else if (loginId.trim().length < 2) {
      errors.loginId = '아이디는 2자 이상이어야 합니다.';
    }
    //비밀번호: 영문, 숫자, 특수문자 포함 8자 이상
    const pw = password;
    const hasLetter = /[A-Za-z]/.test(pw);
    const hasNumber = /\d/.test(pw);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>\\_\\-]/.test(pw);

    if (!pw) {
      errors.password = '비밀번호를 입력해주세요.';
    } else if (pw.length < 8 || !hasLetter || !hasNumber || !hasSpecial) {
      errors.password = '영문, 숫자, 특수문자를 포함해 8자 이상 입력해주세요.';
    }
    // 이름: 가게명 / 복지시설명
    if (!name.trim()) {
      errors.name =
        userType === USER_TYPES.STORE
          ? '가게명을 입력해주세요.'
          : '복지시설명을 입력해주세요.';
    }
    // 주소
    if (!address.trim()) {
      errors.address = '주소를 입력해주세요.';
    }

    // 소개글: 최소 5자, 최대 200자
    if (!description.trim()) {
      errors.description = '소개글을 입력해주세요.';
    } else if (
      description.trim().length < 5 ||
      description.trim().length > 200
    ) {
      errors.description = '소개글은 5자 이상 200자 이하로 입력해주세요.';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      alert(firstError);
      return; // 검증 실패하면 api호출 x
    }

    setLoading(true);
    setError(null);

    try {
      if (userType === USER_TYPES.STORE) {
        await signupMarket({
          loginId,
          password,
          name,
          address,
          description,
        });
      } else {
        await signupCenter({
          loginId,
          password,
          name,
          address,
          description,
        });
      }

      alert('회원가입이 완료되었습니다. 로그인 해주세요.');
      const loginPath =
        userType === USER_TYPES.STORE ? '/store/login' : '/welfare/login';
      navigate(loginPath);
    } catch (err) {
      console.error(err);
      setError(err.message || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading;

  return (
    <div className="signup-container">
      {/* 헤더 뒤로가기 버튼 */}
      <div className="header">
        <button
          className="back-button"
          type="button"
          onClick={() =>
            navigate(
              userType === USER_TYPES.STORE ? '/store/login' : '/welfare/login'
            )
          }
        >
          <img src={backBtn} alt="뒤로가기" className="back-btn" />
        </button>
      </div>

      {/* 로고 */}
      <div className="signup-logo-area">
        <img src={logo3} alt="푸다 로고" className="signup-logo" />
      </div>

      {/* 가게 / 복지시설 탭 */}
      <LoginTabs userType={userType} onChange={handleUserTypeChange} />

      {/* 회원가입 폼 */}
      <SignupForm
        loginId={loginId}
        password={password}
        name={name}
        address={address}
        description={description}
        onChangeLoginId={setLoginId}
        onChangePassword={setPassword}
        onChangeName={setName}
        onChangeAddress={setAddress}
        onChangeDescription={setDescription}
        onSubmit={handleSubmit}
        disabled={isDisabled}
        loading={loading}
        userType={userType}
      />

      {error && <p className="signup-error-text">{error}</p>}
    </div>
  );
}
