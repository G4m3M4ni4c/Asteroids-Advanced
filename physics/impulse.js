function Impulse(params) {

  this.force = params.force !== undefined ? params.force : new Force({});
  this.time = params.time !== undefined ? params.time : -1;

}

Impulse.prototype.getForce = function() {
  var dt = this.time < 0 ? world.dt : this.time;
  return this.force.copy().mult(dt);
}

Impulse.prototype.getVector = function() {
  var dt = this.time < 0 ? world.dt : this.time;
  return this.force.vector.copy().mult(dt);
}

Impulse.prototype.getTorque = function() {
  var dt = this.time < 0 ? world.dt : this.time;
  return this.force.torque * dt;
}
