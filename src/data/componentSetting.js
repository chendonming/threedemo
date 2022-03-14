/**
 * 组件不同会导致配置也不一致，此为关联组件和其配置
 */
export default {
  // 正方体
  cube: [
    {
      name: 'width',
      label: '宽度',
      type: 'number',
    },
    {
      name: 'height',
      label: '高度',
      type: 'number',
    },
    {
      name: 'wallThickness',
      label: '壁厚',
      type: 'number',
    },
  ],
  // 圆锥
  cone: [
    {
      name: 'radius',
      label: '底部半径',
      type: 'number',
    },
    {
      name: 'height',
      label: '高度',
      type: 'number',
    },
    {
      name: 'wallThickness',
      label: '壁厚',
      type: 'number',
    },
  ],
};
