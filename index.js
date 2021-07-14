import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js";

let paused = true;
const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 10;
camera.position.y = 4;
const renderer = new THREE.WebGLRenderer({ antiAlias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

const radius = 1.0;
const geometry = new THREE.SphereGeometry(radius);
const material = new THREE.MeshNormalMaterial({ flatShading: true });

function getBall() {
  const mesh = new THREE.Mesh(geometry, material);
  let x = THREE.MathUtils.randFloatSpread(10);
  let z = THREE.MathUtils.randFloatSpread(10);
  mesh.rotation.x = THREE.MathUtils.randFloatSpread(Math.PI);
  mesh.position.x = x;
  mesh.position.z = z;
  const velocity = {
    x: 0,
    z: 0,
  };

  const repelStrength = 0.0001;
  const dampingMult = 0.98;
  function update(allBalls) {
    velocity.x *= dampingMult;
    velocity.z *= dampingMult;
    x += velocity.x;
    z += velocity.z;
    mesh.position.x = x;
    mesh.position.z = z;

    // This code is not optimized!
    const direction = new THREE.Vector3(0, 0, 0);
    allBalls.forEach((b) => {
      const dist = b.mesh.position.distanceTo(mesh.position);

      if (dist < radius * 2) {
        direction
          .subVectors(b.mesh.position, mesh.position)
          .normalize()
          .multiplyScalar(repelStrength);
        b.velocity.x += direction.x;
        b.velocity.z += direction.z;
      }
    });
  }

  return {
    mesh,
    velocity,
    update,
  };
  Ô;
}

const balls = [];
let numBalls = 20;
for (let i = 0; i < numBalls; i += 1) {
  let ball = getBall();
  scene.add(ball.mesh);
  balls.push(ball);
}

function animate() {
  requestAnimationFrame(animate);
  if (paused === false) {
    balls.forEach((b) => b.update(balls));
  }
  renderer.render(scene, camera);
}

animate();

function disruptBalls() {
  const direction = new THREE.Vector3(0, 0, 0);
  balls.forEach((b) => {
    direction
      .subVectors(new THREE.Vector3(0, 0, 0), b.mesh.position)
      .normalize()
      .multiplyScalar(Math.random() * 0.05 + 0.05);
    b.velocity.x += direction.x;
    b.velocity.z += direction.z;
  });
}

function keyHandler(evt) {
  const { key } = evt;
  const SPACE = " ";
  const ESC = "Escape";
  if (key === SPACE) {
    disruptBalls();
  }
  if (key === ESC) {
    paused = !paused;
  }
}

window.addEventListener("keydown", keyHandler);
