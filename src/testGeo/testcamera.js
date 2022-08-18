import * as THREE from "three";

/**
 * 测试相机
 * @param {THREE.Scene} scene
 * @param {THREE.Camera} camera
 */
function testcamera(scene, camera) {
  const div = document.createElement('div')
  div.innerHTML = 'Click'
  div.style = 'position: fixed; left: 200px; top: 110px;cursor: pointer; background: red'
  div.onclick = run
  document.body.appendChild(div)

  function run() {
    camera.updateMatrixWorld();
    camera.updateProjectionMatrix();
    const t = new THREE.Vector3(1000, 0, 0);
    t.project(camera);

    console.log("camera: ", camera);
    console.log("t: ", JSON.stringify(t));
  }
}

export { testcamera };
