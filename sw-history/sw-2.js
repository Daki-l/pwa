self.addEventListener('install', event => {
    console.log('V1 installing…');
  
    // cache a cat SVG
    event.waitUntil(
      caches.open('static-v1').then(cache => cache.add('/img/cloudy.png'))
    );
  });
  
  self.addEventListener('activate', event => {
    console.log('V1 now ready to handle fetches!');
  });
  
  self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
  
    // serve the cat SVG from the cache if the request is
    // same-origin and the path is '/img/one.jpg'
    if (url.origin == location.origin && url.pathname == '/img/one.jpg') {
      event.respondWith(caches.match('/img/cloudy.png'));
    }
  });