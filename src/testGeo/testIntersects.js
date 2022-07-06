import * as THREE from "three";
import { vectorIncreaseDistance } from "@/util/threeUtils.js";
/**
 *
 * @param {THREE.Scene} scene
 */
function testIntersects(scene, camera) {
  // 渲染一个mesh
  const geometry = new THREE.BoxGeometry(2, 2, 2);
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
    const c = new THREE.Vector3(1, 1, 1);
    const m = new THREE.Matrix4();
    m.makeScale(2, 2, 2);
    c.applyMatrix4(m);
    console.log(c);
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
      console.log('positions: ', geometry.attributes.position.array)
      const result = testMesh(
        geometry.index.array,
        geometry.attributes.position.array,
        {
          directionx: raycaster.ray.direction.x,
          directiony: raycaster.ray.direction.y,
          directionz: raycaster.ray.direction.z,
          originx: raycaster.ray.origin.x,
          originy: raycaster.ray.origin.y,
          originz: raycaster.ray.origin.z,
          far: Infinity,
        },
        scene
      );

      console.log("相交结果: ", result);
    }

    window.addEventListener("click", onPointerMove);
  }
}

function testMesh(indices, positions, opt, scene) {
  const { directionx, directionz, directiony, originx, originy, originz, far } = opt;
  console.log("count: ", indices.length);
  for (let faceId = 0; faceId < indices.length; faceId += 3) {
    const ia = indices[faceId] * 3;
    const ib = indices[faceId + 1] * 3;
    const ic = indices[faceId + 2] * 3;

    const v0 = new THREE.Vector3(positions[ia], positions[ia + 1], positions[ia + 2]);
    const v1 = new THREE.Vector3(positions[ib], positions[ib + 1], positions[ib + 2]);
    const v2 = new THREE.Vector3(positions[ic], positions[ic + 1], positions[ic + 2]);

    const center = new THREE.Triangle(v0, v1, v2).getMidpoint(new THREE.Vector3());

    const e0 = v0.clone().sub(center).normalize();
    const e1 = v1.clone().sub(center).normalize();
    const e2 = v2.clone().sub(center).normalize();

    var vFOV = THREE.MathUtils.degToRad(camera.fov); // convert vertical fov to radians
    var dist = v0.distanceTo(camera.position);

    var height = Math.tan(vFOV / 2) * dist; // visible height
    var width = 2 * (height * camera.aspect) / 12;

    const newV0 = vectorIncreaseDistance(v0, e0, width);
    const newV1 = vectorIncreaseDistance(v1, e1, width);
    const newV2 = vectorIncreaseDistance(v2, e2, width);

    const { x: v0x, y: v0y, z: v0z } = newV0;
    const { x: v1x, y: v1y, z: v1z } = newV1;
    const { x: v2x, y: v2y, z: v2z } = newV2;

    {
      // 辅助理解
      const allowFaceId = faceId === 0;
      {
        if (allowFaceId) {
          // 画原本的三角形 红色
          const geometry = new THREE.BufferGeometry();
          console.log('v0:', JSON.stringify(v0))
          const vertices = new Float32Array([v0.x, v0.y, v0.z, v1.x, v1.y, v1.z, v2.x, v2.y, v2.z]);
          console.log(vertices)
          geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
          const material = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });
          material.depthTest = false;
          const mesh = new THREE.Mesh(geometry, material);
          mesh.renderOrder = 1;
          scene.add(mesh);
        }
      }

      {
        if (allowFaceId) {
          // 画扩张后的三角形, 黄色
          const geometry = new THREE.BufferGeometry();
          const vertices = new Float32Array([v0x, v0y, v0z, v1x, v1y, v1z, v2x, v2y, v2z]);
          geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
          const material = new THREE.MeshBasicMaterial({ color: 0xf7dc6f, side: THREE.DoubleSide });
          material.depthTest = false;
          const mesh = new THREE.Mesh(geometry, material);
          mesh.renderOrder = 0;
          scene.add(mesh);
        }
      }

      {
        if (allowFaceId) {
          // 画中心点
          const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
          const material = new THREE.MeshBasicMaterial({ color: 0x5dade2, side: THREE.DoubleSide });
          const cube = new THREE.Mesh(geometry, material);
          material.depthTest = false;
          cube.renderOrder = 2;
          console.log('center: ', center)
          cube.position.copy(center);
          scene.add(cube);
        }
      }
    }

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
