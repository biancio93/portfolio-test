/* ======================================================
IMPORT
====================================================== */
import * as THREE from "three";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(TextPlugin);

/* ======================================================
CANVAS
====================================================== */
const canvas = document.querySelector("canvas.main-scene");

/* ======================================================
SCENE
====================================================== */
const scene = new THREE.Scene();

/* =========================================================
FOG
========================================================= */
const fog = new THREE.Fog("#280f36", 150, 250);
scene.fog = fog;

/* ======================================================
MATERIAL
====================================================== */
// initialize textureloader
const textureLoader = new THREE.TextureLoader();

// Gradient
const gradientTexture = textureLoader.load("/textures/gradients/5.jpg");

// Stars
const particlesTexture = textureLoader.load("/textures/stars/1.png");

gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.generateMipmaps = false;

// Planet_1
const texturePlanet_1 = textureLoader.load('/textures/planets/planet_2/color-subplanet.png');
const textureSubPlanet_1 = textureLoader.load('/textures/planets/planet_2/color-atmosphere.png');
const texturePlanet_1_Height = textureLoader.load('/textures/planets/planet_2/texture-lava-height.jpg');
const texturePlanet_1_Occlusion = textureLoader.load('/textures/planets/planet_2/texture-lava-Occlusion.jpg');
// Planet_3
const texturePlanet_3 = textureLoader.load('/textures/planets/planet_3/color.jpg');
const ringPlanet_3 = textureLoader.load('/textures/planets/planet_3/ring.jpg');
const texturePlanet_3_Occlusion = textureLoader.load('/textures/planets/planet_3/occlusion.jpg');
// const texturePlanet_3_Occlusion = textureLoader.load('/textures/planets/planet_2/texture-lava-Occlusion.jpg');

/* ======================================================
STARS
====================================================== */
// Geometry
const particlesGeometry = new THREE.BufferGeometry();
const count = 500;

const positions = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 300;
}

//material
const particlesMaterial = new THREE.PointsMaterial({
  size: 2,
  sizeAttenuation: true,
  map: particlesTexture,
  transparent: true,
  alphaMap: particlesTexture,
  // alphaTest : 0.001
  //depthTest: false,
});

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

/* ======================================================
OBJECT
====================================================== */
const orbitPlanet_1_size = 40;
const orbitPlanet_2_size = 56;
const orbitPlanet_3_size = 96;

// SUN
const sunGeometry = new THREE.SphereGeometry(16, 16, 16);
const sunMaterial = new THREE.MeshToonMaterial({ color: 0xf39e5c });
sunMaterial.gradientMap = gradientTexture;
const sunSphere = new THREE.Mesh(sunGeometry, sunMaterial);
sunSphere.position.set(0, 0, 0);
scene.add(sunSphere);

// PLANET #1
const planet_1_Geometry = new THREE.SphereGeometry(4, 16, 32);
const planet_1_Material = new THREE.MeshStandardMaterial();
// planet_1_Material.gradientMap = gradientTexture;
planet_1_Material.map = texturePlanet_1;
const planet_1_Sphere = new THREE.Mesh(planet_1_Geometry, planet_1_Material);
planet_1_Sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(planet_1_Sphere.geometry.attributes.uv.array, 2));
planet_1_Material.aoMap = texturePlanet_1_Occlusion;
planet_1_Material.aoMapIntensity = 0.5;
planet_1_Material.displacementMap = texturePlanet_1_Height;
planet_1_Material.displacementScale = 1;
planet_1_Sphere.position.set(34, 0, 0);
scene.add(planet_1_Sphere);

// Planet Orbit Path
const planet_1_OrbitGeometry = new THREE.CircleGeometry(orbitPlanet_1_size, 64);
const planet_1_OrbitMaterial = new THREE.PointsMaterial({
  color: 0x32f6f3,
  size: 0.3,
  sizeAttenuation: true,
});
const planet_1_OrbitParticles = new THREE.Points(
  planet_1_OrbitGeometry,
  planet_1_OrbitMaterial
);
planet_1_OrbitParticles.rotation.x = Math.PI * 0.5;
scene.add(planet_1_OrbitParticles);
// ATMOSPHERE PLANET #1
const planet_1_Atmosphere_Geometry = new THREE.SphereGeometry(4.5, 16, 16);
const planet_standard_Atmosphere_Material = new THREE.MeshStandardMaterial({
  color: 0x69a8cf,
});
const planet_1_Atmosphere_Material = new THREE.MeshStandardMaterial({
  color: 0xf5a214,
});
planet_standard_Atmosphere_Material.transparent = true;
planet_standard_Atmosphere_Material.opacity = 0.2;
planet_1_Atmosphere_Material.map = textureSubPlanet_1;
planet_1_Atmosphere_Material.transparent = true;
planet_1_Atmosphere_Material.opacity = 0.2;
planet_1_Atmosphere_Material.displacementScale = 0.05;
const planet_1_Atmosphere = new THREE.Mesh(
  planet_1_Atmosphere_Geometry,
  planet_1_Atmosphere_Material
);
scene.add(planet_1_Atmosphere);
// ATMOSPHERE PLANET #1 CUSTOM DATA
planet_1_Atmosphere.name = "homepage";
planet_1_Atmosphere.landingPositionUpdate = false;
planet_1_Atmosphere.landingPosition = {
  x: planet_1_Atmosphere.position.x,
  y: planet_1_Atmosphere.position.y,
  z: planet_1_Atmosphere.position.z,
};

