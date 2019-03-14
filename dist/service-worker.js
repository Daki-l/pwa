importScripts("./precache-manifest.49288a73fa4a5d590d340febec4beefa.js");


        importScripts('./static/workbox-v3.6.3/workbox-sw.js');
        workbox.setConfig({
            modulePathPrefix: './static/workbox-v3.6.3/'
        });
    /**
 * @file service-worker.js with workbox api
 * @desc [example](https://workbox-samples.glitch.me/examples/workbox-sw/)
 * @author David liu(dorismartin12437@gmail.com)
 */

/* globals workbox */
workbox.core.setCacheNameDetails({
    prefix: 'lavas-cache',
    suffix: 'v1',
    precache: 'install-time',
    runtime: 'run-time',
    googleAnalytics: 'ga'
});
workbox.skipWaiting();
workbox.clientsClaim();
console.log(workbox, self.__precacheManifest)
workbox.precaching.precacheAndRoute(self.__precacheManifest || []);
// workbox.precache();

/**
 * example runningCache with api
 */
// `https://www.apiopen.top/weatherApi?city=${v}`
workbox.routing.registerRoute(/^https/,
    workbox.strategies.networkFirst());


/**
 * example runningCache with resources from CDN
 * including maxAge, maxEntries
 * cacheableResponse is important for CDN
 */
workbox.routing.registerRoute(/^https/i,
    workbox.strategies.cacheFirst({
        cacheName: 'lavas-cache-images',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 100,
                maxAgeSeconds: 7 * 24 * 60 * 60
            }),
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200]
            })
        ]
    })
);
undefined
