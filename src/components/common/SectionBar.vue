<template>
  <div class="section-contianer">
    <div class="flex-row-start">
      <div class="divider-stick" />
      <div class="bar-title">
        {{ title }}
      </div>
      <slot name="default" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SectionBar',
  props: {
    title: { type: String, default: '' }
  },
  data() {
    return {
    }
  },
  mounted() {
  }
}
</script>

<style scoped>
.section-contianer {
  padding: 10px 0;
  width: 100%;
  /* background-color: rgb(238, 238, 238); */
  background-color: transparent;
}
.flex-row-start {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}
.divider-stick {
  background-color: #FC6C64;
  width: 4px;
  height: 16px;
}
.bar-title {
  font-size: 15px;
  font-weight: bold;
  color: #333333;
  margin-left: 10px;
}
</style>
