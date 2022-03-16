import * as THREE from 'three';

export default function () {
  const points = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(5, 5),
    new THREE.Vector2(0, 5),
  ];
  const n1 = new THREE.Vector2(1, 1);

  points.forEach(point => {
     const angle = n1.angle();
     point.rotateAround(new THREE.Vector2(0, 0), -angle)
  })

  console.log(points)
  // 关于绕指定向量旋转的问题， 可以反其道在物体上， 实际上还是绕y旋转.

  const geometry = new THREE.LatheGeometry(points, 30);

  return geometry;
}
