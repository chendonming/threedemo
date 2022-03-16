import * as THREE from 'three';

export default function () {
  const arr = new Float32Array([
    -5, 5,
    5, 5,
    5, -10,
    -5, -6,
    -8, -8
  ]);

  const a = new THREE.Float32BufferAttribute(arr, 2)
  const shape = new THREE.Shape();
  for(let i = 0; i < a.count; i++) {
    if(i === 0) {
      shape.moveTo( a.getX(i), a.getY(i) );
      continue;
    }

    shape.lineTo(a.getX(i), a.getY(i))
    if(i === a.count - 1) {
      shape.lineTo(a.getX(0), a.getY(0))
    }
  }

  console.log('形状： ======>', shape)

  const extrudeSettings = {
    steps: 2,
    depth: 16,
    bevelEnabled: true,
    bevelThickness: 1,
    bevelSize: 0,
    bevelOffset: 0,
    bevelSegments: 1
  };
  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  var matrix = new THREE.Matrix4();

  var dir = new THREE.Vector3(0.4, 1, 0); // you set this. a unit-length vector is not required.

  var Syx = dir.x / dir.y,
    Syz = dir.z / dir.y;

  matrix.set(1, Syx, 0, 0,
    0, 1, 0, 0,
    0, Syz, 1, 0,
    0, 0, 0, 1);

  geo.applyMatrix4(matrix);
  return geo;
}
