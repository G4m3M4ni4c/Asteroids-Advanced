function Entity(params) {
  Physics.call(this, params);
  this.id = -1;
  this.canCollide = true;
  this.dead = false;
  this.r = params.r !== undefined ? params.r : 1;
  this.owner = params.owner !== undefined ? params.owner : -1;
}

Entity.prototype.registerId = function(id) {
  this.id = id;
}

Entity.prototype.edges = function() {
  if (this.pos.x - this.r > world.halfwidth) {
    this.pos.x = this.pos.x % world.halfwidth - world.halfwidth;
  } else if (this.pos.x + this.r < -world.halfwidth) {
    this.pos.x = this.pos.x % world.halfwidth + world.halfwidth;
  }
  if (this.pos.y - this.r > world.halfheight) {
    this.pos.y = this.pos.y % world.halfheight - world.halfheight;
  } else if (this.pos.y + this.r < -world.halfheight) {
    this.pos.y = this.pos.y % world.halfheight + world.halfheight;
  }
  var playerPos = world.getLocalPlayer().getEntity().pos;
  var relPos = p5.Vector.sub(this.pos, playerPos);
  var halfWinWid = windowWidth / 2;
  var halfWinHig = windowHeight / 2
  if      (relPos.x + world.width  - this.r <  halfWinWid) this.pos.x += world.width;
  else if (relPos.x - world.width  + this.r > -halfWinWid) this.pos.x -= world.width;
  if      (relPos.y + world.height - this.r <  halfWinHig) this.pos.y += world.height;
  else if (relPos.y - world.height + this.r > -halfWinHig) this.pos.y -= world.height;
}

Entity.prototype.globalPoint = function(localPoint) {
  var point = localPoint.copy();
  point.rotate(this.heading);
  point.add(this.pos);
  return point;
}

Entity.prototype.globalVertices = function(localVerts) {
  var globalVerts = [];
  for (var i = 0; i < localVerts.length; i++) {
    globalVerts.push(localVerts[i].copy().rotate(this.heading).add(this.pos));
  }
  return globalVerts;
}

Entity.prototype.collides = function(entity) {
  if (!(this.canCollide && entity.canCollide)) {
    return false;
  }

  var dx = this.pos.x - entity.pos.x;
  var dy = this.pos.y - entity.pos.y;
  var dr = this.r + entity.r;
  return dx * dx + dy * dy <= dr * dr;
}

Entity.prototype.collision = function() {}

Entity.prototype.update = function() {
  if (this.dead) {
    return true;
  }

  Physics.prototype.update.call(this);

  this.edges();
}

Entity.prototype.render = function() {
  push();
  translate(this.pos.x, this.pos.y);
  rotate(this.heading);
  fill(0);
  stroke(255);
  ellipse(this.pos.x, this.pos.y, this.r);
  pop();
}

Entity.prototype = Object.create(Physics.prototype);
