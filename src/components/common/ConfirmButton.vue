<template>
  <el-popconfirm v-if="popRequired" :title="title" v-bind="$attrs" @confirm="$emit('click')" v-on="$listeners">
    <el-button slot="reference" :type="buttonType" plain :size="size" :style="buttonStyle"> {{ buttonText }} </el-button>
  </el-popconfirm>
  <el-button v-else :type="buttonType" plain :size="size" @click="$emit('click')"> {{ buttonText }} </el-button>
</template>

<script>
export default {
  name: 'ConfirmButton',
  props: {
    popRequired: { type: Boolean, default: true }, // 是否需要确认
    title: { type: String, default: '是否确定此操作?' },
    size: { type: String, default: 'small' },
    buttonText: { type: String, default: '提 交' },
    buttonType: { type: String, default: 'primary' },
    buttonStyle: { type: Object, default: () => {} }
  },
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

