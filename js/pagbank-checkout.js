// Funções para integração com PagBank via Netlify Functions
document.addEventListener('DOMContentLoaded', function() {
    // Botões de pagamento
    const pixButton = document.getElementById('submit-pix-payment');
    const cardButton = document.getElementById('submit-card-payment');
    
    // Elementos para exibir resultados
    const paymentResult = document.getElementById('payment-result');
    const pixQrCodeContainer = document.getElementById('pix-qrcode');
    const pixCopyPasteContainer = document.getElementById('pix-copy-paste');
    const orderIdContainer = document.getElementById('order-id');
    
    // Função para obter dados do formulário e carrinho
    function getOrderData() {
        // Obter dados do cliente
        const customerName = document.getElementById('customer-name').value;
        const customerEmail = document.getElementById('customer-email').value;
        const customerPhone = document.getElementById('customer-phone').value;
        const customerCPF = document.getElementById('customer-cpf').value;
        
        // Obter endereço
        const shippingZipCode = document.getElementById('shipping-zipcode').value;
        const shippingStreet = document.getElementById('shipping-street').value;
        const shippingNumber = document.getElementById('shipping-number').value;
        const shippingComplement = document.getElementById('shipping-complement').value;
        const shippingNeighborhood = document.getElementById('shipping-neighborhood').value;
        const shippingCity = document.getElementById('shipping-city').value;
        const shippingState = document.getElementById('shipping-state').value;
        
        // Obter itens do carrinho do localStorage
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Calcular valores
        const subtotal = parseFloat(document.getElementById('subtotal-value').innerText.replace('R$ ', '').replace(',', '.'));
        const shipping = parseFloat(document.getElementById('shipping-value').innerText.replace('R$ ', '').replace(',', '.'));
        const total = parseFloat(document.getElementById('total-value').innerText.replace('R$ ', '').replace(',', '.'));
        
        return {
            customer: {
                name: customerName,
                email: customerEmail,
                phone: customerPhone,
                cpf: customerCPF
            },
            shipping: {
                zipCode: shippingZipCode,
                street: shippingStreet,
                number: shippingNumber,
                complement: shippingComplement,
                neighborhood: shippingNeighborhood,
                city: shippingCity,
                state: shippingState
            },
            items: cartItems,
            amount: {
                subtotal: subtotal,
                shipping: shipping,
                total: total
            }
        };
    }
    
    // Processar pagamento PIX
    if (pixButton) {
        pixButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Mostrar loading
            paymentResult.innerHTML = '<p>Processando pagamento...</p>';
            paymentResult.style.display = 'block';
            
            // Obter dados do pedido
            const orderData = getOrderData();
            
            // Chamar função Netlify para criar pedido PIX
            fetch('/api/create-pix-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    paymentResult.innerHTML = `<p class="error">Erro: ${data.error}</p>`;
                    return;
                }
                
                // Exibir QR Code e informações do PIX
                pixQrCodeContainer.innerHTML = `<img src="${data.qrcode}" alt="QR Code PIX">`;
                pixCopyPasteContainer.innerHTML = `
                    <p>Código Copia e Cola:</p>
                    <textarea readonly onclick="this.select()">${data.copyPaste}</textarea>
                    <button onclick="navigator.clipboard.writeText('${data.copyPaste}')">Copiar</button>
                `;
                orderIdContainer.innerHTML = `<p>ID do Pedido: ${data.orderId}</p>`;
                
                // Exibir instruções
                paymentResult.innerHTML = `
                    <h3>Pagamento PIX Gerado</h3>
                    <p>Escaneie o QR Code ou use o código Copia e Cola para pagar.</p>
                    <p>O pagamento expira em 30 minutos.</p>
                    <div id="pix-container">
                        <div id="pix-qrcode">${pixQrCodeContainer.innerHTML}</div>
                        <div id="pix-copy-paste">${pixCopyPasteContainer.innerHTML}</div>
                    </div>
                    <div id="order-id">${orderIdContainer.innerHTML}</div>
                `;
                
                // Limpar carrinho após gerar pagamento
                // localStorage.removeItem('cart');
            })
            .catch(error => {
                console.error('Erro:', error);
                paymentResult.innerHTML = `<p class="error">Erro ao processar pagamento. Tente novamente.</p>`;
            });
        });
    }
    
    // Processar pagamento com Cartão
    if (cardButton) {
        cardButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Mostrar loading
            paymentResult.innerHTML = '<p>Processando pagamento...</p>';
            paymentResult.style.display = 'block';
            
            // Obter dados do pedido
            const orderData = getOrderData();
            
            // Adicionar dados do cartão
            const cardData = {
                number: document.getElementById('card-number').value,
                holder: document.getElementById('card-holder').value,
                expiry: document.getElementById('card-expiry').value,
                cvv: document.getElementById('card-cvv').value
            };
            
            // Chamar função Netlify para criar pedido com cartão
            fetch('/api/create-card-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    order: orderData,
                    card: cardData
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    paymentResult.innerHTML = `<p class="error">Erro: ${data.error}</p>`;
                    return;
                }
                
                // Exibir resultado do pagamento
                if (data.status === 'PAID' || data.status === 'AUTHORIZED') {
                    paymentResult.innerHTML = `
                        <h3>Pagamento Aprovado!</h3>
                        <p>Seu pedido foi processado com sucesso.</p>
                        <p>ID do Pedido: ${data.orderId}</p>
                    `;
                    
                    // Limpar carrinho após pagamento aprovado
                    localStorage.removeItem('cart');
                } else {
                    paymentResult.innerHTML = `
                        <h3>Pagamento ${data.status}</h3>
                        <p>${data.message || 'Verifique os dados do cartão e tente novamente.'}</p>
                        <p>ID do Pedido: ${data.orderId}</p>
                    `;
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                paymentResult.innerHTML = `<p class="error">Erro ao processar pagamento. Tente novamente.</p>`;
            });
        });
    }
});
