<template>
  <div id="gl_mount" ref="mount"></div>
</template>

<script>
import * as THREE from 'three';
import {
  position,
  degreeToRadian,
  setupMeshes,
  setupRectLights,
  rotate,
  // V3,
  recursiveObjSearch,
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
      screenLights: [],
      spotLight: null,
      spotLightTargetPos: {
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
    spotLightTargetOffset() {
      // offset light target with mouse position
      // adjust for mesh rotation
      const x = (this.lerped.x / this.viewport.width) * 2 - 0.5;
      const y =
        -((this.lerped.y / this.viewport.height) * 2 - 1) + 0.2;
      return {
        x,
        y,
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

      this.tvLightUp(oldIndex, false);
      setTimeout(() => {
        this.animateLightTarget(
          [newMesh.position.x, newMesh.position.y],
          [oldMesh.position.x, oldMesh.position.y],
        );
      }, 300);

      setTimeout(() => {
        this.tvLightUp(newIndex, true);
      }, 300);
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
    extractMaterials() {
      const { children } = this.meshes;
      this.materials = children.map(
        (mesh) =>
          // eslint-disable-next-line implicit-arrow-linebreak
          recursiveObjSearch(mesh, 'material'),
        // eslint-disable-next-line function-paren-newline
      );
      console.log(this.materials);
    },
    async initMeshes() {
      this.meshes = await setupMeshes();
      this.scene.add(this.meshes);

      return this.meshes;
    },
    initScreenLights() {
      this.screenLights = setupRectLights(0xe2f8c1, 0);
      this.scene.add(this.screenLights);
      this.tvLightUp(0, true);
    },
    initSpotLight() {
      this.spotLight = new THREE.SpotLight(
        0xe9e9e9,
        1.5,
        0,
        degreeToRadian(9),
        0.5,
        2,
      );
      this.spotLight.castShadow = true;
      position(this.spotLight, [4, 4, 8]);

      this.scene.add(this.spotLight);
      this.scene.add(this.spotLight.target);
    },
    async initGL() {
      this.scene = new THREE.Scene();
      this.initCamera();
      this.initRenderer();

      await this.initMeshes();
      this.extractMaterials();
      this.initScreenLights();

      this.initSpotLight();

      this.animate();
      this.$store.commit('setGlLoaded', true);
    },
    animate() {
      requestAnimationFrame(this.animate);

      this.spotLightLookAt();

      this.renderer.render(this.scene, this.camera);
    },
    animateLightTarget([newX, newY], [oldX, oldY]) {
      const diffX = newX - oldX;
      const diffY = newY - oldY;

      animationLoop(
        600,
        ({ delta }) => {
          this.spotLightTargetPos.x = oldX + diffX * delta;
          this.spotLightTargetPos.y = oldY + diffY * delta;
        },
        ease.inOutQuad,
      );
    },
    tvLightUp(index, enable) {
      const light = this.screenLights.children[index];
      light.intensity = enable ? 5 : 0;
    },
    spotLightLookAt() {
      this.spotLight.target.position = new THREE.Vector3(
        this.spotLightTargetPos.x + this.spotLightTargetOffset.x,
        this.spotLightTargetPos.y + this.spotLightTargetOffset.y,
        this.spotLightTargetPos.z + this.spotLightTargetOffset.z,
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
