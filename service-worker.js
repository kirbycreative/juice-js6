self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('v1').then((cache) => {
        return cache.addAll([
          './sw-test/',
          './sw-test/index.html',
          './sw-test/style.css',
          './sw-test/app.js',
          './sw-test/image-list.js',
          './sw-test/star-wars-logo.jpg',
          './sw-test/gallery/',
          './sw-test/gallery/bountyHunters.jpg',
          './sw-test/gallery/myLittleVader.jpg',
          './sw-test/gallery/snowTroopers.jpg'
        ]);
      })
    );
  });

  self.addEventListener('fetch', (event) => {
    event.respondWith(
      // magic goes here
    );
  });

  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((resp) => {
        return resp || fetch(event.request).then((response) => {
          let responseClone = response.clone();
          caches.open('v1').then((cache) => {
            cache.put(event.request, responseClone);
          });
  
          return response;
        }).catch(() => {
          return caches.match('./sw-test/gallery/myLittleVader.jpg');
        })
      });
    );
  });


  self.addEventListener('activate', (event) => {
    var cacheKeeplist = ['v2'];
  
    event.waitUntil(
      caches.keys().then((keyList) => {
        return Promise.all(keyList.map((key) => {
          if (cacheKeeplist.indexOf(key) === -1) {
            return caches.delete(key);
          }
        }));
      })
    );
  });