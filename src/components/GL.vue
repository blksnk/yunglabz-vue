<template>
  <div id="gl_mount" ref="mount"></div>
</template>

<script>
import * as THREE from 'three';
import {
  Mesh,
  position,
  degreeToRadian,
  setUpMeshes,
  rotate,
} from '@/helpers/three';
import { animationLoop, ease } from '@/helpers/animation';

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
      this.setUpCamera();
    },
    setUpCamera() {
      rotate(this.camera, [-10, 10, 0]);
      position(this.camera, [2, 2.5, 6]);
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
      this.meshes = await setUpMeshes();
      this.scene.add(this.meshes);
      return this.meshes;
    },
    initLight() {
      this.light = new THREE.SpotLight(
        0xe9e9e9,
        1.9,
        0,
        degreeToRadian(14),
        0.5,
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
      this.$store.commit('setGlLoaded', true);
    },
    animate() {
      requestAnimationFrame(this.animate);

      this.lightLookAt();

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
        ease.inOutQuad,
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
