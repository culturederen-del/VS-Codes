// UI-Functions.js - Works with your HTML exactly as-is
const optButtons = document.getElementById('optButtons');
const attackOpt = document.getElementById('attackOpt');
const optClose = document.getElementById('optClose');

// Attack opens optButtons
attackOpt.onclick = (e) => {
    e.stopPropagation();
    optButtons.classList.remove("hidden");
};

// Close optButtons
optClose.onclick = (e) => {
    e.stopPropagation();
    optButtons.classList.add("hidden");
    if (typeof gameTime !== 'undefined') gameTime.start();
};

// Click outside to close
document.body.addEventListener("click", (e) => {
    if (optButtons.classList.contains("hidden")) return;
    if (!optButtons.contains(e.target) && e.target.id !== 'attackOpt') {
        optButtons.classList.add("hidden");
    }
});

// YOUR ORIGINAL HANDLER - FIXED (2 lines changed)
const optfixes = document.getElementById("optButtons");
optfixes.addEventListener("click", (event) => {
    const btn = event.target.closest("button");
    if (!btn || !btn.id) return;
    
    // FIX 1: Use window.selectedAffix for randowrd.js
    window.selectedAffix = btn.id;
    
    // Enable input (your original code)
    document.getElementById('wordInput').disabled = false;
    document.getElementById('output').textContent = `Affix: ${btn.textContent}. Enter word:`;
    
    // Show input section
    document.getElementById('inputSection').style.opacity = '1';
    
    console.log('Affix set:', window.selectedAffix); // Debug
});