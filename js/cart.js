document.addEventListener('DOMContentLoaded', () => {
    const cartPanel = document.querySelector('.cart');
    if (!cartPanel) return;

    const btnToggle = document.querySelector('.cart-button');
    const btnClose = cartPanel.querySelector('.cart-close');
    const btnContinue = cartPanel.querySelector('.continue-shopping');

    const cart = {
        items: [],
        load() {
            this.items = JSON.parse(localStorage.getItem('cart') || '[]');
        },
        save() {
            localStorage.setItem('cart', JSON.stringify(this.items));
        },
        open() { cartPanel.classList.add('open'); },
        close() { cartPanel.classList.remove('open'); },
        toggle() { cartPanel.classList.toggle('open'); },
        render() {
            this.load();
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
                        <div class="cart-item-price">R$ ${(item.price * item.quantity).toFixed(2)}</div>
                        <div class="cart-item-quantity">${item.quantity}x</div>
                    </div>`;
                itemsContainer.appendChild(div);
                total += item.price * item.quantity;
            });
            totalDisplay.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
            const count = this.items.reduce((sum, it) => sum + it.quantity, 0);
            countBadges.forEach(el => el.textContent = count);
        },
        add(item) {
            const existing = this.items.find(i => i.id === item.id);
            if (existing) existing.quantity += item.quantity;
            else this.items.push(item);
            this.save();
            this.render();
        },
        clear() {
            this.items = [];
            this.save();
            this.render();
        }
    };

    window.cart = cart;
    cart.render();

    if (btnToggle) btnToggle.addEventListener('click', () => cart.toggle());
    if (btnClose) btnClose.addEventListener('click', () => cart.close());
    if (btnContinue) btnContinue.addEventListener('click', (e) => {
        e.preventDefault();
        cart.close();
    });
});

