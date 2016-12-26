function Force(params) {

  this.vector = params.vector !== undefined ? params.vector : createVector(0, 0);
  this.torque = params.torque !== undefined ? params.torque : 0;

  this.copy = function() {
    return new Force({
      vector: this.vector,
      torque: this.torque
    });
  }

}

Force.prototype.add = function(force) {
  this.vector.add(force.vector);
  this.torque += force.torque;
  return this;
}

Force.prototype.sub = function(force) {
  this.vector.add(-force.vector);
  this.torque -= force.torque;
  return this;
}

Force.prototype.mult = function(amount) {
  this.vector.mult(amount);
  this.torque *= amount;
  return this;
}

Force.prototype.div = function(amount) {
  this.vector.div(amount);
  this.torque /= amount;
  return this;
}

Force.getForce = function(point, vector) {
  force = new Force({
    vector: Force.getVector(point, vector),
    torque: Force.getTorque(point , vector)
  });
  return force;
}

Force.getVector = function(point, vector) {
  return p5.Vector.dot(point, vector) / point.mag();
}

Force.getTorque = function(point, vector) {
  return cross(point, vector);
}

Force.add = function(f1, f2) {
  force = f1.copy();
  force.add(f2);
  return force;
}

Force.sub = function(f1, f2) {
  force = f1.copy();
  force.sub(f2);
  return force;
}

Force.mult = function(f1, a) {
  force = f1.copy();
  force.mult(a);
  return force;
}

Force.div = function(f1, a) {
  force = f1.copy();
  force.div(a);
  return force;
}
