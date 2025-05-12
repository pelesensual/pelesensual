// Integração com PagSeguro para checkout

// Email da conta do vendedor PagSeguro
const PAGSEGURO_EMAIL = "fxeconsultoria@gmail.com";

// Função para configurar o checkout do PagSeguro
window.setupPagSeguroCheckout = function(items, totalAmount) {
    const pagseguroForm = document.getElementById("pagseguro-form");
    const pagseguroButton = document.getElementById("pagseguro-checkout-button");
    const pagseguroLoading = document.getElementById("pagseguro-loading");

    if (!pagseguroForm || !pagseguroButton) {
        console.error("Elementos do formulário PagSeguro não encontrados.");
        return;
    }

    // Limpar campos existentes no formulário, exceto o botão
    while (pagseguroForm.firstChild && pagseguroForm.firstChild !== pagseguroButton) {
        pagseguroForm.removeChild(pagseguroForm.firstChild);
    }

    // Adicionar campos obrigatórios para o PagSeguro
    const fields = {
        "receiverEmail": PAGSEGURO_EMAIL,
        "currency": "BRL",
        // "reference": "PEDIDO123", // Opcional: um código de referência para o pedido
        "shippingAddressRequired": "false" // Simplificando, já que o endereço não é mais coletado no formulário principal
    };

    for (const key in fields) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = fields[key];
        pagseguroForm.appendChild(input);
    }

    // Adicionar itens do carrinho
    items.forEach((item, index) => {
        const i = index + 1;
        const itemFields = {
            [`itemId${i}`]: item.id || `prod${index}`,
            [`itemDescription${i}`]: `${item.name} (Tam: ${item.size})`,
            [`itemAmount${i}`]: item.price.toFixed(2),
            [`itemQuantity${i}`]: item.quantity,
            // [`itemWeight${i}`]: "100" // Opcional: peso em gramas
        };
        for (const key in itemFields) {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = itemFields[key];
            pagseguroForm.appendChild(input);
        }
    });

    // Ação do botão de checkout do PagSeguro
    pagseguroButton.onclick = function() {
        if (pagseguroLoading) pagseguroLoading.style.display = "block";
        
        // Validar se há itens e total
        if (!items || items.length === 0 || totalAmount <= 0) {
            alert("Não há itens no carrinho ou o valor total é inválido para o PagSeguro.");
            if (pagseguroLoading) pagseguroLoading.style.display = "none";
            return;
        }

        // Verificar se o formulário está pronto para ser submetido
        // O PagSeguro geralmente usa um lightbox ou redirecionamento.
        // Para redirecionamento simples (menos seguro e não recomendado para dados de cartão diretos):
        // pagseguroForm.action = "https://pagseguro.uol.com.br/v2/checkout/payment.html";
        // pagseguroForm.submit();

        // Para uma integração mais robusta (Lightbox ou API de Checkout Transparente):
        // Seria necessário incluir o script do PagSeguro e chamar suas funções.
        // Exemplo conceitual para Lightbox (requer script do PagSeguro carregado):
        // try {
        //     PagSeguroLightbox({
        //         code: 'SEU_CODIGO_DE_CHECKOUT_GERADO_VIA_API'
        //     }, {
        //         success: function(transactionCode) {
        //             alert("Pedido realizado com sucesso! Transação: " + transactionCode);
        //             // Limpar carrinho, redirecionar para página de sucesso, etc.
        //             if (window.cart) window.cart.clearCart();
        //             window.location.href = "confirmacao.html"; 
        //         },
        //         abort: function() {
        //             alert("Pagamento cancelado.");
        //             if (pagseguroLoading) pagseguroLoading.style.display = "none";
        //         }
        //     });
        // } catch (e) {
        //     console.error("Erro ao iniciar PagSeguro Lightbox:", e);
        //     alert("Erro ao iniciar o pagamento com PagSeguro. Verifique o console para detalhes.");
        //     if (pagseguroLoading) pagseguroLoading.style.display = "none";
        // }

        // Como uma integração completa do Lightbox/API está fora do escopo de modificação de arquivo simples,
        // vamos manter o redirecionamento básico, mas alertando sobre a necessidade de configuração.
        alert("Para completar a integração com PagSeguro, o código de checkout (gerado pela API do PagSeguro) ou a biblioteca JavaScript do PagSeguro precisa ser configurada para processar este formulário de forma segura. Este é um redirecionamento de exemplo.");
        pagseguroForm.action = "https://pagseguro.uol.com.br/v2/checkout/payment.html"; // Sandbox ou Produção conforme a conta
        // pagseguroForm.action = "https://sandbox.pagseguro.uol.com.br/v2/checkout/payment.html"; // Para ambiente de testes
        pagseguroForm.target = "_blank"; // Abrir em nova aba para não perder o contexto da loja
        pagseguroForm.submit();
        if (pagseguroLoading) pagseguroLoading.style.display = "none";
    };
};

// Chamar a configuração quando a página de checkout carregar e o modo de cartão for selecionado
document.addEventListener("DOMContentLoaded", function() {
    const cardRadio = document.getElementById("card-payment");
    if (cardRadio && document.body.classList.contains("checkout-page")) { // Garante que só executa na página de checkout
        // A função setupPagSeguroCheckout será chamada no script da checkout.html quando o método de cartão for selecionado
        // e os dados do carrinho estiverem carregados.
    }
});

