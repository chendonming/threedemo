<template>
  <div class="web2d">
    <div class="controller-wrapper">
      <el-button @click="handleClick">创建一个module</el-button>
      <el-button @click="addInput">添加一个输出接口</el-button>
      <el-button @click="addOutput">添加一个输入接口</el-button>
      <el-button @click="showSetting">修改当前模块配置</el-button>
      <div class="current-select">当前选中: {{name}}</div>
    </div>
    <div class="content-wrapper">
      <div id="web2d"></div>
      <div class="info-wrapper">
        <h1>接口信息列表</h1>
      </div>
    </div>
    <el-dialog :title="`修改 ${name} 配置`"
               :visible.sync="show" width="30%" :close-on-click-modal="false">
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="名称" prop="name" required>
          <el-input v-model="form.name" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateSetting">确定</el-button>
          <el-button @click="show = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Konva from 'konva';
import { uuid } from '@/util';

export default {
  name: 'Web2D',
  data() {
    return {
      app: null,
      layer: null,
      allowClick: false,
      index: 1,
      currentGroup: null,
      allowDrawLine: false,
      // 线的数据
      linePoints: [],
      // 当前线对象
      line: null,
      // 当前接口对象
      currentInterface: null,
      // 线对象集合
      lineList: [],
      // 当前模块的name
      name: '',
      // 拖动监听
      dragListen: false,
      show: false,
      form: {
        name: '',
      },
      // 画线时的动画
      animateDrawLine: null,
      // 拖动group时的动画
      animateGroup: null,
      rules: {
        name: [
          {
            // eslint-disable-next-line consistent-return
            validator: (rule, value, callback) => {
              if (value.length > 7) {
                return callback(new Error('长度不能超过7个字符'));
              }
              callback();
            },
          },
        ],
      },
    };
  },
  mounted() {
    const dom = document.getElementById('web2d');
    const width = dom.clientWidth;
    const height = dom.clientHeight;
    const stage = new Konva.Stage({
      container: 'web2d',
      width,
      height,
    });

    // 模块所在的图层
    const layer = new Konva.Layer();
    stage.add(layer);

    stage.on('click', (e) => {
      if (this.allowClick) {
        const { offsetX, offsetY } = e.evt;
        this.createModule(offsetX, offsetY);
        this.allowClick = false;
      } else {
        this.currentGroup = e.target.parent;
      }

      // 正在连接接口
      if (this.allowDrawLine) {
        if ((this.currentInterface.fromRect === 'input' && e.target.name() === 'output')
        || (this.currentInterface.fromRect === 'output' && e.target.name() === 'input')) {
          cancelAnimationFrame(this.animateDrawLine);
          this.allowDrawLine = false;
          this.currentInterface.linePoints = this.linePoints;
          this.currentInterface.to = e.target.parent;
          this.linePoints = [];
        }
      }
    });

    stage.on('mousemove', (e) => {
      if (this.allowDrawLine) {
        const { offsetX, offsetY } = e.evt;
        if (this.linePoints.length <= 2) {
          this.linePoints.push(...[offsetX - 2, offsetY - 2]);
        } else {
          this.$set(this.linePoints, this.linePoints.length - 1, offsetY - 2);
          this.$set(this.linePoints, this.linePoints.length - 2, offsetX - 2);
        }
      }
    });

    this.layer = layer;
  },
  watch: {
    allowClick(val) {
      document.getElementById('web2d').style.cursor = val ? 'crosshair' : '';
    },
    currentGroup: {
      handler(val) {
        if (val) {
          this.name = this.findByName(val, 'text')?.text() || '';
        }
      },
      deep: true,
    },
    show(val) {
      if (!val) {
        this.form.name = '';
      }
    },
  },
  methods: {
    // 线渲染器
    lineRenderer() {
      const that = this;
      function animate() {
        if (that.allowDrawLine && that.line) {
          that.animateDrawLine = requestAnimationFrame(animate);
          that.line.points(that.linePoints);
        }
      }
      animate();
    },
    updateSetting() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const text = this.findByName(this.currentGroup, 'text');
          text.text(this.form.name);
          this.show = false;
        }
      });
    },
    findByName(group, name) {
      return group.find(`.${name}`)[0];
    },
    showSetting() {
      this.show = true;
      this.form.name = JSON.parse(JSON.stringify(this.name));
    },
    addInput() {
      if (!this.currentGroup) return;
      const rect = this.findByName(this.currentGroup, 'input');
      // eslint-disable-next-line no-unused-expressions
      rect && rect.visible(true);
    },
    addOutput() {
      if (!this.currentGroup) return;
      const rect = this.findByName(this.currentGroup, 'output');
      // eslint-disable-next-line no-unused-expressions
      rect && rect.visible(true);
    },
    handleClick() {
      this.allowClick = true;
    },
    /**
     * 创建一个“模型”形状
     * @param x 坐标x
     * @param y 坐标y
     */
    createModule(x, y) {
      const groupId = uuid();
      const group = new Konva.Group({
        x,
        y,
        draggable: true,
        id: groupId,
      });

      // 上面的矩形
      const topRect = new Konva.Rect({
        x: 0,
        y: 0,
        width: 150,
        height: 30,
        fill: '#31b5dc',
        stroke: '#000',
        strokeWidth: 2,
      });

      const botRect = new Konva.Rect({
        x: 0,
        y: 30,
        width: 150,
        height: 70,
        fill: '#31b5dc',
        stroke: '#000',
        strokeWidth: 2,
      });

      const inputRect = new Konva.Rect({
        x: 145,
        y: 45,
        width: 10,
        height: 10,
        fill: '#fff',
        stroke: '#000',
        strokeWidth: 2,
        visible: false,
        name: 'input',
      });

      inputRect.on('click', (e) => {
        if (this.allowDrawLine) return;
        this.allowDrawLine = true;
        const { offsetX, offsetY } = e.evt;
        this.linePoints.push(...[offsetX, offsetY]);

        const id = uuid();

        this.line = new Konva.Line({
          points: this.linePoints,
          stroke: '#000',
          strokeWidth: 4,
          lineCap: 'round',
          lineJoin: 'round',
          id,
        });

        this.layer.add(this.line);
        this.line.moveToTop();
        this.lineRenderer();
        this.currentInterface = {
          from: group,
          to: null,
          fromRect: 'input',
          toRect: 'output',
          linePoints: [],
          id,
          line: this.line,
        };
        this.lineList.push(this.currentInterface);
      });

      inputRect.on('mouseenter', () => {
        document.body.style.cursor = 'cell';
      });
      inputRect.on('mouseleave', () => {
        document.body.style.cursor = '';
      });

      const outputRect = new Konva.Rect({
        x: -5,
        y: 45,
        width: 10,
        height: 10,
        fill: '#fff',
        stroke: '#000',
        strokeWidth: 2,
        visible: false,
        name: 'output',
      });

      outputRect.on('mouseenter', () => {
        document.body.style.cursor = 'cell';
      });
      outputRect.on('mouseleave', () => {
        document.body.style.cursor = '';
      });

      outputRect.on('click', (e) => {
        if (this.allowDrawLine) return;
        this.allowDrawLine = true;
        const { offsetX, offsetY } = e.evt;
        this.linePoints.push(...[offsetX, offsetY]);

        const id = uuid();

        this.line = new Konva.Line({
          points: this.linePoints,
          stroke: '#000',
          strokeWidth: 4,
          lineCap: 'round',
          lineJoin: 'round',
          id,
        });

        this.layer.add(this.line);
        this.line.moveToTop();
        this.lineRenderer();
        this.currentInterface = {
          from: group,
          to: null,
          fromRect: 'output',
          toRect: 'input',
          linePoints: [],
          id,
          line: this.line,
        };
        this.lineList.push(this.currentInterface);
      });

      const text = new Konva.Text({
        x: 0,
        width: 150,
        text: `模块${this.index}`,
        padding: 10,
        fontSize: 18,
        align: 'center',
        name: 'text',
      });
      group.add(topRect);
      group.add(botRect);
      group.add(text);
      group.add(inputRect);
      group.add(outputRect);
      this.layer.add(group);

      group.on('dragstart', () => {
        const res = this.lineList.filter((v) => v.from.id() === groupId || v.to.id() === groupId);
        if (res && res.length > 0) {
          this.dragListen = true;
          const that = this;
          // eslint-disable-next-line no-inner-declarations
          function animate() {
            if (that.dragListen) {
              res.forEach((row) => {
                const from = row.from.find(`.${row.fromRect}`)[0];
                const to = row.to.find(`.${row.toRect}`)[0];
                const fromPos = from.getAbsolutePosition();
                const toPos = to.getAbsolutePosition();
                row.line.points([fromPos.x + 5, fromPos.y + 5, toPos.x + 5, toPos.y + 5]);
              });
            }
            that.animateGroup = requestAnimationFrame(animate);
          }
          animate();
        }
      });

      group.on('mouseup', () => {
        this.dragListen = false;
        cancelAnimationFrame(this.animateGroup);
      });

      // eslint-disable-next-line no-plusplus
      this.index++;
      this.currentGroup = group;
    },
  },
};
</script>

<style lang="less" scoped>
.web2d {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  #web2d {
    flex: 1;
  }

  .controller-wrapper {
    padding: 30px;
    border-bottom: 1px solid #eee;
  }

  .content-wrapper {
    display: flex;
    flex-direction: column;
    flex: 1;

    .info-wrapper {
      height: 200px;
      border-top: 1px solid #eee;
      padding: 10px;

      h1 {
        font-size: 20px;
      }
    }
  }

  .current-select {
    display: inline-block;
    margin-left: 40px;
    font-size: 20px;
    font-weight: 600;
  }
}
</style>
