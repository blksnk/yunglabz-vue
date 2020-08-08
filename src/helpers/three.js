import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib';

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

export function V3({ x, y, z }) {
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

export function setProp(obj, prop, val) {
  obj[prop].set(val);
}

export function foo() {
  return 'bar';
}

export function Clone(obj) {
  return obj.clone();
}

export function isDupe(arr, prop, val) {
  return arr.some((child) => child[prop] === val);
}

export function recursiveObjSearch(object, key) {
  let value;
  object.children.some((child) => {
    let ret;
    if (child[key]) {
      value = child[key];
      ret = true;
    } else if (object.children.length > 0) {
      value = recursiveObjSearch(child, key);
      ret = value !== undefined;
    }
    return ret;
  });
  return value;
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
    loadModel(loader, 'models/retro_tv/scene.gltf'),
    loadModel(loader, 'models/crt_green/scene.gltf'),
    loadModel(loader, 'models/retro_tv_rotated/scene.gltf'),
    loadModel(loader, 'models/mac_classic_reduced/scene.gltf'),
    loadModel(loader, 'models/big_tv/scene.gltf'),
  ]);

  return loaded;
}

export async function setupMeshes() {
  const [
    retroTv,
    crtGreen,
    retroTvRotated,
    mac,
    tvBig,
  ] = await loadUsedModels();

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
  position(retroTvRotated, [2, 0, 0]);
  rotate(retroTvRotated, [0, 0, 90]);

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

  const meshes = Group([
    retroTv,
    tvBig,
    retroTvRotated,
    crtGreen,
    mac,
  ]);
  rotate(meshes, [0, 15, 0]);

  return meshes;
}

export function setupRectLights(color = 0xe2f8c1, intensity = 5) {
  RectAreaLightUniformsLib.init();

  const light0 = new THREE.RectAreaLight(
    color,
    intensity,
    1.7,
    1.4,
  );
  position(light0, [0, 0.15, 0.75]);
  rotate(light0, [0, 180, 0]);

  const light1 = new THREE.RectAreaLight(
    color,
    intensity,
    2.1,
    1.7,
  );
  position(light1, [-2.8, 0.3, 0.8]);
  rotate(light1, [0, 195, 0]);

  const light2 = new THREE.RectAreaLight(
    color,
    intensity,
    1.4,
    1.7,
  );
  position(light2, [2, 0, 0.7]);
  rotate(light2, [0, 180, 0]);

  const light3 = new THREE.RectAreaLight(
    color,
    intensity + 3,
    1,
    0.8,
  );
  position(light3, [-2.6, 2.1, 1.05]);
  rotate(light3, [-9, 200, 0]);

  const light4 = new THREE.RectAreaLight(
    color,
    intensity,
    0.95,
    0.8,
  );
  position(light4, [1.1, 2.05, 0.9]);
  rotate(light4, [-9, 173, 0]);

  const lights = Group([light0, light1, light2, light3, light4]);
  rotate(lights, [0, 15, 0]);

  return lights;
}
