// CONFIGURAÇÃO DO REPOSITÓRIO
const USERNAME = '1UPz'; // <-- Substitua pelo seu usuário
const REPO = 'Startpage-wallpapers';
const FOLDER = 'wallpapers'; 

const apiUrl = `https://api.github.com/repos/${USERNAME}/${REPO}/contents/${FOLDER}`;

// Registrar o Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker registrado com sucesso.'))
            .catch(err => console.error('Erro ao registrar Service Worker:', err));
    });
}

async function loadWallpaper() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Erro: ${response.status}`);

        const files = await response.json();
        const images = files.filter(file => file.name.match(/\.(jfif|jpg|jpeg|png|webp|avif)$/i));
        
        if (images.length === 0) return;

        // 1. Escolhe e aplica o wallpaper atual normalmente
        const randomImage = images[Math.floor(Math.random() * images.length)];
        document.body.style.backgroundImage = `url('${randomImage.download_url}')`;

        // 2. Envia a lista de todas as URLs de imagens para o Service Worker colocar em cache em segundo plano
        if (navigator.serviceWorker.controller) {
            const imageUrls = images.map(img => img.download_url);
            navigator.serviceWorker.controller.postMessage({
                action: 'cacheImages',
                urls: imageUrls
            });
        }
        
    } catch (error) {
        console.error("Erro ao buscar os wallpapers:", error);
    }
}

window.onload = loadWallpaper;