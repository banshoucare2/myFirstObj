<template>
  <div class="header-container">
    <van-image fit="cover" :src="header" />
  </div>
</template>

<script>
export default {
  name: 'page-header',
  data () {
    return {
      header: require('@/assets/home_intro.png')
    }
  },
  activated () {},
  created () {},
  methods: {},
  watch: {}
}
</script>

<style scoped>
.header-container {
  width: 100%;
  height: 220px;
  border-radius: 5px;
  margin-bottom: 10px;
  margin-top: 20px;
  overflow: hidden;
}
</style>
