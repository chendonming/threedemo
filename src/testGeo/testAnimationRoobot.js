import * as THREE from "three";
import { RoobotControl } from "./RoobotMove/RoobotControl.js";

/**
 *
 * @param {THREE.Scene} scene
 */
function testAnimationRoobot(scene, camera, renderer) {
  camera.position.set(10, 10, 10);
  new RoobotControl(scene, camera, renderer);
}

export { testAnimationRoobot };
