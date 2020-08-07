import * as THREE from 'three';

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

export function position(el, [x, y, z]) {
  el.position.set(x, y, z);
}

export function scale(obj, [x, y, z]) {
  obj.scale.set(x, y, z);
}

export function radToDeg(rad) {
  return (rad * 180) / Math.PI;
}

export function degreeToRadian(deg) {
  return (deg * Math.PI) / 180;
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
      url,
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