// PLANET #1 - MOON
const moon_1_Geometry = new THREE.SphereGeometry(0.7, 16, 16);
const moon_1_Material = new THREE.MeshToonMaterial({color: 0xFFFCA2});
moon_1_Material.transparent = true;
moon_1_Material.gradientMap = gradientTexture;
moon_1_Material.shininess = 100
const moon_1_Sphere = new THREE.Mesh(moon_1_Geometry, moon_1_Material);
scene.add(moon_1_Sphere);
// Moon Orbit Path
const moon_1_OrbitGeometry = new THREE.CircleGeometry(6, 16);
const moon_1_OrbitMaterial = new THREE.PointsMaterial({
  color: 0x32f6f3,
  size: 0.3,
  sizeAttenuation: true,
});
const moon_1_OrbitParticles = new THREE.Points(
  moon_1_OrbitGeometry,
  moon_1_OrbitMaterial
);
moon_1_OrbitParticles.rotation.x = Math.PI * 0.5;
scene.add(moon_1_OrbitParticles);

// PLANET #2
const planet_2_Geometry = new THREE.SphereGeometry(6, 16, 16);
const planet_2_Material = new THREE.MeshStandardMaterial();
planet_2_Material.displacementScale = 0.05;
// planet_2_Material.gradientMap = gradientTexture;
// planet_2_Material.map = texturePlanet_2;
const planet_2_Sphere = new THREE.Mesh(planet_2_Geometry, planet_2_Material);
scene.add(planet_2_Sphere);
// Planet Orbit Path
const planet_2_OrbitGeometry = new THREE.CircleGeometry(orbitPlanet_2_size, 64);
const planet_2_OrbitMaterial = new THREE.PointsMaterial({
  color: 0x32f6f3,
  size: 0.3,
  sizeAttenuation: true,
});
const planet_2_OrbitParticles = new THREE.Points(
  planet_2_OrbitGeometry,
  planet_2_OrbitMaterial
);
planet_2_OrbitParticles.rotation.x = Math.PI * 0.5;
scene.add(planet_2_OrbitParticles);
// ATMOSPHERE PLANET #2
const planet_2_Atmosphere_Geometry = new THREE.SphereGeometry(6.5, 16, 32);
const planet_2_Atmosphere = new THREE.Mesh(
  planet_2_Atmosphere_Geometry,
  planet_standard_Atmosphere_Material
);
scene.add(planet_2_Atmosphere);
// ATMOSPHERE PLANET #1 CUSTOM DATA
planet_2_Atmosphere.name = "about";
planet_2_Atmosphere.landingPositionUpdate = false;
planet_2_Atmosphere.landingPosition = {
  x: planet_2_Atmosphere.position.x,
  y: planet_2_Atmosphere.position.y,
  z: planet_2_Atmosphere.position.z,
};

// PLANET #3
const planet_3_Geometry = new THREE.SphereGeometry(5, 16, 128);
const planet_3_Material = new THREE.MeshStandardMaterial();
// planet_3_Material.gradientMap = gradientTexture;
planet_3_Material.map = texturePlanet_3;
planet_2_Material.displacementScale = 0.05;
const planet_3_Sphere = new THREE.Mesh(planet_3_Geometry, planet_3_Material);
planet_3_Sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(planet_3_Sphere.geometry.attributes.uv.array, 2));
planet_3_Material.aoMap = texturePlanet_3_Occlusion;
planet_3_Material.aoMapIntensity = 1;
// planet_3_Material.displacementMap = texturePlanet_3_Height;
// planet_3_Material.displacementScale = 0.25;
scene.add(planet_3_Sphere);
// Planet Orbit Path
const planet_3_OrbitGeometry = new THREE.CircleGeometry(
  orbitPlanet_3_size,
  128
);
const planet_3_OrbitMaterial = new THREE.PointsMaterial({
  color: 0x32f6f3,
  size: 0.3,
  sizeAttenuation: true,
});
const planet_3_OrbitParticles = new THREE.Points(
  planet_3_OrbitGeometry,
  planet_3_OrbitMaterial
);
planet_3_OrbitParticles.rotation.x = Math.PI * 0.5;
scene.add(planet_3_OrbitParticles);
// ATMOSPHERE PLANET #3
const planet_3_Atmosphere_Geometry = new THREE.SphereGeometry(5.5, 16, 16);
const planet_3_Atmosphere = new THREE.Mesh(
  planet_3_Atmosphere_Geometry,
  planet_standard_Atmosphere_Material
);
scene.add(planet_3_Atmosphere);
// RING PLANET #3
const planet_3_Ring_Geometry = new THREE.RingGeometry( 10, 7, 32 ); 
const planet_3_Ring_Material = new THREE.MeshBasicMaterial( { color: 0xA57617, side: THREE.DoubleSide } );
planet_3_Ring_Material.displacementScale = 0.05;
planet_3_Ring_Material.map = ringPlanet_3;

let uvs = planet_3_Ring_Geometry.attributes.uv.array;
// loop and initialization taken from RingBufferGeometry
let phiSegments = planet_3_Ring_Geometry.parameters.phiSegments || 0;
let thetaSegments = planet_3_Ring_Geometry.parameters.thetaSegments || 0;
phiSegments = phiSegments !== undefined ? Math.max( 1, phiSegments ) : 1;
thetaSegments = thetaSegments !== undefined ? Math.max( 3, thetaSegments ) : 8;
for ( let c = 0, j = 0; j <= phiSegments; j ++ ) {
    for ( let i = 0; i <= thetaSegments; i ++ ) {
        uvs[c++] = i / thetaSegments,
        uvs[c++] = j / phiSegments;
        
    }
}

const planet_3_Ring = new THREE.Mesh( planet_3_Ring_Geometry, planet_3_Ring_Material ); 
planet_3_Ring.rotation.x = Math.PI * 0.55;
scene.add( planet_3_Ring );
// ATMOSPHERE PLANET #1 CUSTOM DATA
planet_3_Atmosphere.name = "portfolio";
planet_3_Atmosphere.landingPositionUpdate = false;
planet_3_Atmosphere.landingPosition = {
  x: planet_3_Atmosphere.position.x,
  y: planet_3_Atmosphere.position.y,
  z: planet_3_Atmosphere.position.z,
};

