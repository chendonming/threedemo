import * as THREE from 'three';

/**
 * 测试四棱台
 * @returns {CylinderGeometry}
 * @constructor
 */
function ConeModel() {
  const minTop = 0.01;
  const minBottom = 0.01;
  const topWidth = 10;
  // eslint-disable-next-line no-unused-vars
  const topHeight = 20;

  const bottomWidth = 20;
  const bottomHeight = 30;

  const geo = new THREE.CylinderGeometry(minTop, minBottom, 20, 4);
  const vertices = geo.attributes.position;
  const v3 = new THREE.Vector3();
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < vertices.count; i++) {
    v3.fromBufferAttribute(vertices, i);
    console.log(v3.x);
    const computedEdge = Math.sqrt(2) / 2;
    // 顶上的点
    if (v3.y === 10 && Number(v3.x.toFixed(2)) === minTop) {
      const n = new THREE.Vector3(computedEdge * topWidth / 2, 0, computedEdge * topWidth / 2);
      const n1 = new THREE.Vector3(computedEdge * topHeight / 2, 0, -computedEdge * topHeight / 2);
      v3.add(n).add(n1);
      vertices.setX(i, v3.x);
      vertices.setZ(i, v3.z);
    }

    // 对应底下的点
    if (v3.y === -10 && Number(v3.x.toFixed(2)) === minTop) {
      const n = new THREE.Vector3(computedEdge * bottomWidth / 2, 0, computedEdge * bottomWidth / 2);
      const n1 = new THREE.Vector3(computedEdge * bottomHeight / 2, 0, -computedEdge * bottomHeight / 2);
      v3.add(n).add(n1);
      vertices.setX(i, v3.x);
      vertices.setZ(i, v3.z);
    }

    if (v3.y === 10 && Number(v3.z.toFixed(2)) === minTop) {
      const n = new THREE.Vector3(computedEdge * topWidth / 2, 0, computedEdge * topWidth / 2);
      const n1 = new THREE.Vector3(-computedEdge * topHeight / 2, 0, computedEdge * topHeight / 2);
      v3.add(n).add(n1)
      vertices.setX(i, v3.x);
      vertices.setZ(i, v3.z);
    }

    // 对应底下的点
    if (v3.y === -10 && Number(v3.z.toFixed(2)) === minTop) {
      const n = new THREE.Vector3(computedEdge * bottomWidth / 2, 0, computedEdge * bottomWidth / 2);
      const n1 = new THREE.Vector3(-computedEdge * bottomHeight / 2, 0, computedEdge * bottomHeight / 2);
      v3.add(n).add(n1)
      vertices.setX(i, v3.x);
      vertices.setZ(i, v3.z);
    }

    if (v3.y === 10 && Number(v3.x.toFixed(2)) === -minTop) {
      const n = new THREE.Vector3(-computedEdge * topWidth / 2, 0, -computedEdge * topWidth / 2);
      const n1 = new THREE.Vector3(-computedEdge * topHeight / 2, 0, computedEdge * topHeight / 2);
      v3.add(n).add(n1);
      vertices.setX(i, v3.x);
      vertices.setZ(i, v3.z);
    }

    // 对应底下的点
    if (v3.y === -10 && Number(v3.x.toFixed(2)) === -minTop) {
      const n = new THREE.Vector3(-computedEdge * bottomWidth / 2, 0, -computedEdge * bottomWidth / 2);
      const n1 = new THREE.Vector3(-computedEdge * bottomHeight / 2, 0, computedEdge * bottomHeight / 2);
      v3.add(n).add(n1);
      vertices.setX(i, v3.x);
      vertices.setZ(i, v3.z);
    }

    if (v3.y === 10 && Number(v3.z.toFixed(2)) === -minTop) {
      const n = new THREE.Vector3(-computedEdge * topWidth / 2, 0, -computedEdge * topWidth / 2);
      const n1 = new THREE.Vector3(computedEdge * topHeight / 2, 0, -computedEdge * topHeight / 2);
      v3.add(n).add(n1);
      vertices.setX(i, v3.x);
      vertices.setZ(i, v3.z);
    }

    // 对应底下的点
    if (v3.y === -10 && Number(v3.z.toFixed(2)) === -minTop) {
      const n = new THREE.Vector3(-computedEdge * bottomWidth / 2, 0, -computedEdge * bottomWidth / 2);
      const n1 = new THREE.Vector3(computedEdge * bottomHeight / 2, 0, -computedEdge * bottomHeight / 2);
      v3.add(n).add(n1);
      vertices.setX(i, v3.x);
      vertices.setZ(i, v3.z);
    }
  }
  geo.computeVertexNormals()
  return geo;
}

export default ConeModel;
