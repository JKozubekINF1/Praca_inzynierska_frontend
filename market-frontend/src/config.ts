export const API_BASE_URL = 'https://localhost:7143';

export const getImageUrl = (path?: string | null) => {
  if (!path) return '/placeholder-image.png';
  if (path.startsWith('http')) return path;

  return `${API_BASE_URL}${path}`;
};
