// src/api/authApi.js

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// 로컬스토리지 키를 market / center로 분리
const MOCK_MARKETS_KEY = 'mockMarkets';
const MOCK_CENTERS_KEY = 'mockCenters';

// 메모리 캐시
let mockMarketStore = null;
let mockCenterStore = null;

// ---------------------------------------------------------
// MOCK: market.json 로드
// ---------------------------------------------------------
async function ensureMockMarketsLoaded() {
  if (mockMarketStore !== null) return;

  // 1) localStorage 우선 사용
  const fromStorage = localStorage.getItem(MOCK_MARKETS_KEY);
  if (fromStorage) {
    try {
      mockMarketStore = JSON.parse(fromStorage);
      return;
    } catch (e) {
      console.warn('mockMarkets 파싱 실패, 초기화 진행', e);
    }
  }

  // 2) 없으면 /mocks/market.json에서 로드
  try {
    const res = await fetch('/mocks/market.json'); // public/mocks/market.json 기준
    if (!res.ok) throw new Error('market.json 불러오기 실패');

    const raw = await res.json();
    mockMarketStore = Array.isArray(raw) ? raw : [];

    localStorage.setItem(MOCK_MARKETS_KEY, JSON.stringify(mockMarketStore));
  } catch (e) {
    console.error('mock market.json 로드 실패:', e);
    mockMarketStore = [];
  }
}

function saveMockMarkets() {
  localStorage.setItem(MOCK_MARKETS_KEY, JSON.stringify(mockMarketStore));
}

// ---------------------------------------------------------
// MOCK: center.json 로드
// ---------------------------------------------------------
async function ensureMockCentersLoaded() {
  if (mockCenterStore !== null) return;

  // 1) localStorage 우선 사용
  const fromStorage = localStorage.getItem(MOCK_CENTERS_KEY);
  if (fromStorage) {
    try {
      mockCenterStore = JSON.parse(fromStorage);
      return;
    } catch (e) {
      console.warn('mockCenters 파싱 실패, 초기화 진행', e);
    }
  }

  // 2) 없으면 /mocks/center.json에서 로드
  try {
    const res = await fetch('/mocks/center.json'); // public/mocks/center.json 기준
    if (!res.ok) throw new Error('center.json 불러오기 실패');

    const raw = await res.json();
    mockCenterStore = Array.isArray(raw) ? raw : [];

    localStorage.setItem(MOCK_CENTERS_KEY, JSON.stringify(mockCenterStore));
  } catch (e) {
    console.error('mock center.json 로드 실패:', e);
    mockCenterStore = [];
  }
}

function saveMockCenters() {
  localStorage.setItem(MOCK_CENTERS_KEY, JSON.stringify(mockCenterStore));
}

// ---------------------------------------------------------
// 공통: 에러 메시지 추출
// ---------------------------------------------------------
async function extractErrorMessage(res, defaultMessage) {
  let message = defaultMessage;
  try {
    const body = await res.json();
    if (body?.message) message = body.message;
  } catch (e) {
    // ignore
  }
  return message;
}

// ---------------------------------------------------------
// 실제 서버 공통 로그인 (엔드포인트는 기존과 동일하게 유지)
// ---------------------------------------------------------
async function remoteLogin({ loginId, password }) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ loginId, password }),
  });

  if (!res.ok) {
    const message = await extractErrorMessage(res, '로그인에 실패했습니다.');
    throw new Error(message);
  }

  return res.json();
}

// ---------------------------------------------------------
// 로그인 - 마켓용
// ---------------------------------------------------------
export async function loginMarket({ loginId, password }) {
  // MOCK 모드
  if (USE_MOCK || !BASE_URL) {
    await ensureMockMarketsLoaded();

    const user = mockMarketStore.find(
      (u) => u.loginId === loginId && u.password === password
    );

    if (!user) {
      throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
    }

    // id, role 없이 필요한 정보만 반환
    const fakeToken = user.token || `fake-token-market-${user.loginId}`;

    return {
      loginId: user.loginId,
      name: user.name,
      address: user.address,
      description: user.description,
      type: 'market',
      token: fakeToken,
    };
  }

  // 실제 서버 모드: 필요 시 엔드포인트 분리(/api/auth/login/market 등)로 변경 가능
  const data = await remoteLogin({ loginId, password });
  return data;
}

