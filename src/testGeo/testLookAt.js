import * as THREE from "three";

/**
 * 测试LookAt性质
 */

function testLookAt(scene) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  cube.lookAt(new THREE.Vector3(1, 0, 0));
  console.log('cube: ', cube)
}

export { testLookAt };
