// Import Three.js dari CDN
import * as THREE from "https://cdn.jsdelivr.net/npm/three@latest/build/three.module.js";

// Inisialisasi Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Atur kamera
camera.position.z = 100;

// Tambahkan cahaya
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 3, 5);
scene.add(directionalLight);

// Fungsi untuk membuat planet
function createPlanet(radius, distance, texturePath) {
  const geometry = new THREE.SphereGeometry(radius, 32, 32);
  const texture = new THREE.TextureLoader().load(texturePath);
  const material = new THREE.MeshPhongMaterial({ map: texture });
  const planet = new THREE.Mesh(geometry, material);
  planet.position.x = distance;
  scene.add(planet);

  return planet;
}

// Buat Matahari
const sunTexture = new THREE.TextureLoader().load("source/sun.jpg");
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const sunGeometry = new THREE.SphereGeometry(10, 32, 32); // radius Matahari disesuaikan
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Konfigurasi data planet
const planetsData = [
  {
    name: "Mercury",
    radius: 0.5,
    distance: 15,
    texture: "source/mercury.jpg",
  },
  { name: "Venus", radius: 1, distance: 20, texture: "source/venus.jpeg" },
  { name: "Earth", radius: 1.2, distance: 25, texture: "source/earth.jpg" },
  { name: "Mars", radius: 0.8, distance: 30, texture: "source/mars.jpeg" },
  { name: "Jupiter", radius: 5, distance: 40, texture: "source/jupiter.jpeg" },
  { name: "Saturn", radius: 4, distance: 50, texture: "source/saturn.jpg" },
  { name: "Uranus", radius: 2.5, distance: 60, texture: "source/uranus.jpg" },
  {
    name: "Neptune",
    radius: 2.4,
    distance: 70,
    texture: "source/neptune.png",
  },
];

// Array untuk menyimpan objek planet
const planets = [];

// Buat planet-planet dari data konfigurasi
planetsData.forEach((planetData) => {
  const planet = createPlanet(
    planetData.radius,
    planetData.distance,
    planetData.texture
  );
  planets.push(planet);
});

// Animasi planet berputar
function animate() {
  requestAnimationFrame(animate);

  planets.forEach((planet) => {
    planet.rotation.y += 0.005;
  });

  sun.rotation.y += 0.001; // Rotasi Matahari lebih lambat dari planet

  renderer.render(scene, camera);
}

animate();

// Load background galaksi menggunakan CubeTextureLoader
const loader = new THREE.CubeTextureLoader();
const galaxyTexture = loader.load([
  "source/galaxy.jpg", // right
  "source/galaxy.jpg", // left
  "source/galaxy.jpg", // top
  "source/galaxy.jpg", // bottom
  "source/galaxy.jpg", // front
  "source/galaxy.jpg", // back
]);
scene.background = galaxyTexture;

// Event listener untuk panning
let isDragging = false;
let previousMousePosition = {
  x: 0,
  y: 0,
};

// Event listener untuk mouse down (mulai drag)
renderer.domElement.addEventListener("mousedown", (event) => {
  isDragging = true;
  previousMousePosition = {
    x: event.clientX,
    y: event.clientY,
  };
});

// Event listener untuk mouse up (selesai drag)
renderer.domElement.addEventListener("mouseup", () => {
  isDragging = false;
});

// Event listener untuk mouse move (selama drag)
renderer.domElement.addEventListener("mousemove", (event) => {
  if (isDragging) {
    const deltaMove = {
      x: event.clientX - previousMousePosition.x,
      y: event.clientY - previousMousePosition.y,
    };

    // Mengatur sensitivitas panning
    const sensitivity = 0.1;

    // Menggeser kamera tanpa mempengaruhi posisi objek
    camera.position.x -= deltaMove.x * sensitivity;
    camera.position.y += deltaMove.y * sensitivity;

    // Tetapkan posisi kamera agar tidak terlalu jauh
    const maxDistance = 300;
    camera.position.clampLength(0, maxDistance);

    previousMousePosition = {
      x: event.clientX,
      y: event.clientY,
    };
  }
});

// Event listener untuk saat mouse meninggalkan area renderer
renderer.domElement.addEventListener("mouseout", () => {
  isDragging = false;
});

// Event listener untuk zoom menggunakan mousewheel
function onMouseWheel(event) {
  // Menentukan arah zoom (in atau out) berdasarkan delta mousewheel
  const delta = Math.sign(event.deltaY);

  // Mengatur sensitivitas zoom
  const zoomSpeed = 10;

  // Menggeser posisi kamera
  camera.position.z -= delta * zoomSpeed;

  // Batasan jarak kamera agar tidak terlalu dekat atau terlalu jauh
  const minZoom = 10;
  const maxZoom = 1000;
  camera.position.z = THREE.MathUtils.clamp(
    camera.position.z,
    minZoom,
    maxZoom
  );
}

// Event listener untuk mousewheel
window.addEventListener("wheel", onMouseWheel);
