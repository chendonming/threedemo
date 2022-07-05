import * as THREE from "three";
/**
 *
 * @param {THREE.Scene} scene
 */
function testIntersects(scene, camera) {
  // 渲染一个mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  {
    // 辅助对象
    const size = 10;
    const divisions = 10;

    const gridHelper = new THREE.GridHelper(size, divisions);
    scene.add(gridHelper);
  }

  {
    // 检测函数
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    function onPointerMove(event) {
      // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      // 通过摄像机和鼠标位置更新射线
      raycaster.setFromCamera(pointer, camera);
      // 计算物体和射线的焦点
      const result = testMesh(geometry.index.array, geometry.attributes.position.array, {
        directionx: raycaster.ray.direction.x,
        directiony: raycaster.ray.direction.y,
        directionz: raycaster.ray.direction.z,
        originx: raycaster.ray.origin.x,
        originy: raycaster.ray.origin.y,
        originz: raycaster.ray.origin.z,
        far: Infinity
      });


      console.log('相交结果: ', result)
    }

    window.addEventListener("click", onPointerMove);
  }
}

function testMesh(indices, positions, opt) {
  const { directionx, directionz, directiony, originx, originy, originz, far } = opt;
  for (let faceId = 0; faceId < indices.length; faceId += 3) {
    const ia = indices[faceId] * 3;
    const ib = indices[faceId + 1] * 3;
    const ic = indices[faceId + 2] * 3;

    const v0x = positions[ia];
    const v0y = positions[ia + 1];
    const v0z = positions[ia + 2];

    const v1x = positions[ib];
    const v1y = positions[ib + 1];
    const v1z = positions[ib + 2];

    const v2x = positions[ic];
    const v2y = positions[ic + 1];
    const v2z = positions[ic + 2];

    const edge1x = v1x - v0x;
    const edge1y = v1y - v0y;
    const edge1z = v1z - v0z;

    const edge2x = v2x - v0x;
    const edge2y = v2y - v0y;
    const edge2z = v2z - v0z;

    const pvecx = directiony * edge2z - directionz * edge2y;
    const pvecy = directionz * edge2x - directionx * edge2z;
    const pvecz = directionx * edge2y - directiony * edge2x;

    const det = edge1x * pvecx + edge1y * pvecy + edge1z * pvecz;
    if (det == 0) continue;
    const invdet = 1 / det;

    const tvecx = originx - v0x;
    const tvecy = originy - v0y;
    const tvecz = originz - v0z;

    const bv = (tvecx * pvecx + tvecy * pvecy + tvecz * pvecz) * invdet;
    if (bv < 0 || bv > 1.0) continue;

    const qvecx = tvecy * edge1z - tvecz * edge1y;
    const qvecy = tvecz * edge1x - tvecx * edge1z;
    const qvecz = tvecx * edge1y - tvecy * edge1x;

    const bw = (directionx * qvecx + directiony * qvecy + directionz * qvecz) * invdet;
    if (bw < 0 || bv + bw > 1.0) continue;

    const distance = (edge2x * qvecx + edge2y * qvecy + edge2z * qvecz) * invdet;

    if (distance > far) continue;

    return {
      distance,
      pickedFaceId: faceId,
    };
  }
}

export { testIntersects };
