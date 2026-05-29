import { useState, useEffect } from 'react';
import client from '../api/client';
import { sampleArticles, sampleCategories, sampleTags, sampleComments } from '../data/sampleData';

// Set to true to use sample data instead of API
const USE_SAMPLE_DATA = false;

const simulateDelay = (data, delay = 300) =>
  new Promise((resolve) => setTimeout(() => resolve(data), delay));

export function useArticles({ page = 0, size = 10, category, tag } = {}) {
  const [data, setData] = useState({ content: [], totalElements: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    if (USE_SAMPLE_DATA) {
      let filtered = [...sampleArticles];
      if (category) filtered = filtered.filter((a) => a.category?.slug === category);
      if (tag) filtered = filtered.filter((a) => a.tags?.some((t) => t.slug === tag));
      const content = filtered.slice(page * size, page * size + size);

      simulateDelay({
        content,
        totalElements: filtered.length,
        totalPages: Math.ceil(filtered.length / size),
      }).then((res) => {
        setData(res);
        setError(null);
      }).finally(() => setLoading(false));
      return;
    }

    let url = `/articles?page=${page}&size=${size}`;
    if (category) url = `/articles/category/${category}?page=${page}&size=${size}`;
    if (tag) url = `/articles/tag/${tag}?page=${page}&size=${size}`;

    client.get(url)
      .then((res) => {
        setData({
          content: res.content || res.records || [],
          totalElements: res.totalElements ?? res.total ?? 0,
          totalPages: res.totalPages ?? res.pages ?? 0,
        });
        setError(null);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [page, size, category, tag]);

  return { ...data, loading, error };
}

export function useArticle(slug) {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    if (USE_SAMPLE_DATA) {
      simulateDelay(sampleArticles.find((a) => a.slug === slug) || null)
        .then((res) => { setArticle(res); setError(null); })
        .finally(() => setLoading(false));
      return;
    }

    client.get(`/articles/${slug}`)
      .then((res) => { setArticle(res); setError(null); })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [slug]);

  return { article, loading, error };
}

export function useCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (USE_SAMPLE_DATA) {
      simulateDelay(sampleCategories).then(setCategories);
      return;
    }

    client.get('/categories')
      .then((res) => setCategories(res || []))
      .catch(() => {});
  }, []);

  return categories;
}

export function useTags() {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (USE_SAMPLE_DATA) {
      simulateDelay(sampleTags).then(setTags);
      return;
    }

    client.get('/tags')
      .then((res) => setTags(res || []))
      .catch(() => {});
  }, []);

  return tags;
}

export function useFeaturedArticles() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    if (USE_SAMPLE_DATA) {
      simulateDelay(sampleArticles.filter((a) => a.featured)).then(setArticles);
      return;
    }

    client.get('/articles/featured')
      .then((res) => setArticles(res || []))
      .catch(() => {});
  }, []);

  return articles;
}

export function useComments(articleId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!articleId) return;
    setLoading(true);

    if (USE_SAMPLE_DATA) {
      simulateDelay(sampleComments.filter((c) => c.articleId === articleId && c.approved))
        .then((res) => { setComments(res); setLoading(false); });
      return;
    }

    client.get(`/comments/article/${articleId}`)
      .then((res) => setComments(res || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [articleId]);

  return { comments, loading };
}
