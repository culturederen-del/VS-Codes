// Use 'const' globals + check if already defined
// Only define if not already defined

// Player class from charStats.js utilizing th
document.addEventListener('DOMContentLoaded', () => {
    const name = localStorage.getItem('playerName') || 'Guest';

    player = new Player(name);

    const userStats = document.getElementById('userStats');

    player.showStats(userStats);
});

// Game utilities
window.gameTime = window.gameTime || { reset: () => {}, start: () => {} };
window.fumbler = window.fumbler || { validCounter: () => {} };
window.VALID_PAIRS = [];

// DOM elements
const inputBox = document.getElementById('inputSection');
const outputElement = document.getElementById('output');
const randPairDis = document.getElementById('randomPairDisplay');
const categoryDisplay = document.getElementById('categoryDisplay');
const categoryResult = document.getElementById('categoryResult');
const fumbleOutput = document.getElementById('fumbleDisplay');

fumbler.showFumbles(fumbleOutput);

function showName(player) {
    if (userStats) {
        userStats.innerHTML = `Player: ${player.name} <br> Fumbles: ${player.fumbles}`;
    }
}


function showDialogue(message, autoClose = true, delay = 1800, isDamage = true) {
    const dialogBox = document.getElementById('dialogBox');
    const dialogText = document.getElementById('dialogText');

    if (!dialogBox || !dialogText) return;

    // Clear previous classes
    dialogBox.className = '';
    
    // Style based on type
    if (isDamage && message.includes('takes') || message.includes('damage')) {
        dialogBox.classList.add('feedback');
    } else if (message.includes('fainted') || message.includes('Critical')) {
        dialogBox.classList.add('success');
    }

    dialogText.textContent = message;
    dialogBox.style.display = 'flex';
    
    // Block background
    document.body.style.pointerEvents = 'none';

    // Auto-close timer
    const autoCloseTimer = setTimeout(() => {
        closeDialog();
    }, delay);

    function closeDialog() {
        document.body.style.pointerEvents = 'auto';
        dialogBox.style.display = 'none';
        dialogBox.className = '';
        clearTimeout(autoCloseTimer);
        dialogBox.removeEventListener('click', handleClick);
    }

    // Optional click-to-close (for non-auto-close messages)
    if (!autoClose) {
        dialogBox.addEventListener('click', handleClick);
    }

    function handleClick() {
        closeDialog();
    }
}


function getPartsOfSpeech(data) {
    return data.flatMap(entry => entry.meanings.map(m => m.partOfSpeech));
}

function getRandomPair() {
    if (window.VALID_PAIRS.length === 0) return null;
    const idx = Math.floor(Math.random() * window.VALID_PAIRS.length);
    const pair = window.VALID_PAIRS[idx];
    window.VALID_PAIRS.splice(idx, 1);
    return pair;
}

function setupCategory(category) {
    window.VALID_PAIRS.length = 0;
    const pairs = {
        noun: ["AN","EN","IN","ON","UN","BA","BE","BO","CA","CO","DE","DO","FA","FO","GA","GO","HA","HE","HI","HO","LA","LE","LO","MA","ME","MI","MO","NA","NE","NO","PA","PE","PO","RA","RE","RO","SA","SE","SO","TA","TE","TO"],
        adjective: ["AD","ED","BE","CO","DE","EX","IM","IN","IR","OB","RE","SE","UN"],
        verb: ["RE","UN","IN","AD","BE","DE","EN","EX","IM","OB","UP","ON","OUT"],
        adverb: ["AD","ED","IN","UN","RE","UP","ON","OUT","OV","AL","BE"],
        pronoun: ["HE","HI","IT","ME","MY","WE","US","YOU","THEY","THEM"]
    };
    window.VALID_PAIRS.push(...(pairs[category] || []));
    window.currentRoundPair = getRandomPair();
}

function nextPair() {
    if (window.VALID_PAIRS.length === 0) {
    setupCategory(window.currentCategory);
    showDialogue("All pairs used! Reset complete."); // No auto-close
}
    const newPair = getRandomPair();
    if (!newPair) {
        if (randPairDis) randPairDis.textContent = "No pairs left!";
        return;
    }
    window.currentRoundPair = newPair;
    if (randPairDis) randPairDis.textContent = `"${newPair}" is your pair!`;
    

    if (round.turnCount === 0 ){

        if (round.roundCount === 0){
            round.startFirstRound();
        } else { 
            round.startNextRound();
        }
    } else {
        round.startNextTurn();
    }

}


