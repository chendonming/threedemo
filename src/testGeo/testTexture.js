import * as THREE from 'three';

/**
 *
 * @param {THREE.Scene} scene
 * @param {THREE.Camera} camera
 * @param {THREE.WebGLRenderer} renderer
 * @descript 测试纹理
 */
function testTexture(scene, camera, renderer) {
  const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
  const normalTexture = new THREE.TextureLoader().load(require('@/assets/1.jpg'))
  const material = new THREE.ShaderMaterial({
    uniforms: {
      u_image: {
        value: normalTexture
      },
    },
    vertexShader: `
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D u_image;
      varying vec2 v_texCoord;
      void main () {
        gl_FragColor = texture2D(u_image, v_texCoord);
      }
    `
  });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
}
export { testTexture }