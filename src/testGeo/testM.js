import * as THREE from 'three'

function testM(scene) {
  const geometry = new THREE.BoxGeometry(10, 10, 10)
  const dir = new THREE.Vector3(1, 1, 1)
  const m = new THREE.Matrix4();
  const Syx = dir.x / dir.y
  const Syz = dir.z / dir.y;
  m.set(
    1, Syx, 0, 0,
    0, 1, 0, 0,
    0, Syz, 1, 0,
    0, 0, 0, 1
  );
  geometry.applyMatrix4(m)
  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshPhongMaterial({
      color: 'red'
    })
  )

  scene.add(mesh)
}

export {testM}