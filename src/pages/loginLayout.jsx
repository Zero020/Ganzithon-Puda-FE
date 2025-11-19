import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoginTabs from './auth/loginTabs.jsx';
import LoginForm from './auth/loginForm.jsx';
import backBtn from '@/assets/icon_back.svg';
import './loginLayout.css';
import logo3 from '@/assets/logo3.svg';
import { loginApi } from '@/api/authApi';

const USER_TYPES = {
  STORE: 'store',
  WELFARE: 'welfare',
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { type } = useParams(); //탭에 따라 주소 변경을 위해 타입가져오기
  const [userType, setUserType] = useState(type || USER_TYPES.STORE); //유저타입
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginError, setIsLoginError] = useState(''); //로그인 에러 상태

  useEffect(() => {
    if (type && type !== userType) {
      // 유효한 값인지 확인
      if (Object.values(USER_TYPES).includes(type)) {
        setUserType(type);
      }
    }
    setIsLoginError(false); //에러 상태 초기화
  }, [type, userType]);

  const handleUserTypeChange = (newType) => {
    setUserType(newType);
    // URL을 새 타입으로 변경하고 로그인 페이지 유지
    navigate(`/${newType}/login`, { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const role = userType === USER_TYPES.STORE ? 'MARKET' : 'CENTER'; //api명세서 롤이름
    console.log('로그인 시도', { userType, id, password });
    try {
      // await loginApi({ loginId: id, password, role: userType });
      setIsLoginError('');
      const data = await loginApi({ loginId: id, password, role });
      console.log('로그인 성공', data);
      //throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
      //role에 따라 페이지 분기
      if (data.role === 'MARKET') {
        navigate('/store'); // 가게 홈
      } else if (data.role === 'CENTER') {
        navigate('/welfare'); // 복지시설 홈
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      setIsLoginError(
        error.message || '아이디 또는 비밀번호가 일치하지 않습니다.'
      );
    }
  };

  const isDisabled = !id || !password;

  return (
    <div className="login-container">
      <div className="header">
        <button className="back-button" type="button">
          <img
            src={backBtn}
            alt="뒤로가기"
            className="back-btn"
            onClick={() => navigate('/')}
          />
        </button>
      </div>

      {/*로고*/}
      <div className="login-logo-area">
        <img src={logo3} alt="푸다 로고" className="login-logo" />
      </div>

      {/*가게 or 복지시설 탭*/}
      <LoginTabs userType={userType} onChange={handleUserTypeChange} />

      {/*아이디, 비밀번호, 버튼*/}
      <LoginForm
        id={id}
        password={password}
        onChangeId={setId}
        onChangePassword={setPassword}
        onSubmit={handleSubmit}
        disabled={isDisabled}
        isError={!!isLoginError}
      />

      {/*회원가입 링크*/}
      <div className="login-footer">
        <span> 계정이 없으신가요?</span>
        <button
          type="button"
          className="signup-link"
          onClick={() => navigate(`/${userType}/signup`)}
        >
          회원가입
        </button>
      </div>
    </div>
  );
}