/* ======================================================
LIGHT
====================================================== */
// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// Point Light
const directionalLight = new THREE.DirectionalLight(0xC84578, 0.2);
directionalLight.castShadow = true;
directionalLight.position.set(10, 10, 56);
// directionalLight.position.set(0, 0, 0);
scene.add(directionalLight);

/* ======================================================
SIZES
====================================================== */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // movment lineart
  cw = lineCanvas.width = window.innerWidth;
  ch = lineCanvas.height = window.innerHeight;
  updateLines();
});

/* ======================================================
CAMERA
====================================================== */
// Base camera
const camera = new THREE.PerspectiveCamera(
  50,
  sizes.width / sizes.height,
  0.1,
  250
);
camera.position.z = 200;
camera.position.x = 0;
camera.position.y = 70;
camera.lookAt(0, 0, 0);
scene.add(camera);

/* =============================================
CANVAS
============================================= */

//FUNZIONE ROTAZIONE TRIANGOLO
function rotateTriangle(original, center, angle) {
  // Calculate the difference vectors between the center and each point
  let v1 = [original[0][0] - center[0], original[0][1] - center[1]];
  let v2 = [original[1][0] - center[0], original[1][1] - center[1]];
  let v3 = [original[2][0] - center[0], original[2][1] - center[1]];
  let v4 = [original[3][0] - center[0], original[3][1] - center[1]];

  // Convert angle to radians
  angle = (angle * Math.PI) / 180;

  // Perform the rotation on each difference vector
  let v1_rotated = [
    v1[0] * Math.cos(angle) - v1[1] * Math.sin(angle),
    v1[0] * Math.sin(angle) + v1[1] * Math.cos(angle),
  ];
  let v2_rotated = [
    v2[0] * Math.cos(angle) - v2[1] * Math.sin(angle),
    v2[0] * Math.sin(angle) + v2[1] * Math.cos(angle),
  ];
  let v3_rotated = [
    v3[0] * Math.cos(angle) - v3[1] * Math.sin(angle),
    v3[0] * Math.sin(angle) + v3[1] * Math.cos(angle),
  ];
  let v4_rotated = [
    v4[0] * Math.cos(angle) - v4[1] * Math.sin(angle),
    v4[0] * Math.sin(angle) + v4[1] * Math.cos(angle),
  ];

  // Add the rotated difference vectors to the center to get the rotated points
  const rotated = [
    [center[0] + v1_rotated[0], center[1] + v1_rotated[1]],
    [center[0] + v2_rotated[0], center[1] + v2_rotated[1]],
    [center[0] + v3_rotated[0], center[1] + v3_rotated[1]],
    [center[0] + v4_rotated[0], center[1] + v4_rotated[1]],
  ];

  return rotated;
}

//POSIZIONE TRIANGOLO
let canvasMap = document.querySelector(".map");

let mapPlanet = canvasMap.getContext("2d");

mapPlanet.translate(canvasMap.width / 2, canvasMap.height / 2);

let sunSphere_mapX = sunSphere.position.x;
let sunSphere_mapZ = sunSphere.position.z;

let planet_1_mapX = planet_1_Sphere.position.x;
let planet_1_mapZ = planet_1_Sphere.position.z;

let planet_2_mapX = planet_2_Sphere.position.x;
let planet_2_mapZ = planet_2_Sphere.position.z;

let planet_3_mapX = planet_3_Sphere.position.x;
let planet_3_mapZ = planet_3_Sphere.position.z;

let user_mapX = camera.position.x;
let user_mapZ = camera.position.z;
let user_mapRotationY = camera.rotation.y;

let objectZoomLevel = {
  zoomLevel: 0.7,
};
let mapZoomLevel = objectZoomLevel.zoomLevel;

// ZOOM IN & ZOOM OUT MAPPA
let allowZoom = false;
let allowZoomRepo = false;
function mapZoomLevelIN() {
  allowZoom = true;
  if (allowZoom !== allowZoomRepo) {
    gsap.to(objectZoomLevel, { duration: 0.4, zoomLevel: 1.2 });
  }
  allowZoomRepo = true;
}
function mapZoomLevelOUT() {
  allowZoom = false;
  if (allowZoom !== allowZoomRepo) {
    gsap.to(objectZoomLevel, { duration: 0.4, zoomLevel: 0.7 });
  }
  allowZoomRepo = false;
}

let planet_1_fill = "#532D2B";
let planet_2_fill = "#532D2B";
let planet_3_fill = "#532D2B";

