// Script para o banner de slides
document.addEventListener('DOMContentLoaded', function() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.banner-slide');
    const dots = document.querySelectorAll('.banner-dot');
    const totalSlides = slides.length;
    
    // Função para mostrar um slide específico
    function showSlide(index) {
        // Remover classe active de todos os slides e dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Adicionar classe active ao slide e dot atual
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        // Atualizar o índice do slide atual
        currentSlide = index;
    }
    
    // Inicializar o primeiro slide
    showSlide(0);
    
    // Configurar os dots para navegação
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });
    
    // Função para avançar para o próximo slide
    function nextSlide() {
        let next = currentSlide + 1;
        if (next >= totalSlides) {
            next = 0;
        }
        showSlide(next);
    }
    
    // Configurar o intervalo para troca automática de slides
    setInterval(nextSlide, 5000);
});
