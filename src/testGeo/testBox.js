import * as THREE from "three";
function testBox(scene) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  geometry.computeBoundingBox()
  console.log(geometry.boundingBox)
}

export { testBox };
