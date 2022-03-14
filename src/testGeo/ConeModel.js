import * as THREE from 'three';

function ConeModel() {
  const minTop = 0.01;
  const minBottom = 0.01;
  const topWidth = 10;
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
    // 顶上的点
    if (v3.y === 10 && Number(v3.x.toFixed(2)) === minTop) {
      // v3.x += 10;
      console.log('top: ', v3);
      // 可以用矩阵解决
      const m = new THREE.Matrix4();
      m.makeTranslation(topWidth, -topHeight, 0);
      v3.applyMatrix4(m);
      vertices.setX(i, v3.x);
      vertices.setY(i, v3.y);
    }

    if (v3.y === -10 && Number(v3.x.toFixed(2)) === minBottom) {
      // 顶下的点
      // 可以用矩阵解决
      console.log('bottom:', v3);
      const m = new THREE.Matrix4();
      m.makeTranslation(bottomWidth, -bottomHeight, 0);
      v3.applyMatrix4(m);
      vertices.setX(i, v3.x);
      vertices.setY(i, v3.y);
    }
    //
    // if (v3.y === 10) {
    //   v3.y += 10;
    // }
    // vertices.setX(i, v3.x);
    // vertices.setY(i, v3.y);
  }
  return geo;
}

export default ConeModel;
