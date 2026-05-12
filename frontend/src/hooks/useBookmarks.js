import { useState, useEffect, useCallback } from 'react';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const useBookmarks = () => {
  const { user, token, updateUser } = useAuth();
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());

  useEffect(() => {
    if (user?.bookmarks) {
      setBookmarkedIds(new Set(user.bookmarks.map(b => b.articleId)));
    }
  }, [user]);

  const isBookmarked = useCallback((articleId) => bookmarkedIds.has(articleId), [bookmarkedIds]);

  const toggleBookmark = useCallback(async (article) => {
    if (!token) {
      toast.error('Please login to bookmark articles');
      return;
    }

    const alreadyBookmarked = bookmarkedIds.has(article.articleId);

    try {
      if (alreadyBookmarked) {
        const { data } = await userAPI.removeBookmark(article.articleId);
        setBookmarkedIds(prev => { const n = new Set(prev); n.delete(article.articleId); return n; });
        updateUser({ ...user, bookmarks: data.bookmarks });
        toast.success('Bookmark removed');
      } else {
        const { data } = await userAPI.addBookmark(article);
        setBookmarkedIds(prev => new Set([...prev, article.articleId]));
        updateUser({ ...user, bookmarks: data.bookmarks });
        toast.success('Article bookmarked!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update bookmark');
    }
  }, [token, bookmarkedIds, user, updateUser]);

  return { isBookmarked, toggleBookmark, bookmarks: user?.bookmarks || [] };
};
