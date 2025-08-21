<template>
  <van-overlay class-name="overlay-background" :show="show" z-index="1000" @click="show = false">
    <div class="wrapper" @click.stop>
      <div class="wrapper block">
        <van-loading type="circular" color="#0DB3A7" size="40" />
      </div>
    </div>
  </van-overlay>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Loading',
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      show: state => state.loading.showed
    })
  }
}
</script>

<style  scoped>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.block {
  width: 100px;
  height: 100px;
  background-color: #333;
  border-radius: 8px;
  color: #fff;
  margin-top: -44px;
}
.overlay-background {
  background-color: rgba(0, 0, 0, 0);
}
</style>