function redrawMap(
  user_mapX,
  user_mapZ,
  user_mapRotationY,
  planet_1_mapX,
  planet_1_mapZ,
  planet_2_mapX,
  planet_2_mapZ,
  planet_3_mapX,
  planet_3_mapZ
) {
  mapPlanet.clearRect(
    -canvasMap.width / 2,
    -canvasMap.height / 2,
    canvas.width,
    canvas.height
  );

  // Sun map position
  mapPlanet.beginPath();
  mapPlanet.arc(sunSphere_mapX, sunSphere_mapZ, 10, 0, 2 * Math.PI);
  mapPlanet.strokeStyle = "#FEA500";
  mapPlanet.stroke();
  mapPlanet.fillStyle = "#FEA500";
  mapPlanet.fill();
  // Planet 1 orbit position
  mapPlanet.beginPath();
  mapPlanet.arc(0, 0, orbitPlanet_1_size * mapZoomLevel, 0, 2 * Math.PI);
  mapPlanet.strokeStyle = "#8F6952";
  mapPlanet.stroke();
  // Planet 1 map position
  mapPlanet.beginPath();
  mapPlanet.arc(
    planet_1_mapX * mapZoomLevel,
    planet_1_mapZ * mapZoomLevel,
    5,
    0,
    2 * Math.PI
  );
  mapPlanet.strokeStyle = "#FEA500";
  mapPlanet.stroke();
  mapPlanet.fillStyle = planet_1_fill;
  mapPlanet.fill();
  mapPlanet.closePath();

  // Planet 2 orbit position
  mapPlanet.beginPath();
  mapPlanet.arc(0, 0, orbitPlanet_2_size * mapZoomLevel, 0, 2 * Math.PI);
  mapPlanet.strokeStyle = "#8F6952";
  mapPlanet.stroke();
  // Planet 2 map position
  mapPlanet.beginPath();
  mapPlanet.arc(
    planet_2_mapX * mapZoomLevel,
    planet_2_mapZ * mapZoomLevel,
    5,
    0,
    2 * Math.PI
  );
  mapPlanet.strokeStyle = "#FEA500";
  mapPlanet.stroke();
  mapPlanet.fillStyle = planet_2_fill;
  mapPlanet.fill();
  mapPlanet.closePath();

  // Planet 3 orbit position
  mapPlanet.beginPath();
  mapPlanet.arc(0, 0, orbitPlanet_3_size * mapZoomLevel, 0, 2 * Math.PI);
  mapPlanet.strokeStyle = "#8F6952";
  mapPlanet.stroke();
  // Planet 3 map position
  mapPlanet.beginPath();
  mapPlanet.arc(
    planet_3_mapX * mapZoomLevel,
    planet_3_mapZ * mapZoomLevel,
    5,
    0,
    2 * Math.PI
  );
  mapPlanet.strokeStyle = "#FEA500";
  mapPlanet.stroke();
  mapPlanet.fillStyle = planet_3_fill;
  mapPlanet.fill();
  mapPlanet.closePath();

  mapPlanet.beginPath();
  //mapPlanet.arc(user_mapX, user_mapZ, 5, 0, 2 * Math.PI);
  mapPlanet.fillStyle = "#FEA500";
  mapPlanet.fill();

  mapPlanet.beginPath();
  mapPlanet.moveTo(user_mapX * mapZoomLevel, user_mapZ * mapZoomLevel);
  // definizione angolo
  let starterVertexXB = user_mapX * mapZoomLevel - 10;
  let starterVertexXC = user_mapX * mapZoomLevel + 10;
  let starterVertexXD = user_mapX * mapZoomLevel + 0;
  let starterVertexYB = user_mapZ * mapZoomLevel + 20;
  let starterVertexYC = user_mapZ * mapZoomLevel + 20;
  let starterVertexYD = user_mapZ * mapZoomLevel + 15;
  let original = [
    [user_mapX, user_mapZ],
    [starterVertexXB, starterVertexYB],
    [starterVertexXD, starterVertexYD],
    [starterVertexXC, starterVertexYC],
  ];
  let center = [user_mapX * mapZoomLevel, user_mapZ * mapZoomLevel];
  let angle = user_mapRotationY;
  let rotated = rotateTriangle(original, center, angle);

  mapPlanet.lineTo(rotated[1][0], rotated[1][1]);
  mapPlanet.lineTo(rotated[2][0], rotated[2][1]);
  mapPlanet.lineTo(rotated[3][0], rotated[3][1]);
  mapPlanet.fill();
}

/* ======================================================
RENDERER
====================================================== */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/* ======================================================
POST PROCESSING
====================================================== */

const effectComposer = new EffectComposer(renderer);
effectComposer.setSize(sizes.width, sizes.height);
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const renderPass = new RenderPass(scene, camera);
renderPass.clearColor = new THREE.Color(0x280f36);
renderPass.clearAlpha = 0.2;
effectComposer.addPass(renderPass);

const params = {
  threshold: 0,
  strength: 1,
  radius: 1.5,
  exposure: '0.5'
};

const unrealBloomPass = new UnrealBloomPass();
unrealBloomPass.threshold = params.threshold;
unrealBloomPass.strength = params.strength;
unrealBloomPass.radius = params.radius;
unrealBloomPass.exposure = params.exposure;
console.log(renderer);
console.log(renderPass);
console.log(effectComposer);
effectComposer.addPass(unrealBloomPass);

/* ======================================================
MOUSE POINTER & RAYCASTER
====================================================== */
// RAYCASTER HOVER
const raycaster = new THREE.Raycaster();
raycaster.far = 160;
raycaster.near = 50;
// RAYCASTER CLICK
const raycasterInteraction = new THREE.Raycaster();
raycasterInteraction.far = 49;
raycasterInteraction.near = 0;

const mouse = new THREE.Vector2();

let positionMouseX;
let positionMouseY;

let starshipPointer1 = document.querySelector(".starship-pointer-1");
let starshipPointer2 = document.querySelector(".starship-pointer-2");
let starshipPointer3 = document.querySelector(".starship-pointer-3");

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;

  // pointer
  positionMouseX = event.clientX - 30;
  positionMouseY = event.clientY - 30;
  starshipPointer3.style.left = positionMouseX + "px";
  starshipPointer3.style.top = positionMouseY + "px";
  gsap.to(starshipPointer1, {
    duration: 0.4,
    top: positionMouseY,
    left: positionMouseX,
  });
  gsap.to(starshipPointer2, {
    duration: 0.8,
    top: positionMouseY,
    left: positionMouseX,
  });
});

/* ======================================================
CONTROLS
====================================================== */
const controls = new FirstPersonControls(camera, canvas);
controls.movementSpeed = 1;
controls.lookSpeed = 0.004;

const target = new THREE.Vector3(0, 0, 0);

let planetHover = false;
let planetHoverRepo = false;

