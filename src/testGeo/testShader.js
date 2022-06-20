import * as THREE from "three";
/**
 * 着色器测试
 * @param {THREE.Scene} scene
 */
function testShader(scene) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);

  const material = new THREE.ShaderMaterial({
    vertexShader: `
    varying vec3 vPosition;
    varying vec3 mPosition;

    void main() {
      vPosition = position;
      mPosition = cameraPosition;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
    `,

    fragmentShader: `
    varying vec3 vPosition;
    varying vec3 mPosition;
    void main() {
      float len = distance(mPosition, vPosition);
      if(len < 1.0) {
        gl_FragColor = vec4(1.0 ,0.0 ,0.0 ,1.0);
      }else{
        gl_FragColor = vec4(1.0 ,1.0 ,1.0 ,1.0);
      }
    }
    `,
  });

  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
}

export { testShader };
