

function getRandomEnemy() {
    const randomIndex = Math.floor(Math.random() *enemyList.length);
    return enemyList[randomIndex];
}

let jake = [
    { name: "Jake the Giant",
        hp: 210,
        dmg: 20,
        critChance: 0.1, // 10% chance for critical hit
        dodgeChance: 0.05, // 10% chance to dodge an attack
        defense: 5
    }
];

let jieben = [
    { name: "Jieben the Lucky",
        hp: 160,   
        dmg: 25,
        critChance: 0.75, // 75% chance for critical hit
        dodgeChance: 0.4, // 40% chance to dodge an attack
        defense: 0
    }
];

let jerwin = [
    { name: "Jerwin the Warrior",
        hp: 180,
        dmg: 40,
        critChance: 0.15, // 15% chance for critical hit
        dodgeChance: 0.10, // 15% chance to dodge an attack
        defense: 15
    }
];

let enemyList = [jake, jieben, jerwin];