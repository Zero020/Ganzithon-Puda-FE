import axios from 'axios';

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

export async function createFoods(items, marketId) {
  const results = [];

  for (const it of items) {
    const formData = new FormData();
    formData.append("marketId", marketId);
    formData.append("name", it.foodName);
    formData.append("description", it.description);
    formData.append("count", it.quantity);
    formData.append("endTime", `${it.deadlineDate}T23:59:59`);

    if (it.imageUrl instanceof File) {
      formData.append("image", it.imageUrl);
    }

    const res = await fetch(`${BASE_URL}/api/markets/${marketId}/products`, {
      method: "POST",
      body: formData
    });

    if (!res.ok) throw new Error(await res.text());

    results.push(await res.json());
  }

  return results;
}
