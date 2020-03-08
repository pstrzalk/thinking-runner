import * as THREE from 'three';

class Runner3D {
  constructor(brain, object_3d, run_animation) {
    this._brain = brain;
    this._object3D = object_3d;
    this._run_animation = run_animation;

    this.position = { x: 0, y: 0, z: 0 };
    this.velocity = { x: 0, y: 0, z: 0 };
    this.bigJumpAcceleration = 50;
    this.smallJumpAcceleration = 30;


    this._object3D.scale.x = .1;
    this._object3D.scale.y = .1;
    this._object3D.scale.z = .1;
  };

  object3D() {
    return this._object3D;
  };

  animate() {
    this.mixer = new THREE.AnimationMixer(this.object3D());
    const animation = this.mixer.clipAction(this._run_animation);

    animation.setLoop();
    animation.enable = true;
    animation.play();
  };

  update(deltaTime, conditions = []) {
    if (this._object3D.position.y <= 0.001) {
      const action = this._brain.chooseAction(conditions);
      console.log(action);

      switch (action) {
        case 'bigJump':
          this.velocity.y += this.bigJumpAcceleration;
          break;
        case 'smallJump':
          this.velocity.y += this.smallJumpAcceleration;
          break;
        default:
          this.velocity.y = 0;
      }
    } else {
      this.velocity.y += -9;
    }

    // Smooth the jump a bit
    if (this.velocity.y > 0 && this._object3D.position.y > this.height * 1.8) {
      this.velocity.y /= 1.4;
    }
    if (this.velocity.y < 0) {
      this.velocity.y *= 1.1;
    }

    // Move the bastard
    this._object3D.position.y += this.velocity.y;
    this._object3D.position.y = Math.max(this._object3D.position.y, 0); // Hit the ground if needed

    this.score += 1;

    if (this.mixer) {
      this.mixer.update(deltaTime);
    }
  };
}

export { Runner3D };
