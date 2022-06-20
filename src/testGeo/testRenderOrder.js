import * as THREE from "three";
/**
 * 测试renderOrder
 * @param {THREE.Scene} scene
 */
function testRenderOrder(scene) {
  {
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshPhongMaterial({
      color: 0x156289,
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.renderOrder = 1
    scene.add(cube);
  }

  {
    const geometry = new THREE.SphereGeometry(1.1, 32, 16);
    const material = new THREE.MeshPhongMaterial({
      color: 0xff0000,
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(3, 0, 0);
    scene.add(sphere);
  }
}

export { testRenderOrder };
