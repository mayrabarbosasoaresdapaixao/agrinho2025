let flowers = [];
let balloons = [];
let cars = [];
let sunAngle = 0;
let buildingHeights = [];
let stars = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  for (let i = width / 2 + 40; i < width - 40; i += 60) {
    buildingHeights.push({ x: i, h: random(100, 180) });
  }

  for (let i = 0; i < 20; i++) {
    flowers.push(new Flower(random(width / 2), random(height * 0.7, height - 20)));
  }

  for (let i = 0; i < 5; i++) {
    cars.push(new Car(random(width / 2, width - 60), height * 0.7 + 30));
  }

  for (let i = 0; i < 100; i++) {
    stars.push({
      x: random(width / 2, width),
      y: random(height * 0.1, height * 0.65),
      size: random(1, 3),
      alpha: random(100, 255),
      speed: random(0.5, 1.5)
    });
  }
}

function draw() {
  drawSky();
  drawStars();
  drawSun();
  drawMoon();
  drawGround();
  drawRoad();
  drawMountains();
  drawCityBuildings();
  drawTree(); // 🌳 Nova função da árvore

  updateFlowers();
  updateBalloons();
  updateCars();

  drawText();

  if (frameCount % 90 === 0) {
    balloons.push(new Balloon(random(width / 2 - 100), height * 0.7));
  }
}

function drawSky() {
  for (let y = 0; y < height * 0.7; y++) {
    let inter = map(y, 0, height * 0.7, 0, 1);
    let c = lerpColor(color(210, 120, 255), color(255, 204, 100), inter);
    stroke(c);
    line(0, y, width / 2, y);
  }

  noStroke();
  fill(0);
  rect(width / 2, 0, width / 2, height * 0.7);
}

function drawStars() {
  noStroke();
  for (let star of stars) {
    fill(255, star.alpha);
    ellipse(star.x, star.y, star.size);
    star.alpha += random(-2, 2);
    star.alpha = constrain(star.alpha, 100, 255);
  }
}

function drawSun() {
  sunAngle += 0.002;
  let x = width * 0.25 + sin(sunAngle) * 50;
  let y = height * 0.3 + cos(sunAngle) * 30;

  for (let r = 120; r > 20; r -= 20) {
    fill(255, 204, 0, map(r, 120, 20, 0, 100));
    ellipse(x, y, r);
  }

  fill(255, 204, 0);
  ellipse(x, y, 40);
}

function drawMoon() {
  fill(240);
  ellipse(width - 100, 100, 60, 60);
  fill(0);
  ellipse(width - 85, 90, 20, 20);
  ellipse(width - 110, 110, 12, 12);
}

function drawGround() {
  fill(100, 180, 100);
  rect(0, height * 0.7, width / 2, height * 0.3);
}

function drawRoad() {
  fill(60);
  rect(width / 2, height * 0.7, width / 2, height * 0.3);

  stroke(255);
  strokeWeight(4);
  for (let y = height * 0.7 + 10; y < height; y += 40) {
    line(width * 0.75 - 10, y, width * 0.75 + 10, y + 10);
  }
  noStroke();
}

function drawMountains() {
  fill(90, 140, 90);
  beginShape();
  vertex(0, height * 0.7);
  for (let x = 0; x < width / 2; x += 20) {
    let y = height * 0.7 - noise(x * 0.01) * 60;
    vertex(x, y);
  }
  vertex(width / 2, height * 0.7);
  endShape(CLOSE);
}

function drawCityBuildings() {
  for (let b of buildingHeights) {
    fill(50);
    rect(b.x, height * 0.7 - b.h, 40, b.h);
    for (let y = height * 0.7 - b.h + 15; y < height * 0.7; y += 25) {
      fill(random() > 0.7 ? 255 : 80);
      rect(b.x + 10, y, 8, 8);
    }
  }
}

function drawTree() {
  let baseX = width / 4;
  let baseY = height * 0.7;
  fill(100, 50, 0);
  rect(baseX, baseY - 60, 20, 60); // tronco
  fill(34, 139, 34);
  ellipse(baseX + 10, baseY - 70, 60, 60); // copa
}

function updateBalloons() {
  for (let i = balloons.length - 1; i >= 0; i--) {
    balloons[i].update();
    balloons[i].display();
    if (balloons[i].pos.y < 0) balloons.splice(i, 1);
  }
}

class Balloon {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.color = color(random(255), random(200), random(255));
    this.speed = random(0.5, 1.2);
  }

  update() {
    this.pos.y -= this.speed;
    this.pos.x += sin(frameCount * 0.01 + this.pos.y * 0.05) * 0.5;
  }

  display() {
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, 20, 30);
    stroke(80);
    line(this.pos.x, this.pos.y + 15, this.pos.x, this.pos.y + 30);
    noStroke();
  }
}

function updateFlowers() {
  for (let flower of flowers) {
    flower.display();
  }
}

class Flower {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.offset = random(TWO_PI);
  }

  display() {
    let sway = sin(frameCount * 0.03 + this.offset) * 5;
    fill(255, 100, 150);
    for (let a = 0; a < TWO_PI; a += PI / 2) {
      let petalX = this.x + cos(a) * 10 + sway;
      let petalY = this.y + sin(a) * 10;
      ellipse(petalX, petalY, 10, 10);
    }
    fill(255, 200, 0);
    ellipse(this.x + sway, this.y, 8, 8);
  }
}

function updateCars() {
  for (let car of cars) {
    car.update();
    car.display();
  }
}

class Car {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.color = color(random(100, 255), random(100, 255), random(100, 255));
    this.speed = random(1, 2);
  }

  update() {
    this.x -= this.speed;
    if (this.x < width / 2) {
      this.x = width;
    }
  }

  display() {
    fill(this.color);
    rect(this.x, this.y - 10, 50, 20, 4);
    rect(this.x + 10, this.y - 20, 30, 10, 4);
    fill(255, 255, 100);
    ellipse(this.x + 48, this.y, 5, 5);
    fill(255, 0, 0);
    ellipse(this.x + 2, this.y, 5, 5);
    fill(0);
    ellipse(this.x + 10, this.y + 10, 10);
    ellipse(this.x + 40, this.y + 10, 10);
  }
}

function drawText() {
  fill(255);
  textAlign(CENTER);
  textSize(30);
  text("Campo🌥  Cidade🌑 ", width / 2, 50);
}
