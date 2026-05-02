// menu-categories.js - PERFECTLY MATCHES YOUR HTML
window.GameCategories = {
    setupCategoryButtons() {
        console.log('🔍 Scanning for category buttons...');
        
        const buttons = {
            'nounBtn': 'noun',
            'verbBtn': 'verb',
            'adjBtn': 'adjective', 
            'advBtn': 'adverb',
            'PrnBtn': 'pronoun'
        };

        let foundCount = 0;
        Object.entries(buttons).forEach(([id, category]) => {
            const btn = document.getElementById(id);
            if (btn) {
                console.log(`${category}:`, btn.textContent);
                foundCount++;
                
                btn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    console.log(`🎯 CLICKED: ${category}`);
                    
                    // Save & redirect
                    sessionStorage.setItem('selectedCategory', category);
                    console.log('💾 SAVED:', sessionStorage.getItem('selectedCategory'));
                    
                    // Visual feedback
                    const feedback = document.createElement('div');
                    feedback.id = 'catFeedback';
                    feedback.innerHTML = `✨ <strong>${category.toUpperCase()}</strong> → GAME!`;
                    feedback.style.cssText = `
                        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                        background: linear-gradient(45deg, #4CAF50, #81C784); 
                        color: white; padding: 20px 40px; border-radius: 15px;
                        font-size: 24px; font-weight: bold; z-index: 9999;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.5); text-align: center;
                    `;
                    document.body.appendChild(feedback);
                    
                    // Animate feedback
                    if (typeof anime !== 'undefined') {
                        anime({
                            targets: feedback,
                            scale: [0.8, 1.2, 1],
                            opacity: [0, 1, 0],
                            duration: 1500,
                            easing: 'easeOutExpo'
                        });
                    }
                    
                    // Redirect
                    setTimeout(() => {
                        console.log('🚀 → training.html');
                        window.location.href = 'training.html';  // ← YOUR TRAINING FILE
                    }, 1500);
                };
            } else {
                console.warn(`❌ Missing: #${id}`);
            }
        });
        
        console.log(`✅ ${foundCount}/5 buttons ready!`);
    }
};

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => window.GameCategories.setupCategoryButtons(), 100);
    });
} else {
    window.GameCategories.setupCategoryButtons();
}