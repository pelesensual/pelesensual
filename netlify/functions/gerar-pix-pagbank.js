// Integração do Checkout PagBank (API Orders)
document.addEventListener("DOMContentLoaded", function() {
    // Seletores de Elementos
    const pixRadio = document.getElementById("pix-payment");
    const cardRadio = document.getElementById("card-payment");
    const pixDetails = document.getElementById("pix-payment-details");
    const cardDetails = document.getElementById("card-payment-details");
    const submitPixButton = document.getElementById("submit-pix-payment");
    const submitCardButton = document.getElementById("submit-card-payment");
    const pixInfoContainer = document.getElementById("pagbank-pix-info-container");
    const pixLoading = document.getElementById("pagbank-pix-loading");
    const pixQrCodeContainer = document.getElementById("pagbank-pix-qrcode-container");
    const pixQrCodeImage = document.getElementById("pagbank-pix-qrcode-image");
    const pixCopyPasteContainer = document.querySelector(".pix-copy-paste-container");
    const pixCopyPasteCode = document.getElementById("pagbank-pix-copy-paste-code");
    const copyPixCodeButton = document.getElementById("copy-pagbank-pix-code-button");
    const pixExpiryInfo = document.getElementById("pagbank-pix-expiry-info");
    const pixExpiryTime = document.getElementById("pix-expiry-time");
    const pixError = document.getElementById("pagbank-pix-error");
    const cardFormContainer = document.getElementById("pagbank-card-form-container");
    const cardLoading = document.getElementById("pagbank-card-loading");
    const cardError = document.getElementById("pagbank-card-error");
    const checkoutActions = document.getElementById("checkout-actions");

    // Verificar se estamos na página de checkout
    if (!checkoutActions) {
        console.log("Não estamos na página de checkout ou o elemento checkout-actions não foi encontrado");
        return;
    }

    // Mostrar as opções de pagamento quando a página carregar
    checkoutActions.style.display = "block";

    // --- Lógica de Seleção de Método de Pagamento ---
    function togglePaymentDetails() {
        if (pixRadio && pixRadio.checked) {
            pixDetails.classList.add("active");
            cardDetails.classList.remove("active");
        } else if (cardRadio && cardRadio.checked) {
            pixDetails.classList.remove("active");
            cardDetails.classList.add("active");
        }
    }

    if (pixRadio && cardRadio) {
        pixRadio.addEventListener("change", togglePaymentDetails);
        cardRadio.addEventListener("change", togglePaymentDetails);
        
        // Inicializa a exibição correta
        togglePaymentDetails();
    }

    // --- Coleta de Dados do Formulário ---
    function getCheckoutData() {
        const customerData = {
            name: document.getElementById("name")?.value || "",
            email: document.getElementById("email")?.value || "",
            phone: document.getElementById("phone")?.value || "",
            cpf: document.getElementById("cpf")?.value || ""
        };
        
        const shippingAddress = {
            cep: document.getElementById("cep")?.value || "",
            street: document.getElementById("street")?.value || "",
            number: document.getElementById("number")?.value || "",
            complement: document.getElementById("complement")?.value || "",
            neighborhood: document.getElementById("neighborhood")?.value || "",
            city: document.getElementById("city")?.value || "",
            state: document.getElementById("state")?.value || ""
        };
        
        // Obter dados do carrinho do localStorage
        let cartData = [];
        let totalAmount = 0;
        
        try {
            const savedCart = localStorage.getItem("pelesensual_cart");
            if (savedCart) {
                const parsedCart = JSON.parse(savedCart);
                
                if (parsedCart.items && Array.isArray(parsedCart.items)) {
                    cartData = parsedCart.items.map(item => ({
                        id: item.id || "",
                        name: item.name || "Produto",
                        quantity: item.quantity || 1,
                        unit_price: item.price || 0
                    }));
                }
                
                totalAmount = parsedCart.total || 0;
            }
        } catch (error) {
            console.error("Erro ao obter dados do carrinho:", error);
            // Dados de fallback para teste
            cartData = [{
                id: "teste-1",
                name: "Produto Teste",
                quantity: 1,
                unit_price: 19.90
            }];
            totalAmount = 19.90;
        }

        return {
            customer: customerData,
            shipping: shippingAddress,
            items: cartData,
            total: totalAmount
        };
    }

    // --- Validação de Formulário ---
    function validateCheckoutForm() {
        const requiredFields = [
            { id: "name", label: "Nome Completo" },
            { id: "email", label: "Email" },
            { id: "phone", label: "Telefone" },
            { id: "cpf", label: "CPF" },
            { id: "cep", label: "CEP" },
            { id: "street", label: "Rua/Avenida" },
            { id: "number", label: "Número" },
            { id: "neighborhood", label: "Bairro" },
            { id: "city", label: "Cidade" },
            { id: "state", label: "Estado" }
        ];

        let isValid = true;
        let firstInvalidField = null;

        for (const field of requiredFields) {
            const element = document.getElementById(field.id);
            if (!element || !element.value.trim()) {
                isValid = false;
                if (!firstInvalidField) {
                    firstInvalidField = element;
                }
                // Adiciona classe de erro ou destaca o campo
                if (element) {
                    element.classList.add("error");
                }
            } else {
                if (element) {
                    element.classList.remove("error");
                }
            }
        }

        if (!isValid) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            if (firstInvalidField) {
                firstInvalidField.focus();
            }
        }

        return isValid;
    }

    // --- Lógica de Pagamento PIX ---
    async function handlePixPayment() {
        console.log("Iniciando pagamento PIX...");
        
        // Validar formulário antes de prosseguir
        if (!validateCheckoutForm()) {
            return;
        }

        const checkoutData = getCheckoutData();
        
        // Adicionar o método de pagamento aos dados
        checkoutData.paymentMethod = "pix";

        // Mostrar loading e esconder elementos
        if (pixInfoContainer) pixInfoContainer.style.display = "block";
        if (pixLoading) pixLoading.style.display = "block";
        if (pixQrCodeContainer) pixQrCodeContainer.style.display = "none";
        if (pixCopyPasteContainer) pixCopyPasteContainer.style.display = "none";
        if (pixExpiryInfo) pixExpiryInfo.style.display = "none";
        if (pixError) pixError.style.display = "none";
        if (submitPixButton) submitPixButton.disabled = true;

        try {
            console.log("Enviando dados para processamento:", checkoutData);
            
            // Chamada à função serverless unificada
            const response = await fetch("/.netlify/functions/create-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(checkoutData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: "Erro ao gerar PIX. Tente novamente." }));
                throw new Error(errorData.error || "Erro desconhecido ao gerar PIX.");
            }

            const pixData = await response.json();
            console.log("Resposta do PIX:", pixData);

            // Exibir dados do PIX recebidos do backend
            if (pixQrCodeImage && pixData.qr_codes && pixData.qr_codes[0] && pixData.qr_codes[0].links) {
                // Encontrar o link da imagem do QR code
                const qrCodeImageLink = pixData.qr_codes[0].links.find(link => link.media === "image/png");
                if (qrCodeImageLink) {
                    pixQrCodeImage.src = qrCodeImageLink.href;
                }
            }
            
            if (pixCopyPasteCode && pixData.qr_codes && pixData.qr_codes[0]) {
                pixCopyPasteCode.value = pixData.qr_codes[0].text || "";
            }
            
            if (pixExpiryTime && pixData.qr_codes && pixData.qr_codes[0] && pixData.qr_codes[0].expiration_date) {
                const expiryDate = new Date(pixData.qr_codes[0].expiration_date);
                pixExpiryTime.textContent = expiryDate.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });
                if (pixExpiryInfo) pixExpiryInfo.style.display = "block";
            }
            
            // Esconder loading e mostrar QR Code
            if (pixLoading) pixLoading.style.display = "none";
            if (pixQrCodeContainer) pixQrCodeContainer.style.display = "block";
            if (pixCopyPasteContainer) pixCopyPasteContainer.style.display = "block";
            if (submitPixButton) submitPixButton.textContent = "Aguardando Pagamento...";
            
        } catch (error) {
            console.error("Erro no pagamento PIX:", error);
            if (pixLoading) pixLoading.style.display = "none";
            if (pixError) {
                pixError.textContent = error.message;
                pixError.style.display = "block";
            }
            if (submitPixButton) {
                submitPixButton.disabled = false;
                submitPixButton.textContent = "Tentar Novamente";
            }
        }
    }

    // --- Lógica de Pagamento Cartão de Crédito ---
    async function handleCardPayment() {
        console.log("Iniciando pagamento com Cartão...");
        
        // Validar formulário antes de prosseguir
        if (!validateCheckoutForm()) {
            return;
        }

        const checkoutData = getCheckoutData();
        const cardData = {
            holder_name: document.getElementById("card-holder-name")?.value || "",
            number: document.getElementById("card-number")?.value || "",
            exp_month: document.getElementById("card-expiry")?.value?.split("/")[0]?.trim() || "",
            exp_year: document.getElementById("card-expiry")?.value?.split("/")[1]?.trim() || "",
            security_code: document.getElementById("card-cvv")?.value || "",
            installments: document.getElementById("card-installments")?.value || "1"
        };

        // Validação básica do cartão
        if (!cardData.holder_name || !cardData.number || !cardData.exp_month || !cardData.exp_year || !cardData.security_code) {
            alert("Por favor, preencha todos os dados do cartão.");
            return;
        }

        // Adicionar o método de pagamento e dados do cartão aos dados do checkout
        checkoutData.paymentMethod = "card";
        checkoutData.card = cardData;

        // Mostrar loading e esconder elementos
        if (cardLoading) cardLoading.style.display = "block";
        if (cardError) cardError.style.display = "none";
        if (submitCardButton) submitCardButton.disabled = true;

        try {
            console.log("Enviando dados para processamento:", checkoutData);
            
            // Chamada à função serverless unificada
            const response = await fetch("/.netlify/functions/create-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(checkoutData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: "Erro no pagamento com cartão. Verifique os dados ou tente outro cartão." }));
                throw new Error(errorData.error || "Erro desconhecido no pagamento com cartão.");
            }

            const paymentResult = await response.json();
            console.log("Resposta do pagamento com cartão:", paymentResult);

            // Pagamento bem-sucedido
            if (cardLoading) cardLoading.style.display = "none";
            alert("Pagamento com cartão aprovado! Pedido confirmado.");
            
            // Limpar carrinho e redirecionar para página de sucesso
            localStorage.removeItem("pelesensual_cart");
            window.location.href = "index.html"; // Ou página de sucesso
            
        } catch (error) {
            console.error("Erro no pagamento com cartão:", error);
            if (cardLoading) cardLoading.style.display = "none";
            if (cardError) {
                cardError.textContent = error.message;
                cardError.style.display = "block";
            }
            if (submitCardButton) submitCardButton.disabled = false;
        }
    }

    // --- Event Listeners ---
    if (submitPixButton) {
        console.log("Adicionando listener ao botão PIX");
        submitPixButton.addEventListener("click", handlePixPayment);
    } else {
        console.warn("Botão de PIX não encontrado na página");
    }

    if (submitCardButton) {
        console.log("Adicionando listener ao botão Cartão");
        submitCardButton.addEventListener("click", handleCardPayment);
    } else {
        console.warn("Botão de Cartão não encontrado na página");
    }

    if (copyPixCodeButton && pixCopyPasteCode) {
        copyPixCodeButton.addEventListener("click", () => {
            pixCopyPasteCode.select();
            document.execCommand("copy");
            alert("Código PIX copiado!");
        });
    }

    console.log("Integração PagBank inicializada com sucesso!");
});
