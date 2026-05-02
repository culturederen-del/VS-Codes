let turnCount = 0;
class fumblingSystem {
 constructor() {
    this.fumbles = 7;
    this.streak = 0;
 }
    #streakBonus() {
        this.streak++;
        if (this.streak > 0) {
            const bonus = Math.min(this.streak * 0.05, 0.5);
            console.log(`Current streak: ${this.streak}, Bonus multiplier: ${bonus}`);
            return 1 + bonus;
            }   
    };
    
    validCounter() {
        if (this.fumbles < 7) {
        this.streak += 1;
        } else {
        showDialogue("You cannot gain streak points while at max fumbles!");
        }
        
        if (this.streak > 5) {
            showDialogue("Streak reached 5! Rewarding extra fumble point.");
            this.fumbles += 1; // reward player with extra fumble point for reaching streak of 5
        }
    }

    validReset() {
        console.log(`Fumble! Streak of ${this.streak} ended.`);
        this.streak = 0; // reset streak on fumble
    }
}

const fumbler = new fumblingSystem();
class gm1Timer{
 constructor(display, duration = 15, onTimeout = () => {}) {
    this.display = display;
    this.duration = duration;
    this.onTimeout = onTimeout;
    this.timeleft = duration;
    this.interval = null;
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.interval = setInterval(() => {
      this.timeleft--;
      this.#updateDisplay();
      console.log(`Time left: ${this.timeleft}s`); // Debug log
      if (this.timeleft <= 0) {
        this.#stop();
        this.onTimeout();
      }
    }, 1000);
    }

    #stop() {
        this.isRunning = false;
        if (this.interval) clearInterval(this.interval);  
    }

    #updateDisplay() {
        const secs = this.timeleft % 60;
        this.display.textContent = `Time left: ${secs}s`;
                if (this.timeleft <= 10) {
            this.display.style.color = 'red'; // Change to red when time is low  
            this.display.style.fontsize = '1.5em'; // font size
            this.display.style.fontWeight = 'bold'; //  bold for emphasis 
        }
    }

    getTimeLeft() {
        return this.timeleft;
    }
    
    pause() {
        if (!this.isRunning) return;
        this.#stop();
    }

    reset(duration = this.duration) {
        this.#stop();
        this.timeleft = this.duration;
        this.#updateDisplay();
    }
}

  const gameTime = new gm1Timer(document.getElementById('timeElapsed'), 40, () => {
    showDialogue("Time's up! You lose the battle!");
    validReset(); // Reset streak on timeout
});


async function batteru(){
    var turns = 0;
    let charmander = { name: 'Charmander', hp: 70, dmg: 10};
    let rattata = { name: 'Rattata', hp: 20, dmg: 5};
    var hasGuarded = false;
    var finalDmg;
    let attacker, defender;
    let willGuard = false;
    // Note: decides who atks and defs

    function guardAction(defender, attacker){
        var reducDmg = attacker.dmg * 0.4 + 1;
        let showDmg = attacker.dmg - reducDmg;
        hasGuarded = true;
        willGuard = true;
        return showDmg;
    }

    function attackAction(attacker, defender, finalDmg) {


        defender.hp -= finalDmg; 
        if (willGuard) {
        console.log(`${defender.name} had guarded against ${attacker.name}!`);
        console.log(`${defender.name} had taken ${finalDmg} damage.`);
        } else {
        console.log(`${attacker.name} had dealth ${attacker.dmg} damage!`);
        console.log(`${defender.name} has ${defender.hp} HP left 😣.`);
        }
        if (defender.hp == 0) {
            console.log(`${defender.name} has fainted!`);
        }

    }

    while (charmander.hp > 0 && rattata.hp > 0) {

    if (turns % 2 === 0) {
        attacker = charmander;
        defender = rattata;
    } else {
        defender = charmander;
        attacker = rattata;
    }

    // 50% chance of enemy defending
    if (rattata === defender){
        if(Math.random() < 0.5){
            willGuard = true;
        }
    }

    // Checks if they guarded or not
    if (willGuard) {
        finalDmg = guardAction(defender, attacker);
    } else {
        finalDmg = attacker.dmg;
    }

    console.log();
    finalDmg = willGuard ? guardAction(defender, attacker) : attacker.dmg; 
    attackAction(attacker, defender, finalDmg);
    willGuard = false;
    hasGuarded = false;
    turns++;
    console.log('--- This is turn ' + turns + ". ---");
    await sleep(2000);
    }

} // battle();

function categoryMultiplier(category) {
    switch (category) {
        case 'noun':
            return 1.0;
        case 'verb':
            return 1.0;
        case 'adjective':
            return 0.9;
        case 'adverb':
            return 0.9;
        default:
            return 1.0;
    }
}

function performedAction() {
    const playerWord = document.getElementById('wordInput').value.trim();
    const minLength = 3;
    const maxLength = 9;
    const minMeasure = 1.1;
    const maxMeasure = 1.5;
    if (playerWord.length > 7) {
        minMeasure = 1.3;
    } else if (playerWord.length > 5) {
        minMeasure = 1.2;
    }
    const clampedLength = Math.max(minLength, Math.min(playerWord.length, maxLength));
    const measure = minMeasure + ((clampedLength - minLength) / (maxLength - minLength)) * (maxMeasure - minMeasure);
    const finalmeasure = measure * categoryMultiplier(currentCategory);
    console.log(`The length of the word is: ${finalmeasure}`);
    return finalmeasure;
    
}

function Battle() {

}

