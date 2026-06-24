// CONFIGURAÇÃO DO REPOSITÓRIO
const USERNAME = '1UPz'; // <-- Substitua pelo seu usuário
const REPO = 'Startpage-wallpapers';
const FOLDER = 'wallpapers'; 

const apiUrl = `https://api.github.com/repos/${USERNAME}/${REPO}/contents/${FOLDER}`;

async function loadWallpaper() {
    try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        const files = await response.json();
        
        // Filtra para garantir que apenas extensões de imagem comuns sejam aceitas
        const images = files.filter(file => file.name.match(/\.(jfif|jpg|jpeg|png|webp|avif)$/i));
        
        if (images.length === 0) {
            console.warn("Nenhuma imagem encontrada na pasta 'wallpapers'.");
            return;
        }

        // Seleção aleatória
        const randomImage = images[Math.floor(Math.random() * images.length)];
        
        // Aplica o link de download direto da imagem ao fundo do body
        document.body.style.backgroundImage = `url('${randomImage.download_url}')`;
        
    } catch (error) {
        console.error("Erro ao buscar os wallpapers da API do GitHub:", error);
    }
}

// Executa a função assim que a página carregar
window.onload = loadWallpaper;