/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      {
        // Business card QR — lands on the full pitch (photos, reviews, booking).
        // src tag makes card scans visible in analytics. Re-point here anytime
        // without reprinting cards.
        source: '/card',
        destination: '/?src=card',
        permanent: false,
      },
      {
        // Review funnel for seat-back / card QRs: print summitoahu.com/review,
        // never Google's own URL, so the target can change without reprinting.
        // 302 (permanent:false) on purpose — a 301 gets cached by phones.
        // Keep in sync with SITE.reviews.googleWrite in src/lib/site.ts.
        source: '/review',
        destination: 'https://g.page/r/CUWNj1mOJo0SEAE/review',
        permanent: false,
      },
      {
        source: '/REVIEW',
        destination: 'https://g.page/r/CUWNj1mOJo0SEAE/review',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
