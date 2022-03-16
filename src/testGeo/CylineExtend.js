import { BufferGeometry, Float32BufferAttribute } from 'three'

class CylinderGeometry extends BufferGeometry {
  constructor() {
    super()
    this.type = 'TestForYou';

    // 高度
    const bheight = 20;
    const topwidth = 10;
    const topheight = 20;
    const bottomwidth = 20;
    const bottomheight = 30;

    const indices = [
      0,1,2,
      1,3,2,

      4,5,6,
      5,7,6,

      2,3,6,
      3,7,6,

      3,1,7,
      1,5,7,

      1,5,4,
      0,1,4,

      2,0,4,
      6,2,4
    ];
    const vertices = [];

    for (let i = 0; i <= 1; i++) {
      const width = i === 0 ? topwidth : bottomwidth
      const height = i === 0 ? topheight : bottomheight
      const y = -i * bheight + bheight / 2
      vertices.push(-width / 2, y, -height / 2)
      vertices.push(width / 2, y, -height / 2)
      vertices.push(-width / 2, y, height / 2)
      vertices.push(width / 2, y, height / 2)
    }
    this.setIndex(indices)
    this.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    this.computeVertexNormals()
  }
}

export { CylinderGeometry }