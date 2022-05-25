import * as THREE from "three";

/**
 * 剖切盒测试
 *
 * 内容: 如何对材质进行剖切盒
 */
function testSelection(scene, renderer) {
  const planes = [
    // new THREE.Plane(new THREE.Vector3(1, 0, 0), 0),
    // new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0),
    // new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
    // new THREE.Plane(new THREE.Vector3(0, -1, 0), 0),
    // new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
    // new THREE.Plane(new THREE.Vector3(1, 0, -1), 0),

    new THREE.Plane( new THREE.Vector3( -1, 0, 0 ), 0.3 ), // yoz
    // new THREE.Plane( new THREE.Vector3( 0, 1, 0 ), 0 ),// x0z
    // new THREE.Plane( new THREE.Vector3( 0, 0, 1 ), 0 ) // x0y
  ];

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial({
    color: 0x00ff00,
    clippingPlanes: planes,
    clipIntersection: true,
    side: THREE.DoubleSide
  });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  renderer.clippingPlanes = planes
}

export { testSelection };
