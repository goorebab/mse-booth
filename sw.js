/* 오프라인 저장: 처음 한 번 열면 모든 파일을 iPad에 저장해 두고, 이후엔 인터넷 없이 실행 */
const CACHE = "mse-booth-v1";
const FILES = [
  "./",
  "assets/GmarketSansBold.otf",
  "assets/GmarketSansMedium.otf",
  "assets/Pretendard-Bold.otf",
  "assets/Pretendard-Regular.otf",
  "assets/cover_atkins.jpg",
  "assets/cover_callister.jpg",
  "assets/cover_fried.jpg",
  "assets/cover_polychem.jpg",
  "assets/cover_sperling.jpg",
  "assets/icon-180.png",
  "assets/icon-192.png",
  "assets/icon-512.png",
  "assets/qr_instagram.svg",
  "index.html",
  "manifest.webmanifest",
  "research/fuelcell/index.html",
  "research/fuelcell/three.min.js",
  "research/semicon/index.html",
  "research/semicon/three.min.js",
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, {cache: "reload"})))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request, {ignoreSearch: true}).then(hit => hit || fetch(e.request).then(res => {
    if (res.ok && new URL(e.request.url).origin === location.origin) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); }
    return res;
  })));
});
