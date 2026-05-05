let characters = [
    { name: "Jake the Jolly",
        hp: 21,
        dmg: 1,
        critChance: 0.1, // 10% chance for critical hit
        dodgeChance: 0.05, // 5% chance to dodge an attack
        defense: 5
    },
    { name: "Jieben the Reyes",
        hp: 10,
        dmg: 20,
        critChance: 0.75, // 75% chance for critical hit
        dodgeChance: 0.40, // 40% chance to dodge an attack
        defense: 5
    },
    { name: "Jerwin the Faithful",
        hp: 18,
        dmg: 20,
        critChance: 0.15, // 15% chance for critical hit
        dodgeChance: 0.10, // 15% chance to dodge an attack
        defense: 15
    },  
    { name: "Nash the Atencion",
        hp: 20,
        dmg: 15,
        critChance: 0.25, // 25% chance for critical hit
        dodgeChance: 0.15, // 15% chance to dodge an attack
        defense: 10
    },  
    { name: "Zedrick the Valiant God",
        hp: 55,
        dmg: 35,
        critChance: 0.2, // 20% chance for critical hit
        dodgeChance: 0.05, // 5% chance to dodge an attack
        defense: 20
    },
    { name: "Marvien the Milk Store",
        hp: 17,
        dmg: 15,
        critChance: 0.15,
        dodgeChance: 0.8,
        defense: 0
    }
]

function nextEnemy() {
    const randomGen = Math.floor(Math.random() * characters.length);
    const chosenEnemy = characters[randomGen];
    characters.splice(randomGen, 1);
    return chosenEnemy;
}
class enemy {
    constructor() {
        const currentFoe = nextEnemy();
        this.name = currentFoe.name;
        this.hp = currentFoe.hp;
        this.dmg = currentFoe.dmg;
        this.defense = currentFoe.defense;
        this.critChance = currentFoe.critChance;
        this.dodgeChance = currentFoe.dodgeChance;
    }

    showEnemyStats(element) {
        if (element) {
            element.innerHTML = `
                Enemy: ${this.name} <br>
                HP: ${this.hp} <br>
            `;
        }
    }

    takeDamage(damage) {
        const actualDamage = Math.max(Math.floor(damage - this.defense), 0);
        this.hp -= actualDamage;
        showDialogue(`${this.name} takes ${actualDamage} damage! HP left: ${this.hp}`);
        this.showEnemyStats(document.getElementById('currentEnemyStateHud')); // Update enemy stats before calculating damage

        if (this.hp <= 0) {
            showDialogue(`${this.name} has fainted!`);
            round.startNextRound();
        }
    }   

    criticalHit() {
        let isCritical = Math.random() < this.critChance;
        if (isCritical) {
            showDialogue(`${this.name} has landed a Critical hit!`);
        }
        return isCritical ? 1.45 : 1; // returns +45% damage for critical hit, otherwise +0% damage
    }

    attack(target) {
        showDialogue(`${this.name} attacks ${target.name} for ${this.dmg} damage!`);
        target.takeDamage(this.dmg);
    }

}



let currentEnemy = new enemy();
const enemyStatus = document.getElementById('currentEnemyStateHud');
currentEnemy.showEnemyStats(enemyStatus);
console.log(`An enemy has appeared: ${currentEnemy.name}!`);

function spawnEnemy(){
    currentEnemy = new enemy();

    const enemyStatus = document.getElementById('currentEnemyStateHud');
    currentEnemy.showEnemyStats(enemyStatus);

    console.log(`An enemy has appeared: ${currentEnemy.name}!`);
}

class Player {
    constructor(name) {
        this.name = name;
        this.hp = 300;
        this.dmg = 40;
        this.defense = 5;
        this.critChance = 0.15; // 15% chance for critical hit
        this.dodgeChance = 0.05; // 5% chance to dodge an attac

    } 

    showStats(element) {
        if (element) {
            element.innerHTML = `
                Player: ${this.name} <br>
                HP: ${this.hp} <br>
            `;
        }
    }

    takeDamage(damage) {
        const actualDamage = Math.max(Math.floor(damage - this.defense), 0);
        this.hp -= actualDamage;
        showDialogue(`${this.name} takes ${actualDamage} damage! HP left: ${this.hp}`);
        this.showStats(userStats);
    }

    criticalHit() {
        let isCritical = Math.random() < this.critChance;
        if (isCritical) {
            showDialogue(`${this.name} has landed a Critical hit!`);
        }
        return isCritical ? 1.45 : 1; // returns +45% damage for critical hit, otherwise +0% damage
    }

    attack(currentEnemy) {
        const measure = performedAction(); // This function should determine the action multiplier based on the player's input
        const finalDamage = Math.floor(this.dmg * measure * this.criticalHit())
        console.log(`${this.name} attacks ${currentEnemy.name} for ${finalDamage} damage!`);
        currentEnemy.takeDamage(finalDamage);
    }
    

}