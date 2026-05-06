// sw.js - Service Worker لتشغيل التطبيق بدون إنترنت
const CACHE_NAME = 'montessori-earth-walk-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/main.html',
  '/quiz.html',
  '/garden.html',
  '/profile.html',
  '/certificate.html',
  '/css/style.css',
  '/css/mobile-responsive.css',
  '/js/main.js',
  '/js/earth-walk.js',
  '/js/quiz.js',
  '/js/garden.js',
  '/js/storage.js',
  '/js/tts.js',
  '/js/utils.js',
  '/js/certificate.js',
  '/data/questions.json',
  '/assets/images/default-avatar.png'
];

// تثبيت Service Worker وتخزين الملفات
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// اعتراض الطلبات وتقديم النسخة المخزنة مؤقتاً
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// تحديث الـ Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});