function planetHoverChecker(
  hoveredObject,
  distance,
  distanceMessage,
  controlcolor,
  controlfill
) {
  planetHover = true;
  distance = Math.round(camera.position.distanceTo(hoveredObject.position));
  gsap.to(".planet-distance", {
    duration: 0,
    opacity: 1,
    text: distanceMessage,
    fill: controlcolor,
  });
  if (planetHover !== planetHoverRepo) {
    gsap.to(".planet-name", {
      duration: 0.5,
      opacity: 1,
      text: hoveredObject.name,
    });
    gsap.to("#distance-button", {
      duration: 0.3,
      opacity: 1,
      y: 0,
      fill: controlfill,
    });
    gsap.to("#pointer-arrow-top", {
      duration: 0.5,
      transform: "translateY(7px)",
      opacity: 1,
    });
    gsap.to("#pointer-arrow-bottom", {
      duration: 0.5,
      transform: "translateY(-7px)",
      opacity: 1,
    });
    gsap.to("#pointer-arrow-right", {
      duration: 0.5,
      transform: "translateX(-7px)",
      opacity: 1,
    });
    gsap.to("#pointer-arrow-left", {
      duration: 0.5,
      transform: "translateX(7px)",
      opacity: 1,
    });
    gsap.to("#starship_x5F_pointer_x5F_corner", {
      duration: 0.5,
      opacity: 1,
    });
    gsap.to("#starship_x5F_pointer_x5F_center", {
      duration: 0.5,
      opacity: 1,
    });
    gsap.to("#galaxy_x5F_rotation", {
      duration: 0.5,
      opacity: 1,
    });
    switch (hoveredObject.name) {
      case "homepage":
        planet_1_fill = "#FEA500";
        break;
      case "about":
        planet_2_fill = "#FEA500";
        break;
      case "portfolio":
        planet_3_fill = "#FEA500";
        break;
    }
  }
  planetHoverRepo = true;
}

function planetNoHoverChecker() {
  planetHover = false;
  if (planetHover !== planetHoverRepo) {
    gsap.to("#distance-button", {
      duration: 0.3,
      opacity: 0,
      y: 10,
      stroke: "#ffffff00",
      fill: "#ffffff00",
    });
    gsap.to(".planet-name", {
      duration: 0.5,
      opacity: 0,
      text: "リックとモーティ",
    });
    gsap.to(".planet-distance", {
      duration: 0.3,
      opacity: 0,
      text: "",
      fill: "#000000",
    });
    gsap.to(".planet-name", {
      duration: 0.5,
      opacity: 0,
    });
    gsap.to("#pointer-arrow-top", {
      duration: 0.5,
      transform: "translateY(0px)",
      opacity: 0.2,
    });
    gsap.to("#pointer-arrow-bottom", {
      duration: 0.5,
      transform: "translateY(0px)",
      opacity: 0.2,
    });
    gsap.to("#pointer-arrow-right", {
      duration: 0.5,
      transform: "translateX(0px)",
      opacity: 0.2,
    });
    gsap.to("#pointer-arrow-left", {
      duration: 0.5,
      transform: "translateX(0px)",
      opacity: 0.2,
    });
    gsap.to("#starship_x5F_pointer_x5F_corner", {
      duration: 0.5,
      opacity: 0.1,
    });
    gsap.to("#starship_x5F_pointer_x5F_center", {
      duration: 0.5,
      opacity: 0.1,
    });
    gsap.to("#galaxy_x5F_rotation", {
      duration: 0.5,
      opacity: 0.1,
    });
    planet_1_fill = "#532D2B";
    planet_2_fill = "#532D2B";
    planet_3_fill = "#532D2B";
  }
  planetHoverRepo = false;
}

function clickPlanet_1(hoveredObject, orbitPlanet_anchor_size) {
  followPlanetX =
    Math.sign(hoveredObject.position.x) *
    (Math.abs(hoveredObject.position.x) + 10);
  followPlanetY = hoveredObject.position.y;
  followPlanetZ =
    Math.sign(hoveredObject.position.z) *
    (Math.abs(hoveredObject.position.z) + 10);
  distancePoint = new THREE.Vector3(
    followPlanetX,
    followPlanetY,
    followPlanetZ
  );
  orbitPlanet_anchor_size = distancePoint.distanceTo(sunSphere.position);
  gsap.to(camera.position, {
    duration: 3,
    delay: 0,
    x: followPlanetX,
    y: followPlanetY,
    z: followPlanetZ,
    onUpdate: function () {
      followPlanetX =
        Math.sign(hoveredObject.position.x) *
        (Math.abs(hoveredObject.position.x) + 10);
      followPlanetY = hoveredObject.position.y;
      followPlanetZ =
        Math.sign(hoveredObject.position.z) *
        (Math.abs(hoveredObject.position.z) + 10);
    },
  });
  gsap.to(target, {
    duration: 3,
    delay: 0,
    x:
      Math.sign(hoveredObject.position.x) *
      (Math.abs(hoveredObject.position.x) + 10),
    y: hoveredObject.position.y,
    z:
      Math.sign(hoveredObject.position.z) *
      (Math.abs(hoveredObject.position.z) + 10),
    onUpdate: function () {
      camera.lookAt(hoveredObject.position);
    },
    onComplete: function () {
      camera.lookAt(hoveredObject.position);
      followPlanet = true;
    },
  });
  return orbitPlanet_anchor_size;
}

/* ======================================================
BUTTON CONTROLS | keydown W - UP
====================================================== */
//control elements
let wKey = document.getElementById("top-bg");
let sKey = document.getElementById("right-bg");
let aKey = document.getElementById("left-bg");
let dKey = document.getElementById("bottom-bg");
let qKey = document.getElementById("standard-mode-bg");

//keydown
let wKeyDown = false;
let sKeyDown = false;
let aKeyDown = false;
let dKeyDown = false;
let qKeyDown = false;
let turboMove = false;

