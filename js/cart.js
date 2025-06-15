// Definindo o cart globalmente primeiro
window.cart = {
    items: [],
    
    // Funções de gerenciamento de dados
    load() {
        this.items = JSON.parse(localStorage.getItem('cart') || '[]');
    },
    
    save() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    },
    
    // Funções de UI do carrinho
    open() { 
        const cartPanel = document.querySelector('.cart');
        if (cartPanel) cartPanel.classList.add('open'); 
    },
    
    close() { 
        const cartPanel = document.querySelector('.cart');
        if (cartPanel) cartPanel.classList.remove('open'); 
    },
    
    toggle() { 
        const cartPanel = document.querySelector('.cart');
        if (cartPanel) cartPanel.classList.toggle('open'); 
    },

    // Função para mostrar mensagens de feedback
    showMessage(message, type = 'success') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);
        
        // Remove a mensagem após 3 segundos
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    },

    // Função para atualizar UI do carrinho
    updateCartUI() {
        const countBadges = document.querySelectorAll('.cart-count');
        const count = this.items.reduce((sum, it) => sum + it.quantity, 0);
        countBadges.forEach(el => el.textContent = count);
    },
    
    // Renderiza o carrinho
    render() {
        this.load();
        const cartPanel = document.querySelector('.cart');
        if (!cartPanel) return;

        const itemsContainer = cartPanel.querySelector('.cart-items');
        const totalDisplay = cartPanel.querySelector('.cart-total-value');
        const countBadges = document.querySelectorAll('.cart-count');
        
        if (!itemsContainer || !totalDisplay) return;
        
        itemsContainer.innerHTML = '';
        let total = 0;

        this.items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name} (Tam: ${item.size})</div>
                    <div class="cart-item-price">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span>${item.quantity}x</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                        <button class="remove-btn" data-id="${item.id}">🗑️</button>
                    </div>
                </div>`;
            
            // Adiciona event listeners para os botões de quantidade
            const minusBtn = div.querySelector('.minus');
            const plusBtn = div.querySelector('.plus');
            const removeBtn = div.querySelector('.remove-btn');
            
            minusBtn.addEventListener('click', () => this.updateQuantity(item.id, -1));
            plusBtn.addEventListener('click', () => this.updateQuantity(item.id, 1));
            removeBtn.addEventListener('click', () => this.removeItem(item.id));
            
            itemsContainer.appendChild(div);
            total += item.price * item.quantity;
        });

        totalDisplay.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        const count = this.items.reduce((sum, it) => sum + it.quantity, 0);
        countBadges.forEach(el => el.textContent = count);
    },

    // Adiciona item ao carrinho
    add(item) {
        this.load();
        const existing = this.items.find(i => i.id === item.id && i.size === item.size);
        
        if (existing) {
            existing.quantity += item.quantity;
        } else {
            this.items.push({...item, quantity: item.quantity || 1});
        }
        
        this.save();
        this.render();
        this.showMessage('Produto adicionado ao carrinho!');
        this.open();
    },

    // Remove item do carrinho
    removeItem(id) {
        this.load();
        this.items = this.items.filter(item => item.id !== id);
        this.save();
        this.render();
        this.showMessage('Produto removido do carrinho');
    },

    // Atualiza quantidade de um item
    updateQuantity(id, change) {
        this.load();
        const item = this.items.find(i => i.id === id);
        
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeItem(id);
                return;
            }
            this.save();
            this.render();
        }
    },

    // Limpa o carrinho
    clear() {
        this.items = [];
        this.save();
        this.render();
        this.showMessage('Carrinho esvaziado');
    },

    // Finaliza a compra
    checkout() {
        if (this.items.length === 0) {
            this.showMessage('Seu carrinho está vazio', 'error');
            return;
        }
        
        // Aqui você pode adicionar a lógica de checkout
        // Por exemplo, redirecionar para a página de checkout
        window.location.href = '/pages/checkout.html';
    }
};

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    const cartPanel = document.querySelector('.cart');
    if (!cartPanel) return;

    const btnToggle = document.querySelector('.cart-button');
    const btnClose = cartPanel.querySelector('.cart-close');
    const btnContinue = cartPanel.querySelector('.continue-shopping');
    const btnCheckout = cartPanel.querySelector('.checkout-button');

    // Renderiza o carrinho inicial
    cart.render();

    // Event Listeners
    if (btnToggle) btnToggle.addEventListener('click', () => cart.toggle());
    if (btnClose) btnClose.addEventListener('click', () => cart.close());
    if (btnContinue) btnContinue.addEventListener('click', (e) => {
        e.preventDefault();
        cart.close();
    });
    if (btnCheckout) btnCheckout.addEventListener('click', () => cart.checkout());

    // Fecha o carrinho quando clicar fora
    document.addEventListener('click', (e) => {
        if (cartPanel.classList.contains('open') && 
            !cartPanel.contains(e.target) && 
            !e.target.closest('.cart-button')) {
            cart.close();
        }
    });
});
