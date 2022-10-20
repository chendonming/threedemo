import * as THREE from 'three';

/**
 *
 * @param {THREE.Scene} scene
 * @param {THREE.PerspectiveCamera} camera
 * @param {THREE.WebGLRenderer} renderer
 * @descript 测试HLOD
 */
function main(scene, camera, renderer) {
  camera.position.set(21.443753511734858, 31.617839559239805, 39.09631472900803)
  const frustum = new THREE.Frustum()
  const tempMat = new THREE.Matrix4()
  const tempVector = new THREE.Vector3()
  const group = new THREE.Group()
  let distance,
    error,
    tempVector2 = new THREE.Vector2(),
    geometricError = 16,
    errorTarget = 630,
    tree = {
    },
    tempTree = tree,
    color = Math.floor(Math.random() * 0xffffff),
    sseNeed = false,
    accuracy = 10

  // 测试数据
  const tilesJson = {
    box: [-8, -8, -8, 8, 8, 8],
    error: 1,
    children: [
      { box: [-8, -8, -8, 0, 0, 0] },
      { box: [-8, 0, -8, 0, 8, 0] },
      { box: [0, 0, 0, 8, 8, 8] },
      { box: [0, -8, 0, 8, 0, 8] },
      { box: [-8, -8, 0, 0, 0, 8] },
      { box: [-8, 0, 0, 0, 8, 8] },
      { box: [0, -8, -8, 8, 0, 0] },
      { box: [0, 0, -8, 8, 8, 0] },
    ]
  }

  preprocess(tilesJson)
  tree.root = tilesJson
  console.log('tree: ', tree)
  scene.add(group)

  renderer.setAnimationLoop(() => {
    // render()
  })

  function render() {
    traverse(c => {
      /**
       * @type {THREE.Box3}
       */
      const box = tempTree.box
      if (!box) return
      camera.updateMatrixWorld()
      camera.updateProjectionMatrix()

      tempMat.copy(group.matrixWorld);
      tempMat.premultiply(camera.matrixWorldInverse);
      tempMat.premultiply(camera.projectionMatrix);
      frustum.setFromProjectionMatrix(tempMat);

      const inView = frustum.intersectsBox(box)
      if (!inView) return;

      tempVector.copy(camera.position);
      distance = box.distanceToPoint(tempVector)

      renderer.getSize(tempVector2)
      const sse = (2 / camera.projectionMatrix.elements[5]) / tempVector2.height;
      // SSE cesium计算法  error = (geometricError * height) / (distance * sseDenominator);
      error = geometricError / (distance * sse);

      if (error < errorTarget) {
        group.add(tempTree.scene)
      } else {
        group.remove(tempTree.scene)
      }

      sseNeed = errorTarget - error < -accuracy
    })
  }

  // function renderBox(row) {
  //   const b = row.box;
  //   const box = new THREE.Box3(
  //     new THREE.Vector3(b[0], b[1], b[2]),
  //     new THREE.Vector3(b[3], b[4], b[5]),
  //   )
  //   const helper = new THREE.Box3Helper(box, color);
  //   tempTree.box = box;
  //   tempTree.scene = helper
  // }

  function traverse(beforecb, aftercb) {
    const rootTileSet = tree.root;
    if (!rootTileSet) return;
    traverseSet(rootTileSet, beforecb, aftercb);
  }

  function traverseSet(tile, beforeCb = null, afterCb = null, parent = null, depth = 0) {
    if (beforeCb && beforeCb(tile, parent, depth)) {
      if (afterCb) {
        afterCb(tile, parent, depth);
      }
      return;
    }
    const children = tile.children;
    for (let i = 0, l = children.length; i < l; i++) {
      traverseSet(children[i], beforeCb, afterCb, tile, depth + 1);
    }
    if (afterCb) {
      afterCb(tile, parent, depth);
    }
  }

  function preprocess(item) {
    const b = item.box;
    const box = new THREE.Box3(
      new THREE.Vector3(b[0], b[1], b[2]),
      new THREE.Vector3(b[3], b[4], b[5]),
    )
    item.box3 = box;
    item.visible = false;

    if (item.children) {
      item.children.forEach(row => {
        preprocess(row)
      })
    }
  }
}
export { main }