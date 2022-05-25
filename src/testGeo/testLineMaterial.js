import * as THREE from "three";
/**
 * 测试线被透明mesh遮挡的问题
 */
function testLineMaterial(scene) {
  camera.position.set(7.392296770918589, 14.784593541837177, 22.176890312755756);

  const material = new THREE.LineBasicMaterial({
    color: 0x0000ff,
  });

  const points = [];
  points.push(new THREE.Vector3(-10, 0, 0));
  points.push(new THREE.Vector3(0, 10, 0));
  points.push(new THREE.Vector3(10, 0, 0));

  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  const line = new THREE.Line(geometry, material);
  scene.add(line);

  {
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);
  }
}

export { testLineMaterial };
