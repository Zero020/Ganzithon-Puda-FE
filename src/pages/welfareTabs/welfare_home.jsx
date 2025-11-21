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

const SORT_OPTIONS = [
  { id: 'default', label: '기본' },
  { id: 'distance', label: '거리순' },
  { id: 'deadline', label: '마감임박순' },
];

export default function WelfareHome() {
  const [sortType, setSortType] = useState('default');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);

    fetchPosts(sortType)
      .then((data) => {
        setPosts(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [sortType]);

  // 검색어 + 정렬 결과 기반으로 필터링
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
              onClick={() => setShowLogoutModal(true)} //모달 열기
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

      {/* 정렬 필터 */}
      <div className={styles.sortFilter}>
        {SORT_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`${styles.sortButton} ${
              sortType === option.id ? styles.sortButtonActive : ''
            }`}
            onClick={() => setSortType(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* 로딩 */}
      {loading && <p>불러오는 중...</p>}

      {/* 검색 결과 없음 */}
      {hasNoResult && !loading && <p>검색 결과가 없습니다.</p>}

      {/* 게시글 리스트 */}
      <div className={styles.postList}>
        {filteredPosts.map((post) => (
          <PostCard key={post.productId} post={post} />
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
                  logout(); // 로그인 정보 삭제
                  setShowLogoutModal(false);
                  navigate('/login'); // 로그인 페이지로 이동
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
