

function getRandomEnemy() {
    const randomIndex = Math.floor(Math.random() *enemyList.length);
    return enemyList[randomIndex];
}

let jake = [
    { name: "Jake the Giant",
        hp: 210,
        dmg: 0.00000001,
        critChance: 0.1, // 10% chance for critical hit
        dodgeChance: 0.05, // 5% chance to dodge an attack
        defense: 5
    }
];

let jieben = [
    { name: "Jieben the Reyes",
        hp: 1,   
        dmg: 15,
        critChance: 0.75, // 75% chance for critical hit
        dodgeChance: 0.9, // 90% chance to dodge an attack
        defense: 0
    }
];

let jerwin = [
    { name: "Jerwin the Stoic",
        hp: 180,
        dmg: 20,
        critChance: 0.15, // 15% chance for critical hit
        dodgeChance: 0.10, // 15% chance to dodge an attack
        defense: 15
    }
];

let enemyList = [jake, jieben, jerwin];

let Nash =  [
    { name: "Nash the Atencion Seeker",
        hp: 200,
        dmg: 15,
        critChance: 0.25, // 25% chance for critical hit
        dodgeChance: 0.15, // 15% chance to dodge an attack
        defense: 10
    }
];

let Zedrick = [
    { name: "Zedrick the Valiant God",
        hp: 550,   
        dmg: 35,
        critChance: 0.2, // 20% chance for critical hit
        dodgeChance: 0.05, // 5% chance to dodge an attack
        defense: 20
    }
];