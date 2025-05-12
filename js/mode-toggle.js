// Funcionalidade para alternar entre os modos varejo e atacado
document.addEventListener('DOMContentLoaded', function() {
    const retailButton = document.getElementById('retail-mode');
    const wholesaleButton = document.getElementById('wholesale-mode');
    const body = document.body;

    const RETAIL_INCREMENT = 4.00;
    const WHOLESALE_INCREMENT = 1.00;

    // Função para atualizar os preços exibidos na página
    function updateDisplayedPrices(mode) {
        const priceElements = document.querySelectorAll('.price');
        priceElements.forEach(priceElement => {
            const basePrice = parseFloat(priceElement.getAttribute('data-price'));
            let finalPrice = basePrice;

            if (mode === 'retail') {
                finalPrice += RETAIL_INCREMENT;
            } else if (mode === 'wholesale') {
                finalPrice += WHOLESALE_INCREMENT;
            }
            priceElement.textContent = `R$ ${finalPrice.toFixed(2).replace('.', ',')}`;
            // Atualizar um novo atributo para o carrinho usar, se necessário, ou o carrinho recalcula
            priceElement.setAttribute('data-current-price', finalPrice.toFixed(2)); 
        });
        // Se o carrinho estiver visível, forçar a atualização da UI do carrinho para refletir novos preços
        if (window.cart && typeof window.cart.updateCartUI === 'function' && document.querySelector('.cart.open')) {
            // É preciso que o carrinho recalcule os totais com base nos novos preços dos itens
            // Isso pode ser complexo se os preços no carrinho são armazenados no momento da adição.
            // Uma abordagem mais simples é o carrinho sempre buscar o preço atualizado do produto.
            // Por agora, vamos focar na exibição. O carrinho precisará ser ajustado.
        }
    }

    function activateRetailMode() {
        body.classList.remove('wholesale-mode');
        body.classList.add('retail-mode');
        retailButton.classList.add('active');
        wholesaleButton.classList.remove('active');
        localStorage.setItem('shopMode', 'retail');
        updateDisplayedPrices('retail');
        updateModeSpecificText('retail');
        adjustQuantitiesAndSteps('retail');
        if (window.cart) window.cart.updateCartUI(); // Atualiza UI do carrinho, incluindo mensagens de mínimo
    }

    function activateWholesaleMode() {
        body.classList.remove('retail-mode');
        body.classList.add('wholesale-mode');
        wholesaleButton.classList.add('active');
        retailButton.classList.remove('active');
        localStorage.setItem('shopMode', 'wholesale');
        updateDisplayedPrices('wholesale');
        updateModeSpecificText('wholesale');
        adjustQuantitiesAndSteps('wholesale');
        if (window.cart) window.cart.updateCartUI(); // Atualiza UI do carrinho, incluindo mensagens de mínimo
    }

    function adjustQuantitiesAndSteps(mode) {
        const quantityInputs = document.querySelectorAll('.quantity-control input, .modal-quantity-input');
        const minQuantity = (mode === 'wholesale') ? 200 : 1;
        const step = (mode === 'wholesale') ? 100 : 1;

        quantityInputs.forEach(input => {
            const currentValue = parseInt(input.value);
            input.min = minQuantity;
            input.step = step;
            // Ajustar valor atual se estiver abaixo do novo mínimo ou não for múltiplo do step
            if (currentValue < minQuantity) {
                input.value = minQuantity;
            } else if (mode === 'wholesale' && currentValue % step !== 0) {
                input.value = Math.ceil(currentValue / step) * step;
                if (input.value < minQuantity) input.value = minQuantity;
            }
        });
    }

    function updateModeSpecificText(mode) {
        const addToCartButtons = document.querySelectorAll('.add-to-cart, .add-to-cart-modal');
        const checkoutButton = document.querySelector('.checkout-button');
        const cartHeader = document.querySelector('.cart-header h3');
        const whatsappButton = document.getElementById('whatsapp-button');
        const baseWhatsappMessage = "Gostaria de fazer um pedido da Pele Sensual.";
        const wholesaleWhatsappMessage = "Gostaria de tirar uma dúvida sobre pedido (atacado).";

        if (mode === 'wholesale') {
            addToCartButtons.forEach(button => button.textContent = button.textContent.replace('Carrinho', 'Pedido'));
            if (checkoutButton) checkoutButton.textContent = 'Finalizar Pedido';
            if (cartHeader) cartHeader.textContent = 'Seu Pedido de Atacado';
            if (whatsappButton) {
                const link = whatsappButton.querySelector('a');
                link.href = `https://wa.me/5585999436548?text=${encodeURIComponent(wholesaleWhatsappMessage)}`;
            }
        } else {
            addToCartButtons.forEach(button => button.textContent = button.textContent.replace('Pedido', 'Carrinho'));
            if (checkoutButton) checkoutButton.textContent = 'Finalizar Compra';
            if (cartHeader) cartHeader.textContent = 'Seu Carrinho';
            if (whatsappButton) {
                const link = whatsappButton.querySelector('a');
                link.href = `https://wa.me/5585999436548?text=${encodeURIComponent(baseWhatsappMessage)}`;
            }
        }
    }

    // Event listeners para os botões
    if (retailButton && wholesaleButton) {
        retailButton.addEventListener('click', activateRetailMode);
        wholesaleButton.addEventListener('click', activateWholesaleMode);

        // Aplicar modo salvo ou padrão no carregamento
        const savedMode = localStorage.getItem('shopMode');
        if (savedMode === 'wholesale') {
            activateWholesaleMode();
        } else {
            activateRetailMode(); // Padrão é varejo
        }
    } else {
        // Se os botões não existirem (ex: página de checkout), apenas aplicar preços
        const currentMode = localStorage.getItem('shopMode') || 'retail';
        updateDisplayedPrices(currentMode);
    }
});

