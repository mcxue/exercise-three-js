import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import Stats from 'three/examples/jsm/libs/stats.module';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { MeshBasicMaterial } from 'three';

// init dat.gui to debugger
const gui = new dat.GUI();
const cameraFold = gui.addFolder('camera');
const houseFold = gui.addFolder('house');
houseFold.open();
// init renderer
const canvas: HTMLElement = document.querySelector('#canvas')!;
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio | 2));
// init scene
const scene = new THREE.Scene();
// init camera
const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
// camera.position.x = -2;
// camera.position.y = 1;
// camera.position.z = 2;
camera.position.x = -2;
camera.position.y = 1;
camera.position.z = 2;
// adjust renderer and camera when canvas's size resizing
cameraFold.add(camera.position, 'x').name('position x axis').min(-5).max(5).step(1);
cameraFold.add(camera.position, 'y').name('position y axis').min(-5).max(5).step(1);
cameraFold.add(camera.position, 'z').name('position z axis').min(-5).max(5).step(1);
window.addEventListener('resize', () => {
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio | 2));
});
// init stats
// @ts-ignore
const stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';
document.body.appendChild(stats.domElement);
// add orbitControl
const controls: OrbitControls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// add the wall and debugger
const wallParams = {
  width: 1.5,
  height: 0.8,
  depth: 1,
  _color: 0xffffff,
  get color() {
    return this._color;
  },
  set color(color: number) {
    this._color = color;
    wallMaterial.color.set(color);
  },
};
const wallGeometry = new THREE.BoxGeometry(wallParams.width, wallParams.height, wallParams.depth);
const wallMaterial = new THREE.MeshBasicMaterial({ color: wallParams.color });
const wall = new THREE.Mesh(wallGeometry, wallMaterial);
wall.position.y = wallParams.height / 2;
// scene.add(wall);
houseFold.addColor(wallParams, 'color').name('wallColor');
// add the wallTop and debugger
const wallTopPositionsArray = new Float32Array([
  -wallParams.width / 2, 0, 0,
  wallParams.width / 2, 0, 0,
  0, wallParams.width / 2 * Math.tan(Math.PI / 6), 0,
]);
const wallTopPositionAttribute = new THREE.BufferAttribute(wallTopPositionsArray, 3);
const wallTopGeometry = new THREE.BufferGeometry();
wallTopGeometry.setAttribute('position', wallTopPositionAttribute);
const wallTop1 = new THREE.Mesh(wallTopGeometry, wallMaterial);
const wallTop2 = new THREE.Mesh(wallTopGeometry, wallMaterial);
wallTop1.position.y = wallParams.height;
wallTop1.position.z = wallParams.depth / 2;
wallTop2.position.y = wallParams.height;
wallTop2.position.z = -wallParams.depth / 2;
wallTop2.rotation.y = Math.PI;
scene.add(wallTop1);
scene.add(wallTop2);

// add the plane and debugger
const groundDebugParams = {
  _color: 0xc1c1c1,
  get color() {
    return this._color;
  },
  set color(color: number) {
    this._color = color;
    groundMaterial.color.set(color);
  },
};
const groundMaterial = new THREE.MeshBasicMaterial({ color: groundDebugParams.color });
const groundGeometry = new THREE.PlaneGeometry(5, 5);
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI * 0.5;
scene.add(ground);
gui.addColor(groundDebugParams, 'color').name('groundColor');
// add the roof and debugger
const roofParams = {
  _color: 0xffe400,
  width: wallParams.width * 0.5 / Math.cos(Math.PI / 6) + wallParams.width / 6,
  height: 1.2,
  depth: 0.01,
  _roof1PositionX: -0.48,
  _roofPositionY: 0.96,
  get color() {
    return this._color;
  },
  set color(color: number) {
    this._color = color;
    roofMaterial.color.set(color);
  },
  get roof1PositionX() {
    return this._roof1PositionX;
  },
  set roof1PositionX(x: number) {
    this._roof1PositionX = x;
    roof1.position.x = x;
    roof2.position.x = -x;
  },
  get roofPositionY() {
    return this._roofPositionY;
  },
  set roofPositionY(y: number) {
    this._roofPositionY = y;
    roof1.position.y = y;
    roof2.position.y = y;
  },
};
const roofGeometry = new THREE.BoxGeometry(roofParams.width, roofParams.height, roofParams.depth);
const roofMaterial = new THREE.MeshBasicMaterial({
  color: roofParams.color,
});
const roof1 = new THREE.Mesh(roofGeometry, roofMaterial);
const roof2 = new THREE.Mesh(roofGeometry, roofMaterial);
roof1.rotation.x = -Math.PI * 0.5;
roof1.rotation.y = -Math.PI / 6;
roof1.position.y = roofParams.roofPositionY;
roof1.position.x = roofParams.roof1PositionX;
roof2.rotation.x = -Math.PI * 0.5;
roof2.rotation.y = Math.PI / 6;
roof2.position.y = roofParams.roofPositionY;
roof2.position.x = -roofParams.roof1PositionX;
scene.add(roof1);
scene.add(roof2);
houseFold.addColor(roofParams, 'color').name('roofColor');
houseFold.add(roofParams, 'roof1PositionX').min(-2).max(2).step(0.01).name('roof1PositionX');
houseFold.add(roofParams, 'roofPositionY').min(-2).max(2).step(0.01).name('roofPositionY');
// add logoRing
const logoRingGeometry = new THREE.RingGeometry(0.08, 0.1, 20);
const logoRingMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
const logoRing = new THREE.Mesh(logoRingGeometry, logoRingMaterial);
logoRing.position.y = 1;
logoRing.position.z = wallParams.depth / 2 + 0.01;
scene.add(logoRing);
// add logoLetter
// @ts-ignore
const fontLoader = new FontLoader();
fontLoader.load('/fonts/gentilis_regular.typeface.json', (font) => {
  const logoLetterGeometry = new TextGeometry('A', {
    font,
    size: 0.5,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  const logoLetterMaterial = new MeshBasicMaterial({ color: 0xffff00 });
  const logoLetter = new THREE.Mesh(logoLetterGeometry, logoLetterMaterial);
  scene.add(logoLetter);
});
console.log(fontLoader);
// render scene
const tick = () => {
  renderer.render(scene, camera);
  controls.update();
  stats.update();
  window.requestAnimationFrame(tick);
};
tick();
