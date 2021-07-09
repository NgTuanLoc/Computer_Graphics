const main = () => {
  // Canvas
  const canvas = document.querySelector("#canvas");

  // Create Perspective Camera
  const fov = 75; // field of view 75 degree
  const aspect = 2; // aspect ratio
  const near = 0.2; // object
  const far = 5; // shade
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;

  const renderer = new THREE.WebGLRenderer({ canvas });

  // Create a scene
  const scene = new THREE.Scene();
  {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  const makeInstance = (geometry, color, x) => {
    const material = new THREE.MeshPhongMaterial({ color: color });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    cube.position.x = x;

    return cube;
  };

  const cubes = [
    makeInstance(geometry, 0x800000, 0),
    makeInstance(geometry, 0x28b463, -2),
    makeInstance(geometry, 0x5b2c6f, 2),
  ];

  renderer.render(scene, camera);
  const render = (time) => {
    time *= 0.001; // convert time to seconds

    cubes.forEach((cube, idx) => {
      const speed = 1 + idx * 0.1;
      const rot = time * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };

  requestAnimationFrame(render);
};

main();
