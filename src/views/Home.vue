<template>
  <div class="home">
    <div class="wrapper">
      <div class="shape">
        <el-button @click="createCube">箭体</el-button>
        <el-button @click="createCone">头锥</el-button>
      </div>
      <div class="color-wrapper">
        <span>设置默认选中颜色</span>
        <el-color-picker v-model="focusColor"/>
      </div>
    </div>
    <div class="content-wrapper">
      <div class="component-list">
        <ul id="items">
          <draggable v-model="data"  @change="change">
            <li v-for="(item, index) in dataComponent"
                :class="{'active': active === index}" :key="item.id"
                @click="focusComponent(item.id, index)">
              {{ item.name }} - {{ item.index || 1 }}
             <div @click.stop="delModel(index)" class="del-button">删除</div>
            </li>
          </draggable>
        </ul>
      </div>
      <web-gl @click="handleModelClick">
        <component v-for="item in dataComponent"
                   :ref="item.id" :uuid="item.id" :width="item.w"
                   :height="item.h" :shapeColor="item.shapeColor"
                   :offset.sync="item.offset" :key="item.id"
                   :isFocus="item.isFocus" :is="item.component"></component>
      </web-gl>
    </div>
    <el-dialog title="组件设置" :visible.sync="show" width="30%">
      <el-form :model="form" ref="form">
        <el-form-item label="宽度" required>
          <el-input-number v-model="form.height" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="高度" required>
          <el-input-number v-model="form.width" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="颜色" required>
          <el-color-picker v-model="form.shapeColor"></el-color-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="changeModel">确定</el-button>
          <el-button @click="show = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import WebGl from '@/components/WebGl.vue';
import Cube from '@/components/webgl/Cube.js';
import Cone from '@/components/webgl/Cone.js';
import { uuid } from '@/util';
import draggable from 'vuedraggable';

export default {
  name: 'Home',
  components: {
    Cone,
    WebGl,
    Cube,
    draggable,
  },
  data() {
    return {
      form: {},
      show: false,
      name: '',
      data: [],
      currentData: null,
      active: null,
      index: 0,
    };
  },
  created() {
    document.addEventListener('mousedown', (e) => {
      if (e.button === 0) {
        if (!e.target.closest('#items') && !e.target.closest('#webgl')
          && !e.target.closest('.el-button') && !e.target.closest('.el-dialog__wrapper')) {
          this.active = null;
          this.data.forEach((row) => {
            // eslint-disable-next-line no-param-reassign
            row.isFocus = false;
          });
        }
      }
    });
  },
  methods: {
    delModel(index) {
      this.data.splice(index, 1);
      this.active = null;
    },
    change(item) {
      this.active = item.moved.newIndex;
    },
    focusComponent(id, index) {
      this.active = index;
      const focus = this.data.find((v) => v.isFocus === true);
      if (focus) {
        focus.isFocus = false;
      }
      this.currentData = this.data.find((v) => v.id === id);
      this.currentData.isFocus = true;
    },
    createCube() {
      this.data.push({
        id: uuid(),
        component: 'cube',
        name: '箭体',
        w: 5,
        h: 20,
        offset: 0,
        shapeColor: '#185caa',
        isFocus: false,
      });
    },
    createCone() {
      this.data.push({
        id: uuid(),
        component: 'cone',
        name: '头锥',
        w: 5,
        h: 20,
        offset: 0,
        shapeColor: '#185caa',
        isFocus: false,
      });
    },
    changeModel() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.currentData.w = this.form.width;
          this.currentData.h = this.form.height;
          this.currentData.shapeColor = this.form.shapeColor;

          this.show = false;
        }
      });
    },
    handleModelClick(name) {
      console.log(`${name}被点击`);
      this.name = name;
      this.currentData = this.data.find((v) => v.id === name);
      const index = this.data.findIndex((v) => v.id === name);
      this.focusComponent(this.currentData.id, index);
      this.form = {
        width: this.currentData.w,
        height: this.currentData.h,
        shapeColor: this.currentData.shapeColor,
      };
      this.show = true;
    },
  },
  watch: {
    show(val) {
      if (!val) {
        this.currentData = null;
      }
    },
  },
  computed: {
    focusColor: {
      get() { return this.$store.state.focusColor; },
      set(val) {
        this.$store.commit('setFocusColor', val);
      },
    },
    dataComponent() {
      const arr = [];
      this.data.reduce((acc, val) => {
        const params = {
          ...val,
          offset: acc + val.h / 2,
        };
        if (typeof params.index === 'undefined') {
          // eslint-disable-next-line no-plusplus
          this.index++;
          // eslint-disable-next-line no-plusplus
          params.index = this.index;
          // eslint-disable-next-line no-param-reassign
          val.index = params.index;
        }
        arr.push(params);
        // eslint-disable-next-line no-param-reassign
        acc += val.h + val.offset;
        return acc;
      }, 0);
      return arr;
    },
  },
};
</script>

<style lang="less">
.home {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;

  .wrapper {
    display: flex;
    padding: 20px;
    justify-content: space-between;

    .shape {
      display: flex;
      align-items: baseline;
    }
  }

  .content-wrapper {
    display: flex;
    flex: 1;

    .component-list {
      flex-shrink: 0;
      width: 200px;
      border: 1px solid #eeeeee;
      user-select: none;

      li {
        cursor: pointer;
        padding: 5px;

        &:hover, &.active {
          background: #2a9a9e;
          color: #85ebf1
        }
      }

      .del-button {
        color: #fff;
        float: right;
      }
    }

    .WebGl {
      flex: 1;
    }
  }

  .color-wrapper {
    display: flex;
    align-items: center;

    >span {
      margin-right: 10px;
    }
  }
}
</style>
