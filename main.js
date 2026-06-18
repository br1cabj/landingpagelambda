document.addEventListener('DOMContentLoaded', () => {
    // 1. Animaciones al hacer scroll (Reveal)
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Solo animar la primera vez
            }
        });
    }, { 
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });
    
    revealElements.forEach(el => revealObserver.observe(el));

    // 2. Animación de contador numérico (Ej: 0.8s)
    const speedMetric = document.getElementById('speed-metric');
    let counted = false;

    if (speedMetric) {
        const target = parseFloat(speedMetric.getAttribute('data-target'));
        const duration = 1500; // ms
        
        const countObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !counted) {
                counted = true;
                let startTimestamp = null;
                const step = (timestamp) => {
                    if (!startTimestamp) startTimestamp = timestamp;
                    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                    
                    // Función de ease-out para que frene al final
                    const easeProgress = 1 - Math.pow(1 - progress, 4);
                    const currentVal = (easeProgress * target).toFixed(1);
                    
                    speedMetric.innerText = currentVal + 's';
                    
                    if (progress < 1) {
                        window.requestAnimationFrame(step);
                    } else {
                        speedMetric.innerText = target + 's';
                    }
                };
                window.requestAnimationFrame(step);
            }
        }, { threshold: 0.5 });
        
        countObserver.observe(speedMetric);
    }
});
