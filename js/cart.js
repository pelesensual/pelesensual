/* Estilo do Carrinho */
.cart {
    position: fixed;
    top: 0;
    right: -400px;
    width: 400px;
    height: 100vh;
    background: white;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
    transition: right 0.3s ease;
    z-index: 1000;
    display: flex;
    flex-direction: column;
}

.cart.open {
    right: 0;
}

/* Cabeçalho do Carrinho */
.cart-header {
    padding: 20px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f8f8f8;
}

.cart-close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #333;
}

/* Itens do Carrinho */
.cart-items {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
}

.cart-item {
    display: flex;
    padding: 10px;
    border-bottom: 1px solid #eee;
    margin-bottom: 10px;
}

.cart-item img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    margin-right: 15px;
}

.cart-item-details {
    flex: 1;
}

.cart-item-title {
    font-weight: bold;
    margin-bottom: 5px;
}

.cart-item-price {
    color: #e91e63;
    font-weight: bold;
}

/* Controles de Quantidade */
.cart-item-quantity {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
}

.quantity-btn {
    background: #f0f0f0;
    border: none;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    transition: background-color 0.2s;
}

.quantity-btn:hover {
    background: #e0e0e0;
}

.remove-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #ff4444;
    font-size: 18px;
    padding: 5px;
    margin-left: auto;
}

/* Rodapé do Carrinho */
.cart-footer {
    padding: 20px;
    border-top: 1px solid #eee;
    background: #f8f8f8;
}

.cart-total {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    margin-bottom: 15px;
}

.cart-buttons {
    display: flex;
    gap: 10px;
}

.continue-shopping,
.checkout-button {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.2s;
}

.continue-shopping {
    background: #f0f0f0;
    color: #333;
}

.checkout-button {
    background: #4CAF50;
    color: white;
}

.continue-shopping:hover {
    background: #e0e0e0;
}

.checkout-button:hover {
    background: #45a049;
}

/* Contador do Carrinho */
.cart-count {
    position: absolute;
    top: -8px;
    right: -8px;
    background: #e91e63;
    color: white;
    font-size: 12px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Mensagens de Feedback */
.message {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 25px;
    border-radius: 5px;
    color: white;
    font-weight: bold;
    z-index: 1001;
    animation: slideIn 0.3s ease-out;
}

.message.success {
    background: #4CAF50;
}

.message.error {
    background: #ff4444;
}

/* Animações */
@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

/* Responsividade */
@media (max-width: 480px) {
    .cart {
        width: 100%;
        right: -100%;
    }

    .cart-item {
        flex-direction: column;
    }

    .cart-item img {
        width: 100%;
        height: auto;
        margin-bottom: 10px;
    }
}
