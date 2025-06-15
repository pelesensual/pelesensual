# Pele Sensual Moda Íntima

Este repositório contém o código do site de comércio eletrônico **Pele Sensual Moda Íntima**. O projeto utiliza HTML estático, estilos CSS e scripts JavaScript para oferecer navegação de produtos e integração de pagamento.

## Instalação e execução local

1. Clone o repositório e abra a pasta `pelesensual`.
2. Sirva os arquivos estaticamente com a ferramenta de sua preferência (por exemplo, `npx serve` ou a extensão *Live Server* do VSCode).
3. Acesse `index.html` pelo navegador para visualizar a página inicial.

## Estrutura

- `index.html` – página principal com destaques dos produtos.
- `produto.html` – página de detalhes de produto.
- `checkout.html` – fluxo de checkout.
- Diretório `js/` – scripts JavaScript.
- Diretório `css/` – estilos CSS.
- Diretório `images/` – imagens utilizadas no site.

A implantação atualmente é realizada na plataforma **Vercel**.
checkout (1).html
Excluído
+0
-282

checkout.html
+1
-2

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="images/logos/PS-Logo_05.png" type="image/png">
    <title>Checkout - Pele Sensual Moda Íntima</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/header-decoration.css">
    <link rel="stylesheet" href="css/mode-toggle.css">
    <link rel="stylesheet" href="css/whatsapp-button.css">
    <link rel="stylesheet" href="css/checkout.css">
</head>
<body>
    <!-- Botão de Alternância Varejo/Atacado -->
    <div class="mode-toggle-container">
        <div class="mode-toggle">
            <button id="retail-mode" class="active">Varejo</button>
            <button id="wholesale-mode">Atacado</button>
        </div>
    </div>

    <!-- Header -->
    <header class="header-decoration">
        <div class="header-pattern"></div>
        <div class="container">
            <div class="header-icons">
                <div class="header-icon">
                    <i class="fas fa-heart"></i>
                    <span>Qualidade Premium</span>
                </div>
                <div class="header-icon">
                    <i class="fas fa-truck"></i>
                    <span>Entrega Rápida</span>
                </div>
@@ -249,51 +248,51 @@
                </div>
                <div class="footer-section">
                    <h3>Categorias</h3>
                    <ul>
                        <li><a href="index.html#produtos-adulto">Moda Íntima Adulto</a></li>
                        <li><a href="index.html#produtos-infantil">Moda Íntima Infantil</a></li>
                        <li><a href="index.html#embalagens">Embalagens e Kits</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h3>Informações</h3>
                    <ul>
                        <li><a href="index.html#sobre">Sobre Nós</a></li>
                        <li><a href="index.html#contato">Contato</a></li>
                        <li><a href="#">Política de Privacidade</a></li>
                        <li><a href="#">Termos e Condições</a></li>
                    </ul>
                </div>
            </div>
            <div class="copyright">
                &copy; 2025 Pele Sensual Moda Íntima. Todos os direitos reservados.
            </div>
        </div>
    </footer>

    <script src="js/main-v2.js"></script>
    <script src="js/main.js"></script>
    <script src="js/mode-toggle.js"></script>
    <script src="js/whatsapp-button.js"></script>
    <script src="js/pagseguro-integration.js"></script> 

    <script>
        document.addEventListener("DOMContentLoaded", function() {
            const summaryItemsContainer = document.getElementById("summary-items");
            const summarySubtotalElem = document.getElementById("summary-subtotal");
            const summaryShippingElem = document.getElementById("summary-shipping");
            const summaryTotalElem = document.getElementById("summary-total");
            const checkoutActions = document.getElementById("checkout-actions");
            const wholesaleMinOrderMsgCheckout = document.getElementById("wholesale-min-order-checkout-message");

            const customerForm = document.getElementById("checkout-form-fields");
            const cityInput = document.getElementById("city");
            const stateInput = document.getElementById("state");

            // Elementos do Pagamento PIX PagBank (Real)
            const generatePagBankPixRealButton = document.getElementById("generate-pagbank-pix-real-button");
            const pagbankPixInfoContainer = document.getElementById("pagbank-pix-info-container");
            const pagbankPixQrCodeImage = document.getElementById("pagbank-pix-qrcode-image");
            const pagbankPixCopiaCola = document.getElementById("pagbank-pix-copy-paste-code");
            const copyPagBankPixCodeButton = document.getElementById("copy-pagbank-pix-code-button");
            const pagbankPixOrderId = document.getElementById("pagbank-pix-order-id");
            const pagbankPixExpiration = document.getElementById("pagbank-pix-expiration");
