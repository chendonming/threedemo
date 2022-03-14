/* eslint-disable no-unused-expressions */
import * as THREE from 'three';
/**
 * 形状参数，所有的几何体都应该有此属性
 */
export default {
  props: {
    // 宽度， 由于默认横放视觉上是高度
    width: {
      type: Number,
      default: 5,
    },
    // 高度
    height: {
      type: Number,
      default: 20,
    },
    // 偏移
    offset: {
      type: Number,
      default: 0,
    },
    // 唯一id保证全局中能找出对象
    uuid: {
      type: String,
    },
    shapeColor: {
      type: String,
      default: '#185caa',
    },
    // 是否聚焦
    isFocus: {
      type: Boolean,
    },
  },
  computed: {
    group() {
      return this.$store.state.group;
    },
  },
  methods: {
    clear() {
      const { scene } = this.$parent;
      this?.geometry.dispose();
      this?.smallGeometry.dispose();
      this?.material.dispose();
      this?.group.remove(this.mesh);
      scene.remove(this?.mesh);
    },
  },
  beforeDestroy() {
    this.clear();
  },
  watch: {
    shapeColor() {
      this.material.color = new THREE.Color(this.shapeColor);
    },
    offset() {
      this.mesh.position.y = -this.offset;
    },
    isFocus(val) {
      if (val) {
        this.material.color = new THREE.Color(this.$store.state.focusColor);
      } else {
        this.material.color = new THREE.Color(this.shapeColor);
      }
    },
  },
};
