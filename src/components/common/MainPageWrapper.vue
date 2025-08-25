<template>
  <!-- <transition name="el-fade-in"> -->
  <div v-show="showed">
    <slot name="default" />
  </div>
  <!-- </transition> -->
</template>

<script>

export default {
  name: 'MainPageWrapper',
  props: { showed: Boolean },
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

