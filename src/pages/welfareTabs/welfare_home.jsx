import { useState, useEffect } from 'react';
import styles from './welfare_home.module.css';

import logo from '@/assets/logo.svg';
import logoText from '@/assets/logo_text.svg';
import iconSearch from '@/assets/icon_search.svg';

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

  useEffect(() => {
    setLoading(true);

    fetchPosts(sortType)
      .then((data) => {
        setPosts(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [sortType]);

  return (
    <div className={styles.welfareContainer}>
      {/* 상단 헤더 */}
      <div className={styles.topHeader}>
        <div className={styles.logoBox}>
          <img src={logo} alt="Logo" className={styles.logo} />
          <img src={logoText} alt="Logo Text" className={styles.logoText} />
        </div>

        <label className={styles.searchBar}>
          <img src={iconSearch} alt="돋보기" className={styles.iconSearch} />
          <input
            className={styles.searchInput}
            type="text"
            placeholder="가게를 검색해보세요."
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

      {/* 게시글 리스트 */}
      <div className={styles.postList}>
        {posts.map((post) => (
          <PostCard key={post.postId} post={post} />
        ))}
      </div>
    </div>
  );
}
