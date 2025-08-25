<template>
  <div class="inner-container">
    <div class="content">
      <slot name="default" />
    </div>
  </div>
</template>

<script>

export default {
  name: 'SubpageWrapper',
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style scoped>
.content {
  width: 100%;
  height: 100%;
  position: relative;
  /* left: 0;
  overflow-x: hidden;
  overflow-y: scroll; */
}
.content::-webkit-scrollbar {
  display: none;
}
</style>
