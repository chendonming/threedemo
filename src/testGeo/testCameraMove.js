import * as THREE from "three";

/**
 * 测试相机移动
 */

function testCameraMove(scene, camera, renderer) {
  const keypress = {};
  const clock = new THREE.Clock();

  document.addEventListener("keydown", (e) => {
    keypress[e.key.toUpperCase()] = true;
  });

  document.addEventListener("keyup", (e) => {
    keypress[e.key.toUpperCase()] = false;
  });

  renderer.setAnimationLoop(() => {
    camera.updateMatrixWorld();
    camera.updateProjectionMatrix();
    const delta = clock.getDelta();
    const move = new THREE.Vector3();

    if (keypress["W"]) {
      move.z -= 1;
    }

    if (keypress["S"]) {
      move.z += 1;
    }

    if (keypress["A"]) {
      move.x -= 1;
    }

    if (keypress["D"]) {
      move.x += 1;
    }

    if (move.x === 0 && move.y === 0 && move.z === 0) return;

    const matrix3 = new THREE.Matrix3();
    const up = new THREE.Vector3(0, 1, 0);

    camera.updateMatrix();
    move.normalize();
    move.applyNormalMatrix(matrix3.setFromMatrix4(camera.matrixWorld));
    move.cross(up).cross(up).negate();

    camera.position.add(move.multiplyScalar(delta * 10));
  });
}

export { testCameraMove };
