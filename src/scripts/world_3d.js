import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { Obstacle3D } from './obstacle_3d';
import { Runner3D } from './runner_3d';

const GRAVITY = -9;
const SCREEN_WIDTH = 600;
const SCREEN_HEIGHT = 500;
const MAX_VELOCITY = 500;

class World3D {
  constructor(brain) {
    this.brain = brain;

    this.clock = new THREE.Clock();
    this.obstacles = [];
  };

  initContainer() {
    this.container = document.querySelector('.viewer');
  }

  addScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xa0a0a0);
  }

  addLights() {
    let light;

    light = new THREE.HemisphereLight(0xffffff, 0x444444);
    light.position.set(0, 200, 0);
    this.scene.add(light);

    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 200, 100);
    light.castShadow = true;
    light.shadow.camera.top = 180;
    light.shadow.camera.bottom = - 100;
    light.shadow.camera.left = - 120;
    light.shadow.camera.right = 120;
    this.scene.add(light);
  };

  addGround() {
    const mesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2000, 2000),
      new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }).material
    );
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    this.scene.add(mesh);

    const grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    this.scene.add(grid);
  };

  addCamera() {
    this.camera = new THREE.PerspectiveCamera(
      45, window.innerWidth / window.innerHeight, 1, 2000
    );
    this.camera.position.set(100, 200, 300);
  };

  addRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);
  };

  addControls() {
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.target.set(0, 100, 0);
    controls.update();
  };

  addObstacles() {
    let obstacle;

    obstacle = new Obstacle3D(0, 0, 300);
    this.obstacles.push(obstacle);
    this.scene.add(obstacle.element3d());
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  loadRunner(gltf) {
    this.runner = new Runner3D(this.brain, gltf.scene, gltf.animations[3]);
    this.scene.add(this.runner.object3D());
    this.runner.animate();
  };

  init() {
    this.initContainer();

    this.addScene();
    this.addCamera();
    this.addLights();
    this.addGround();

    const loader = new GLTFLoader();
    loader.load('public/scene.gltf', gltf => this.loadRunner(gltf));

    this.addObstacles();
    this.addRenderer();
    this.addControls();

    window.addEventListener('resize', () => { this.onWindowResize(); }, false);
  };

  animate() {
    requestAnimationFrame(() => { this.animate(); });

    const deltaTime = this.clock.getDelta();

    this.obstacles.forEach(obstacle => obstacle.update(deltaTime));

    if (this.runner) {
      const firstObstacleIndex = 0; //this.obstacles[0].position().x > 20 ? 0 : 1; // 20px is runner width

      const conditions = [
        this.obstacles[firstObstacleIndex].position().x / SCREEN_WIDTH,
        this.obstacles[firstObstacleIndex].position().y / SCREEN_HEIGHT,
        this.obstacles[firstObstacleIndex].width / 100,
        1
      ];

      this.runner.update(deltaTime, conditions);

      // console.log('runner ', this.runner);
      // console.log('runner position', this.runner.position);

      // this.runner.position.z += 100 * delta;
    }

    this.renderer.render(this.scene, this.camera);
  };

  render() {
    this.init();
    this.animate();
  };
}

export { World3D };
