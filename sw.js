// sw.js - Service Worker لتشغيل التطبيق بدون إنترنت

// تحديد المسار الأساسي (base path) تلقائياً
const BASE_PATH = self.location.pathname.replace('sw.js', '');
const CACHE_NAME = 'montessori-earth-walk-v1';

// الملفات التي سيتم تخزينها مؤقتاً (باستخدام مسارات نسبية)
const urlsToCache = [
  BASE_PATH,
  BASE_PATH + 'index.html',
  BASE_PATH + 'css/style.css',
  BASE_PATH + 'css/mobile-responsive.css',
  BASE_PATH + 'js/main.js',
  BASE_PATH + 'js/earth-walk.js',
  BASE_PATH + 'js/quiz.js',
  BASE_PATH + 'js/garden.js',
  BASE_PATH + 'js/storage.js',
  BASE_PATH + 'js/tts.js',
  BASE_PATH + 'js/utils.js',
  BASE_PATH + 'js/certificate.js',
  BASE_PATH + 'data/questions.json',
  BASE_PATH + 'assets/images/default-avatar.png'
];

// تثبيت Service Worker وتخزين الملفات
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('Cache error:', err))
  );
  self.skipWaiting();
});

// اعتراض الطلبات وتقديم النسخة المخزنة
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
          return caches.match(BASE_PATH + 'index.html');
        });
      })
  );
});

// تحديث الـ Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
);
