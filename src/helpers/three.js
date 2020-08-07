import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export function Group(els) {
  const g = new THREE.Group();
  els.forEach((el) => {
    g.add(el);
  });
  return g;
}

export function Mesh(geo, mat) {
  return new THREE.Mesh(geo, mat);
}

export function V3(x, y, z) {
  return new THREE.Vector3(x, y, z);
}

export function radToDeg(rad) {
  return (rad * 180) / Math.PI;
}

export function degreeToRadian(deg) {
  return (deg * Math.PI) / 180;
}

export function rotate(obj, coords) {
  const [x, y, z] = coords.map((angle) => degreeToRadian(angle));
  obj.rotateX(x);
  obj.rotateY(y);
  obj.rotateZ(z);
}

export function position(obj, [x, y, z]) {
  obj.position.set(x, y, z);
}

export function scale(obj, [x, y, z]) {
  obj.scale.set(x, y, z);
}

export function translate(obj, [x, y, z]) {
  obj.translateX(x);
  obj.translateY(y);
  obj.translateZ(z);
}

export function foo() {
  return 'bar';
}

export function Clone(obj) {
  return obj.clone();
}

export function getNested(obj, levels) {
  let child = obj;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i <= levels; i++) {
    // eslint-disable-next-line prefer-destructuring
    child = child.children[0];
  }
  return child;
}

export async function loadModel(loader, url) {
  return new Promise((resolve, reject) => {
    loader.load(
      process.env.BASE_URL + url,
      ({ scene }) => {
        resolve(scene);
      },
      null,
      (err) => {
        console.error(err);
        reject(err);
      },
    );
  });
}

export async function loadUsedModels() {
  const loader = new GLTFLoader();
  const loaded = await Promise.all([
    loadModel(loader, 'models/retro_tv_reduced/scene.gltf'),
    loadModel(loader, 'models/crt_green_reduced/scene.gltf'),
    loadModel(loader, 'models/mac_classic_reduced/scene.gltf'),
    loadModel(loader, 'models/big_tv_reduced/scene.gltf'),
  ]);

  return loaded;
}

export async function setUpMeshes() {
  const [
    retroTv,
    crtGreen,
    mac,
    tvBig,
    // dualMonitor,
  ] = await loadUsedModels();

  const box2 = Clone(retroTv);

  // [__]   [_]
  // [__] [xx] [_]
  //    [_]
  position(retroTv, [0, 0.05, 0]);
  scale(retroTv, [1.1, 1.15, 1.1]);

  // [__]   [_]
  // [xx] [__] [_]
  //    [_]
  position(tvBig, [-2.7, 0.3, 0.3]);
  scale(tvBig, [1.6, 1.6, 1.6]);
  rotate(tvBig, [0, 105, 0]);

  // [__]   [_]
  // [__] [__] [x]
  //    []
  position(box2, [2, 0, 0]);
  rotate(box2, [0, 0, 90]);

  // [xx]   [_]
  // [__] [__] [_]
  //    []
  position(crtGreen, [-2, 1.94, 0.1]);
  rotate(crtGreen, [0, 20, 0]);
  translate(crtGreen.children[0], [-1, 0, 0]);

  // [__]   [x]
  // [__] [__] [_]
  //    []
  position(mac, [1.1, 1.85, 0.5]);
  scale(mac, [1.5, 1.5, 1.5]);
  rotate(mac, [0, -7, 0]);

  const group = Group([retroTv, tvBig, box2, crtGreen, mac]);
  rotate(group, [0, 15, 0]);

  return group;
}
