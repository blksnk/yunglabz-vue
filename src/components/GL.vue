<template>
  <div id="gl_mount" ref="mount"></div>
</template>

<script>
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {
  Group,
  Clone,
  Mesh,
  position,
  // scale,
  translate,
  rotate,
  degreeToRadian,
  loadModel,
} from '@/helpers/three';
import { animationLoop, ease } from '@/helpers/animation';

const loader = new GLTFLoader();

export default {
  name: 'GL',
  props: {
    lerped: {
      type: Object,
      default: () => ({
        x: 0,
        y: 0,
      }),
    },
  },
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      meshes: null,
      materials: [],
      light: null,
      model: null,
      lightTargetPos: {
        x: 0,
        y: 0,
        z: 1,
      },
    };
  },
  computed: {
    container() {
      return this.$refs.mount;
    },
    activeIndex() {
      return this.$store.state.activeTrackIndex;
    },
    lightTargetOffset() {
      const x = (this.lerped.x / this.viewport.width) * 2 - 1;
      const y = -((this.lerped.y / this.viewport.height) * 2 - 1);
      return {
        x,
        y: y + 0.5,
        z: 0.5,
      };
    },
    viewport() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      return {
        width,
        height,
        ratio: width / height,
      };
    },
  },
  watch: {
    activeIndex(newIndex, oldIndex) {
      const oldMesh = this.meshes.children[oldIndex];
      const newMesh = this.meshes.children[newIndex];

      this.animateLightTarget(
        [newMesh.position.x, newMesh.position.y],
        [oldMesh.position.x, oldMesh.position.y],
      );
      // this.tvLightUp(getNested(newMesh, 1), true);
    },
  },
  methods: {
    initCamera() {
      this.camera = new THREE.PerspectiveCamera(
        70,
        this.container.clientWidth / this.container.clientHeight,
        0.01,
        50,
      );
      this.camera.position.set(0, 1.65, 5);
    },
    resizeRenderer() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    initRenderer() {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      this.resizeRenderer();
      this.container.appendChild(this.renderer.domElement);
    },
    initMaterials() {
      this.materials = [
        new THREE.MeshLambertMaterial({
          color: 0x181818,
          emissive: 0x9a57ff,
          emissiveIntensity: 2,
          wireframe: true,
        }),
      ];
    },
    createPlane() {
      return new THREE.Mesh(
        new THREE.PlaneGeometry(4, 3, 3, 3),
        this.materials[0],
      );
    },
    createBox() {
      return Mesh(
        new THREE.BoxGeometry(3.5, 3, 3, 2, 2, 2),
        this.materials[1],
      );
    },
    async initMeshes() {
      const [box0] = await Promise.all([
        loadModel(loader, '/models/retro_tv/scene.gltf'),
        // loadModel(loader, '/models/crt_monitor/scene.gltf'),
      ]);

      const box1 = Clone(box0);
      const box2 = Clone(box0);
      const box3 = Clone(box0);
      const box4 = Clone(box0);

      position(box0, [1, 1.65, 0]);

      position(box1, [-1, 1.65, 0]);

      position(box2, [2, 0, 0]);
      translate(box2, [0.25, 0, 0.3]);
      // scale(box2, [1.3, 1.3, 1.3]);
      rotate(box2, [0, -20, 0]);

      position(box3, [0, 0, 0]);

      position(box4, [-2, 0, 0]);

      this.meshes = Group([box0, box1, box2, box3, box4]);
      this.scene.add(this.meshes);
      return this.meshes;
    },
    initLight() {
      this.light = new THREE.SpotLight(
        0x6529ff,
        1.8,
        0,
        degreeToRadian(12),
        0.4,
        2,
      );
      this.light.castShadow = true;

      position(this.light, [0, 5, 5]);

      this.scene.add(this.light);
      this.scene.add(this.light.target);
    },
    async initGL() {
      this.scene = new THREE.Scene();
      this.initCamera();
      this.initRenderer();
      this.initMaterials();

      await this.initMeshes();
      this.initLight();

      this.animate();
      this.animateLightTarget([1, 1.65], [0, 0]);
      this.$store.commit('setGlLoaded', true);
    },
    animate() {
      requestAnimationFrame(this.animate);

      this.lightLookAt();
      this.cameraLookAt();

      this.renderer.render(this.scene, this.camera);
    },
    animateLightTarget([newX, newY], [oldX, oldY]) {
      const diffX = newX - oldX;
      const diffY = newY - oldY;

      animationLoop(
        600,
        ({ delta }) => {
          this.lightTargetPos.x = oldX + diffX * delta;
          this.lightTargetPos.y = oldY + diffY * delta;
        },
        ease.inOutParametric,
      );
    },
    tvLightUp(obj, enable) {
      const tvScreen = obj.children[12];
      if (enable) {
        // eslint-disable-next-line prefer-destructuring
        tvScreen.material = this.materials[0];
      } else {
        tvScreen.material = obj.material;
      }
      tvScreen.material.needsUpdate = true;
    },
    lightLookAt() {
      this.light.target.position = new THREE.Vector3(
        this.lightTargetPos.x + this.lightTargetOffset.x,
        this.lightTargetPos.y + this.lightTargetOffset.y,
        this.lightTargetPos.z + this.lightTargetOffset.z,
      );
    },
    lightMove() {
      const { x, y, z } = this.lightPos;
      position(this.light, [x, y, z]);
    },
    cameraLookAt() {
      const { x, y, z } = this.meshes.position;
      this.camera.lookAt(new THREE.Vector3(x, y + 1, z));
    },
  },
  mounted() {
    this.initGL();
    window.addEventListener('resize', this.resizeRenderer);
  },
};
</script>

<style lang="scss">
#gl_mount {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}
</style>