document.addEventListener("keydown", function (event) {
  if (event.key.toLowerCase() === "w") {
    wKeyDown = true;
    aKeyDown = false;
    dKeyDown = false;
    gsap.to(wKey, { duration: 0.4, opacity: 0.4 });
    gsap.to("#top-arrow", { duration: 0.4, opacity: 1 });
  } else if (event.key.toLowerCase() === "d") {
    dKeyDown = true;
    gsap.to(sKey, { duration: 0.4, opacity: 0.4 });
    gsap.to("#right-arrow", { duration: 0.4, opacity: 1 });
  } else if (event.key.toLowerCase() === "a") {
    aKeyDown = true;
    gsap.to(aKey, { duration: 0.4, opacity: 0.4 });
    gsap.to("#left-arrow", { duration: 0.4, opacity: 1 });
  } else if (event.key.toLowerCase() === "s") {
    sKeyDown = true;
    gsap.to(dKey, { duration: 0.4, opacity: 0.4 });
    gsap.to("#bottom-arrow", { duration: 0.4, opacity: 1 });
  } else if (event.key.toLowerCase() === "q") {
    switch ((qKeyDown = !qKeyDown)) {
      case true:
        controls.movementSpeed = 3;
        gsap.to(qKey, { duration: 0.4, opacity: 1 });
        gsap.to("#standard-mode-bg", {
          filter: "drop-shadow(0px 0px 8px rgba(245, 173, 49, 1))",
          duration: 0.4,
        });
        turboMove = true;
        break;
      case false:
        controls.movementSpeed = 1;
        gsap.to(qKey, { duration: 0.4, opacity: 0.4 });
        gsap.to("#standard-mode-bg", {
          filter: "drop-shadow(0px 0px 0px rgba(245, 173, 49, 0))",
          duration: 0.4,
        });
        turboMove = false;
        break;
      default:
        controls.movementSpeed = 1;
        gsap.to(qKey, { duration: 0.4, opacity: 0.4 });
        turboMove = false;
    }
  }
});

document.addEventListener("keyup", function (event) {
  if (event.key.toLowerCase() === "w") {
    wKeyDown = false;
    gsap.to(wKey, { duration: 0.4, opacity: 0.2 });
    gsap.to("#top-arrow", { duration: 0.4, opacity: 0.2 });
  } else if (event.key.toLowerCase() === "d") {
    sKeyDown = false;
    gsap.to(sKey, { duration: 0.4, opacity: 0.2 });
    gsap.to("#right-arrow", { duration: 0.4, opacity: 0.2 });
  } else if (event.key.toLowerCase() === "a") {
    aKeyDown = false;
    gsap.to(aKey, { duration: 0.4, opacity: 0.2 });
    gsap.to("#left-arrow", { duration: 0.4, opacity: 0.2 });
  } else if (event.key.toLowerCase() === "s") {
    dKeyDown = false;
    gsap.to(dKey, { duration: 0.4, opacity: 0.2 });
    gsap.to("#bottom-arrow", { duration: 0.4, opacity: 0.2 });
  }
});

/* ======================================================
LINEMOVEMENT
====================================================== */

const lineCanvas = document.getElementById("line-speed");
const ctx = lineCanvas.getContext("2d");

let cw = (lineCanvas.width = window.innerWidth);
let ch = (lineCanvas.height = window.innerHeight);

let movmentDirectionMax = 2; // -1 right & 1 left
let movmentDirectionMin = 0; // -1 right & 1 left
let movmentRadiusMin = 500; // 500 standard & 200 turbo
let movmentRadiusMax = 700; // 700 standard & 300 turbo
let trianglePositionX;
let trianglePositionY;
let trianglePositionAngle;

const lines = [];
let MAX_LINES = 200;

const rand = (min, max) => min + Math.random() * (max - min);

class SpeedLine {
  constructor(x, y) {
    if (aKeyDown === true && wKeyDown === false) {
      trianglePositionX = rand(0, x);
      trianglePositionY = rand(0, y * 2);
      trianglePositionAngle = Math.PI * 0.5;
    } else if (dKeyDown === true && wKeyDown === false) {
      trianglePositionX = rand(x, x * 2);
      trianglePositionY = rand(0, y * 2);
      trianglePositionAngle = Math.PI * -0.5;
    } else if (wKeyDown === true) {
      trianglePositionX = x;
      trianglePositionY = y;
      trianglePositionAngle =
        Math.PI * rand(movmentDirectionMin, movmentDirectionMax);
    } else {
      trianglePositionX = x;
      trianglePositionY = y;
      trianglePositionAngle =
        Math.PI * rand(movmentDirectionMin, movmentDirectionMax);
    }
    this.x = trianglePositionX;
    this.y = trianglePositionY;

    this.speed = rand(2, 4);
    this.life = this.curLife = rand(500, 900);
    this.alpha = rand(0.25, 1);
    this.angle = trianglePositionAngle;
    // this.angle = Math.PI * rand(movmentDirectionMin, movmentDirectionMax);
    this.size = rand(20, 40);
    this.inRadius = rand(movmentRadiusMin, movmentRadiusMax);
    this.outRadius = cw;
  }

  updateLines() {
    if (wKeyDown === true || aKeyDown === true || dKeyDown === true) {
      this.curLife -= this.speed;
      this.inRadius += this.speed * 4;

      this.alpha *= this.curLife / this.life;
      this.size *= this.curLife / this.life;

      const { x, y, size, angle, alpha } = this,
        { inRadius, outRadius } = this;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      ctx.beginPath();
      ctx.moveTo(0, inRadius);
      ctx.lineTo(size, outRadius);
      ctx.lineTo(-size, outRadius);
      ctx.closePath();

      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();
      ctx.restore();
    } else {
    }
  }
}