// ---------------------------------------------------------
// 로그인 - 복지시설(센터)용
// ---------------------------------------------------------
export async function loginCenter({ loginId, password }) {
  // MOCK 모드
  if (USE_MOCK || !BASE_URL) {
    await ensureMockCentersLoaded();

    const user = mockCenterStore.find(
      (u) => u.loginId === loginId && u.password === password
    );

    if (!user) {
      throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
    }

    const fakeToken = user.token || `fake-token-center-${user.loginId}`;

    return {
      loginId: user.loginId,
      name: user.name,
      address: user.address,
      description: user.description,
      type: 'center',
      token: fakeToken,
    };
  }

  // 실제 서버 모드
  const data = await remoteLogin({ loginId, password });
  return data;
}

// ---------------------------------------------------------
// (호환용) 예전 구조 유지: role로 분기 - 기존에 사용하시던 loginApi 남겨놨습니다 !
// role: 'market' | 'center'
// ---------------------------------------------------------
export async function loginApi({ loginId, password, role }) {
  if (role === 'MARKET') {
    return loginMarket({ loginId, password });
  }
  if (role === 'CENTER') {
    return loginCenter({ loginId, password });
  }
  // role 안 줬으면 그냥 공통 로그인 (기존 서버 구조용)
  if (!USE_MOCK && BASE_URL) {
    return remoteLogin({ loginId, password });
  }

  throw new Error('로그인 타입이 올바르지 않습니다.');
}

// ---------------------------------------------------------
// 가게 회원가입 (market)
// ---------------------------------------------------------
export async function signupMarket({
  loginId,
  password,
  name,
  address,
  description,
}) {
  // MOCK 모드
  if (USE_MOCK || !BASE_URL) {
    await Promise.all([ensureMockMarketsLoaded(), ensureMockCentersLoaded()]);

    // 아이디 중복 체크 (market/center 전체에서)
    const existsInMarket = mockMarketStore.some((u) => u.loginId === loginId);
    const existsInCenter = mockCenterStore.some((u) => u.loginId === loginId);

    if (existsInMarket || existsInCenter) {
      throw new Error('이미 사용 중인 아이디입니다.');
    }

    const newUser = {
      loginId,
      password,
      name,
      address,
      description,
      token: `fake-token-market-${loginId}`,
    };

    mockMarketStore.push(newUser);
    saveMockMarkets();

    return {
      loginId: newUser.loginId,
      name: newUser.name,
      address: newUser.address,
      description: newUser.description,
      type: 'market',
      token: newUser.token,
    };
  }

  // ---- 실제 서버 모드 ----
  const res = await fetch(`${BASE_URL}/api/auth/signup/market`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      loginId,
      password,
      name,
      address,
      description,
    }),
  });

  if (!res.ok) {
    const message = await extractErrorMessage(
      res,
      '가게 회원가입에 실패했습니다.'
    );
    throw new Error(message);
  }

  return;
}

// ---------------------------------------------------------
// 복지시설 회원가입 (center)
// ---------------------------------------------------------
export async function signupCenter({
  loginId,
  password,
  name,
  address,
  description,
}) {
  // MOCK 모드
  if (USE_MOCK || !BASE_URL) {
    await Promise.all([ensureMockMarketsLoaded(), ensureMockCentersLoaded()]);

    const existsInMarket = mockMarketStore.some((u) => u.loginId === loginId);
    const existsInCenter = mockCenterStore.some((u) => u.loginId === loginId);

    if (existsInMarket || existsInCenter) {
      throw new Error('이미 사용 중인 아이디입니다.');
    }

    const newUser = {
      loginId,
      password,
      name,
      address,
      description,
      token: `fake-token-center-${loginId}`,
    };

    mockCenterStore.push(newUser);
    saveMockCenters();

    return {
      loginId: newUser.loginId,
      name: newUser.name,
      address: newUser.address,
      description: newUser.description,
      type: 'center',
      token: newUser.token,
    };
  }

  // ---- 실제 서버 모드 ----
  const res = await fetch(`${BASE_URL}/api/auth/signup/center`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      loginId,
      password,
      name,
      address,
      description,
    }),
  });

  if (!res.ok) {
    const message = await extractErrorMessage(
      res,
      '복지시설 회원가입에 실패했습니다.'
    );
    throw new Error(message);
  }

  return;
}
