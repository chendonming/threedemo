import * as THREE from 'three'

function testM(scene, camera) {
  camera.position.set(-1.9515294512020167, 11.207220957403793, 28.458108686812864)

  const geometry = new THREE.BoxGeometry(10, 10, 10)
  const m = new THREE.Matrix4();
  m.set(
    1, 1, 0, 0, // x
    0, 1, 0, 0, // y
    0, 1, 1, 0, // z
    0, 0, 0, 1 // w
  );
  geometry.applyMatrix4(m)
  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshPhongMaterial({
      color: 'red',
      side: THREE.DoubleSide
    })
  )

  scene.add(mesh)
}

export { testM }