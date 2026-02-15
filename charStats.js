// Character stats and player class

class player {
    constructor(name) {
        this.name = name;
        this.hp = 100;
        this.dmg = 20;
        this.defense = 5;
        this.fumbles = 10;
        this.streak = 0;
        this.critChance = 0.1; // 10% chance for critical hit
    }   
    
    takeDamage(damage) {
        const actualDamage = Math.max(damage - this.defense, 0);
        this.hp -= actualDamage;
        console.log(`${this.name} takes ${actualDamage} damage! HP left: ${this.hp}`);

        if (this.hp <= 0) {
            showDialogue(`${this.name} has fainted!`);
            gameOver();
        }
    }

    criticalHit() {
        return Math.random() < this.critChance ? 1.45 : 1; // returns +45% damage for critical hit, otherwise +0% damage
    }

    attack(target) {
        const measure = performedAction(); // This function should determine the action multiplier based on the player's input
        const finalDamage = this.dmg * measure * this.criticalHit();
        console.log(`${this.name} attacks ${target.name} for ${finalDamage} damage!`);
        target.takeDamage(finalDamage);
    }
    
    
    handleFumble(invalidWord) {
    if (invalidWord) {
        this.fumbles -= 1;
        showDialogue(`Oh no you fumbled! You have ${this.fumbles} fumbles left!`);
        this.streak = 0; // reset streak on fumble
        } else {
        
        this.fumbles = 10; // reset fumble points on successful word
        }

    if (this.fumbles <= 0) {
        showDialogue("You have no fumbles left! You lose the battle!");
        gameOver();
        }
    }

}

class enemy {
    constructor(name, hp, dmg) {
        this.name = name;
        this.hp = hp;
        this.dmg = dmg;
        this.critChance = 0.15; // 15% chance for critical hit
    }
    
    takeDamage(damage) {
        this.hp -= damage;
        console.log(`${this.name} takes ${damage} damage! HP left: ${this.hp}`);    
        if (this.hp <= 0) {
            console.log(`${this.name} has fainted!`);
        }
    }

    attack(target) {
        console.log(`${this.name} attacks ${target.name} for ${this.dmg} damage!`);
        target.takeDamage(this.dmg);
    }

}