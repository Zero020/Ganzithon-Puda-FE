const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export async function fetchStoreData() {
    if (USE_MOCK || !BASE_URL) {
        // 더미데이터
        const res = await fetch('../mocks/storeReservations.json');
        if (!res.ok) throw new Error('mock 데이터 불러오기 실패');
        const data = await res.json();
        return data;
    
    }
    // 실제 서버
    const res = await fetch(`${BASE_URL}/api/store/reservations`);
    if (!res.ok) throw new Error('API 요청 실패');
    const data = await res.json();
    return data;
}