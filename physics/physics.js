function Physics(params) {

  this.mass = params.mass !== undefined ? params.mass : 1;

  this.pos = params.position !== undefined ? params.pos : createVector(0, 0);
  this.vel = params.velocity !== undefined ? params.vel : createVector(0, 0);

  this.heading = params.heading !== undefined ? params.heading : 0;
  this.rotation = params.rotation !== undefined ? params.rotation : 0;

  this.impulseMan = ImpulseManager();

  this.mu = params.mu !== undefined ? params.mu : createVector(0, 0);
  this.drag = params.drag !== undefined ? params.drag : createVector(0, 0);

}

const g = 9.81;

Physics.prototype.update = function() {

  var force = impulseMan.pop(world.dt);

  // Acceleration
  if (this.force.x != 0 || this.force.y != 0) this.velocity.add(force.vector.div(this.mass));
  // Rotational Acceleration
  if (this.torque != 0) this.rotation += force.torque / this.mass;

  this.position.add(this.velocity.copy().mult(world.dt));
  this.heading += this.rotation * world.dt;

}

Physics.prototype.momentum = function() {
  var momentum = this.velocity.copy();
  momentum.mult(this.mass);
  return momentum;
}

Physics.prototype.calculateMu = function(breakThrough) {
  var R = this.mass * g;
  return breakThrough / R;
}

Physics.calculateDrag = function(maxForce, maxVel) {
  return maxForce / (maxVel * maxVel);
}

Physics.prototype.applyForce = function(force, time) {
  this.impulseMan.push(new Impulse({
    force: force,
    time: time
  }));
}

Physics.prototype.applyVector = function(vector, time) {
  var force = new Force({
    vector: vector
  });
  this.impulseMan.push(new Impulse({
    force: force,
    time: time
  }));
}

Physics.prototype.applyTorque = function(torque, time) {
  var force = new Force({
    torque: torque
  });
  this.impulseMan.push(new Impulse({
    force: force,
    time: time
  }));
}

Physics.prototype.predictVelocity = function(time) {
  time = time !== undefined ? time : world.dt;
  var force = impulseMan.peek(time);
  return force.vector.div(this.mass).add(this.velocity);
}

Physics.prototype.predictRotation = function(time) {
  time = time !== undefined ? time : world.dt;
  var force = impulseMan.peek(time);
  return force.torque.div(this.mass).add(this.rotation);
}

Physics.prototype.applyFriction = function() {

  var R = this.mass * g;

  if (this.mu.x > 0) {
    var F = this.mu.x * R;
    if (this.vel.magSq() > 0) {
      var normVel = this.vel.copy().normalize();
      var frict = normVel.copy().mult(-F);
      this.applyForce(frict);
      if (p5.Vector.dot(this.vel, this.predictVelocity()) < 0) {
        frict.mult(-1);
        var force = normVel;
        force.mult(-p5.Vector.dot(normVel, this.force.copy()));
        this.applyForce(frict);
        this.applyForce(force);
        this.vel.mult(0);
      }
    } else if (this.force.magSq() > F * F) {
      this.applyForce(this.force.copy().normalize().mult(-F));
    } else {
      this.force.mult(0);
    }
  }

  if (this.mu.y > 0) {
    var F = this.mu.y * R;
    if (this.rotation != 0) {
      this.applyTorque(-F * (this.rotation > 0 ? 1 : -1));
      if ((this.rotation > 0) != (this.predictRotation() > 0)) {
        this.torque = 0;
        this.rotation = 0;
      }
    } else if (abs(this.torque) > F) {
      this.applyTorque(-F * (this.torque > 0 ? 1 : -1));
    } else {
      this.torque = 0;
    }
  }

}

Physics.prototype.applyDrag = function() {

  if (this.drag.x != 0) {
    this.applyForce(this.vel.copy().mult(-this.drag.x * this.vel.mag()));
  }

  if (this.drag.y > 0) {
    var drag = this.drag.y * this.rotation * this.rotation;
    this.applyTorque(this.rotation > 0 ? -drag : drag);
  }

}
