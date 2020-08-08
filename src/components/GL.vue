<template>
  <div id="gl_mount" ref="mount"></div>
</template>

<script>
import * as THREE from 'three';
import {
  position,
  rotate,
  degreeToRadian,
  setupMeshes,
  setupRectLights,
  isDupe,
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
      frameId: null,
      unsubscribeFromStore: () => null,
      scene: null,
      camera: null,
      renderer: null,
      meshes: null,
      materials: [],
      screenLights: null,
      spotLight: null,
      activeIndex: 0,
      hoverIndex: 0,
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
    viewport() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      return {
        width,
        height,
        ratio: width / height,
      };
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
  },
  methods: {
    subscribeToStore() {
      const unsub = this.$store.subscribe(
        (mutation, { glLoaded }) => {
          if (
            mutation.type === 'setActiveTrackIndex' &&
            mutation.payload !== this.activeIndex
          ) {
            this.activeScreenChangeAnimation(
              mutation.payload,
              this.activeIndex,
            );
            this.activeIndex = mutation.payload;
          } else if (
            mutation.type === 'setHoverTrackIndex' &&
            glLoaded
          ) {
            this.hoverIndex = mutation.payload;
            const newMesh = this.meshes.children[mutation.payload];

            this.animateLightTarget(
              [newMesh.position.x, newMesh.position.y],
              [
                this.spotLightTargetPos.x,
                this.spotLightTargetPos.y,
              ],
            );
          }
        },
      );
      this.unsubscribeFromStore = () => {
        this.$store.commit('setGlLoaded', false);
        unsub();
        console.log('unsubbed');
      };
    },
    activeScreenChangeAnimation(newIndex, oldIndex) {
      this.tvLightUp(oldIndex, false);
      setTimeout(() => this.tvLightUp(newIndex, true), 300);
    },
    initCamera() {
      this.camera = new THREE.PerspectiveCamera(
        75,
        this.viewport.ratio,
        0.01,
        50,
      );
      this.setupCamera();
    },
    setupCamera() {
      rotate(this.camera, [-10, 10, 0]);
      position(this.camera, [2, 2.5, 6]);
    },
    sizeRenderer() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    initRenderer() {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      this.sizeRenderer();
      this.container.appendChild(this.renderer.domElement);
    },
    extractMaterials() {
      const mats = [];

      this.meshes.traverse((child) => {
        if (
          child.material &&
          !isDupe(mats, 'uuid', child.material.uuid)
        ) {
          mats.push(child.material);
        }
      });

      return mats;
    },
    setupMaterials() {
      this.materials = this.extractMaterials();

      // remove additional mats from crt_green model;
      this.materials.splice(3, 2);

      for (let i = 0; i < this.materials.length; i += 1) {
        this.materials[i].emissiveIntensity = 0;
        this.materials[i].emissive.set(0xb8f857);
      }
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
        0.5,
        0,
        degreeToRadian(11),
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
      window.addEventListener('resize', this.sizeRenderer);

      await this.initMeshes();

      this.setupMaterials();
      this.initScreenLights();
      this.initSpotLight();

      this.animate();
      this.$store.commit('setGlLoaded', true);
    },
    animate() {
      this.frameId = requestAnimationFrame(this.animate);

      this.spotLightLookAt();

      this.renderer.render(this.scene, this.camera);
    },
    animateLightTarget([newX, newY], [oldX, oldY], onComplete) {
      const diffX = newX - oldX;
      const diffY = newY - oldY;

      animationLoop({
        duration: 600,
        applyFn: ({ delta }) => {
          this.spotLightTargetPos.x = oldX + diffX * delta;
          this.spotLightTargetPos.y = oldY + diffY * delta;
        },
        easeFn: ease.inOutQuad,
        onComplete,
      });
    },
    tvLightUp(index, enable) {
      const light = this.screenLights.children[index];
      const mat = this.materials[index];
      // eslint-disable-next-line no-confusing-arrow
      const rampVal = (delta, val) =>
        // eslint-disable-next-line implicit-arrow-linebreak
        enable ? val * delta : val * (1 - delta);
      animationLoop({
        duration: enable ? 300 : 100,
        applyFn: ({ delta }) => {
          light.intensity = rampVal(delta, 5);
          mat.emissiveIntensity = rampVal(delta, 1);
        },
        ease: enable ? ease.inOutQuad : null,
      });
    },
    spotLightLookAt() {
      this.spotLight.target.position = new THREE.Vector3(
        this.spotLightTargetPos.x + this.spotLightTargetOffset.x,
        this.spotLightTargetPos.y + this.spotLightTargetOffset.y,
        this.spotLightTargetPos.z + this.spotLightTargetOffset.z,
      );
    },
    stopRenderLoop() {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
      window.removeEventListener('resize', this.sizeRenderer);
      this.container.removeChild(this.renderer.domElement);
    },
    clearAssets() {
      if (this.meshes) {
        this.scene.remove(this.meshes);
      }
      if (this.spotLight) {
        this.scene.remove(this.spotLight.target);
        this.scene.remove(this.spotLight);
      }
      if (this.screenLights) {
        this.scene.remove(this.screenLights);
      }

      this.scene.traverse((child) => {
        if (child.dispose) {
          child.dispose();
        }
      });
      console.log('cleared');
    },
  },
  mounted() {
    this.initGL();
    this.subscribeToStore();
  },
  beforeDestroy() {
    this.stopRenderLoop();
    this.unsubscribeFromStore();
    this.clearAssets();
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
