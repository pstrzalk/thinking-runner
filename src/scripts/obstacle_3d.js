import * as THREE from 'three';

class Obstacle3D {
  constructor(x, y, z) {
    this.velocity = { x: 0, y: 0, z: -20 };

    this.width = y > 0 ? 20 : (Math.floor(Math.random() * 80) + 20);
    this._element3d = new THREE.Mesh(
      new THREE.CubeGeometry(20, 20, this.width), new THREE.MeshNormalMaterial()
    );

    this._element3d.position.x = x;
    this._element3d.position.y = y;
    this._element3d.position.z = z;
  };

  element3d() {
    return this._element3d;
  };

  position() {
    return this.element3d().position;
  }

  update(deltaTime) {
    this._element3d.position.x += this.velocity.x * deltaTime;
    this._element3d.position.y += this.velocity.y * deltaTime;
    this._element3d.position.z += this.velocity.z * deltaTime;
  };
};

export { Obstacle3D };
