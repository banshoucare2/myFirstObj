<template>
  <div class="bar-container flex-row-between">
    <div class="flex-row-start">
      <el-button v-if="needBack" class="back-button" type="text" plain icon="el-icon-arrow-left" size="medium" @click="onClickBack">
        返回
      </el-button>
      <div class="bar-title">
        {{ title }}
      </div>
      <slot name="bar-prefix" />
    </div>
    <slot name="bar-button" />
  </div>
</template>

<script>
export default {
  name: 'NavigationBar',
  props: {
    title: { type: String, default: '' },
    needBack: { type: Boolean, default: true }
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
    onClickBack() {
      this.$emit('onClickBack')
    }
  }
}
</script>

<style scoped>
.bar-container {
  width: 100%;
  height: 44px;
  background-color: white;
  padding-right: 18px;
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 99;
  border: 1px solid #ebe3e7;
  box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.1);
}
.bar-title {
  font-size: 16px;
  color: #333333;
  font-weight: bold;
  margin-left: 20px;
}
.back-button {
  border-right: 1px solid #e8e8e8;
  padding-right: 10px;
  padding-left: 10px;
}
.flex-row-start {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}
.flex-row-between {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
</style>
