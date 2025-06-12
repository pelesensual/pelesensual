document.addEventListener('DOMContentLoaded', function() {
    // Defina o cart no topo, para ser global dentro deste escopo
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');

    // Função utilitária para abrir o modal de seleção
    function openSizeModal(product) {
        document.getElementById('modal-product-name').textContent = product.name;
        document.getElementById('modal-product-image').src = product.image;
        document.getElementById('modal-product-price').textContent = `Preço: R$ ${product.price}`;
        document.getElementById('modal-product-ref').textContent = `REF: ${product.id}`;
        const sizeSelect = document.getElementById('size-select');
        sizeSelect.innerHTML = '<option value="">Selecione o tamanho</option>';
        (product.sizes || ['P','M','G','GG']).forEach(size => {
            const opt = document.createElement('option');
            opt.value = size;
            opt.textContent = size;
            sizeSelect.appendChild(opt);
        });
        document.getElementById('quantity-input').value = 1;
        sizeModal.dataset.productId = product.id;
        sizeModal.dataset.productName = product.name;
        sizeModal.dataset.productPrice = product.price;
        sizeModal.dataset.productImage = product.image;
        sizeModal.classList.add('active');
    }

    function closeSizeModal() {
        sizeModal.classList.remove('active');
        delete sizeModal.dataset.productId;
        delete sizeModal.dataset.productName;
        delete sizeModal.dataset.productPrice;
        delete sizeModal.dataset.productImage;
    }

    function addToCart(product, size, quantity) {
        if (!size) {
            alert('Informe o tamanho.');
            return;
        }
        if (!quantity || quantity < 1) {
            alert('Informe a quantidade.');
            return;
        }
        const id = `${product.id}-${size}`;
        const existing = cart.find(item => item.id === id);
        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.push({
                id,
                name: product.name,
                price: product.price,
                image: product.image,
                size,
                quantity
            });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        closeSizeModal();
        alert('Produto adicionado ao carrinho!');
    }

    function updateCartCount() {
        // Atualize a variável cart com o que está no localStorage
        cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelector('.cart-count').textContent = count;
    }

    const sizeModal = document.getElementById('size-modal');
    document.getElementById('confirm-add-to-cart').onclick = function() {
        const size = document.getElementById('size-select').value;
        const quantity = parseInt(document.getElementById('quantity-input').value, 10);
        const product = {
            id: sizeModal.dataset.productId,
            name: sizeModal.dataset.productName,
            price: parseFloat(sizeModal.dataset.productPrice),
            image: sizeModal.dataset.productImage
        };
        addToCart(product, size, quantity);
    };
    document.getElementById('cancel-modal').onclick = closeSizeModal;
    document.querySelector('.modal-close').onclick = closeSizeModal;
    document.getElementById('decrease-qty').onclick = function() {
        const input = document.getElementById('quantity-input');
        if (parseInt(input.value, 10) > 1) input.value = parseInt(input.value, 10) - 1;
    };
    document.getElementById('increase-qty').onclick = function() {
        const input = document.getElementById('quantity-input');
        input.value = parseInt(input.value, 10) + 1;
    };

    function getProductFromButton(btn) {
        return {
            id: btn.dataset.id,
            name: btn.dataset.name,
            price: parseFloat(btn.dataset.price),
            image: btn.dataset.image,
            sizes: btn.dataset.sizes ? btn.dataset.sizes.split(',') : undefined
        };
    }

    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.onclick = function(e) {
            e.preventDefault();
            openSizeModal(getProductFromButton(btn));
        };
    });

    document.querySelectorAll('.add-to-order, .buy-now').forEach(btn => {
        btn.onclick = function(e) {
            e.preventDefault();
            openSizeModal(getProductFromButton(btn));
        };
    });

    updateCartCount();
});
