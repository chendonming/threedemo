import * as THREE from "three";
/**
 * 测试材质方法
 */
function testMaterial(scene) {
  const geometry = new THREE.TorusKnotGeometry(1, 0.1, 100, 16);
  // const geometry = new THREE.BoxGeometry(2, 2, 2);
  const plane = new THREE.Plane(new THREE.Vector3(1, 0, 0), -0.6)
  // const plane1 = new THREE.Plane(new THREE.Vector3(0, -1, 0), -0.6);

  {
    const helper = new THREE.PlaneHelper(plane, 2, 0xff0000);
    scene.add(helper);
  }

  {
    const helper = new THREE.PlaneHelper(plane, 2, 0xff0000);
    scene.add(helper);
  }

  {
    const size = 10;
    const divisions = 10;
    const gridHelper = new THREE.GridHelper(size, divisions);
    scene.add(gridHelper);
  }

  const material = new THREE.MeshPhongMaterial({
    color: 0x156289,
    clippingPlanes: [plane.negate()],
    clipIntersection: true,
    side: THREE.DoubleSide,
  });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  {
    // 剖切面缝合
    const planeGeom = new THREE.PlaneGeometry(2, 2);
    const stencilGroup = createPlaneStencilGroup(geometry, plane, 1);
    const planeMat = new THREE.MeshStandardMaterial({
      color: 0xe91e63,
      stencilWrite: true,
      stencilRef: 0,
      stencilFunc: THREE.LessStencilFunc,
      stencilFail: THREE.ReplaceStencilOp,
      stencilZFail: THREE.ReplaceStencilOp,
      stencilZPass: THREE.ReplaceStencilOp,
    });
    const po = new THREE.Mesh(planeGeom, planeMat);
    po.onAfterRender = function (renderer) {
      renderer.clearStencil();
    };
    po.renderOrder = 1.1;
    scene.add(po);
    scene.add(stencilGroup);

    plane.coplanarPoint(po.position);
    po.lookAt(
      po.position.x - plane.normal.x,
      po.position.y - plane.normal.y,
      po.position.z - plane.normal.z
    );
  }
}

function createPlaneStencilGroup(geometry, plane, renderOrder) {
  const group = new THREE.Group();
  const baseMat = new THREE.MeshBasicMaterial();
  baseMat.depthWrite = false;
  baseMat.depthTest = false;
  baseMat.colorWrite = false;
  baseMat.stencilWrite = true;
  baseMat.stencilFunc = THREE.AlwaysStencilFunc;

  // back faces
  const mat0 = baseMat.clone();
  mat0.side = THREE.BackSide;
  mat0.clippingPlanes = [plane];
  mat0.stencilFail = THREE.IncrementWrapStencilOp;
  mat0.stencilZFail = THREE.IncrementWrapStencilOp;
  mat0.stencilZPass = THREE.IncrementWrapStencilOp;

  const mesh0 = new THREE.Mesh(geometry, mat0);
  mesh0.renderOrder = renderOrder;
  group.add(mesh0);

  // front faces
  const mat1 = baseMat.clone();
  mat1.side = THREE.FrontSide;
  mat1.clippingPlanes = [plane];
  mat1.stencilFail = THREE.DecrementWrapStencilOp;
  mat1.stencilZFail = THREE.DecrementWrapStencilOp;
  mat1.stencilZPass = THREE.DecrementWrapStencilOp;

  const mesh1 = new THREE.Mesh(geometry, mat1);
  mesh1.renderOrder = renderOrder;
  group.add(mesh1);
  return group;
}

export { testMaterial };
