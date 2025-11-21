const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// 지금은 토큰 사용 안함 → 아예 빈 헤더만 유지
function getAuthHeaders() {
  return {
    'Content-Type': 'application/json',
  };
}


// 가게 예약 데이터 불러오기(가게 홈)
export async function fetchStoreData(marketId, accessToken) {
  if (USE_MOCK || !BASE_URL) {
    // 🔹 더미데이터 사용
    const res = await fetch('/mocks/storeReservations.json');
    if (!res.ok) throw new Error('mock 데이터 불러오기 실패');
    const data = await res.json();
    return data; // [{ centerName, endTime, count, status, reservationTime }, ...]
  }

  // 실제 서버
  const res = await fetch(
    `${BASE_URL}/api/market/reservations/read/${marketId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    }
  );

  if (!res.ok) {
    throw new Error('예약 조회 API 요청 실패');
  }

  const data = await res.json();
  return data;
}


// === 상품 등록 ===
export async function createFoods(items, marketId) {
  if (!marketId) throw new Error('marketId가 필요합니다.');

  if (USE_MOCK || !BASE_URL) {
    console.log('음식 등록(mock)', items);
    await new Promise((res) => setTimeout(res, 500));
    return { success: true };
  }

  // 명세서에 맞는 payload로 변환
  const payloads = items.map((it) => ({
    name: it.foodName,
    description: it.description,
    count: it.quantity,
    endTime: `${it.deadlineDate}T23:59:59`,
    imageUrl: it.imageUrl,
  }));

  // 각 품목을 개별 POST 요청으로 전송
  for (const body of payloads) {
    const res = await fetch(
      `${BASE_URL}/api/markets/${marketId}/products`,
      {
        method: 'POST',
        headers: getAuthHeaders(), // 여기에도 토큰 없음
        body: JSON.stringify(body),
      }
    );

    if (res.status !== 201) {
      throw new Error('상품 등록 실패');
    }
  }

  return { success: true };
}
