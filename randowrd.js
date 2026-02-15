let VALID_PAIRS = [];
let currentRoundPair;
let invalidWord = false;
const user = new player("Player1"); 
const category = ["noun", "adjective", "verb", "adverb", "pronoun"];
const nounBtn = document.getElementById('nounBtn');
const verbBtn = document.getElementById('verbBtn');
const adjBtn = document.getElementById('adjBtn');
const advBtn = document.getElementById('advBtn');
const prnBtn = document.getElementById('PrnBtn');

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
    // Remove it so we don’t pick the same one again
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
    case "pronoun":
        VALID_PAIRS.push(
          "PR","UN","IN",
          "HE","SH","IT","TH","WE");
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

const outputElement = document.getElementById('output');
const randPairDis = document.getElementById('randomPairDisplay');
const categoryDisplay = document.getElementById('categoryDisplay');
const fumbleOutput = document.getElementById('fumbleDisplay');

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
prnBtn.addEventListener("click", () => startGame("pronoun"));

// fumbleOutput.textContent = `You have ${user.fumbles} fumbles left.`;

document.getElementById('wordSent').addEventListener('click', async () => {
    let wordInput = document.getElementById('wordInput').value.trim().toUpperCase();

    if (!currentCategory || !currentRoundPair) {
        showDialogue("Please select a category to start the game!");
        return;
    }

    if (!wordInput) {
        outputElement.textContent = 'Please enter a word!';
        return;
    }

    if (!/^[A-Za-z]+$/.test(wordInput)) {
        outputElement.textContent = "Please enter letters only!";
        return;
    }

    if (wordInput.startsWith(currentRoundPair)) {
        wordInput = wordInput.slice(2);
    }

    const finalWord = currentRoundPair + wordInput;

    if (finalWord.length < 3) {
        outputElement.textContent = `${finalWord.toUpperCase()} is too short!`;
        return;
    }

    // Only validate the word
    await fetchData(wordInput, finalWord);
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