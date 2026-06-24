const CACHE_NAME = 'startpage-wallpapers-v1';

// Ouve mensagens enviadas pelo script.js principal
self.addEventListener('message', (event) => {
    if (event.data && event.data.action === 'cacheImages') {
        const urlsToCache = event.data.urls;

        // Abre o cache e adiciona apenas as imagens que ainda não estão salvas
        caches.open(CACHE_NAME).then((cache) => {
            urlsToCache.forEach((url) => {
                cache.match(url).then((response) => {
                    if (!response) {
                        // Se não estiver no cache, baixa e armazena
                        cache.add(url).then(() => {
                            console.log(`Imagem cacheada com sucesso: ${url}`);
                        }).catch(err => console.warn(`Falha ao cachear: ${url}`, err));
                    }
                });
            });
        });
    }
});

// Intercepta as requisições do navegador
self.addEventListener('fetch', (event) => {
    // Aplica a estratégia apenas para as imagens dos wallpapers
    if (event.request.url.includes('objects') || event.request.url.includes('githubusercontent')) {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                // Retorna do cache se existir; caso contrário, busca na rede
                return cachedResponse || fetch(event.request).then((networkResponse) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        // Salva no cache para a próxima vez
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                });
            })
        );
    }
});