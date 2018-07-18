function Nom(nutritionalValue) {
    this.position = createVector(random(width) - width / 2, random(height) - height / 2);
    this.nutritionalValue = nutritionalValue;

    this.draw = function() {
        fill(lerpColor(color(200, 0, 0), color(0, 200, 0), map(this.nutritionalValue, -0.5, 0.5, -1, 1)));
        stroke(lerpColor(color(255, 0, 0), color(0, 255, 0), map(this.nutritionalValue, -0.5, 0.5, -1, 1)));
        strokeWeight(5);

        push();
        translate(this.position);
        point(0, 0);
        pop();
    }
}