document.addEventListener('DOMContentLoaded', function() {
    // Defina o cart no topo, para ser global dentro deste escopo
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');

    // Função utilitária para abrir o modal de seleção
    function openSizeModal(product) {
        const modal = document.getElementById('size-modal');
        if (!modal) {
            console.error('Modal não encontrado!');
            return;
        }

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
        modal.dataset.productId = product.id;
        modal.dataset.productName = product.name;
        modal.dataset.productPrice = product.price;
        modal.dataset.productImage = product.image;
        
        // Usar 'show' em vez de 'active' para consistência com o CSS
        modal.classList.add('show');
        modal.style.display = 'flex';
    }

    function closeSizeModal() {
        const modal = document.getElementById('size-modal');
        if (!modal) return;
        
        modal.classList.remove('show');
        modal.style.display = 'none';
        delete modal.dataset.productId;
        delete modal.dataset.productName;
        delete modal.dataset.productPrice;
        delete modal.dataset.productImage;
    }

    function addToCart(product, size, quantity) {
        if (!size) {
            showMessage('Por favor, selecione o tamanho.', 'error');
            return;
        }
        if (!quantity || quantity < 1) {
            showMessage('Por favor, informe a quantidade.', 'error');
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
        showMessage('Produto adicionado ao carrinho!', 'success');
    }

    function showMessage(text, type = 'success') {
        // Remove mensagem anterior se existir
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;
        document.body.appendChild(message);

        // Mostrar mensagem
        setTimeout(() => {
            message.classList.add('show');
        }, 100);

        // Remover mensagem após 3 segundos
        setTimeout(() => {
            message.classList.remove('show');
            setTimeout(() => {
                if (message.parentNode) {
                    message.parentNode.removeChild(message);
                }
            }, 300);
        }, 3000);
    }

    function updateCartCount() {
        // Atualize a variável cart com o que está no localStorage
        cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = count;
        }
    }

    // Event listeners para o modal
    const modal = document.getElementById('size-modal');
    if (modal) {
        const confirmButton = document.getElementById('confirm-add-to-cart');
        if (confirmButton) {
            confirmButton.onclick = function() {
                const size = document.getElementById('size-select').value;
                const quantity = parseInt(document.getElementById('quantity-input').value, 10);
                const product = {
                    id: modal.dataset.productId,
                    name: modal.dataset.productName,
                    price: parseFloat(modal.dataset.productPrice),
                    image: modal.dataset.productImage
                };
                addToCart(product, size, quantity);
            };
        }

        const cancelButton = document.getElementById('cancel-modal');
        if (cancelButton) {
            cancelButton.onclick = closeSizeModal;
        }

        const closeButton = document.querySelector('.modal-close');
        if (closeButton) {
            closeButton.onclick = closeSizeModal;
        }

        // Fechar modal ao clicar fora dele
        modal.onclick = function(e) {
            if (e.target === modal) {
                closeSizeModal();
            }
        };
    }

    // Controles de quantidade
    const decreaseBtn = document.getElementById('decrease-qty');
    if (decreaseBtn) {
        decreaseBtn.onclick = function() {
            const input = document.getElementById('quantity-input');
            if (parseInt(input.value, 10) > 1) {
                input.value = parseInt(input.value, 10) - 1;
            }
        };
    }

    const increaseBtn = document.getElementById('increase-qty');
    if (increaseBtn) {
        increaseBtn.onclick = function() {
            const input = document.getElementById('quantity-input');
            input.value = parseInt(input.value, 10) + 1;
        };
    }

    function getProductFromButton(btn) {
        return {
            id: btn.dataset.id,
            name: btn.dataset.name,
            price: parseFloat(btn.dataset.price),
            image: btn.dataset.image,
            sizes: btn.dataset.sizes ? btn.dataset.sizes.split(',') : undefined
        };
    }

    // Event listeners para botões "Adicionar ao Carrinho"
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.onclick = function(e) {
            e.preventDefault();
            console.log('Botão clicado:', btn.dataset);
            openSizeModal(getProductFromButton(btn));
        };
    });

    // Event listeners para botões "Adicionar Pedido" e "Comprar Agora"
    document.querySelectorAll('.add-to-order, .buy-now').forEach(btn => {
        btn.onclick = function(e) {
            e.preventDefault();
            openSizeModal(getProductFromButton(btn));
        };
    });

    // Inicializar contador do carrinho
    updateCartCount();

    console.log('JavaScript carregado com sucesso!');
});