function updateLines() {
  lines.forEach((line, i) => {
    if (!line || line.curLife < 0) lines[i] = new SpeedLine(cw / 2, ch / 2);
    lines[i].updateLines();
  });
}

for (let i = 0; i < MAX_LINES; i++) {
  lines[i] = new SpeedLine(cw / 2, ch / 2);
}

/* ======================================================
ANIMATE
====================================================== */
const clock = new THREE.Clock(true);
let hoveredObject;
let distance;
let distanceMessage;
let controlcolor;
let controlfill;

let followPlanet = false;
let followPlanetRepo = false;
let followPlanetX;
let followPlanetY;
let followPlanetZ;
let distancePoint;

let moveToPlanet;

let orbitPlanet_anchor_size;

let elapsedTimeStart = 0;
let elapsedTimeEnd = 0;
let elapsedTimeDifference = 0;

moon_1_Sphere.orbitAngle = 0.4;
planet_1_Sphere.orbitAngle = 0.05;
planet_2_Sphere.orbitAngle = 0.04;
planet_3_Sphere.orbitAngle = 0.03;
planet_1_Atmosphere.orbitAngle = planet_1_Sphere.orbitAngle;
planet_2_Atmosphere.orbitAngle = planet_2_Sphere.orbitAngle;
planet_3_Atmosphere.orbitAngle = planet_3_Sphere.orbitAngle;

let orbitAngleClick;

