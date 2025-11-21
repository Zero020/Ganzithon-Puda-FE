export function logout() {
  // 토큰
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  // 유저 정보
  localStorage.removeItem("user");

  // localStorage.clear(); 전체제거
}
