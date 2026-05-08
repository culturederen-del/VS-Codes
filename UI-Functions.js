// UI-Functions.js - main game
const optButtons = document.getElementById('optButtons');
const attackOpt = document.getElementById('attackOpt');
const optClose = document.getElementById('optClose');
const gameOverPopup = document.querySelector('.gameOverPopUp');
const actBtns = document.querySelectorAll('.actionBtn');
const runBtn = document.getElementById('runOpt');
const takeDmgFX = document.getElementById('damageTint');
let damageTimeout;

// Attack opens optButtons
attackOpt.onclick = (e) => {
    e.stopPropagation();
    optButtons.classList.remove("hidden");

    actBtns.forEach(btn => {
        btn.style.display = "none";
    });
    runBtn.style.display = "none";
};

// Close optButtons
optClose.onclick = (e) => {
    e.stopPropagation();
    optButtons.classList.add("hidden");
        actBtns.forEach(btn => {
        btn.style.display = "flex";
    });
        runBtn.style.display = "flex";
};




function damageFX() {
    if (!takeDmgFX) return;

    takeDmgFX.classList.add("active");

    clearTimeout(damageTimeout);

    damageTimeout = setTimeout(() => {
        takeDmgFX.classList.remove("active");
    }, 350);
}


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
    document.getElementById('output').textContent = `Move Type: ${btn.textContent}`;
    
    // Show input section
    document.getElementById('inputSection').style.opacity = '1';
    
    console.log('Affix set:', window.selectedAffix); // Debug
});

const upperDisplay = document.getElementById('upperGameDisplay');

function showGameOutput() {
        gameOutput.style.opacity = '1';
    }
