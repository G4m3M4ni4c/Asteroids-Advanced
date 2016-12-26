// Daniel Shiffman
// http://codingrainbow.com
// http://patreon.com/codingrainbow
// Code for: https://youtu.be/hacZU523FyM

function Laser(world, params) {
  params.r = params.r !== undefined ? params.r : 4;
  Entity.call(this, params);

  this.velocity = p5.Vector.fromAngle(params.heading).mult(2400);
  this.velocity.add(params.initialVel);
  this.c = params.c ? params.c : color(255);
  this.duration = params.duration !== undefined ? params.duration : 20;
  var maxDuration = this.duration;

  playSoundEffect(laserSoundEffect[floor(random(3))]);

  this.update = function() {
    this.duration--;
    return Entity.prototype.update.call(this) || this.duration < 0;
  }

  this.render = function() {
    push();
    translate(this.position.x, this.position.y);
    colorMode(RGB);
    stroke(red(this.c), green(this.c), blue(this.c), 55 + 200 * this.duration / maxDuration);
    strokeWeight(this.r);
    strokeCap(SQUARE);
    var halfLine = this.velocity.copy().mult(0.5 * world.pdt);
    line(-halfLine.x, -halfLine.y, halfLine.x, halfLine.y);
    pop();
  }


  this.collides = function(entity) {
    var tail = p5.Vector.sub(this.position, this.velocity.copy().mult(world.pdt));
    if (entity.toString() !== "[object Asteroid]"
      || !(Entity.prototype.collides.call(this, entity) || lineIntersectCircle(this.position, tail, entity.position, entity.r))) {
      return false;
    }
    var verts = entity.shape.vertices;
    var localPos = p5.Vector.sub(this.position, entity.position).rotate(-entity.heading);
    if (Shape.contains(verts, localPos)) return true;
    var localTail = p5.Vector.sub(tail, entity.position).rotate(-entity.heading);
    for (var i = 0, j = entity.total - 1; i < entity.total; j = i++)
      if (lineIntersect(verts[i], verts[j], localPos, localTail)) return true;
    return false;
  }

  this.collision = function(entity) {
    if (entity.toString() === "[object Asteroid]") {
      this.dead = true;
    }
  }

  this.toString = function() {
    return "[object Laser]";
  }
}

Laser.prototype = Object.create(Entity.prototype);
