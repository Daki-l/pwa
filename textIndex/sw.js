let CACHE_VERSION = '1.0.1';
const CURRENT_CACHES = {
    prefetch: 'wheater-v' + CACHE_VERSION
};
var urlsToPrefetch = [
    './base.css',
    './index.css',
    './index.html',
    './sw.js',
    './static/jquery.min.js',
    './images/icon.png',
    './images/badge.png'
  ];

  self.addEventListener('install', event => {
    console.log('[ServiceWorker] installing');
    event.waitUntil(
        caches.open(CURRENT_CACHES['prefetch']).then(cache => {
            cache.addAll(
                urlsToPrefetch.map(urlToPrefetch => {
                    return new Request(urlToPrefetch, {mode: 'no-cors'});
                })
            ).then(() => {
                console.log('全部缓存成功');
            }).catch(err => {
                console.log('缓存失败', err);
            })
        })
    )
});

self.addEventListener('activate', e => {
    console.log('[ServiceWorker] activated');
    e.waitUntil(
        // 判断版本是否和当前版本对应，不对应的话删除旧的cache
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map(key => {
                if (key !== CURRENT_CACHES.prefetch) {
                    console.log('[ServiceWorker] 删除旧的cache', key);
                    // return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

// 实现离线缓存，拦截请求，并判断请求是否已在缓存中，有的话就使用缓存的数据
self.addEventListener('fetch', event => {
    console.log('[ServiceWorker] Fetch', event.request.url);
    event.respondWith(
      caches.open(CURRENT_CACHES.prefetch)
        .then(cache => cache.match(event.request, {ignoreSearch: true}))
        .then(response => {
        return response || fetch(event.request);
      })
    );
});

//在我们触发推送消息后，浏览器会收到推送消息，弄明白推送的服务工作线程，然后再唤醒相应的服务线程并分配推送事件。我们需要侦听此事件，显示通知作为结果。
self.addEventListener('push', function(event) {
    console.log('[Service Worker] 消息推送push.');
    console.log(`[Service Worker] 将push这个数据 "${event.data.text()}"`);
  
    const title = '消息推送！';
    const options = {
      body: '你有一个新的消息提示，请前往查看!',
      icon: 'images/icon.png',
      badge: 'images/badge.png'
    };
  
    event.waitUntil(self.registration.showNotification(title, options));
});

//如果您点击以下其中一个通知，会发现没有发生任何事情。我们可以通过侦听服务工作线程中的 notificationclick 事件，处理通知点击。
self.addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Notification 点击事件.');
  
    event.notification.close();
  
    event.waitUntil(
      clients.openWindow('https://www.baidu.com')
    );
  });