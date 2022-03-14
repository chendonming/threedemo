<template>
  <div class="module">
    <web2-d>
    </web2-d>
  </div>
</template>

<script>
import Web2D from '@/components/Web2D.vue';

export default {
  name: 'Module',
  components: { Web2D },
  mounted() {

  },
};
</script>

<style scoped>
h1 {
  font-size: 25px;
  padding: 20px;
}

.module {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
