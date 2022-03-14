import parent from '@/mix/parent.js';
import * as THREE from 'three';
import shape from '@/mix/shape.js';
import { CSG } from 'three-csg-ts';

/**
 * 正方体
 */
export default {
  name: 'Cube',
  render() { return <div/>; },
  mixins: [parent, shape],
  mounted() {
    this.renderModel();
  },
  methods: {
    renderModel() {
      const { scene } = this.$parent;
      this.geometry = new THREE.CylinderBufferGeometry(this.width, this.width, this.height, 32);
      this.material = new THREE.MeshLambertMaterial({ color: this.shapeColor });

      // eslint-disable-next-line max-len
      this.smallGeometry = new THREE.CylinderBufferGeometry(this.width - 2, this.width - 2, this.height, 32);
      const smallCylinder = new THREE.Mesh(this.smallGeometry, this.material);
      const bigCylinder = new THREE.Mesh(this.geometry, this.material);

      smallCylinder.updateMatrix();
      bigCylinder.updateMatrix();

      const subRes = CSG.subtract(bigCylinder, smallCylinder);
      subRes.name = this.uuid;
      // subRes.position.y = -this.offset;
      this.mesh = subRes;
      scene.add(subRes);
      this.group.add(subRes);

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
