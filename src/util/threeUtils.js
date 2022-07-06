/**
 * 根据testGo文件夹中的实验, 进行抽离各种实用API
 */
import * as THREE from "three";

/**
 *
 * @param {THREE.Vector3} startPos 开始的点
 * @param {THREE.Vector3} direction 归一化向量
 * @param {number} dist 距离
 * @return {THREE.Vector3}
 * @description 从startPos位置 沿着向量 direction 前进一定dist距离 返回位置
 */
function vectorIncreaseDistance(startPos, direction, dist) {
  const newPos = new THREE.Vector3();
  newPos.addVectors(startPos, direction.multiplyScalar(dist));
  return newPos;
}

export { vectorIncreaseDistance };
