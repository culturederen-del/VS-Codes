// randowrd.js - FIXED: No redeclaration errors
// Use 'const' globals + check if already defined

// Only define if not already defined
if (typeof VALID_PAIRS === 'undefined') {
    window.VALID_PAIRS = [];
    window.currentRoundPair = null;
    window.currentCategory = null;
    window.selectedAffix = null;
    window.pendingFinalWord = null;
    window.gameState = 'selectCategory';
    
    // Player class (only once)
    if (typeof window.player === 'undefined') {
        window.player = class {
            constructor(name) {
                this.name = name;
                this.fumbles = 3;
            }
            handleFumble(invalid) {
                if (invalid) this.fumbles--;
            }
        };
    }
    
    window.user = new window.player("Player1");
}

// Game utilities (safe)
window.gameTime = window.gameTime || { reset: () => {}, start: () => {} };
window.fumbler = window.fumbler || { validCounter: () => {} };

// DOM elements (safe)
const inputBox = document.getElementById('inputSection');
const outputElement = document.getElementById('output');
const randPairDis = document.getElementById('randomPairDisplay');
const categoryDisplay = document.getElementById('categoryDisplay');
const fumbleOutput = document.getElementById('fumbleDisplay');

function showDialogue(message) {
    const dialogBox = document.getElementById('dialogBox');
    const dialogText = document.getElementById('dialogText');
    if (!dialogBox || !dialogText) return;
    dialogText.textContent = message;
    dialogBox.style.display = 'block';
    const closeIt = () => {
        dialogBox.style.display = 'none';
        document.removeEventListener('keydown', closeIt);
    };
    document.addEventListener('keydown', closeIt);
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
        showDialogue("All pairs used! Reset complete.");
    }
    const newPair = getRandomPair();
    if (!newPair) {
        if (randPairDis) randPairDis.textContent = "No pairs left!";
        return;
    }
    window.currentRoundPair = newPair;
    if (randPairDis) randPairDis.textContent = `"${newPair}" is your pair!`;
    gameTime.start();
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

// 🔥 MAIN GAME LOGIC - Submit handler
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
            window.user.handleFumble(true);
            validReset();
            if (wordInput) wordInput.disabled = false;
            return;
        }

        const data = await response.json();
        const partsOfSpeech = getPartsOfSpeech(data);
        
        if (outputElement) outputElement.textContent = `"${finalWord}" ✓ Valid!`;
        gameTime.pause();
        gameTime.reset();
        fumbler.validCounter();

        const isCorrectCategory = partsOfSpeech.some(pos => 
            pos.toLowerCase().includes(window.currentCategory.toLowerCase())
        );

        const categoryOutput = document.getElementById('categoryOutput');
        if (categoryOutput) {
            categoryOutput.textContent = isCorrectCategory 
                ? `"${finalWord}" is perfect ${window.currentCategory}!`
                : `"${finalWord}" valid - advancing!`;
        }

        nextPair();
        validReset();
        
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
    if (savedCategory) {
        window.currentCategory = savedCategory;
        setupCategory(savedCategory);
        nextPair();
        if (categoryDisplay) categoryDisplay.textContent = `Category: ${savedCategory}`;
        if (outputElement) outputElement.textContent = 'ATTACK for affix options!';
        sessionStorage.removeItem('selectedCategory');
        console.log('Game started with:', savedCategory);
        return;
    }
    if (outputElement) outputElement.textContent = 'Select category from menu!';
});

// Fumble display
setInterval(() => {
    if (fumbleOutput) fumbleOutput.textContent = `Fumbles: ${window.user.fumbles}`;
}, 1000);

console.log('randowrd.js loaded');