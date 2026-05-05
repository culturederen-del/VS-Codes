/*
(function() {
    'use strict';

    function initFireworks() {
        const canvas = document.createElement('canvas');
        canvas.className = 'fireworks';
        canvas.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            pointer-events: none; z-index: 9999;
        `;
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const numberOfParticules = 8;
        const colors = ['#a61c3c', '#694a38', '#92bfb1', '#f4ac45'];
        const particles = [];
        let animationId = null;

        function getCanvasCoords(e) {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.clientX || e.touches[0]?.clientX;
            const clientY = e.clientY || e.touches[0]?.clientY;
            return { x: clientX - rect.left, y: clientY - rect.top };
        }

        document.addEventListener('click', function(e) {
            // Trigger fireworks on ANY button click
            if (e.target.tagName === 'BUTTON') {
                console.log('🎆 Fireworks on:', e.target.textContent);
                const coords = getCanvasCoords(e);
                animateParticules(coords.x, coords.y);
            }
        }, true); 

        // Touch support (unchanged)
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const coords = getCanvasCoords(e);
            animateParticules(coords.x, coords.y);
        }, { passive: false });

        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);
    }

    // Initialize (unchanged)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFireworks);
    } else {
        initFireworks();
    }
})();

*/