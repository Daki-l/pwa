const expectedCaches = ['static-v2']

self.addEventListener('install', event => {
    console.log('V2 installing…');
  
    // cache a cat SVG
    event.waitUntil(
    //   caches.open('static-v1').then(cache => cache.add('/img/cloudy.png')),
      caches.open('static-v2').then(cache =>cache.add('img/fog.png'))
    );
  });
  
  self.addEventListener('activate', event => {
    caches.keys().then(keys => Promise.all(
        keys.map(key => {
            if(!expectedCaches.includes(key)) {
                return caches.delete(key)
            }
        })
    )).then(() => {
        console.log('v2 is ready tohandle fetches')
    })
  });
  
  self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
  
    // serve the fog SVG from the cache if the request is
    // same-origin and the path is '/cloudy.svg'
    if (url.origin == location.origin && url.pathname == '/img/one.jpg') {
      event.respondWith(caches.match('/img/fog.png'));
    }
  });