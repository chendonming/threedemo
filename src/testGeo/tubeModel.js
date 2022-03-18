import * as THREE from 'three'

export default function (path) {
  const length = 12, width = 8;

  const shape = new THREE.Shape();
  shape.moveTo( 0,0 );
  shape.lineTo( 0, width );
  shape.lineTo( length, width );
  shape.lineTo( length, 0 );
  shape.lineTo( 0, 0 );

  const extrudeSettings = {
    steps: 64,
    depth: 1,
    bevelEnabled: true,
    bevelThickness: 1,
    bevelSize: 0,
    bevelOffset: 0,
    bevelSegments: 1,
    extrudePath: path
  };

  const holePath = new THREE.Path();
  holePath.absarc(6, 4, 3.5, 0, Math.PI * 2, true);
  shape.holes.push(holePath);

  const geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
  console.log(geometry)

  return geometry
}
