// Funcionalidade para zoom de imagens com passador
document.addEventListener('DOMContentLoaded', function() {
    // Criar o modal de imagem com passador
    const imageModal = document.createElement('div');
    imageModal.classList.add('image-modal');
    imageModal.innerHTML = `
        <button class="close-button">&times;</button>
        <div class="modal-content">
            <button class="nav-button prev-button"><i class="fas fa-chevron-left"></i></button>
            <div class="main-image-container">
                <img src="" alt="Imagem ampliada" class="modal-main-image">
            </div>
            <button class="nav-button next-button"><i class="fas fa-chevron-right"></i></button>
        </div>
        <div class="modal-thumbnails"></div>
    `;
    document.body.appendChild(imageModal);

    // Variáveis para controle do passador de imagens
    let currentProductId = null;
    let currentImageIndex = 0;
    let productImages = [];

    // Função para carregar imagens no modal
    function loadImagesIntoModal(productId, mainImageSrc) {
        // Limpar miniaturas anteriores
        const thumbnailsContainer = imageModal.querySelector('.modal-thumbnails');
        thumbnailsContainer.innerHTML = '';
        
        // Obter todas as imagens do produto
        if (productId) {
            // Estamos na página de produto
            productImages = getProductImages(productId);
        } else {
            // Estamos em outra página, usar apenas a imagem clicada
            productImages = [mainImageSrc];
        }
        
        // Encontrar o índice da imagem atual
        currentImageIndex = productImages.findIndex(img => img === mainImageSrc);
        if (currentImageIndex === -1) currentImageIndex = 0;
        
        // Definir a imagem principal
        const modalMainImage = imageModal.querySelector('.modal-main-image');
        modalMainImage.src = productImages[currentImageIndex];
        
        // Adicionar miniaturas apenas se houver mais de uma imagem
        if (productImages.length > 1) {
            productImages.forEach((imgSrc, index) => {
                const thumbnail = document.createElement('div');
                thumbnail.classList.add('modal-thumbnail');
                if (index === currentImageIndex) {
                    thumbnail.classList.add('active');
                }
                
                thumbnail.innerHTML = `<img src="${imgSrc}" alt="Miniatura ${index + 1}">`;
                thumbnail.addEventListener('click', function() {
                    currentImageIndex = index;
                    updateModalImage();
                });
                
                thumbnailsContainer.appendChild(thumbnail);
            });
        }
        
        // Mostrar ou ocultar botões de navegação
        const prevButton = imageModal.querySelector('.prev-button');
        const nextButton = imageModal.querySelector('.next-button');
        
        if (productImages.length <= 1) {
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
        } else {
            prevButton.style.display = 'block';
            nextButton.style.display = 'block';
        }
    }
    
    // Função para atualizar a imagem principal no modal
    function updateModalImage() {
        const modalMainImage = imageModal.querySelector('.modal-main-image');
        modalMainImage.src = productImages[currentImageIndex];
        
        // Atualizar miniaturas ativas
        const thumbnails = imageModal.querySelectorAll('.modal-thumbnail');
        thumbnails.forEach((thumb, index) => {
            if (index === currentImageIndex) {
                thumb.classList.add('active');
            } else {
                thumb.classList.remove('active');
            }
        });
    }
    
    // Função para obter todas as imagens de um produto
    function getProductImages(productId) {
        // Dados dos produtos (mesmos dados do main.js)
        const products = {
            '016': {
                image: '../images/calca_microfibra_frente_1.png',
                additionalImages: [
                    '../images/calca_microfibra_frente_2.png',
                    '../images/calca_microfibra_costas_1.png',
                    '../images/calca_microfibra_costas_2.png',
                    '../images/calca_microfibra_016.png'
                ]
            },
            '012': {
                image: '../images/calcola_modal_frente_1.png',
                additionalImages: [
                    '../images/calcola_modal_costas_1.png',
                    '../images/calça modal.png', 
                    '../images/calça modal 2.png',
                    '../images/calca_modal_012.png'
                ]
            },
            '013': {
                image: '../images/pala_cotton_frente_1.png',
                additionalImages: [
                    '../images/pala_cotton_costas_1.png',
                    '../images/pala_cotton_detalhes.png',
                    '../images/pala_cotton_013.png'
                ]
            },
            '050': {
                image: '../images/fio_pala_dupla_050.png',
                additionalImages: []
            },
            '023': {
                image: '../images/calca_plus_023.png',
                additionalImages: []
            },
            '052': {
                image: '../images/fio_largo_frente_1.png',
                additionalImages: [
                    '../images/fio_largo_costas_1.png',
                    '../images/fio_largo_052.png'
                ]
            },
            '1020': {
                image: '../images/calca_lateral_dupla_1020.png',
                additionalImages: []
            },
            '002': {
                image: '../images/infantil_trix_frente_1.png',
                additionalImages: [
                    '../images/infantil_trix_costas_1.png',
                    '../images/infantil_trix_002.png'
                ]
            },
            '014': {
                image: '../images/tanga_lari_frente_1.png',
                additionalImages: [
                    '../images/tanga_lari_costas_1.png'
                ]
            },
            '026': {
                image: '../images/box_feminina/box_feminina_frente_1.png',
                additionalImages: [
                    '../images/box_feminina/box_feminina_traseira_1.png',
                    '../images/box_feminina/box_feminina_detalhe_1.jpg'
                ]
            },
            'caixa': {
                image: '../images/caixa_embalagem.png',
                additionalImages: []
            }
        };
        
        // Verificar se estamos na página de produto ou na página inicial
        const isProductPage = window.location.pathname.includes('produto.html');
        const basePath = isProductPage ? '' : './';
        
        // Ajustar caminhos das imagens se estiver na página inicial
        if (!isProductPage) {
            Object.keys(products).forEach(key => {
                products[key].image = products[key].image.replace('../', basePath);
                products[key].additionalImages = products[key].additionalImages.map(img => 
                    img.replace('../', basePath)
                );
            });
        }
        
        if (products[productId]) {
            return [products[productId].image, ...products[productId].additionalImages];
        }
        
        return [];
    }

    // Adicionar ícones de zoom a todas as imagens de produtos
    const allProductImagesOnPage = document.querySelectorAll(".product-card img, .category-card img, .product-main-image");
    allProductImagesOnPage.forEach(img => {
        // Adicionar ícone de zoom
        const zoomIcon = document.createElement('div');
        zoomIcon.classList.add('zoom-icon');
        zoomIcon.innerHTML = '<i class="fas fa-search-plus"></i>';
        
        // Verificar se o elemento pai já tem position relative
        if (getComputedStyle(img.parentElement).position !== 'relative') {
            img.parentElement.style.position = 'relative';
        }
        
        img.parentElement.appendChild(zoomIcon);

        // Adicionar evento de clique na imagem e no ícone
        function openImageModal() {
            // Determinar o ID do produto
            let productId = null;
            
            // Verificar se estamos na página de produto
            if (window.location.pathname.includes('produto.html')) {
                const urlParams = new URLSearchParams(window.location.search);
                productId = urlParams.get('id');
            } else {
                // Tentar obter o ID do produto do botão "Adicionar ao Carrinho" mais próximo
                const productCard = img.closest('.product-card');
                if (productCard) {
                    const addToCartButton = productCard.querySelector('.add-to-cart');
                    if (addToCartButton) {
                        productId = addToCartButton.getAttribute('data-id');
                    }
                }
            }
            
            // Carregar imagens no modal
            loadImagesIntoModal(productId, img.src);
            
            // Mostrar o modal
            imageModal.classList.add('active');
        }
        
        img.addEventListener('click', openImageModal);
        zoomIcon.addEventListener('click', openImageModal);
    });

    // Navegação entre imagens
    const prevButton = imageModal.querySelector('.prev-button');
    const nextButton = imageModal.querySelector('.next-button');
    
    prevButton.addEventListener('click', function() {
        if (currentImageIndex > 0) {
            currentImageIndex--;
        } else {
            currentImageIndex = productImages.length - 1;
        }
        updateModalImage();
    });
    
    nextButton.addEventListener('click', function() {
        if (currentImageIndex < productImages.length - 1) {
            currentImageIndex++;
        } else {
            currentImageIndex = 0;
        }
        updateModalImage();
    });

    // Fechar o modal ao clicar no botão de fechar
    const closeButton = imageModal.querySelector('.close-button');
    closeButton.addEventListener('click', function() {
        imageModal.classList.remove('active');
    });

    // Fechar o modal ao clicar fora da imagem
    imageModal.addEventListener('click', function(e) {
        if (!e.target.closest('.modal-content') && 
            !e.target.closest('.modal-thumbnails') && 
            e.target !== closeButton) {
            imageModal.classList.remove('active');
        }
    });

    // Fechar o modal ao pressionar a tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && imageModal.classList.contains('active')) {
            imageModal.classList.remove('active');
        }
    });
    
    // Navegação com teclado quando o modal estiver aberto
    document.addEventListener('keydown', function(e) {
        if (!imageModal.classList.contains('active')) return;
        
        if (e.key === 'ArrowLeft') {
            prevButton.click();
        } else if (e.key === 'ArrowRight') {
            nextButton.click();
        }
    });
});
