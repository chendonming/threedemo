<template>
  <div class="WebGl" ref="webgl" id="webgl">
    <slot v-if="scene"></slot>
  </div>
</template>

<script>
import * as THREE from "three";
import oc from "three-orbit-controls";
import { mapGetters } from "vuex";
import Stats from "stats.js";
import {testVector} from '@/testGeo/testVector.js'

const OrbitControls = oc(THREE);

export default {
  name: "WebGl",
  data() {
    return {
      scene: null,
      time: null,
    };
  },
  computed: {
    ...mapGetters(["group"]),
  },
  mounted() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#fff");
    const width = this.$refs.webgl.clientWidth;
    const height = this.$refs.webgl.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.01, 1000);
    window.camera = camera
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    });

    renderer.localClippingEnabled = true
    renderer.setSize(width, height);
    this.$refs.webgl.appendChild(renderer.domElement);

    // 添加光源
    const point = new THREE.PointLight(0xffffff, 1.5);
    point.position.set(0, 0, 100);
    scene.add(point);

    // 添加相机控制
    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(1, 2, 3);
    controls.update();

    // 添加辅助线测试
    const axesHelper = new THREE.AxesHelper(250);
    scene.add(axesHelper);

    const group = new THREE.Group();
    group.name = "test";
    this.$store.commit("setGroup", group);
    scene.add(group);
    // group.rotateX(Math.PI / 2);
    // group.rotateZ(Math.PI / 2);

    // 添加FPS监控
    const stats = new Stats();
    stats.domElement.style.position = "absolute";
    stats.domElement.style.left = "0px";
    stats.domElement.style.top = "0px";
    stats.showPanel(0);
    this.$refs.webgl.appendChild(stats.dom);

    function animate() {
      requestAnimationFrame(animate);
      stats.begin();
      const vector = camera.position.clone();
      point.position.set(vector.x, vector.y, vector.z);

      controls.update();
      renderer.render(scene, camera);
      stats.end();
    }

    animate();

    this.scene = scene;
    this.renderer = renderer;
    this.camera = camera;
    this.testRender()

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    document.getElementById("webgl").addEventListener("mousedown", (e) => {
      if (e.button === 0) this.time = new Date();
    });
    document.getElementById("webgl").addEventListener(
      "mouseup",
      (event) => {
        if (event.button === 0) {
          const time = new Date();
          // 点击事件小于200ms才响应
          if (time.getTime() - this.time.getTime() <= 200) {
            this.onDocumentMouseDown(event);
            this.time = null;
          }
        }
      },
      false
    );
  },
  methods: {
    testRender() {
      testVector(this.scene)
    },
    /**
     * 投注一条射线 被射线命中的mesh会被返回，以此来实现点击事件
     */
    onDocumentMouseDown(event) {
      event.preventDefault();
      this.mouse.x =
        (event.offsetX / this.renderer.domElement.clientWidth) * 2 - 1;
      this.mouse.y =
        -(event.offsetY / this.renderer.domElement.clientHeight) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.group.children);
      if (intersects.length > 0) {
        this.$emit("click", intersects[0].object.name);
      }
    },
  },
};
</script>

<style scoped>
.WebGl {
  border-top: 1px solid #eee;
  position: relative;
  height: 100%;
}
</style>
