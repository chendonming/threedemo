import * as THREE from 'three';

/**
 *
 * @param {THREE.Scene} scene
 * @param {THREE.Camera} camera
 * @param {THREE.WebGLRenderer} renderer
 * @descript THREEJS波纹效果
 */
function ripple(scene, camera, renderer) {
  const geometry = new THREE.PlaneGeometry(10, 10);


  // const material = new THREE.ShaderMaterial({
  //   vertexShader: `
  //     varying vec2 vUv;
  //     void main() {
  //       vUv = uv;
  //       gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  //     }
  //   `,
  //   fragmentShader: `
  //     varying vec2 vUv;
  //     void main () {
  //       vec2 center = vec2(0.5, 0.5);
  //       float radius = pow(0.1, 2.0);
  //       float x = pow(vUv.x - 0.5, 2.0);
  //       float y = pow(vUv.y - 0.5, 2.0);
  //       vec4 bgColor = vec4(1., 1., 1., 0.);
  //       if(x + y < radius) {
  //         gl_FragColor = vec4(25/255, 1.0, 1.0,smoothstep(0.09, 0.1, sqrt(x + y)));
  //         gl_FragColor = mix(bgColor, gl_FragColor, 1.);
  //       } else {
  //         discard;
  //       }
  //     }
  //   `,
  //   side: THREE.DoubleSide
  // })

  const material = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      void main () {
        vec2 left = step(vec2(.1), vUv);
        float color = left.x * left.y;

        gl_FragColor = vec4(vec3(color), 1.);
      }
    `,
    side: THREE.DoubleSide
  })

  const plane = new THREE.Mesh(geometry, material);
  plane.rotateX(Math.PI / 2)
  scene.add(plane);
}
export { ripple }