function validReset() {
    const wordInput = document.getElementById('wordInput');
    if (wordInput) {
        wordInput.value = "";
        wordInput.focus();
    }
    window.selectedAffix = null;
    window.pendingFinalWord = null;
    window.gameState = 'selectAffix';
}

function cleanUserInput(input, pair, affixType) {
    let cleanInput = input.toUpperCase();
    switch (affixType) {
        case 'PhysOpt': if (cleanInput.startsWith(pair)) cleanInput = cleanInput.slice(pair.length); break;
        case 'AstralOpt': if (cleanInput.endsWith(pair)) cleanInput = cleanInput.slice(0, -pair.length); break;
    }
    return cleanInput;
}

//This progresses the game for each loop
function continueGameFlow(wordInput) {
    setTimeout(() => {
        if (categoryResult) categoryResult.textContent = "";
        nextPair();
        validReset();
        if (wordInput) wordInput.disabled = false;
    }, 1200);
}


//Submit handler
document.addEventListener('click', async (e) => {
    if (e.target.id !== 'wordSent') return;
    
    const wordInput = document.getElementById('wordInput');
    const wordValue = wordInput?.value?.trim().toUpperCase();
    
    if (!window.currentCategory || !window.currentRoundPair) {
        showDialogue("Select category from menu first!");
        return;
    }
    if (!window.selectedAffix) {
        if (outputElement) outputElement.textContent = "Select affix via ATTACK first!";
        return;
    }
    if (!wordValue || !/^[A-Z]+$/.test(wordValue) || wordValue.length < 3) {
        if (outputElement) outputElement.textContent = "Enter valid word (3+ letters)!";
        return;
    }

    let finalWord;
    switch (window.selectedAffix) {
        case 'PhysOpt': finalWord = window.currentRoundPair + cleanUserInput(wordValue, window.currentRoundPair, window.selectedAffix); break;
        case 'MentOpt': 
            if (!wordValue.includes(window.currentRoundPair)) {
                if (outputElement) outputElement.textContent = `Infix needs "${window.currentRoundPair}" INSIDE!`;
                return;
            }
            finalWord = wordValue; 
            break;
        case 'AstralOpt': finalWord = cleanUserInput(wordValue, window.currentRoundPair, window.selectedAffix) + window.currentRoundPair; break;
        default: if (outputElement) outputElement.textContent = "Invalid affix!"; return;
    }

    if (outputElement) outputElement.textContent = `Checking "${finalWord}"...`;
    if (wordInput) wordInput.disabled = true;

    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${finalWord}`);
        if (!response.ok) {
            if (outputElement) outputElement.textContent = `"${finalWord}" is not a real word!`;
            fumbler.handleFumble(true);
            validReset();
            if (wordInput) wordInput.disabled = false;
            return;
        }

        const data = await response.json();
        const partsOfSpeech = getPartsOfSpeech(data);
        const uniquePOS = [...new Set(partsOfSpeech.map(p => p.toLowerCase()))];
        const targetCategory = window.currentCategory.toLowerCase();
        const isCorrectCategory = uniquePOS.includes(targetCategory);

        if (isCorrectCategory) {
            if (outputElement) outputElement.textContent = `"${finalWord}" ✓ Perfect! (${uniquePOS.join(', ')})`;
            round.playerAttacks();
            fumbler.validCounter();
        } else {
            if (outputElement) outputElement.textContent = `"${finalWord}" is correct but wrong category!`;
            if (categoryResult) {
                categoryResult.textContent = `"${finalWord}" has: ${uniquePOS.join(', ')} (need: ${targetCategory})`;
            }
            fumbler.handleFumble(true);
        }

continueGameFlow(wordInput);
        
    } catch (error) {
        console.error('API Error:', error);
        if (outputElement) outputElement.textContent = 'Network error - retry!';
        validReset();
        if (wordInput) wordInput.disabled = false;
    }
});


// Initialize game from menu
document.addEventListener('DOMContentLoaded', () => {
    const savedCategory = sessionStorage.getItem('selectedCategory');

    if (!savedCategory) return;

    window.currentCategory = savedCategory;

    setupCategory(savedCategory);
    nextPair();

    requestAnimationFrame(() => {
        const el = document.getElementById('categoryDisplay');
        if (el) el.textContent = `Category: ${window.currentCategory}`;
    });

    if (outputElement) {
        outputElement.textContent = 'ATTACK for affix options!';
    }

    sessionStorage.removeItem('selectedCategory');
});

// Fumble display
setInterval(() => {
    if (fumbleOutput) fumbleOutput.textContent = `Fumbles: ${fumbler.fumbles}`;
}, 1000);