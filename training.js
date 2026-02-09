function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function battle(){
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

} battle();