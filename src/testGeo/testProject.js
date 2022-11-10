import * as THREE from 'three';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

/**
 *
 * @param {THREE.Scene} scene
 * @param {THREE.Camera} camera
 * @param {THREE.WebGLRenderer} renderer
 * @descript 测试三维向量的project和unproject方法
 */
function testProject(scene, camera, renderer) {
  const canvas = renderer.domElement
  const dom = document.createElement('div')
  /**
   * @type {THREE.Mesh}
   */
  let cube
  dom.style.cssText = 'position: fixed; background: red; border-radius: 50%; width: 20px; height: 20px;transform: translate(-50%, -50%);'
  document.body.appendChild(dom)

  const unprojectPoint = (x, y, z) => {
    const point = new THREE.Vector3(x, y, z)
    const unprojectPoint = point.clone().project(camera);
    unprojectPoint.x = (canvas.clientWidth * (unprojectPoint.x + 1) / 2);
    unprojectPoint.y = (canvas.clientHeight * (-unprojectPoint.y + 1) / 2);
    return unprojectPoint
  }

  const project = (x, y, z = 0.5) => {
    const v = new THREE.Vector3();
    v.x = (x - canvas.clientWidth * 0.5) / (canvas.clientWidth * 0.5);
    v.y = (canvas.clientHeight * 0.5 - y) / (canvas.clientHeight * 0.5);
    v.z = z;
    v.unproject(camera);
    return v;
  }

  const createBox = (x, y, z) => {
    if (cube) {
      cube.removeFromParent()
    }
    const geometry = new THREE.BoxGeometry(0.1, .1, .1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, y, z)
    scene.add(cube);
  }

  const obj = {
    '3dto2d click': () => {
      const point = unprojectPoint(0, 0, 0);
      dom.style.left = point.x + 'px'
      dom.style.top = point.y + 'px'
      console.log(point)
    },
    '2dto3d click': () => {
      const point = project(477, 464)
      console.log(point)
      createBox(point.x, point.y, point.z)
    }
  }
  const gui = new GUI();
  gui.add(obj, '3dto2d click');
  gui.add(obj, '2dto3d click');
}
export { testProject }