// Funcionalidade do botão de WhatsApp
document.addEventListener('DOMContentLoaded', function() {
    // Criar o elemento do botão flutuante
    const whatsappButton = document.createElement('a');
    whatsappButton.href = 'https://wa.me/5585999436548?text=Gostaria%20de%20fazer%20um%20pedido%20da%20Pele%20Sensual.';
    whatsappButton.className = 'whatsapp-float';
    whatsappButton.setAttribute('target', '_blank');
    whatsappButton.setAttribute('rel', 'noopener noreferrer');
    whatsappButton.innerHTML = '<i class="fab fa-whatsapp"></i>';
    
    // Adicionar o botão ao corpo da página
    document.body.appendChild(whatsappButton);
    
    // Verificar se estamos no modo atacado ou varejo
    const updateWhatsAppMessage = function() {
        const isWholesale = document.body.classList.contains('wholesale-mode');
        let message; // Declarar variável de mensagem

        if (isWholesale) {
            // Definir a mensagem específica para atacado
            message = 'Gostaria de tirar uma dúvida sobre pedido (atacado)';
        } else {
            // Definir a mensagem para varejo
            message = 'Gostaria de fazer um pedido da Pele Sensual.';
        }

        const encodedMessage = encodeURIComponent(message);
        whatsappButton.href = `https://wa.me/5585999436548?text=${encodedMessage}`;
    };
    
    // Atualizar a mensagem inicialmente
    updateWhatsAppMessage();
    
    // Adicionar listener para quando o modo mudar (varejo/atacado)
    document.addEventListener('modeChanged', updateWhatsAppMessage);
});
