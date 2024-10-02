import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";

let paused = false;
const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.set(0, 4, 10);
const renderer = new THREE.WebGLRenderer({ antiAlias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const geometry = new THREE.SphereGeometry(1, 9, 6);
const material = new THREE.MeshNormalMaterial({ flatShading: true });

function getBall() {
  const radius = 1.0;
  const mesh = new THREE.Mesh(geometry, material);
  mesh.scale.setScalar(radius);
  let x = THREE.MathUtils.randFloatSpread(10);
  let z = THREE.MathUtils.randFloatSpread(10);
  mesh.rotation.x = THREE.MathUtils.randFloatSpread(Math.PI);
  mesh.position.x = x;
  mesh.position.z = z;
  const velocity = {
    x: 0,
    z: 0,
  };

  const repelStrength = 0.0002;
  const dampingMult = 0.98;
  function update(allBalls) {
    velocity.x *= dampingMult;
    velocity.z *= dampingMult;
    x += velocity.x;
    z += velocity.z;
    mesh.position.x = x;
    mesh.position.z = z;

    // This code is not optimized!
    const direction = new THREE.Vector3();
    allBalls.forEach((b) => {
      const dist = b.position.distanceTo(mesh.position);

      if (dist < radius * 2) {
        direction
          .subVectors(b.position, mesh.position)
          .normalize()
          .multiplyScalar(repelStrength);
        b.userData.velocity.x += direction.x;
        b.userData.velocity.z += direction.z;
      }
    });
  }
  mesh.userData = {
    update,
    velocity,
  }
  return mesh;
}

const ballGroup = new THREE.Group();
ballGroup.userData.update = () => {
  ballGroup.children.forEach((b) => b.userData.update(ballGroup.children));
};

ballGroup.userData.disruptBalls = () => {
  const direction = new THREE.Vector3();
  ballGroup.children.forEach((b) => {
    direction
      .subVectors(new THREE.Vector3(), b.position)
      .normalize()
      .multiplyScalar(Math.random() * 0.05 + 0.05);
    b.userData.velocity.x += direction.x;
    b.userData.velocity.z += direction.z;
  });
};

scene.add(ballGroup);

let numBalls = 20;
for (let i = 0; i < numBalls; i += 1) {
  let ball = getBall();
  ballGroup.add(ball);
}

function animate() {
  requestAnimationFrame(animate);
  if (paused === false) {
    ballGroup.userData.update();
  }
  controls.update();
  renderer.render(scene, camera);
}

animate();

function keyHandler(evt) {
  const { key } = evt;
  const SPACE = " ";
  const ESC = "Escape";
  if (key === SPACE) {
    ballGroup.userData.disruptBalls();
  }
  if (key === ESC) {
    paused = !paused;
  }
}
window.addEventListener("keydown", keyHandler);

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", handleWindowResize, false);
