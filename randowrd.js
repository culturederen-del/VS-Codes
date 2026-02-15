const VALID_PAIRS = [];
const user =  new player("Player1"); 
const category = ["noun", "adjective", "verb", "adverb", "pronoun", "preposition", "conjunction", "interjection"];

let currentCategory = category[Math.floor(Math.random() * category.length)];
let isValidCategory = false;
function getRandomPair() {
  let randomIndex = Math.floor(Math.random() * VALID_PAIRS.length);
  return VALID_PAIRS[randomIndex];
}

function getPartsOfSpeech(data) {
  return data[0]?.meanings?.map(m => m.partOfSpeech) || [];
}

switch (currentCategory) {
  case "noun":
    VALID_PAIRS.push("AN", "EN", "IN", "ON", "UN");
    break;
  case "adjective":
    VALID_PAIRS.push("AD", "ED", "IN", "UN");
    break;
  case "verb":
    VALID_PAIRS.push("RE", "UN", "IN");
    break;
  case "adverb":
    VALID_PAIRS.push("AD", "ED", "IN", "UN");
    break;
  case "pronoun":
    VALID_PAIRS.push("PR", "UN", "IN");
    break;
  case "preposition":
    VALID_PAIRS.push("PR", "UN", "IN");
    break;
  case "conjunction":
    VALID_PAIRS.push("CO", "UN", "IN");
    break;
  case "interjection":
    VALID_PAIRS.push("IN", "UN");
    break;
  case "all":
    VALID_PAIRS.push(  "ST","TR","BR","CR","DR","FR","GR","PR","BL","CL","FL","GL","PL","SL","SP","SK","SM","SN","SW","TH","SH","CH","PH","WH","SC");
    break;
  default:
    break;
}

let randomPair = getRandomPair();
const outputElement = document.getElementById('output');
const randPairDis = document.getElementById('randomPairDisplay');
const categoryDisplay = document.getElementById('categoryDisplay');
const fumbleOutput = document.getElementById('fumbleDisplay');

randPairDis.textContent = `${randomPair} is your current two letters!`;
fumbleOutput.textContent = `You have ${user.fumbles} fumbles left.`;
categoryDisplay.textContent = `Current category: ${currentCategory.toUpperCase()}`;

// dialogue box function
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



document.getElementById('wordSent').addEventListener('click', async () => {
  let wordInput = document.getElementById('wordInput').value.trim().toUpperCase();

  if (!wordInput) {
    outputElement.textContent = 'Please enter a word!';
    return;
  }
  

  // Check for special characters, numbers, or spaces
  const checkSpecChar = /^[A-Za-z]+$/.test(wordInput);

  if (!checkSpecChar) {
    outputElement.textContent = "Please enter letters only (no numbers, spaces or special characters)!";
    return; 
  }




  // store the current pair for this round
  const currentRoundPair = randomPair;

  // remove duplicate first two letters if user typed them
  if (wordInput.length >= 2 && wordInput.startsWith(currentRoundPair)) {
    wordInput = wordInput.slice(2);
  }

  const finalWord = currentRoundPair + wordInput;

  if (finalWord.length < 3) {
    outputElement.textContent = `${finalWord} is too short to be a valid word!`;
    return;
  }

  await fetchData(wordInput, finalWord, currentRoundPair);
});

async function fetchData(wordInput, finalWord, currentRoundPair, currentCategory) {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${finalWord}`);

    if (!response.ok) {
      outputElement.textContent = `${currentRoundPair}${wordInput} is not a valid word!`;
      document.getElementById('wrongOutput').textContent = `Try again with a different word!`;
      document.getElementById('wordInput').value = "";
      document.getElementById('wordInput').focus();
      invalidWord = true;
      return;
    }
    const data = await response.json();

    outputElement.textContent = `${currentRoundPair}${wordInput} is a valid word!`;
    console.log(data);
    const partofSpeech = getPartsOfSpeech(data);
    if (category.includes(currentCategory)) {
    const partOfSpeech = getPartsOfSpeech(data);
    isValidCategory = partOfSpeech.includes(currentCategory);
    if (isValidCategory) {
      document.getElementById('categoryOutput').textContent = `Great! ${currentRoundPair}${wordInput} is a valid ${currentCategory}!`;
    } else {
      document.getElementById('categoryOutput').textContent = `Almost! ${currentRoundPair}${wordInput} is valid but not a ${currentCategory}. Try again!`;
      return;
    } }

    // generate new random pair for next round
    randomPair = getRandomPair();
    randPairDis.textContent = `${randomPair} is your next current two letters!`;
    document.getElementById('wordInput').value = "";
    document.getElementById('wordInput').focus();

  } catch (error) {
    console.error('Error:', error);
  }
}
