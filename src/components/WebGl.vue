<template>
  <div class="WebGl" ref="webgl" id="webgl">
  </div>
</template>

<script>
import * as THREE from "three";
import oc from "three-orbit-controls";
import { mapGetters } from "vuex";
import Stats from "stats.js";
import { textureRepeat } from "@/testGeo/textureRepeat.js";

const OrbitControls = oc(THREE);

export default {
  name: "WebGl",
  methods: {
    testRender() {
      textureRepeat(this.scene, this.camera, this.renderer);
    },
  },
  computed: {
    ...mapGetters(["group"]),
  },
  mounted() {
    const scene = new THREE.Scene();
    window.scene = scene;
    scene.background = new THREE.Color("#fff");
    const width = this.$refs.webgl.clientWidth;
    const height = this.$refs.webgl.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.01, 1000);
    window.camera = camera;
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.localClippingEnabled = true;
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

    const size = 20;
    const divisions = 20;

    // const gridHelper = new THREE.GridHelper(size, divisions);
    // scene.add(gridHelper);

    // 添加辅助线测试
    const axesHelper = new THREE.AxesHelper(250);
    scene.add(axesHelper);

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
      renderer.render(scene, camera);
      stats.end();
    }

    animate();

    this.scene = scene;
    this.renderer = renderer;
    this.camera = camera;
    this.testRender();

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
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