const tick = () => {
  let elapsedTime = clock.getElapsedTime();

  // ==================================== OGGETTI
  // map
  planet_1_mapX = planet_1_Sphere.position.x;
  planet_1_mapZ = planet_1_Sphere.position.z;
  planet_2_mapX = planet_2_Sphere.position.x;
  planet_2_mapZ = planet_2_Sphere.position.z;
  planet_3_mapX = planet_3_Sphere.position.x;
  planet_3_mapZ = planet_3_Sphere.position.z;
  user_mapX = camera.position.x;
  user_mapZ = camera.position.z;
  user_mapRotationY = (-camera.rotation.y * 360) / Math.PI;
  redrawMap(
    user_mapX,
    user_mapZ,
    user_mapRotationY,
    planet_1_mapX,
    planet_1_mapZ,
    planet_2_mapX,
    planet_2_mapZ,
    planet_3_mapX,
    planet_3_mapZ
  );

  // Moon Orbit
  const moonOrbitAngle = elapsedTime * moon_1_Sphere.orbitAngle;
  moon_1_Sphere.position.x = 
    planet_1_Sphere.position.x + 6 * Math.cos(moonOrbitAngle);
  moon_1_Sphere.position.z =
    planet_1_Sphere.position.z + 6 * Math.sin(moonOrbitAngle);

  // Planet_1 Orbit
  const planet_1_OrbitAngle = elapsedTime * planet_1_Sphere.orbitAngle;
  planet_1_Sphere.position.x =
    sunSphere.position.x + orbitPlanet_1_size * Math.cos(planet_1_OrbitAngle);
  planet_1_Sphere.position.z =
    sunSphere.position.z + orbitPlanet_1_size * Math.sin(planet_1_OrbitAngle);
  planet_1_Sphere.rotation.y = 0.4 * elapsedTime;
  planet_1_Atmosphere.position.x = planet_1_Sphere.position.x;
  planet_1_Atmosphere.position.z = planet_1_Sphere.position.z;
  if (planet_1_Atmosphere.landingPositionUpdate === true) {
    planet_1_Atmosphere.landingPosition.x = planet_1_Atmosphere.position.x;
    planet_1_Atmosphere.landingPosition.z = planet_1_Atmosphere.position.z;
    planet_1_Atmosphere.landingPosition.y = planet_1_Atmosphere.position.y;
  } else {
  }

  // Planet_2 Orbit
  const planet_2_OrbitAngle = ( elapsedTime + 54 ) * planet_2_Sphere.orbitAngle;
  planet_2_Sphere.position.x =
    sunSphere.position.x + orbitPlanet_2_size * Math.cos(planet_2_OrbitAngle);
  planet_2_Sphere.position.z =
    sunSphere.position.z + orbitPlanet_2_size * Math.sin(planet_2_OrbitAngle);
  planet_2_Atmosphere.position.x = planet_2_Sphere.position.x;
  planet_2_Atmosphere.position.z = planet_2_Sphere.position.z;
  if (planet_2_Atmosphere.landingPositionUpdate === true) {
    planet_2_Atmosphere.landingPosition.x = planet_2_Atmosphere.position.x;
    planet_2_Atmosphere.landingPosition.z = planet_2_Atmosphere.position.z;
    planet_2_Atmosphere.landingPosition.y = planet_2_Atmosphere.position.y;
  } else {
  }

  // Planet_3 Orbit
  const planet_3_OrbitAngle = ( elapsedTime + 22 ) * planet_3_Sphere.orbitAngle;
  planet_3_Sphere.position.x =
    sunSphere.position.x + orbitPlanet_3_size * Math.cos(planet_3_OrbitAngle);
  planet_3_Sphere.position.z =
    sunSphere.position.z + orbitPlanet_3_size * Math.sin(planet_3_OrbitAngle);
  planet_3_Sphere.rotation.y = 0.3 * elapsedTime;
  planet_3_Atmosphere.position.x = planet_3_Sphere.position.x;
  planet_3_Atmosphere.position.z = planet_3_Sphere.position.z;
  if (planet_3_Atmosphere.landingPositionUpdate === true) {
    planet_3_Atmosphere.landingPosition.x = planet_3_Atmosphere.position.x;
    planet_3_Atmosphere.landingPosition.z = planet_3_Atmosphere.position.z;
    planet_3_Atmosphere.landingPosition.y = planet_3_Atmosphere.position.y;
  } else {
  }
  // Planet_3 Ring
  planet_3_Ring.position.x = planet_3_Sphere.position.x;
  planet_3_Ring.position.z = planet_3_Sphere.position.z;
  planet_3_Ring.rotation.z = 0.5 * elapsedTime;

  // Moon_1 Orbit Path
  moon_1_OrbitParticles.position.x = planet_1_Sphere.position.x;
  moon_1_OrbitParticles.position.z = planet_1_Sphere.position.z;

  // Moon_1 Orbit Path
  moon_1_OrbitParticles.rotation.z = elapsedTime * 0.4;

  // Planet_1 Orbit Path
  planet_1_OrbitParticles.rotation.z = elapsedTime * 0.06;

  // Planet_2 Orbit Path
  planet_2_OrbitParticles.rotation.z = elapsedTime * 0.04;

  // Planet_3 Orbit Path
  planet_3_OrbitParticles.rotation.z = elapsedTime * 0.02;

  // Atmosphere_1 Orbit Path
  planet_1_Atmosphere.rotation.y = elapsedTime * 1.2;
  planet_1_Atmosphere.rotation.x = elapsedTime * 1.2;
  

  // ==================================== MAP ZOOM

  mapZoomLevel = objectZoomLevel.zoomLevel;
  if (
    Math.abs(camera.position.z) < orbitPlanet_3_size + 20 &&
    Math.abs(camera.position.x) < orbitPlanet_3_size + 20
  ) {
    mapZoomLevelIN();
  } else {
    mapZoomLevelOUT();
  }

  // ==================================== RAYCASTER

  // raycasting animation
  raycaster.setFromCamera(mouse, camera);
  raycasterInteraction.setFromCamera(mouse, camera);

  const objectsToTest = [
    planet_1_Atmosphere,
    planet_2_Atmosphere,
    planet_3_Atmosphere,
  ];
  const intersects = raycaster.intersectObjects(objectsToTest);
  const intersectsInteraction =
    raycasterInteraction.intersectObjects(objectsToTest);

  // raycasting HOVER
  for (const intersect of intersects) {
    hoveredObject = intersect.object;
    distance = Math.round(camera.position.distanceTo(hoveredObject.position));
    distanceMessage = "distance : " + distance;
    controlcolor = "#ffffff";
    controlfill = "#fea50000";
    planetHoverChecker(
      hoveredObject,
      distance,
      distanceMessage,
      controlcolor,
      controlfill
    );
  }

  // raycasting CLICK
  for (const intersectInt of intersectsInteraction) {
    intersectInt.object.planetClickable = true;
    hoveredObject = intersectInt.object;
    distance = Math.round(camera.position.distanceTo(hoveredObject.position));
    distanceMessage = "click to landing";
    controlcolor = "#000000";
    controlfill = "#fea500";
    planetHoverChecker(
      hoveredObject,
      distance,
      distanceMessage,
      controlcolor,
      controlfill
    );
    // PLANET CLICK
    renderer.domElement.addEventListener("pointerdown", function (e) {
      if (intersectInt.object.planetClickable == true) {
        controls.enabled = false;
        elapsedTimeStart = elapsedTime;
        moveToPlanet = clickPlanet_1(hoveredObject, orbitPlanet_anchor_size);
        orbitAngleClick = intersectInt.object;
        intersectInt.object.planetClickable = false;
        return orbitAngleClick;
      }
    });
  }

  for (const objectInt of objectsToTest) {
    if (
      !intersectsInteraction.find(
        (intersectInt) => intersectInt.object === objectInt
      )
    ) {
      objectInt.planetClickable = false;
    }
  }

  // PLANET HOVER
  if (intersects.length === 0 && intersectsInteraction.length === 0) {
    planetNoHoverChecker();
  } else {
  }

  // PLANET CLICK --> FOLLOW
  if (followPlanet === true) {
    orbitPlanet_anchor_size = camera.position.distanceTo(sunSphere.position);
    switch (followPlanetRepo) {
      case false:
        elapsedTimeEnd = elapsedTime;
        elapsedTimeDifference = elapsedTimeEnd - elapsedTimeStart;
        followPlanetRepo = true;
      case true:
    }
    camera.position.x =
      Math.cos(
        (elapsedTime - elapsedTimeDifference * 0.5) * orbitAngleClick.orbitAngle
      ) * orbitPlanet_anchor_size;
    camera.position.z =
      Math.sin(
        (elapsedTime - elapsedTimeDifference * 0.5) * orbitAngleClick.orbitAngle
      ) * orbitPlanet_anchor_size;

    // Set the camera position
    //camera.position.set(cameraX, 0, cameraZ);

    // Update the camera lookAt to point towards (0, 0, 0)
    // camera.lookAt(sunSphere.position.x + orbitPlanet_2_size * Math.cos((elapsedTime - elapsedTimeDifference * 0.5) * orbitAngleClick.orbitAngle), orbitAngleClick.position.y,  sunSphere.position.z + orbitPlanet_2_size * Math.sin((elapsedTime - elapsedTimeDifference * 0.5) * orbitAngleClick.orbitAngle));
  } else {
  }

  // ==================================== LINE MOVEMENT

  if (turboMove === false) {
    movmentRadiusMin = 500; // 500 standard & 200 turbo
    movmentRadiusMax = 700; // 700 standard & 300 turbo
  } else {
    movmentRadiusMin = 200; // 500 standard & 200 turbo
    movmentRadiusMax = 300; // 700 standard & 300 turbo
  }

  ctx.clearRect(0, 0, cw, ch);
  updateLines();

  // ==================================== ALTITUDE
  gsap.to("#starship_x5F_level", {
    y: -camera.position.y,
  });

  // Update controls
  controls.update(clock.getDelta() + 0.1);

  // Render
  // renderer.render(scene, camera);
  effectComposer.render();

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
