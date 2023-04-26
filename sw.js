self.addEventListener("install",e => {
    console.log("Installed successfully");
    e.waitUntil(
        caches.open("static").then(cache => {
            return cache.addAll(["./","./src/style.css","./images/logo192.png","./src/bg.jpg","./src/config.js","./src/index.js","./src/script.js","/index.html","./manifest.json"])
        })
    );
});

self.addEventListener("fetch", e => {
    console.log(`intercepting fetch request for: ${e.request.url}`);
    e.respondWith(
        caches.match(e.request).then(response => {
            return response || fetch(e.request);
        })
    )
});