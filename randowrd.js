// Global variables to manage game state
let VALID_PAIRS = [];
let currentRoundPair;
let invalidWord = false;
let selectedAffix = null;
let pendingFinalWord = null;

const user = new player("Player1"); 
const category = ["noun", "adjective", "verb", "adverb", "pronoun"];
const nounBtn = document.getElementById('nounBtn');
const verbBtn = document.getElementById('verbBtn');
const adjBtn = document.getElementById('adjBtn');
const advBtn = document.getElementById('advBtn');
const prnBtn = document.getElementById('PrnBtn');
const prefix = document.getElementById('PhysOpt');
const infix = document.getElementById('MentOpt');
const suffix = document.getElementById('AstralOpt');
const optfixes = document.getElementById("optButtons");
const inputBox = document.getElementById('inputSection');

const outputElement = document.getElementById('output');
const randPairDis = document.getElementById('randomPairDisplay');
const categoryDisplay = document.getElementById('categoryDisplay');
const fumbleOutput = document.getElementById('fumbleDisplay');



function showDialogue(message) {
  const dialogBox = document.getElementById('dialogBox');
  const dialogText = document.getElementById('dialogText');

  dialogText.textContent = message;
  dialogBox.style.display = 'block';

  // Set up a one-time keypress listener
  function closeDialogue() {
    dialogBox.style.display = 'none';
    document.removeEventListener('keydown', closeDialogue); // remove listener
  }

  document.addEventListener('keydown', closeDialogue);
}


let isValidCategory = false;

function getPartsOfSpeech(data) {
  return data.flatMap(entry =>
    entry.meanings.map(m => m.partOfSpeech)
  );
}

function getRandomPair() {
    if (VALID_PAIRS.length === 0) return null; // no pairs left
    const randomIndex = Math.floor(Math.random() * VALID_PAIRS.length);
    const pair = VALID_PAIRS[randomIndex];
    // Removes it so we don’t pick the same one again
    VALID_PAIRS.splice(randomIndex, 1);
    return pair;
}

function setupCategory(category) {
  VALID_PAIRS.length = 0; // Clear previous pairs

  switch (category) {
    case "noun":
        VALID_PAIRS.push(
          "AN","EN","IN","ON","UN",
          "BA","BE","BO","CA","CO",
          "DE","DO","FA","FO","GA",
          "GO","HA","HE","HI","HO",
          "LA","LE","LO","MA","ME",
          "MI","MO","NA","NE","NO",
          "PA","PE","PO","RA","RE",
          "RO","SA","SE","SO","TA",
          "TE","TO");
      break;
    case "adjective":
        VALID_PAIRS.push(
          "AD","ED",
          "BE","CO","DE","EX","IM",
          "IN","IR","OB","RE","SE",
          "UN");
      break;
    case "verb":
        VALID_PAIRS.push(
          "RE","UN","IN",
          "AD","BE","DE","EN","EX",
          "IM","OB","UP","ON","OUT");
      break;
    case "adverb":
        VALID_PAIRS.push(
          "AD","ED","IN","UN",
          "RE","UP","ON","OUT","OV",
          "AL","BE");
      break;
    case "general":
            VALID_PAIRS.push(
          "ST","TR","BR","CR","DR","FR","GR","PR",
          "BL","CL","FL","GL","PL","SL",
          "SP","SK","SM","SN","SW","TH","SH",
          "CH","PH","WH","SC","QU","KN","WR","TW");
      break;  // Added break for clarity
    default:
      break;
  }

  currentRoundPair = getRandomPair();
}

function nextPair() {
    // Refill if empty
    if (VALID_PAIRS.length === 0) {
        setupCategory(currentCategory); // refill VALID_PAIRS
        showDialogue("You've gone through all the pairs! Pairs has been reset.");
    }

    // Pick the next random pair
    const newPair = getRandomPair();

    if (!newPair) {
        randPairDis.textContent = "No pairs available!";
        return;
    }
    currentRoundPair = newPair;
    randPairDis.textContent = `${currentRoundPair} is your current pair!`;
}



function startGame(category) {
    currentCategory = category;
    setupCategory(category);
    nextPair(); // set first pair
    categoryDisplay.textContent = `Current category: ${currentCategory}`;
}

nounBtn.addEventListener("click", () => startGame("noun"));
verbBtn.addEventListener("click", () => startGame("verb"));
adjBtn.addEventListener("click", () => startGame("adjective"));
advBtn.addEventListener("click", () => startGame("adverb"));

function cleanUserInput(input, pair, affixType) {
    let cleanInput = input.toUpperCase();

    switch (affixType) {
        case 'PhysOpt': // prefix → remove at start
            if (cleanInput.startsWith(pair)) cleanInput = cleanInput.slice(pair.length);
            break;
        case 'AstralOpt': // suffix → remove at end
            if (cleanInput.endsWith(pair)) cleanInput = cleanInput.slice(0, -pair.length);
            break;
        case 'MentOpt': // infix → don't remove anything
            // leave the word as-is; user must include the pair
            break;
    }

    return cleanInput;
}



// fumbleOutput.textContent = `You have ${user.fumbles} fumbles left.`;


