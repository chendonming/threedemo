import * as THREE from 'three';

/**
 *
 * @param {THREE.Scene} scene
 * @param {THREE.Camera} camera
 * @param {THREE.WebGLRenderer} renderer
 * @descript 测试轮廓
 */
function OutlineNode(scene, camera, renderer) {
  camera.position.set(-46.39977063142862, 36.46321958040742, 80.37565425415214)
  camera.rotation.set(-0.44527841371063376, -0.6596758942759722, -0.28454784940412936)

  const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
  const material = new THREE.MeshPhongMaterial({
    color: 0x049ef4,
    stencilWrite: true,
    stencilRef: 1,
    stencilFunc: THREE.AlwaysStencilFunc,
    stencilFail: THREE.KeepStencilOp,
    stencilZFail: THREE.KeepStencilOp,
    stencilZPass: THREE.ReplaceStencilOp,
  });
  const torusKnot = new THREE.Mesh(geometry, material);
  torusKnot.renderOrder = 1
  scene.add(torusKnot);
  // {
  //   // 解开注释查看第一种方法: 缩放网格
  //   const geometry1 = new THREE.TorusKnotGeometry(10, 3, 100, 16);
  //   const material1 = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.BackSide });
  //   const torusKnot1 = new THREE.Mesh(geometry1, material1);
  //   torusKnot1.position.copy(torusKnot.position)
  //   torusKnot1.scale.multiplyScalar(1.05)
  //   scene.add(torusKnot1);
  // }

  // 第二种方法: 模板测试
  const geometry1 = new THREE.TorusKnotGeometry(10, 3, 100, 16);
  const material1 = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    stencilWrite: true,
    stencilRef: 1,
    depthTest: false,
    stencilFunc: THREE.NotEqualStencilFunc,
    stencilFail: THREE.KeepStencilOp,
    stencilZFail: THREE.KeepStencilOp,
    stencilZPass: THREE.ReplaceStencilOp,
  });
  const torusKnot1 = new THREE.Mesh(geometry1, material1);
  torusKnot1.position.copy(torusKnot.position)
  torusKnot1.scale.multiplyScalar(1.05)
  torusKnot1.renderOrder = 2
  scene.add(torusKnot1);
}
export { OutlineNode }