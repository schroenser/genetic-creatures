function Creature(position, health, genome) {
    this.position = position;
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);

    this.maximumForce = 1;
    this.maximumSpeed = 5;
    this.slowingDistance = 10;
    this.mutationRate = 0.005;

    this.genome = genome;
    this.health = health;

    this.inEatingRange = function(nom) {
        return p5.Vector.sub(nom.position, this.position).mag() <= this.maximumSpeed;
    };

    this.eat = function(nom) {
        this.health = min(1, this.health + nom.nutritionalValue);
    };

    this.offspring = function() {
        let offspring;
        if (this.health > map(this.genome[2], -1, 1, 0, 1)) {
            this.health /= 2;
            offspring = new Creature(this.position.copy(),
                this.health,
                [this.mutate(this.genome[0]), this.mutate(this.genome[1]), this.mutate(this.genome[2])]);
        }
        return offspring;
    };

    this.mutate = function(value) {
        return constrain(value + random(-1 * this.mutationRate, this.mutationRate), -1, 1);
    };

    this.crave = function(noms) {
        let maximumDistance = noms.map((nom) => p5.Vector.sub(nom.position, this.position).mag()).reduce((accumulator,
            currentValue) => currentValue > accumulator ? currentValue : accumulator);

        let target;
        let bestValue = -1;
        for (let i = 0; i < noms.length; i++) {
            let nom = noms[i];
            let distance = p5.Vector.sub(nom.position, this.position).mag();
            let relativeDistance = distance / maximumDistance;
            let value = (relativeDistance * this.genome[0] + nom.nutritionalValue * this.genome[1]) / 2;
            if (value > bestValue) {
                target = nom;
                bestValue = value;
            }
        }

        let desiredVelocity = createVector(0, 0);
        if (target) {
            let targetOffset = p5.Vector.sub(target.position, this.position);
            let distance = targetOffset.mag();
            if (distance > 0) {
                let rampedSpeed = this.maximumSpeed * (distance / this.slowingDistance);
                let clippedSpeed = min(rampedSpeed, this.maximumSpeed);
                desiredVelocity = targetOffset.mult(clippedSpeed / distance);
            }
        }

        let steeringDirection = p5.Vector.sub(desiredVelocity, this.velocity);
        let steeringForce = steeringDirection.limit(this.maximumForce);
        steeringForce.mult(1 / (this.health * 10));
        this.acceleration = steeringForce;
    };

    this.act = function(noms) {
        this.crave(noms);
        this.updateMovement();
        this.updateVitals();
        this.draw();
    };

    this.updateMovement = function() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maximumSpeed);
        this.position.add(this.velocity);
    };

    this.updateVitals = function() {
        this.health = max(0, this.health - 0.0075);
    };

    this.draw = function() {
        fill(lerpColor(color(255, 0, 0), color(0, 255, 0), map(this.genome[1], -1, 1, 0, 1)));
        stroke(lerpColor(color(255, 0, 0), color(0, 255, 0), map(this.genome[0], -1, 1, 0, 1)));
        strokeWeight(1);

        let size = map(health, 0, 1, 10, 20);

        push();
        translate(this.position);
        rotate(this.velocity.heading() - HALF_PI);
        beginShape();
        vertex(0, size);
        vertex(-1 * size, -1 * size);
        vertex(0, map(this.genome[2], -1, 1, 0, -1 * size));
        vertex(size, -1 * size);
        endShape(CLOSE);
        pop();
    }
}