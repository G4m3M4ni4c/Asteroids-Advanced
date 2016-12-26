function ImpulseManager() {

  this.frameImpulse = new Force({});
  this.impulses = []

}

ImpulseManager.prototype.push = function(impulse) {
  if (!time) return;
  if (this.impulse.time < 0) this.frameImpulse.add(impulse.force);
  else this.impulses.push(impulse);
}

ImpulseManager.prototype.pop = function(time) {
  if (!time || time < 0) return null;
  if (time == 0) return new Force();
  newImpulses = [];
  force = new Force();
  force.add(this.frameImpulse.mult(time));
  for (var i = 0; i < this.impulses.length; i++) {
    var impulse = this.impulses[i];
    if (impulse.time <= time) {
      force.add(impulse.getForce());
    } else {
      force.add(impulse.force);
      impulse.time -= time;
      newImpulses.push(impulse);
    }
  }
  this.frameImpulse = new Force();
  this.impulses = newImpulses;
  return force;
}

ImpulseManager.prototype.peek = function(time) {
  if (!time || time < 0) return null;
  if (time == 0) return new Force();
  force = new Force();
  force.add(this.frameImpulse.copy().mult(time));
  for (var i = 0; i < this.impulses.length; i++) {
    var impulse = this.impulses[i];
    if (impulse.time <= time) force.add(impulse.getForce());
    else force.add(impulse.force.copy().mult(time));
  }
  this.impulses = newImpulses;
  return force;
}
