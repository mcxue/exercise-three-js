import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/**
 * init renderer
 */
const canvas: HTMLElement = document.querySelector('#canvas')!;
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio | 2));
/**
 * init scene
 */
const scene = new THREE.Scene();
/**
 * init camera
 */
const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
camera.position.z = 5;
/**
 * init clock
 */
const clock = new THREE.Clock();
/**
 * adjust renderer and camera when canvas's size resizing
 */
window.addEventListener('resize', () => {
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio | 2));
});
/**
 * Double-tap to enter full screen or exit full screen
 */
window.addEventListener('dblclick', () => {
  // @ts-ignore
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen().then();
      // @ts-ignore
    } else if (canvas.webkitRequestFullscreen) {
      // @ts-ignore
      canvas.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().then();
      // @ts-ignore
    } else if (document.webkitExitFullscreen) {
      // @ts-ignore
      document.webkitExitFullscreen();
    }
  }
});
/**
 * add axes helper
 */
const axeHelper = new THREE.AxesHelper(2);
scene.add(axeHelper);

/**
 * add orbitControl
 */
const controls: OrbitControls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// @ts-ignore
// It says Argument of type 'OrbitControls' is not assignable to parameter of type 'Object3D<Event>'
// It actually inherits Object3D.
// Maybe I'll fix it later
scene.add(controls);
/**
 * add a cube
 */
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial();
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

/**
 * render scene
 */
const animate = () => {
  renderer.render(scene, camera);
  const elapsedTime = clock.getElapsedTime();
  controls.update();
  cube.rotation.x = elapsedTime;
  cube.rotation.y = elapsedTime;
  window.requestAnimationFrame(animate);
};
animate();
