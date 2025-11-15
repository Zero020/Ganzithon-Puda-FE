import { useState, useEffect } from 'react';
import './welfare_home.css';
import logo from '@/assets/logo.svg';
import icon_search from '@/assets/icon_search.svg';

//API
import { fetchPosts } from '@/api/welfareApi.js';

//Components
import PostCard from './postCard.jsx';

const SORT_OPTIONS = [
  { id: 'default', label: '기본' },
  { id: 'distance', label: '거리순' },
  { id: 'deadline', label: '마감임박순' },
];

export default function WelfareHome() {
  const [sortType, setSortType] = useState('default'); // 현재 선택된 정렬
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // sortType이 바뀔 때마다 목록 다시 불러오기
    setLoading(true);
    fetchPosts(sortType)
      .then((data) => {
        setPosts(data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [sortType]);

  return (
    <div className="welfare-container">
      <div className="topHeader">
        <img src={logo} alt="Logo" className="logo" />
        <label className="searchBar">
          <img src={icon_search} alt="돋보기" className="icon-search" />
          <input
            className="search-input"
            type="text"
            placeholder="가게를 검색해보세요."
          />
        </label>
      </div>

      <div className="sortFilter">
        {SORT_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`sortButton ${
              sortType === option.id ? 'is-active' : ''
            }`}
            onClick={() => setSortType(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {loading && <p className="loading-text">불러오는 중...</p>}

      <div className="post-list">
        {posts.map((post) => (
          <PostCard key={post.uuid} post={post} />
        ))}
      </div>
    </div>
  );
}
