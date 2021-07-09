// // global variables
// let camera, scene, renderer;
// let floor, geometry, material, mesh, floorMesh, light, axes;
// let gui;
// let stats;

// // controls
// let obControl, afControl;

// // rotation values
// let rot_x = 0.01;
// let rot_y = 0.02;
// let alpha = 0;

// // gui settings
// const settings = {
//   common: {
//     scale: 1,
//     autorotate: true,
//     showaxes: true,
//   },
//   geometry: {
//     shape: "cube",
//     material: "basic",
//   },
//   light: {
//     enable: true,
//     autorotate: false,
//     shadow: true,
//     automove: false,
//     luminance: 4,
//   },
//   affine: {
//     mode: "none",
//   },
// };

// const init = () => {
//   // Setup Camera
//   camera = new THREE.PerspectiveCamera(
//     80,
//     window.innerWidth / window.innerHeight,
//     0.01,
//     1000
//   );
//   camera.position.set(0, 0, 4);
//   scene = new THREE.Scene();

//   // Create Main Object
//   geometry = new THREE.BoxBufferGeometry(0.4, 0.4, 0.4);
//   material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
//   object = new THREE.Mesh(geometry, material);
//   object.castShadow = true;
//   object.receiveShadow = false;
//   object.name = "object";

//   // floor
//   floor = new THREE.PlaneBufferGeometry(5, 5, 32, 32);
//   let floorMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
//   floorMesh = new THREE.Mesh(floor, floorMat);
//   floorMesh.receiveShadow = true;
//   floorMesh.rotation.x = -Math.PI / 2.0;
//   floorMesh.name = "floor";
//   floorMesh.position.set(0, -0.6, 0);

//   // light
//   light = new THREE.PointLight(0xffffff, 2, 100);
//   light.position.set(0, 1, 0);
//   light.castShadow = true;

//   // Add Object to Scene
//   scene.add(object);
//   scene.add(light);
//   scene.add(floor);

//   const canvas = document.querySelector("#canvas");
//   const renderer = new THREE.WebGLRenderer({ canvas });
//   renderer.render(scene, camera);
// };

// init();

function init() {
  camera = new THREE.PerspectiveCamera(
    80,
    window.innerWidth / window.innerHeight,
    0.01,
    10
  );
  camera.position.z = 2;
  scene = new THREE.Scene();

  // main object
  geometry = new THREE.BoxBufferGeometry(0.4, 0.4, 0.4);
  material = new THREE.MeshBasicMaterial({ color: 0x222222 });
  mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = false;
  mesh.name = "object";

  // floor
  floor = new THREE.PlaneBufferGeometry(5, 5, 32, 32);
  var floorMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
  floorMesh = new THREE.Mesh(floor, floorMat);
  floorMesh.receiveShadow = true;
  floorMesh.rotation.x = -Math.PI / 2.0;
  floorMesh.name = "floor";
  floorMesh.position.set(0, -0.6, 0);

  // light
  light = new THREE.PointLight(0xffffff, 2, 100);
  light.position.set(0, 1, 0);
  light.castShadow = true; // default false

  // axesHelper
  axes = new THREE.GridHelper(100, 2);

  // add object and floor to scene
  scene.add(floorMesh);
  scene.add(mesh);
  scene.add(light);
  scene.add(axes);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.shadowMap.enabled = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // stats
  stats = new Stats();
  document.body.appendChild(stats.dom);

  // controls
  var controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.maxPolarAngle = Math.PI * 1;
  controls.minDistance = 1;
  controls.maxDistance = 10;

  afControl = new THREE.TransformControls(camera, renderer.domElement);
  afControl.addEventListener("change", function () {
    renderer.render(scene, camera);
  });
  afControl.addEventListener("dragging-changed", function (event) {
    controls.enabled = !event.value;
  });

  //afControl.attach(mesh);
  scene.add(afControl);
  window.addEventListener("resize", onWindowResize, false);
}

init();
