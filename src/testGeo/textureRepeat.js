import * as THREE from 'three';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

/**
 *
 * @param {THREE.Scene} scene
 * @param {THREE.Camera} camera
 * @param {THREE.WebGLRenderer} renderer
 * @descript 测试类似雪碧图重复
 */
function textureRepeat(scene, camera, renderer) {
  camera.position.set(5, 5, 5)
  const texture = new THREE.TextureLoader().load(require('../assets/1.jpg'));
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.repeat.set(2, 2)

  const geometry = new THREE.BufferGeometry();
  const vertices = new Float32Array([
    0, 0, 0,
    5, 0, 0,
    5, 5, 0,

    0, 0, 0,
    5, 5, 0,
    0, 5, 0,
  ])
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geometry.computeVertexNormals()

  // const material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide, map: texture });

  const shadermaterial = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
      `,
    fragmentShader: `
      varying vec2 vUv;
      uniform sampler2D u_texture;
      uniform vec2 repeat;
      uniform vec2 tiles;
      uniform vec2 size;
      void main() {
        // gl_FragColor = texture2D(u_texture, vUv);
        // 取模运算
        // gl_FragColor = vec4(texture2D(u_texture, mod(vUv * tiles, vec2(1)) * fontsize.xy + repeat.xy));
        gl_FragColor = vec4(texture2D(u_texture, mod(vUv * tiles, vec2(1)) * size + repeat));
      }
      `,
    uniforms: {
      u_texture: {
        value: texture
      },
      repeat: {
        value: new THREE.Vector2(0.653448275862, 0.36379310344)
      },
      tiles: {
        value: new THREE.Vector2(4, 4)
      },
      size: {
        value: new THREE.Vector2(0.25, 0.25)
      }
    },
    side: THREE.DoubleSide
  })

  // 估算   起始 0.653448275862  0.36379310344

  const uvs = new Float32Array([
    0.4, 0,
    0.7, 0,
    0.7, 0.8,

    0.4, 0,
    0.7, 0.8,
    0.4, 0.8,
  ])

  const tvs = new Float32Array([
    0, 0,
    1, 0,
    1, 1,

    0, 0,
    1, 1,
    0, 1,
  ])
  geometry.setAttribute('uv', new THREE.BufferAttribute(tvs, 2));
  const plane = new THREE.Mesh(geometry, shadermaterial);
  scene.add(plane);

  const gui = new GUI();
  const obj = {
    size: 0.25,
    offsetx: 0.653448275862,
    offsety: 0.36379310344,
    repeat: 4,
  }
  gui.add(obj, 'size', 0.001, 1).onChange(e => {
    shadermaterial.uniforms.size.value = new THREE.Vector2(e, e);
  });

  gui.add(obj, 'offsetx', 0.001, 1).onChange(e => {
    shadermaterial.uniforms.repeat.value = new THREE.Vector2(e, shadermaterial.uniforms.repeat.value.y);
  });

  gui.add(obj, 'offsety', 0.001, 1).onChange(e => {
    shadermaterial.uniforms.repeat.value = new THREE.Vector2(shadermaterial.uniforms.repeat.value.x, e);
  });

  gui.add(obj, 'repeat', 1, 10).onChange(e => {
    shadermaterial.uniforms.tiles.value = new THREE.Vector2(e, e);
  });
}
export { textureRepeat }