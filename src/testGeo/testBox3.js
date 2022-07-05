import * as THREE from "three";
/**
 *
 * @param {THREE.Scene} scene
 */
function testBox3(scene) {
  const min = new THREE.Vector3(-1, -1, -1);
  const max = new THREE.Vector3(1, 1, 1);
  const box = new THREE.Box3(min, max);

  box.expandByVector(new THREE.Vector3(1, 10, 0))

  const helper = new THREE.Box3Helper(box, 0xff0000);
  scene.add(helper);

  {
    const size = 10;
    const divisions = 10;

    const gridHelper = new THREE.GridHelper(size, divisions);
    scene.add(gridHelper);
  }
}

export { testBox3 };