/* This entire 2 blocks below (until 'fetchData') is the event listener for the submit button which
   validates the inputted word's syntax, 
   checks if it matches the current category and the affixes, 
   and then advances the game state accordingly.
*/

// makes it so that affix conditional is done and a button event listener checker: validates affix choice and then calls fetchData to validate the word itself

optfixes.addEventListener("click", (event) => {
    const btn = event.target.closest("button");
    if (!btn) return;
    selectedAffix = btn.id;   // store affix
    document.getElementById('wordInput').disabled = false; // now user can type
    outputElement.textContent = `Affix selected: ${btn.textContent}. Now enter your word.`; 
    if (btn.id) { 
    inputBox.style.opacity = 1; // visually indicate input is disabled until affix is chosen
   } 
});


document.getElementById('wordSent').addEventListener('click', async () => {
    let wordInput = document.getElementById('wordInput').value.trim();

    if (!currentCategory || !currentRoundPair) {
        showDialogue("Please select a category to start the game!");
        return;
    }

    if (!selectedAffix) { outputElement.textContent = "Please select an affix first!"; return; }

    if (!wordInput) {
        outputElement.textContent = 'Please enter a word!';
        return;
    }

    if (!/^[A-Z]+$/i.test(wordInput)) {
        outputElement.textContent = "Please enter letters only!";
        return;
    }

    if (wordInput.length < 1) {
        outputElement.textContent = "Word is too short!";
        return;
    }

    // Clean user input to prevent doubling
      pendingFinalWord = cleanUserInput(wordInput, currentRoundPair, selectedAffix);

    outputElement.textContent = "Now choose an affix type: prefix, infix, or suffix.";
    let finalWord;

    switch (selectedAffix) {
        case 'PhysOpt': // prefix → add pair at start
            finalWord = currentRoundPair + pendingFinalWord;
            break;
        case 'MentOpt': // infix → user must have typed it
            finalWord = pendingFinalWord;
            break;
        case 'AstralOpt': // suffix → add pair at end
            finalWord = pendingFinalWord + currentRoundPair;
            break;
    }
    const optButtons = document.querySelectorAll('#optButtons button');
    optButtons.forEach(btn => btn.disabled = true);  // disable all while validating
    // ✅ Affix validation
    let isValidAffix = false;
    switch (selectedAffix) {
        case 'PhysOpt': 
            isValidAffix = finalWord.startsWith(currentRoundPair);
            break;
        case 'MentOpt':
            isValidAffix = finalWord.includes(currentRoundPair) &&
                           !finalWord.startsWith(currentRoundPair) &&
                           !finalWord.endsWith(currentRoundPair);
            break;
        case 'AstralOpt': 
            isValidAffix = finalWord.endsWith(currentRoundPair);
            break;
    }
    document.getElementById('optButtons').disabled = false;
    if (!isValidAffix) {
        outputElement.textContent = `${finalWord} does not match the selected affix!`;
        return;
    }
    optButtons.forEach(btn => btn.disabled = false);  // re-enabled after validation

    // ✅ Validate final word via API
    await fetchData(pendingFinalWord, finalWord);

    // Reset for next round
    pendingFinalWord = null;
    selectedAffix = null;
    document.getElementById('wordInput').value = "";

    document.getElementById('wordInput').disabled = true; // optional
});




async function fetchData(wordInput, finalWord) {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${finalWord}`);

    if (!response.ok) {
      outputElement.textContent = `${finalWord} is not a valid word!`;
      invalidWord = true;
      user.handleFumble(invalidWord);
      const wrongOutput = document.getElementById('wrongOutput');
      if (wrongOutput) {
          wrongOutput.textContent = `Try again!`;
      }
      document.getElementById('wordInput').value = "";
      document.getElementById('wordInput').focus();
      return;
    }

    const data = await response.json();
    outputElement.textContent = `${finalWord} is a valid word!`;

    const partsOfSpeech = getPartsOfSpeech(data);
    console.log(`Word: ${finalWord}, POS from API: ${partsOfSpeech.join(', ')}, Current Category: ${currentCategory}`); // Debug log

    // More lenient POS check: exact match or partial (e.g., "noun" matches "noun")
    isValidCategory = partsOfSpeech.some(pos => pos.toLowerCase().includes(currentCategory.toLowerCase()));
    if (isValidCategory) {
        const categoryOutput = document.getElementById('categoryOutput');
        if (categoryOutput) {
            categoryOutput.textContent = `Great! ${finalWord} is a valid ${currentCategory}!`;
        }
        nextPair(); // Generate new pair
        console.log(`Advanced to new pair: ${currentRoundPair}`); // Debug log
    } 
    else {
        // If no exact match but word is valid, advance with a warning (handles API inconsistencies)
        const categoryOutput = document.getElementById('categoryOutput');
        if (categoryOutput) {
            categoryOutput.textContent = `Almost! ${finalWord} is valid but POS unclear for ${currentCategory}. Advancing anyway! (POS: ${partsOfSpeech.join(', ')})`;
        }
        console.log(`POS mismatch, but advancing due to leniency`); // Debug log
        nextPair(); // Still generate new pair to avoid sticking
    }

    // Clear input
    document.getElementById('wordInput').value = "";
    document.getElementById('wordInput').focus();

  } catch (error) {
    console.error('Error:', error);
  }
}