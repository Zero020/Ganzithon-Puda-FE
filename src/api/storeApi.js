const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// 가게 예약 데이터 불러오기(가게 홈)
export async function fetchStoreData() {
    if (USE_MOCK || !BASE_URL) {
        // 더미데이터
        const res = await fetch('../mocks/storeReservations.json');
        if (!res.ok) throw new Error('mock 데이터 불러오기 실패');
        const data = await res.json();
        return data;

    }
    // 실제 서버
    const res = await fetch(`${BASE_URL}/api/store/reservations`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!res.ok) {
        throw new Error('API 요청 실패');
    }

    const data = await res.json();
    return data;
}

// 가게 식품 등록하기 (가게 음식등록)
export async function createFoods(items) {

  // 콘솔 확인용
  if (USE_MOCK || !BASE_URL) {
    console.log('음식 등록 요청', items);
    // 로딩 느낌만 주고 끝내기
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true };
  }

  //실제 서버 -> 명세서 나온 후 수정예정
  const res = await fetch(`${BASE_URL}/api/store/foods`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(items),
  });

  if (!res.ok) {
    let message = '음식 등록에 실패했습니다.';
    try {
      const errBody = await res.json();
      if (errBody?.message) message = errBody.message;
    } catch (e) {
    }
    throw new Error(message);
  }

  const data = await res.json().catch(() => ({}));
  return data;
}
