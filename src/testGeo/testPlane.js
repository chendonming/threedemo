import * as THREE from "three";
/**
 * 测试 Plane
 */
function testPlane(scene) {
  const plane = new THREE.Plane(new THREE.Vector3(1, 1, 0), -1);
  const helper = new THREE.PlaneHelper(plane, 2, 0xff0000);
  scene.add(helper);

  const size = 10;
  const divisions = 10;

  const gridHelper = new THREE.GridHelper(size, divisions);
  scene.add(gridHelper);

  // 测试coplanarPoint
  {
    const v = new THREE.Vector3();
    plane.coplanarPoint(v);
    console.log("coplanarPoint:=====>", v);
    const geometry = new THREE.BoxGeometry(0.08, 0.08, 0.08);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    cube.position.set(v.x, v.y, v.z)
  }
  // 测试 distanceToPoint
  {
    const geometry = new THREE.BoxGeometry(0.08, 0.08, 0.08);
    const material = new THREE.MeshBasicMaterial({ color: "blue" });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const v = new THREE.Vector3(1, 0, 0);
    cube.position.set(v.x, v.y, v.z);
    console.log("distanceToPoint: ====>", plane.distanceToPoint(v));

    // 算真正的垂直距离
    const n = Math.sqrt(2)
    const line3 = new THREE.Line3(
      new THREE.Vector3(0, n, 0),
      new THREE.Vector3(n, 0, 0),
    )

    const res = new THREE.Vector3()
    line3.closestPointToPoint(v, false, res)
    console.log('交点: ====>', res);
    console.log('距离: ====>', res.distanceTo(v))
  }
}

export { testPlane };
