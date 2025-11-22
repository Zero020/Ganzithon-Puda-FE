import { useState, useEffect, useMemo } from 'react';
import styles from './welfare_home.module.css';

import logo from '@/assets/logo3.svg';
import iconSearch from '@/assets/icon_search.svg';
import icon_logout from '@/assets/icon_logout.svg';
import { logout } from '../auth/auth.jsx';
import { useNavigate } from 'react-router-dom';

// API
import { fetchPosts } from '@/api/welfareApi.js';

// Components
import PostCard from './postCard.jsx';

export default function WelfareHome() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  // 초기 게시글 불러오기
  useEffect(() => {
    setLoading(true);

    fetchPosts()
      .then((data) => {
        setPosts(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []); // 정렬 제거 → 빈 배열

  const refetchPosts = async () => {
    setLoading(true);
    try {
      const data = await fetchPosts();
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 검색 필터링
  const filteredPosts = useMemo(() => {
    if (!search.trim()) return posts;

    const keyword = search.trim().toLowerCase();

    return posts.filter((post) => {
      const targetText = (post.foodName || '').toLowerCase();
      return targetText.includes(keyword);
    });
  }, [search, posts]);

  const hasNoResult = !loading && filteredPosts.length === 0;

  return (
    <div className={styles.welfareContainer}>
      {/* 상단 헤더 */}
      <div className={styles.topHeader}>
        <div className={styles.logoBox}>
          <img src={logo} alt="Logo" className={styles.logo} />

          <div className={styles.headerLogout}>
            <img
              src={icon_logout}
              alt="logout"
              className={styles.logoutIcon}
              onClick={() => setShowLogoutModal(true)}
            />
          </div>
        </div>

        <label className={styles.searchBar}>
          <img src={iconSearch} alt="돋보기" className={styles.iconSearch} />
          <input
            className={styles.searchInput}
            type="text"
            placeholder="가게를 검색해보세요."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </div>

      {/* 로딩 */}
      {loading && <p>불러오는 중...</p>}

      {/* 검색 결과 없음 */}
      {hasNoResult && !loading && <p>검색 결과가 없습니다.</p>}

      {/* 게시글 리스트 */}
      <div className={styles.postList}>
        {filteredPosts.map((post) => (
          <PostCard key={post.productId} post={post} onReserved={refetchPosts} />
        ))}
      </div>

      {showLogoutModal && (
        <div className={styles.logoutModalBackdrop}>
          <div className={styles.logoutModal}>
            <p className={styles.logoutModalMessage}>로그아웃 하시겠습니까?</p>
            <div className={styles.logoutModalButtons}>
              <button
                type="button"
                className={`${styles.logoutModalBtn} ${styles.logoutCancel}`}
                onClick={() => setShowLogoutModal(false)}
              >
                취소
              </button>
              <button
                type="button"
                className={`${styles.logoutModalBtn} ${styles.logoutConfirm}`}
                onClick={() => {
                  logout();
                  setShowLogoutModal(false);
                  navigate('/login');
                }}
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
