// Instruções para configuração de checkout e pagamento
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar opções de pagamento ao checkout
    const paymentMethods = document.querySelectorAll('.payment-option');
    if (paymentMethods.length > 0) {
        // Adicionar detalhes para cada método de pagamento
        const paymentDetails = {
            'pix': {
                title: 'PIX',
                instructions: 'Após finalizar o pedido, você receberá um QR Code para pagamento via PIX.',
                details: 'Chave PIX: pelesensualmodaintima@gmail.com (E-mail)'
            },
            'credit-card': {
                title: 'Cartão de Crédito',
                instructions: 'Processamos pagamentos via Mercado Pago e PagSeguro.',
                details: 'Aceitamos as principais bandeiras: Visa, Mastercard, Elo, American Express'
            },
            'bank-transfer': {
                title: 'Transferência Bancária',
                instructions: 'Faça uma transferência para nossa conta bancária.',
                details: 'Banco: Nubank\nAgência: 0001\nConta: 12345-6\nNome: Pele Sensual Moda Íntima\nCNPJ: XX.XXX.XXX/0001-XX'
            }
        };

        // Adicionar evento para mostrar detalhes do método de pagamento selecionado
        paymentMethods.forEach(method => {
            const input = method.querySelector('input');
            input.addEventListener('change', function() {
                const paymentId = this.value;
                const paymentInfo = document.getElementById('payment-info');
                
                if (paymentInfo) {
                    paymentInfo.innerHTML = `
                        <h4>${paymentDetails[paymentId].title}</h4>
                        <p>${paymentDetails[paymentId].instructions}</p>
                        <p class="payment-details">${paymentDetails[paymentId].details}</p>
                    `;
                }
            });
        });

        // Mostrar detalhes do método selecionado por padrão
        const defaultMethod = document.querySelector('.payment-option input:checked');
        if (defaultMethod) {
            defaultMethod.dispatchEvent(new Event('change'));
        }
    }
});

// Função para adicionar informações de checkout
function addCheckoutInstructions() {
    const checkoutForm = document.querySelector('.checkout-form');
    if (checkoutForm) {
        // Adicionar seção de instruções
        const instructionsSection = document.createElement('div');
        instructionsSection.classList.add('checkout-instructions');
        instructionsSection.innerHTML = `
            <h3>Como configurar o checkout e pagamento</h3>
            <p>Para configurar o checkout e pagamento em sua loja, siga estas instruções:</p>
            
            <h4>1. Configuração de conta no Mercado Pago</h4>
            <ol>
                <li>Acesse <a href="https://www.mercadopago.com.br" target="_blank">www.mercadopago.com.br</a> e crie uma conta comercial</li>
                <li>Verifique sua identidade e dados bancários</li>
                <li>No painel, vá em "Ferramentas de venda" > "Checkout Pro"</li>
                <li>Copie as credenciais de acesso (PUBLIC_KEY e ACCESS_TOKEN)</li>
            </ol>
            
            <h4>2. Configuração de conta no PagSeguro</h4>
            <ol>
                <li>Acesse <a href="https://pagseguro.uol.com.br" target="_blank">pagseguro.uol.com.br</a> e crie uma conta</li>
                <li>Complete seu cadastro com os dados da empresa</li>
                <li>No painel, vá em "Minha conta" > "Preferências" > "Credenciais"</li>
                <li>Copie o token de integração</li>
            </ol>
            
            <h4>3. Integração com o site</h4>
            <ol>
                <li>Substitua as credenciais nos arquivos de configuração</li>
                <li>Teste o checkout em ambiente de sandbox antes de ativar em produção</li>
                <li>Configure as notificações de pagamento para atualizar o status dos pedidos</li>
            </ol>
            
            <p>Para mais informações, consulte a documentação oficial:</p>
            <ul>
                <li><a href="https://www.mercadopago.com.br/developers" target="_blank">Documentação do Mercado Pago</a></li>
                <li><a href="https://dev.pagseguro.uol.com.br" target="_blank">Documentação do PagSeguro</a></li>
            </ul>
        `;
        
        // Adicionar antes do botão de finalizar pedido
        const submitButton = checkoutForm.querySelector('button[type="submit"]');
        if (submitButton) {
            checkoutForm.insertBefore(instructionsSection, submitButton.parentNode);
        } else {
            checkoutForm.appendChild(instructionsSection);
        }
        
        // Adicionar div para informações de pagamento
        const paymentMethods = checkoutForm.querySelector('.payment-methods');
        if (paymentMethods) {
            const paymentInfo = document.createElement('div');
            paymentInfo.id = 'payment-info';
            paymentInfo.classList.add('payment-info');
            paymentMethods.parentNode.insertBefore(paymentInfo, paymentMethods.nextSibling);
        }
    }
}

// Executar quando a página for carregada
window.addEventListener('load', function() {
    addCheckoutInstructions();
});
