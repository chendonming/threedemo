import parent from '@/mix/parent.js';
import * as THREE from 'three';
import shape from '@/mix/shape.js';
import { CSG } from 'three-csg-ts';

/**
 * 圆锥体
 */
export default {
  name: 'Cone',
  render() { return <div/>; },
  mixins: [parent, shape],
  mounted() {
    this.renderModel();
  },
  methods: {
    renderModel() {
      const { scene } = this.$parent;
      this.geometry = new THREE.ConeBufferGeometry(this.width, this.height, 32);
      this.material = new THREE.MeshLambertMaterial({ color: this.shapeColor });
      const cylinder = new THREE.Mesh(this.geometry, this.material);
      this.smallGeometry = new THREE.ConeBufferGeometry(this.width - 2, this.height, 32);
      const smallCylinder = new THREE.Mesh(this.smallGeometry, this.material);
      const subRes = CSG.subtract(cylinder, smallCylinder);

      scene.add(subRes);
      this.group.add(subRes);
      subRes.name = this.uuid;

      this.mesh = subRes;
      // subRes.position.y = -this.offset;

      if (this.isFocus) {
        this.material.color = new THREE.Color(this.$store.state.focusColor);
      } else {
        this.material.color = new THREE.Color(this.shapeColor);
      }
    },
  },
  watch: {
    height() {
      this.clear();
      this.renderModel();
    },
    width() {
      this.clear();
      this.renderModel();
    },
  },
};
