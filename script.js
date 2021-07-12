// Global Variables
let camera, scene, renderer;
let floor, geometry, material, object, floorMesh, light, axes;
let gui;
let stats;

// Controls
let obControl, afControl;

// Rotation Values
let rot_x = 0.01;
let rot_y = 0.02;
let alpha = 0;

// Settings
const settings = {
  display: {
    scale: 1,
    autoRotate: true,
    showAxes: true,
  },
  geometry: {
    shape: "cube",
    material: "basic",
  },
  camera: {
    x: 0,
    y: 0,
    z: 4,
    fov: 80,
    near: 0.01,
    far: 3,
  },
  light: {
    enable: true,
    autoRotate: false,
    shadow: true,
    autoMove: false,
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
    0.1,
    10
  );
  camera.position.set(0, 0, 4);
  scene = new THREE.Scene();

  // Create Main Object
  geometry = new THREE.BoxBufferGeometry(1, 1, 1);
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
  floorMesh.position.set(0, -1.5, 0);

  // light
  light = new THREE.PointLight(0xffffff, 4, 200);
  light.name = "light";
  light.position.set(3, 4, 0);
  light.castShadow = true;

  // axesHelper
  axes = new THREE.GridHelper(100, 2);
  axes.name = "axes";

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
  // controls
  let controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.maxPolarAngle = Math.PI * 1;
  controls.minDistance = 1;
  controls.maxDistance = 10;

  afControl = new THREE.TransformControls(camera, renderer.domElement);
  afControl.addEventListener("change", () => {
    renderer.render(scene, camera);
  });
  afControl.addEventListener("dragging-changed", (event) => {
    controls.enabled = !event.value;
  });

  //afControl.attach(mesh);
  scene.add(afControl);
  window.addEventListener("resize", onWindowResize, false);
};

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
};

const render = () => {
  requestAnimationFrame(render);

  if (settings["display"].autoRotate === true) {
    object.rotation.x += 0.02;
    object.rotation.y += 0.02;
  }

  if (settings["light"].autoRotate === true) {
    alpha = Math.PI * 0.01 + alpha;
    let new_x = Math.sin(alpha);
    let new_z = Math.cos(alpha);

    light.position.set(new_x, 1, new_z);
    if (alpha == 2 * Math.PI) alpha = 0;
  }

  renderer.render(scene, camera);
  stats.update();
};

const Cockpit = () => {
  // Init Control Table
  gui = new dat.GUI();

  // 1/ Display Control (Scale - Show Axes - Auto Rotate)
  control = gui.addFolder("Display");
  control.add(settings["display"], "scale", 0.1, 3, 0.05).onChange(() => {
    object.scale.set(
      settings["display"].scale,
      settings["display"].scale,
      settings["display"].scale
    );
  });

  control.add(settings["display"], "showAxes").onChange(function () {
    axes.visible = !!settings["display"].showAxes;
  });

  control.add(settings["display"], "autoRotate");

  // 2/ Geometry, Materials Selection
  control = gui.addFolder("Geometry");
  control
    .add(settings["geometry"], "shape", [
      "cube",
      "sphere",
      "cone",
      "cylinder",
      "wheel",
      "teapot",
    ])
    .onChange(handleGeometry);

  control
    .add(settings["geometry"], "material", ["basic", "point", "lines", "solid"])
    .onChange(handleMaterial);

  // 3/ Control Camera: x, y, z, field of view, near, far
  control = gui.addFolder("Camera");
  control.add(settings["camera"], "x", -10, 10, 0.05).onChange(() => {
    camera.position.x = settings["camera"].x;
  });
  control.add(settings["camera"], "y", -10, 10, 0.05).onChange(() => {
    camera.position.y = settings["camera"].y;
  });
  control.add(settings["camera"], "z", -10, 10, 0.05).onChange(() => {
    camera.position.z = settings["camera"].z;
  });
  control.add(camera, "fov", 1, 180, 0.1).onChange(() => {
    camera.updateProjectionMatrix();
  });
  control.add(camera, "near", 0.1, 10, 0.1).onChange(() => {
    camera.updateProjectionMatrix();
  });
  control.add(camera, "far", 0.1, 10, 0.1).onChange(() => {
    camera.updateProjectionMatrix();
  });

  // 4/ Affine Transform
  control = gui.addFolder("Affine Transform");
  control
    .add(settings["affine"], "mode", ["none", "translate", "scale", "rotate"])
    .onChange(handleAffineTransform);
};

// Geometry: Cube, Sphere, Cone, Cylinder, Wheel, Teapot
const handleGeometry = () => {
  switch (settings["geometry"].shape) {
    case "cube":
      geometry = new THREE.BoxBufferGeometry(1, 1, 1);
      break;
    case "sphere":
      geometry = new THREE.SphereBufferGeometry(1, 100, 100);
      break;
    case "cone":
      geometry = new THREE.ConeBufferGeometry(1, 1, 20, 20);
      break;
    case "cylinder":
      geometry = new THREE.CylinderBufferGeometry(1, 1, 1.5, 20, 20);
      break;
    case "wheel":
      geometry = new THREE.TorusBufferGeometry(1, 0.5, 20, 20);
      break;
    case "teapot":
      geometry = new THREE.TeapotBufferGeometry(
        1,
        true,
        true,
        true,
        true,
        true
      );
      break;

    default:
      geometry = new THREE.BoxBufferGeometry(1, 1, 1);
      break;
  }
  updateObject(geometry, material);
};

// Material: Point, Lines, Solid
const handleMaterial = () => {
  switch (settings["geometry"].material) {
    case "basic":
      material = new THREE.MeshPhongMaterial({ color: 0x0000ff });
      break;
    case "point":
      material = new THREE.PointsMaterial({ color: 0x0000ff });
      break;
    case "lines":
      material = new THREE.MeshNormalMaterial();
      material.wireframe = true;
      break;
    case "solid":
      material = new THREE.MeshNormalMaterial();
      material.wireframe = true;
      break;
  }
  updateObject(geometry, material);
};

// Affine: Translate, Scale, Rotate
const handleAffineTransform = () => {
  switch (settings["affine"].mode) {
    case "none":
      console.log(settings["affine"]);
      console.log("detached");
      afControl.detach();
      break;
    case "translate":
      console.log("translate");
      afControl.setMode("translate");
      afControl.attach(object);
      break;
    case "rotate":
      afControl.setMode("rotate");
      afControl.attach(object);
      break;
    case "scale":
      afControl.setMode("scale");
      afControl.attach(object);
      break;
  }
};

// Utilities (clearObject, updateObject)
const clearObject = () => {
  scene.children = scene.children.filter(
    (element) => element.name !== "object"
  );
};

const updateObject = (newShape, newMaterial) => {
  clearAffineTransform();
  clearObject();

  object = new THREE.Mesh(newShape, newMaterial);
  if (settings["light"].shadow === true) {
    object.castShadow = true;
    object.receiveShadow = false;
  }
  object.name = "object";
  scene.add(object);
};

const clearAffineTransform = () => {
  afControl.detach();
  settings["affine"].mode = "none";
};

// Main
const main = () => {
  init();
  render();
  Cockpit();
};

main();
