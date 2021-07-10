// global variables
let camera, scene, renderer;
let floor, geometry, material, object, floorMesh, light, axes;
let gui;
let stats;

// controls
let obControl, afControl;

// rotation values
let rot_x = 0.01;
let rot_y = 0.02;
let alpha = 0;

// gui settings
const settings = {
  common: {
    scale: 1,
    autorotate: true,
    showaxes: true,
  },
  geometry: {
    shape: "cube",
    material: "basic",
  },
  light: {
    enable: true,
    autorotate: false,
    shadow: true,
    automove: false,
    luminance: 4,
  },
  affine: {
    mode: "none",
  },
};

const init = () => {
  // Setup Camera
  camera = new THREE.PerspectiveCamera(
    80,
    window.innerWidth / window.innerHeight,
    0.01,
    1000
  );
  camera.position.set(0, 0, 4);
  scene = new THREE.Scene();

  // Create Main Object
  geometry = new THREE.BoxBufferGeometry(0.4, 0.4, 0.4);
  material = new THREE.MeshPhongMaterial({ color: 0x0000ff });
  object = new THREE.Mesh(geometry, material);
  object.castShadow = true;
  object.receiveShadow = false;
  object.name = "object";

  // floor
  floor = new THREE.PlaneBufferGeometry(5, 5, 32, 32);
  let floorMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
  floorMesh = new THREE.Mesh(floor, floorMat);
  floorMesh.receiveShadow = true;
  floorMesh.rotation.x = -Math.PI / 2.0;
  floorMesh.name = "floor";
  floorMesh.position.set(0, -0.6, 0);

  // light
  light = new THREE.PointLight(0xffffff, 2, 100);
  light.position.set(0, 1, 0);
  light.castShadow = true;

  // axesHelper
  axes = new THREE.GridHelper(100, 2);

  // Add Object to Scene
  scene.add(object);
  scene.add(light);
  scene.add(floorMesh);
  scene.add(axes);

  // Create Statistic fps Frame
  stats = new Stats();
  document.body.appendChild(stats.dom);

  // Render Canvas Element
  const canvas = document.querySelector("#canvas");
  renderer = new THREE.WebGLRenderer({ canvas });

  renderer.shadowMap.enabled = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
};

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
};

const render = () => {
  requestAnimationFrame(render);

  if (settings["common"].autorotate === true) {
    object.rotation.x += 0.02;
    object.rotation.y += 0.02;
    console.log(object.rotation.x);
  }

  if (settings["light"].autorotate === true) {
    alpha = Math.PI * 0.01 + alpha;
    let new_x = Math.sin(alpha);
    let new_z = Math.cos(alpha);

    light.position.set(new_x, 1, new_z);
    if (alpha == 2 * Math.PI) alpha = 0;
  }

  renderer.render(scene, camera);
  stats.update();
};

function Cockpit() {
  gui = new dat.GUI();
  h = gui.addFolder("Common");
  h.add(settings["common"], "scale", 0.1, 2, 0.1).onChange(function () {
    object.scale.set(
      settings["common"].scale,
      settings["common"].scale,
      settings["common"].scale
    );
  });
}

init();
render();
Cockpit();
