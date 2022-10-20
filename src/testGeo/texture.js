import * as THREE from 'three';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

/**
 *
 * @param {THREE.Scene} scene
 * @param {THREE.Camera} camera
 * @param {THREE.WebGLRenderer} renderer
 * @descript 纹理图片
 */
function texture(scene, camera, renderer) {
  camera.position.set(0, 1, 1);
  const gui = new GUI();
  const debug = {
    type: '正常',
  };
  const geometry = new THREE.PlaneGeometry(1, 1);
  const normalTexture = new THREE.TextureLoader().load(require('@/assets/1.jpg'));
  const material = new THREE.ShaderMaterial({
    uniforms: {
      u_image: {
        value: normalTexture,
      },
      u_textureSize: {
        value: new THREE.Vector2(580, 580),
      },
      u_kernel: {
        value: [
          0, 0, 0,
          0, 1, 0,
          0, 0, 0,
        ],
      },
      u_kernelWeight: {
        value: computeKernelWeight([
          0, 0, 0,
          0, 1, 0,
          0, 0, 0,
        ]),
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
      uniform vec2 u_textureSize;
      uniform float u_kernel[9];
      uniform float u_kernelWeight;
      varying vec2 v_texCoord;
      void main () {
        // 因为纹理的xy坐标总是0-1, 通过 1/纹理size 将会得到每一个像素所占的坐标size
        vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;
        vec4 colorSum =
        texture2D(u_image, v_texCoord + onePixel * vec2(-1, -1)) * u_kernel[0] +
        texture2D(u_image, v_texCoord + onePixel * vec2( 0, -1)) * u_kernel[1] +
        texture2D(u_image, v_texCoord + onePixel * vec2( 1, -1)) * u_kernel[2] +
        texture2D(u_image, v_texCoord + onePixel * vec2(-1,  0)) * u_kernel[3] +
        texture2D(u_image, v_texCoord + onePixel * vec2( 0,  0)) * u_kernel[4] +
        texture2D(u_image, v_texCoord + onePixel * vec2( 1,  0)) * u_kernel[5] +
        texture2D(u_image, v_texCoord + onePixel * vec2(-1,  1)) * u_kernel[6] +
        texture2D(u_image, v_texCoord + onePixel * vec2( 0,  1)) * u_kernel[7] +
        texture2D(u_image, v_texCoord + onePixel * vec2( 1,  1)) * u_kernel[8] ;
    
        // 只把rgb值求和除以权重
        gl_FragColor = vec4((colorSum / u_kernelWeight).rgb, 1.0);
      }
    `,
  });
  const plane = new THREE.Mesh(geometry, material);
  gui.add(debug, 'type', {
    正常: [
      0, 0, 0,
      0, 1, 0,
      0, 0, 0,
    ],
    高斯模糊: [
      0.045, 0.122, 0.045,
      0.122, 0.332, 0.122,
      0.045, 0.122, 0.045,
    ],
    不锐化: [
      -1, -1, -1,
      -1, 9, -1,
      -1, -1, -1,
    ],
    锐化: [
      -1, -1, -1,
      -1, 16, -1,
      -1, -1, -1,
    ],
    边缘检测: [
      -0.125, -0.125, -0.125,
      -0.125, 1, -0.125,
      -0.125, -0.125, -0.125,
    ],
    边缘检测2: [
      -1, -1, -1,
      -1, 8, -1,
      -1, -1, -1,
    ],
    边缘检测3: [
      -5, 0, 0,
      0, 0, 0,
      0, 0, 5,
    ],
  }).onChange((value) => {
    material.uniforms.u_kernel.value = value;
    material.uniforms.u_kernelWeight.value = computeKernelWeight(value);
  });
  scene.add(plane);

  function computeKernelWeight(kernel) {
    const weight = kernel.reduce((prev, curr) => prev + curr);
    return weight <= 0 ? 1 : weight;
  }
}
export { texture };
