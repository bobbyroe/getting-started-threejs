import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antiAlias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });

const box = new THREE.Mesh(geometry, material);
scene.add(box);

function animate() {
  requestAnimationFrame(animate);
  box.rotation.y += 0.02;
  box.rotation.z += 0.01;
  renderer.render(scene, camera);
}

animate();
