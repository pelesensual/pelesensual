// Modificar a função handleAddToCartInteraction para incluir stopPropagation
function handleAddToCartInteraction(quantityInputElement, productId, productName, baseProductPrice, productImage, size, event) {
    if (event) {
        event.stopPropagation(); // Previne a propagação do evento
    }

    let quantityFromInput = parseInt(quantityInputElement.value);
    const currentIsWholesale = document.body.classList.contains("wholesale-mode");
    let finalQuantityForCart = quantityFromInput;
    let message = "Produto adicionado ao carrinho!";

    // ... resto do código da função permanece igual ...
}

// Modificar a função openSizeModal para incluir stopPropagation
function openSizeModal(productId, productName, baseProductPrice, productImage, event) {
    if (event) {
        event.stopPropagation(); // Previne a propagação do evento
    }

    const existingModal = document.querySelector(".size-modal-overlay");
    if (existingModal) existingModal.remove();

    // ... resto do código da função permanece igual ...

    // Modificar o evento do botão adicionar ao carrinho no modal
    modalContent.querySelector("#modal-add-to-cart").addEventListener("click", (event) => {
        event.stopPropagation(); // Previne a propagação do evento
        
        const selSizeBtn = modalContent.querySelector(".modal-size-option.selected");
        if (!selSizeBtn && availableSizes.length > 0) {
            cart.showMessage("Por favor, selecione um tamanho.");
            return;
        }
        const selectedSize = selSizeBtn ? selSizeBtn.getAttribute("data-size") : 'Único';
        
        handleAddToCartInteraction(qtyInput, productId, productName, baseProductPrice, productImage, selectedSize, event);
        overlay.remove();
    });
}

// Modificar o event listener do DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
    cart.loadCart();

    // Adicionar stopPropagation em todos os botões relevantes
    const cartBtn = document.querySelector(".cart-button");
    if (cartBtn) {
        cartBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            toggleCart();
        });
    }

    // Modificar os event listeners dos botões "Comprar" nos cards
    document.querySelectorAll(".product-card .comprar-btn").forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            
            const card = button.closest(".product-card");
            openSizeModal(
                button.getAttribute("data-id"),
                card.querySelector("h3").textContent,
                parseFloat(card.querySelector(".price").getAttribute("data-price")),
                card.querySelector("img").src,
                event
            );
        });
    });

    // Modificar os event listeners dos botões "Adicionar ao Carrinho"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation();
            
            const productId = this.getAttribute('data-id');
            const productName = this.getAttribute('data-name');
            const productPrice = this.getAttribute('data-price');
            const productImage = this.getAttribute('data-image');
            const size = this.getAttribute('data-size') || 'Único';
            
            // Usar o sistema de carrinho existente
            cart.addItem(productId, productName, productPrice, size, productImage, 1);
        });
    });

    // ... resto do código do DOMContentLoaded permanece igual ...
});

// Remover as funções duplicadas
// Remover: addToCart, showMessage, updateCartCount
// (já existem equivalentes no objeto cart)
