import * as THREE from "three";

/**
 * 测试材质中的SIDE
 * @param {THREE.Scene} scene
 * @param {THREE.Camera} camera
 */
function testSide(scene, camera) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial({ color: 0x00ff00, side: THREE.BackSide });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  camera.position.set(0, 1, 0)
  console.log("position", camera.position);
}

export { testSide };
