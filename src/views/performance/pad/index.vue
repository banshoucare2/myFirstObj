<template>
  <div class="page-container" :style="{ minHeight: SCREEN_HEIGHT }">
    <van-nav-bar v-if="showTitle" :title="handleTitle" fixed style="z-index: 9999;"/>
    <div class="pad-main">
      <div  class="pad-card">
        <h2 style="text-align: center">请您签名</h2>
        <div style="border-radius: 4px;">
          <vue-signature-pad
            style="z-index: 9999999;background-color: #FFFFFF;border-radius: 4px;transition: 0.3s;box-shadow: 0 0 10px 0 #969799;"
            ref="signaturePad"
            :options="options"
            width="100%"
            height="420px"
          />
          <div style="display:flex;justify-content: right;">
            <van-button type="default" icon="brush-o"
                        @click="clearSignature">清空</van-button>
          </div>
        </div>
        <div  class="pad-tip">
          <b><em/>温馨提示：</b>
          <p><em/>1.该签名应用于绩效完成情况确认签名，请确认为本人签字。</p>
          <p><em/>2.电子签名提交后暂不允许变更，请您认真签名。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import jx from "@/utils/jx";
import VueSignaturePad from 'vue-signature-pad';
import {signatureHandle} from "@/service/performance";
import {Toast} from "vant";
import cookies from "js-cookie";

export default {
  name: 'final', // 终审
  props: {
    businessKey: { type: String, default: '' },
    task: { type: Object, default: () => {} },
    showTitle: { type: Boolean, default: true }
  },
  components: {
    VueSignaturePad
  },
  data () {
    return {
      title: '数字签名提交',
      loading: false,
      options: {
        penColor: '#000', // 设置笔的颜色
      },
      signatureImage: null,
    }
  },
  created () {
    this.SCREEN_HEIGHT = this.$SCREEN_HEIGHT + 'px'
    this.$on('submit', this.onSubmit)
    this.init()
  },
  watch: {

  },
  computed: {
    jx() {
      return jx
    },
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    handleTitle() {
      return this.title
    },
  },
  methods: {
    async init() {
      console.log('this.task:',this.task)
    },
    clearSignature() {
      this.$refs.signaturePad.clearSignature();
    },
    onSubmit() {
      const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
      if (!isEmpty) {
        //保存
        //console.log('签名:', data);
        // 自定义加载图标
        Toast.loading({
          message: '提交中...',
          forbidClick: true,
          loadingType: 'spinner',
        });
        console.log('this.!!!task',this.task)
        const userId = this.task.assignee;
        signatureHandle({ signature: data,taskId:this.task.id,userId: userId })
          .then((msg) => {
            console.log("---handleBack:"+msg)
            if(msg){
              this.$toast('签名提交成功')
              setTimeout(() => {
                Toast.clear();
                this.$router.push({path: '/dingding/index'})
              }, 2000);
            }else{
              this.$toast('签名提交失败')
            }
          }).catch((e) => {
            this.$toast('签名提交失败！')
            Toast.clear();
          });
      } else {
        this.$toast("请您签名后再进行提交");
      }
    }
  }
}
</script>

<style scoped>
.page-container {
  padding-top: 46px;
  padding-bottom: 34px;
  height: 100%;
  position: relative;
}
/deep/.page-container .van-nav-bar {
  background-color: var(--navbar-color, #bb2f25);
}
/deep/.page-container .van-nav-bar .van-nav-bar__arrow {
  color: white;
}
/deep/.page-container .van-nav-bar .van-nav-bar__text {
  color: white;
}
/deep/.page-container .van-nav-bar .van-nav-bar__title {
  color: white;
}
.table-container table {
  width: auto;
  min-width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
}
.table-container th, td {
  min-width: 30vw; /* 最小宽度 */
  max-width: 30vw; /* 最大宽度 */
  width: 30vw; /* 固定宽度 */
  padding: 8px;
  text-align: center;
  border: 1px solid #ddd;
  white-space: normal; /* 允许换行 */
  word-break: break-all; /* 允许单词断行 */
}
.table-container thead th {
  background-color: #f7f8fa;
  position: sticky;
  top: 0;
  z-index: 1;
}
.van-grid-item img {
  display: block;
  width: 100%;
  height: 100%;
}
/deep/.page-container .van-dialog {
  padding: 12px !important;
}
/deep/.page-container .van-dialog .van-dialog__header {
  padding: 8px 0 16px 0 !important;
  font-weight: 700;
}
.van-cell{
  padding: 10px 6px;
}
.totalScore{
  color: #bb2f25;
  font-size: 20px;
  font-family: Silom,sans-serif;
}
.title-class{
  text-align: right;
  justify-content: flex-end;
  flex: 2;
}
.value-class{
  font-weight: bold;
  text-align: center;
  justify-content: center;
  flex: 3;
}
.index-title-class{
  text-align: left;
  justify-content: left;
  flex: 5;
}
.index-value-class{
  font-weight: bold;
  text-align: center;
  justify-content: center;
  flex: 3;
}
.custom-border-cell {
  width: 100%;
  border: 1px solid #efefef !important;
  border-radius: 1px !important;
}
.custom-border-cell::after {
  display: none !important;
}
/* van-collapse-item标题栏背景色 */
/deep/ .van-collapse-item__title {
  border: #dddddd solid 1px;
  background-color: white;
}
/deep/ .van-collapse-item__value {
  color: #bb2f25 !important;
}
.pad-main{
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.pad-card{
  //margin: 45px auto;
  background-color: #dddddd;
  padding: 17px;
  border-radius: 8px;
  border: 2px solid transparent;
  background-clip: padding-box;
}
.pad-tip{
  text-align: left;
  padding-top: 15px;
  width: 100%;
  z-index: 9999;
}
</style>
