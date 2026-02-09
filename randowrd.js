
async function genRanWord() { 

const VALID_PAIRS = [
  "ST","TR","BR","CR","DR","FR","GR","PR",
  "BL","CL","FL","GL","PL","SL",
  "SP","SK","SM","SN","SW",
  "TH","SH","CH","PH","WH",
  "SC"];

  function getRandomPair() {
    const randomIndex = Math.floor(Math.random() * VALID_PAIRS.length);
    return VALID_PAIRS[randomIndex];
  }

}   await fetchData();