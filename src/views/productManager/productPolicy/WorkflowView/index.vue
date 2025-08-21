<template>
  <Detail ref="detailRef" :businessKey="businessKey" :task="task" :showTitle="showTitle" />
</template>

<script>
import Detail from '../Detail/index'

export default {
  props: {
    businessKey: { type: String, default: '' },
    task: { type: Object, default: () => {} },
    showTitle: { type: Boolean, default: true }
  },
  components: { Detail },
  created() {
    this.$on('meetingResult', this.handleDiySubmit)
    this.$on('poll', this.handlePoll)
    this.$on('popass', this.handlePopass)
  },
  methods: {
    filterProcessComment(taskList) {
      return this.$refs['detailRef'].filterProcessComment(taskList)
    },
    /*  */
    handleDiySubmit() {
      this.$refs['detailRef'].handleDiySubmit()
    },
    handlePoll() {
      this.$refs['detailRef'].handlePoll()
    },
    handlePopass() {
      this.$refs['detailRef'].handlePopass()
    },
  }
}
</script>