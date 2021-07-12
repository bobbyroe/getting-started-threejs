import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js";

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

const geometry = new THREE.SphereGeometry();
const material = new THREE.MeshNormalMaterial({ flatShading: true });

function getBall() {
  const ball = new THREE.Mesh(geometry, material);
  ball.position.x = THREE.MathUtils.randFloatSpread(10); 
  ball.position.z = THREE.MathUtils.randFloatSpread(10); 
  ball.rotation.x = THREE.MathUtils.randFloatSpread(Math.PI); 
  return ball;
}

let numBalls = 20;
for (let i = 0; i < numBalls; i += 1) {
  let ball = getBall();
  scene.add(ball);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
