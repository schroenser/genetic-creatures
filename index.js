let noms = [];
let creatures = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    createNoms();
    createCreatures();
}

function createNoms() {
    for (var i = 0; i < (windowWidth*windowHeight) / 5000; i++) {
        noms.push(new Nom(random(-1, 1)));
    }
}

function createCreatures() {
    for (var i = 0; i < (windowWidth*windowHeight) / 20000; i++) {
        creatures.push(new Creature(
            createVector(random(width) - width / 2, random(height) - height / 2),
            1,
            [random(-1, 1), random(-1, 1), random(-1, 1)]));
    }
}

function draw() {
    translate(width / 2, height / 2);
    background(51);

    for (let i = creatures.length - 1; i >= 0; i--) {
        let creature = creatures[i];
        for (let j = noms.length - 1; j >= 0; j--) {
            let nom = noms[j];
            if (creature.inEatingRange(nom)) {
                creature.eat(nom);
                noms.splice(j, 1);
                noms.push(new Nom(nom.nutritionalValue));
            }
        }

        let offspring = creature.offspring();
        if (offspring) {
            creatures.push(offspring)
        }

        creature.act(noms);
    }

    creatures = creatures.filter(function(creature) {
        return creature.health > 0;
    });

    if(creatures.length == 0) {
        createCreatures();
    }

    noms.forEach(function(nom) {
        nom.draw();
    });
}