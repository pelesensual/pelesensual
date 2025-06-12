document.addEventListener('DOMContentLoaded', function() {
    // Botão de alternância Varejo/Atacado
    const retailModeButton = document.getElementById('retail-mode');
    const wholesaleModeButton = document.getElementById('wholesale-mode');

    retailModeButton.addEventListener('click', function() {
        retailModeButton.classList.add('active');
        wholesaleModeButton.classList.remove('active');
    });

    wholesaleModeButton.addEventListener('click', function() {
        wholesaleModeButton.classList.add('active');
        retailModeButton.classList.remove('active');
    });

    // Banner rotativo
    let slideIndex = 0;
    const slides = document.querySelectorAll('.banner-slide');
    const dots = document.querySelectorAll('.banner-dots .banner-dot');

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }

    function nextSlide() {
        slideIndex++;
        if (slideIndex >= slides.length) {
            slideIndex = 0;
        }
        showSlide(slideIndex);
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            slideIndex = index;
            showSlide(slideIndex);
        });
    });

    setInterval(nextSlide, 5000);

    // Carrinho
    const cartButton = document.querySelector('.cart-button');
    const cart = document.querySelector('.cart');
    const cartCloseButton = document.querySelector('.cart-close');
    const continueShoppingButton = document.querySelector('.continue-shopping');
    const checkoutButton = document.querySelector('.checkout-button');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalValue = document.querySelector('.cart-total-value');
    let cartItems = [];

    cartButton.addEventListener('click', () => {
        cart.classList.add('active');
    });

    cartCloseButton.addEventListener('click', () => {
        cart.classList.remove('active');
    });

    continueShoppingButton.addEventListener('click', () => {
        cart.classList.remove('active');
    });

    function updateCartTotal() {
        let total = 0;
        cartItems.forEach(item => {
            total += item.price * item.quantity;
        });
        cartTotalValue.textContent = `R$ ${total.toFixed(2)}`;
    }

    function displayCartItem(item) {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item');
        cartItemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>Tamanho: ${item.size}</p>
                <p>Quantidade: ${item.quantity}</p>
                <p>R$ ${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <button class="btn btn-remove" data-id="${item.id}">Remover</button>
        `;
        cartItemsContainer.appendChild(cartItemDiv);

        const removeButton = cartItemDiv.querySelector('.btn-remove');
        removeButton.addEventListener('click', () => {
            cartItems = cartItems.filter(cartItem => cartItem.id !== item.id);
            cartItemDiv.remove();
            updateCartTotal();
        });
    }

    function updateCartDisplay() {
        cartItemsContainer.innerHTML = '';
        cartItems.forEach(item => {
            displayCartItem(item);
        });
        updateCartTotal();
    }

    // Modal de Seleção de Tamanho
    const sizeModal = document.getElementById('size-modal');
    const modalProductName = document.getElementById('modal-product-name');
    const modalProductImage = document.getElementById('modal-product-image');
    const modalProductPrice = document.getElementById('modal-product-price');
    const modalProductRef = document.getElementById('modal-product-ref');
    const sizeSelect = document.getElementById('size-select');
    const quantityInput = document.getElementById('quantity-input');
    const confirmAddToCartButton = document.getElementById('confirm-add-to-cart');
    const cancelModalButton = document.getElementById('cancel-modal');
    const decreaseQtyButton = document.getElementById('decrease-qty');
    const increaseQtyButton = document.getElementById('increase-qty');
    const modalCloseButton = document.querySelector('.modal-close');

    let selectedProductId;
    let selectedProductName;
    let selectedProductPrice;
    let selectedProductImage;

    // Função para abrir o modal
    function openSizeModal(productId, productName, productPrice, productImage) {
        selectedProductId = productId;
        selectedProductName = productName;
        selectedProductPrice = productPrice;
        selectedProductImage = productImage;

        modalProductName.textContent = productName;
        modalProductImage.src = productImage;
        modalProductPrice.textContent = `Preço: R$ ${productPrice}`;
        modalProductRef.textContent = `REF: ${productId}`;

        // Limpar e preencher as opções de tamanho (exemplo)
        sizeSelect.innerHTML = '<option value="">Selecione o tamanho</option>';
        ['P', 'M', 'G', 'GG'].forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size;
            sizeSelect.appendChild(option);
        });

        quantityInput.value = 1; // Resetar a quantidade

        sizeModal.classList.add('active');
    }

    // Evento para fechar o modal
    function closeSizeModal() {
        sizeModal.classList.remove('active');
    }

    // Evento para adicionar ao carrinho após a seleção
    confirmAddToCartButton.addEventListener('click', () => {
        const selectedSize = sizeSelect.value;
        const quantity = parseInt(quantityInput.value);

        if (!selectedSize) {
            alert('Por favor, selecione um tamanho.');
            return;
        }

        if (isNaN(quantity) || quantity <= 0) {
            alert('Por favor, insira uma quantidade válida.');
            return;
        }

        const newItem = {
            id: selectedProductId + '-' + selectedSize, // ID único
            name: selectedProductName,
            price: selectedProductPrice,
            image: selectedProductImage,
            size: selectedSize,
            quantity: quantity
        };

        cartItems.push(newItem);
        updateCartDisplay();
        closeSizeModal();
    });

    // Eventos dos botões de controle de quantidade
    decreaseQtyButton.addEventListener('click', () => {
        let qty = parseInt(quantityInput.value);
        if (qty > 1) {
            quantityInput.value = qty - 1;
        }
    });

    increaseQtyButton.addEventListener('click', () => {
        let qty = parseInt(quantityInput.value);
        quantityInput.value = qty + 1;
    });

    // Evento para fechar o modal ao clicar no "x"
    modalCloseButton.addEventListener('click', closeSizeModal);

    // Evento para cancelar o modal
    cancelModalButton.addEventListener('click', closeSizeModal);

    // Adicionar produtos ao carrinho
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.id;
            const productName = button.dataset.name;
            const productPrice = parseFloat(button.dataset.price);
            const productImage = button.dataset.image;

            openSizeModal(productId, productName, productPrice, productImage);
        });
    });

    // PagSeguro Checkout (simulação)
    checkoutButton.addEventListener('click', () => {
        alert('Checkout simulado. Implemente a lógica real do PagSeguro aqui.');
    });
});
