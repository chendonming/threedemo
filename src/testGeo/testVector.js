import * as THREE from 'three';

/**
 * 测试向量
 * @param {THREE.Scene} scene
 */
function testVector(scene) {
  // 辅助测试向量的加法 ====> add
  // 红色向量
  // 方向
  const dir1 = new THREE.Vector3(1, 1, 0).normalize();
  // origin
  const o1 = new THREE.Vector3(1, 0, 0);
  const a = new THREE.ArrowHelper(dir1, o1, 1, 0xff0000);
  scene.add(a);

  {
    // 辅助理解画点
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
  }

  // 蓝色色向量
  // 方向
  const dir2 = new THREE.Vector3(0, 1, 0).normalize();
  // origin
  const o2 = new THREE.Vector3(1, 0, 0);
  const a2 = new THREE.ArrowHelper(dir2, o2, 1, 0x00ff00);
  scene.add(a2);

  // 相加
  const dir3 = dir1.add(dir2).normalize()
  // origin
  const o3 = new THREE.Vector3(1, 0, 0);
  const a3 = new THREE.ArrowHelper(dir3, o3, 1, 0x0000ff);
  scene.add(a3);
}

export { testVector };
