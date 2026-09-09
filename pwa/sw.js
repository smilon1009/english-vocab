// 雅思背单词工作台 · 离线缓存 Service Worker
// 只缓存本站静态文件（页面/词库/库），Supabase 的请求一律放行走网络。
const CACHE = 'ev-shell-v5';
const ASSETS = [
  '../',
  '../index.html',
  '../js/words.js',
  '../js/words_ielts1.js',
  '../js/words_ielts2.js',
  '../js/words_ielts3.js',
  '../js/words_ielts4.js',
  '../js/words_ielts5.js',
  '../js/words_ielts6.js',
  '../js/config.js',
  '../lib/supabase.min.js',
  '../pwa/manifest.webmanifest',
  '../pwa/icon.svg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => Promise.all(ASSETS.map((a) => c.add(a).catch(() => true))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const u = new URL(req.url);
  if (u.origin !== self.location.origin) return;   // 只处理本站；Supabase 域名放行

  // 页面跳转：网络优先（保证每次部署更新都拿到最新），失败时回退到缓存的首页
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((r) => {
          const cp = r.clone();
          caches.open(CACHE).then((c) => c.put('../index.html', cp));
          return r;
        })
        .catch(() => caches.match('../index.html').then((r) => r || Response.error()))
    );
    return;
  }

  // 静态资源：缓存优先，后台静默更新
  e.respondWith(
    caches.match(req).then((hit) => {
      const net = fetch(req)
        .then((r) => {
          if (r && r.status === 200) {
            const cp = r.clone();
            caches.open(CACHE).then((c) => c.put(req, cp));
          }
          return r;
        })
        .catch(() => hit);
      return hit || net;
    })
  );
});
