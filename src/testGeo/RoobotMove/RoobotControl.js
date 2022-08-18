import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

/**
 * 人物<机器>控制
 * @author chendm
 */
class RoobotControl {
  /**
   * @param {THREE.WebGLRenderer } renderer
   * @param {THREE.Camera} camera
   * @param {THREE.Scene} scene
   */
  constructor(scene, camera, renderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    // glft模型路径
    this.gltf = "RobotExpressive.glb";
    // API对象, 执行人物指令
    this.api = { state: "Standing" };
    // 表情(内容视模型而定)
    this.emotes = ["Jump", "Yes", "No", "Wave", "Punch", "ThumbsUp"];
    // 状态(内容视模型而定)
    this.states = ["Idle", "Walking", "Running", "Dance", "Death", "Sitting", "Standing"];
    // 指定站立时的状态
    this.standing = "Standing";
    // 指定行动时的状态
    this.walking = "Walking";
    // 动画管理
    this.mixer = null;
    // 模型
    this.model = null;
    // 动作
    this.actions = {};
    // 上一个动作
    this.previousAction = null;
    // 当前动作
    this.activeAction = null;
    // 时钟
    this.clock = new THREE.Clock();
    // 人物直面的方向
    this.playerDirection = new THREE.Vector3();
    // 人物碰撞盒子
    this.playerCollider = null;
    // 记录键盘输入
    this.keypress = {};
    // 第一次keydown
    this.firstKeyDown = true;
    this.init();

    console.log("this: ", this);
  }

  init() {
    const loader = new GLTFLoader();
    loader.load(this.gltf, (gltf) => {
      this.model = gltf.scene;
      this.scene.add(this.model);
      this.mixer = new THREE.AnimationMixer(this.model);

      this.createActions(gltf.animations);
      this.createEmotes();
      this.createControlEvents();

      const dir = new THREE.Vector3();
      this.renderer.setAnimationLoop(() => {
        const delta = this.clock.getDelta();
        this.mixer.update(delta);
        this.camera.updateMatrixWorld();
        this.camera.updateProjectionMatrix();
        const move = new THREE.Vector3();
        this.camera.getWorldDirection(dir);
        dir.y = 0;
        if (this.keypress["W"]) {
          move.z -= 1;
          // this.model.rotation.y = 0;
        }

        if (this.keypress["S"]) {
          move.z += 1;
          dir.negate();
          // this.model.rotation.y = -Math.PI;
          // relativeCameraOffset = new THREE.Vector3(0, 10, 10);
        }

        if (this.keypress["A"]) {
          move.x -= 1;
          dir.applyMatrix4(new THREE.Matrix4().makeRotationY(Math.PI / 2));
          // this.model.rotation.y = Math.PI / 2;
          // relativeCameraOffset = new THREE.Vector3(10, 10, 0);
        }

        if (this.keypress["D"]) {
          move.x += 1;
          dir.applyMatrix4(new THREE.Matrix4().makeRotationY(-Math.PI / 2));
          // this.model.rotation.y = -Math.PI / 2;
          // relativeCameraOffset = new THREE.Vector3(-10, 10, 0);
        }

        dir.multiplyScalar(10000);
        this.model.lookAt(dir);
        if (move.x === 0 && move.y === 0 && move.z === 0) return;

        const matrix3 = new THREE.Matrix3();
        const up = new THREE.Vector3(0, 1, 0);

        this.camera.updateMatrix();
        move.normalize();
        move.applyNormalMatrix(matrix3.setFromMatrix4(this.camera.matrixWorld));
        move.cross(up).cross(up).negate();

        const distanceVector = move.multiplyScalar(delta * 10);
        this.model.position.add(distanceVector);
        this.camera.position.add(distanceVector);
      });
    });
  }

  createControlEvents() {
    document.addEventListener("keydown", this.createKeyDown.bind(this));
    document.addEventListener("keyup", this.createKeyUp.bind(this));
  }

  createKeyDown(e) {
    this.keypress[e.key.toUpperCase()] = true;
    if (
      (this.keypress["W"] || this.keypress["A"] || this.keypress["S"] || this.keypress["D"]) &&
      this.api.state !== this.walking
    ) {
      // 视角回到人物上
      // 相机与人物的offset
      // if (this.firstKeyDown) {
      //   console.log(111);
      //   const relativeCameraOffset = new THREE.Vector3(0, 10, -10);
      //   const cameraOffset = relativeCameraOffset.applyMatrix4(this.model.matrixWorld);
      //   this.camera.position.copy(cameraOffset);
      //   this.camera.lookAt(this.model.position);
      //   this.firstKeyDown = false;
      // }
      this.api.state = this.walking;
      this.restoreState();
    }
  }

  createKeyUp(e) {
    this.keypress[e.key.toUpperCase()] = false;
    if (this.api.state !== this.standing) {
      this.api.state = this.standing;
      this.restoreState();
    }
    this.firstKeyDown = true;
  }

  createEmotes() {
    for (let i = 0; i < this.emotes.length; i++) {
      const name = this.emotes[i];
      this.api[name] = () => {
        this.fadeToAction(name, 0.2);
        this.mixer.addEventListener("finished", this.restoreState.bind(this));
      };
    }
  }

  fadeToAction(name, duration) {
    this.previousAction = this.activeAction;
    this.activeAction = this.actions[name];

    if (this.previousAction && this.activeAction) {
      if (this.previousAction !== this.activeAction) {
        this.previousAction.fadeOut(duration);
      }
    }
    this.activeAction
      .reset()
      .setEffectiveTimeScale(1)
      .setEffectiveWeight(1)
      .fadeIn(duration)
      .play();
  }

  restoreState() {
    this.mixer.removeEventListener("finished", this.restoreState.bind(this));
    this.fadeToAction(this.api.state, 0.2);
  }

  createActions(animations) {
    for (let i = 0; i < animations.length; i++) {
      const clip = animations[i];
      const action = this.mixer.clipAction(clip);
      this.actions[clip.name] = action;

      if (this.emotes.indexOf(clip.name) >= 0 || this.states.indexOf(clip.name) >= 4) {
        action.clampWhenFinished = true;
        action.loop = THREE.LoopOnce;
      }
    }
  }
}

export { RoobotControl };
