// Funcionalidade para zoom de imagens com passador
document.addEventListener('DOMContentLoaded', function() {
    // Configurações
    const config = {
        modalClass: 'image-modal',
        activeClass: 'active',
        thumbnailClass: 'modal-thumbnail',
        mainImageClass: 'modal-main-image',
        zoomIconClass: 'zoom-icon',
        productCardSelector: '.product-card img, .category-card img, .product-main-image',
        paths: {
            isProductPage: () => window.location.pathname.includes('produto.html'),
            getBasePath: () => config.paths.isProductPage() ? '' : './'
        }
    };

    // Criar o modal de imagem com passador
    const imageModal = createImageModal();
    document.body.appendChild(imageModal);

    // Estado do modal
    const modalState = {
        currentProductId: null,
        currentImageIndex: 0,
        productImages: [],
        isModalOpen: false
    };

    // Criar estrutura do modal
    function createImageModal() {
        const modal = document.createElement('div');
        modal.classList.add(config.modalClass);
        modal.innerHTML = `
            <button class="close-button">&times;</button>
            <div class="modal-content">
                <button class="nav-button prev-button"><i class="fas fa-chevron-left"></i></button>
                <div class="main-image-container">
                    <img src="" alt="Imagem ampliada" class="${config.mainImageClass}">
                </div>
                <button class="nav-button next-button"><i class="fas fa-chevron-right"></i></button>
            </div>
            <div class="modal-thumbnails"></div>
        `;
        return modal;
    }

    // Função para carregar imagens no modal com tratamento de erros
    function loadImagesIntoModal(productId, mainImageSrc) {
        try {
            const thumbnailsContainer = imageModal.querySelector('.modal-thumbnails');
            thumbnailsContainer.innerHTML = '';
            
            modalState.productImages = productId ? getProductImages(productId) : [mainImageSrc];
            modalState.currentImageIndex = Math.max(0, modalState.productImages.findIndex(img => img === mainImageSrc));
            
            updateMainImage();
            updateThumbnails();
            updateNavigationButtons();
        } catch (error) {
            console.error('Erro ao carregar imagens:', error);
            cart.showMessage('Erro ao carregar as imagens. Por favor, tente novamente.');
        }
    }

    // Atualizar imagem principal
    function updateMainImage() {
        const modalMainImage = imageModal.querySelector(`.${config.mainImageClass}`);
        if (modalMainImage && modalState.productImages[modalState.currentImageIndex]) {
            modalMainImage.src = modalState.productImages[modalState.currentImageIndex];
        }
    }

    // Atualizar miniaturas
    function updateThumbnails() {
        const thumbnailsContainer = imageModal.querySelector('.modal-thumbnails');
        if (modalState.productImages.length <= 1) return;

        modalState.productImages.forEach((imgSrc, index) => {
            const thumbnail = createThumbnail(imgSrc, index);
            thumbnailsContainer.appendChild(thumbnail);
        });
    }

    // Criar miniatura individual
    function createThumbnail(imgSrc, index) {
        const thumbnail = document.createElement('div');
        thumbnail.classList.add(config.thumbnailClass);
        if (index === modalState.currentImageIndex) {
            thumbnail.classList.add(config.activeClass);
        }

        thumbnail.innerHTML = `<img src="${imgSrc}" alt="Miniatura ${index + 1}">`;
        thumbnail.addEventListener('click', (event) => {
            event.stopPropagation();
            modalState.currentImageIndex = index;
            updateModalImage();
        });

        return thumbnail;
    }

    // Atualizar botões de navegação
    function updateNavigationButtons() {
        const [prevButton, nextButton] = [
            imageModal.querySelector('.prev-button'),
            imageModal.querySelector('.next-button')
        ];

        const shouldShowButtons = modalState.productImages.length > 1;
        prevButton.style.display = shouldShowButtons ? 'block' : 'none';
        nextButton.style.display = shouldShowButtons ? 'block' : 'none';
    }

    // Atualizar imagem do modal
    function updateModalImage() {
        updateMainImage();
        
        const thumbnails = imageModal.querySelectorAll(`.${config.thumbnailClass}`);
        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle(config.activeClass, index === modalState.currentImageIndex);
        });
    }

    // Adicionar zoom às imagens
    function initializeProductImages() {
        const productImages = document.querySelectorAll(config.productCardSelector);
        
        productImages.forEach(img => {
            const zoomIcon = createZoomIcon();
            setupImageContainer(img);
            img.parentElement.appendChild(zoomIcon);

            // Eventos de zoom
            [img, zoomIcon].forEach(element => {
                element.addEventListener('click', (event) => handleImageClick(event, img));
            });
        });
    }

    // Criar ícone de zoom
    function createZoomIcon() {
        const zoomIcon = document.createElement('div');
        zoomIcon.classList.add(config.zoomIconClass);
        zoomIcon.innerHTML = '<i class="fas fa-search-plus"></i>';
        return zoomIcon;
    }

    // Configurar container da imagem
    function setupImageContainer(img) {
        const parent = img.parentElement;
        if (getComputedStyle(parent).position !== 'relative') {
            parent.style.position = 'relative';
        }
    }

    // Manipular clique na imagem
    function handleImageClick(event, img) {
        if (event.target.closest('.add-to-cart')) return;

        const productId = getProductIdFromContext(img);
        loadImagesIntoModal(productId, img.src);
        openModal();
    }

    // Obter ID do produto do contexto
    function getProductIdFromContext(img) {
        if (config.paths.isProductPage()) {
            return new URLSearchParams(window.location.search).get('id');
        }

        const productCard = img.closest('.product-card');
        return productCard?.querySelector('.add-to-cart')?.getAttribute('data-id') || null;
    }

    // Controles do modal
    function setupModalControls() {
        const prevButton = imageModal.querySelector('.prev-button');
        const nextButton = imageModal.querySelector('.next-button');
        const closeButton = imageModal.querySelector('.close-button');

        prevButton.addEventListener('click', (event) => {
            event.stopPropagation();
            navigateImages('prev');
        });

        nextButton.addEventListener('click', (event) => {
            event.stopPropagation();
            navigateImages('next');
        });

        closeButton.addEventListener('click', (event) => {
            event.stopPropagation();
            closeModal();
        });

        // Fechar ao clicar fora
        imageModal.addEventListener('click', (event) => {
            if (!event.target.closest('.modal-content') && 
                !event.target.closest('.modal-thumbnails') && 
                event.target !== closeButton) {
                closeModal();
            }
        });

        // Navegação por teclado
        document.addEventListener('keydown', handleKeyboardNavigation);
    }

    // Navegação entre imagens
    function navigateImages(direction) {
        const totalImages = modalState.productImages.length;
        if (direction === 'prev') {
            modalState.currentImageIndex = (modalState.currentImageIndex > 0) ? 
                modalState.currentImageIndex - 1 : totalImages - 1;
        } else {
            modalState.currentImageIndex = (modalState.currentImageIndex < totalImages - 1) ? 
                modalState.currentImageIndex + 1 : 0;
        }
        updateModalImage();
    }

    // Manipular navegação por teclado
    function handleKeyboardNavigation(event) {
        if (!modalState.isModalOpen) return;

        switch (event.key) {
            case 'Escape':
                closeModal();
                break;
            case 'ArrowLeft':
                navigateImages('prev');
                break;
            case 'ArrowRight':
                navigateImages('next');
                break;
        }
    }

    // Abrir modal
    function openModal() {
        modalState.isModalOpen = true;
        imageModal.classList.add(config.activeClass);
    }

    // Fechar modal
    function closeModal() {
        modalState.isModalOpen = false;
        imageModal.classList.remove(config.activeClass);
    }

    // Inicialização
    initializeProductImages();
    setupModalControls();
});
