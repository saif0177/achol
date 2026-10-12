import React from 'react';

export const FALLBACK_SARIE_IMAGE = '/src/assets/images/product_jamdani_crimson_red_1791268726175.jpg';
export const FALLBACK_BANNER_IMAGE = '/src/assets/images/hero_jamdani_craft_1791268697306.jpg';

/**
 * Gracefully handles image load errors in <img> elements by substituting
 * a reliable authentic handloom saree asset and preventing infinite retry loops.
 */
export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackUrl: string = FALLBACK_SARIE_IMAGE
) => {
  const target = e.currentTarget;
  if (target.dataset.hasFailed) return;
  target.dataset.hasFailed = 'true';
  target.src = fallbackUrl;
};

/**
 * Normalizes image paths to ensure consistent loading across development,
 * preview links, and production container builds.
 */
export const getSafeImageUrl = (url?: string, fallback: string = FALLBACK_SARIE_IMAGE): string => {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return fallback;
  }
  return url.trim();
};
