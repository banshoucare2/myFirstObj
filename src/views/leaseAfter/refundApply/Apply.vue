<template>
  <div class="page-container" :style="{ minHeight: SCREEN_HEIGHT }">
      <van-sticky :offset-top="0">
         <van-tabs class="vanTabs" v-model="activeName">
            <van-tab title="基本信息" name="0" >
              <van-field
                :value="result.tbApplyTittle"
                label="申请标题"
                readonly
              />
              <van-field
                :value="tbRefundTypefn(result.tbRefundType)"
                label="退款类型"
                readonly
              />
              <van-field
                :value="tbBusinessTypefn(result.tbBusinessType)"
                label="业务类型"
                readonly
              />
              <van-field
                :value="formatMoney(result.tbRefundAmount)"
                label="退款金额"
                readonly
              />
              <van-field
                type="textarea"          
                :value="result.tbApplyReason"
                label="申请原因"
                readonly
              />
            </van-tab>
            <van-tab title="附件信息" name="1" >
              <Upload-component  ref="Upload" @saveCallback = 'saveApplyInfoFn' :uploadList="uploadList" :isSave="false" :is_search="true"/>          
            </van-tab>
          </van-tabs>
       </van-sticky>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import store from '@/store'
import cookies from "js-cookie";
import Upload from '@/views/leaseAfter/refundApply/Upload';
import { Dialog } from 'vant'
import { formatMoney } from '@/utils/format'
import { getDetailById } from '@/service/refundApply'
export default {
  name: 'processForm',
  props: {
    businessKey: {
      type: String,
      default: ""
    },
    formData: {
      type: Object,
      default: () => ({})
    },
    task: {
      type: Object,
      default: () => ({})
    },
  },
  data () {
    return {
      uploadList: [
        { name: '退款申请函', attach: [] },
        { name: '流水回单', attach: [] },
        { name: '其他', attach: [] }
      ],
      formatMoney,
      activeName: '1',
      result: {}
    }
  },
  created () {
    this.SCREEN_HEIGHT = this.$SCREEN_HEIGHT + 'px'
    this.init()
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  methods: { 
    tbRefundTypefn (a) {
       if (a == '1') return '经销商保证金退回'
       if (a == '2') return '重复扣款'
       if (a == '3') return '结清余额退回'
       if (a == '4') return '代收代付'
       return ''
    },
    tbBusinessTypefn (a) {
       if (a == '1') return '商用车'
       if (a == '2') return '乘用车'
       return ''
    },
    init (item) {   
      this.$store.dispatch('loading/show')
      let this1 = this
      setTimeout(function(){
        this1.activeName = '0'
      },300)    
      getDetailById({tbRefundApplyId:this.businessKey}).then((res) => {
        store.dispatch('loading/close')
        console.log(res)
        this.result = res.data;
        if (this.result.uploadFile) {
          this.uploadList.forEach(val => {
            this.result.uploadFile.forEach(a => {
              if (a.bussType == val.name) {
                val.attach.push(a)
              }
            })
          })  
          console.log(this.uploadList)
          try {
            this.$refs['Upload'].init()         
          } catch(e) {}         
        }  
      });
    }    
  },
  components: {
    [Upload.name]: Upload
  }
}
</script>

<style scoped>
/deep/ .vanTabs .van-tabs__content {
  overflow: scroll;
  height: calc(100vh - 120px);
}
.dialog-footer {
  height: 3em;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .confirm {
    color: #0DB3A7;
  }
}
 .title {
    font-size: 1.1em;
    font-weight: bold;
    color: #015478;
    text-align: left;
    padding: 10px 10px 10px 20px;
  }
.padding {
  padding-left: 5px;
  padding-right: 5px;
}
.listDiv{
  max-height: 800px;
  overflow-y: scroll;
  margin-bottom: 50px;
}
/deep/ .van-cell {
  padding: 5px;
}
/deep/ .van-cell__value--alone {
  display: flex;
}
/deep/ .van-cell__value--alone span {
  width: 25%;
  text-align: center;
}
.page-container {
  height: 100%;
  background-color: #F9FAFE;
}
/deep/ .redVan .van-field__label{
  color: red;
}
/deep/ .redVan .van-field__control {
  color: red;
}
.flex-row-between {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.flex-center {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.flex-row-start {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}
/deep/ .van-dialog {
  width: 95%;
}
.list-item {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  min-height: 160px;
  overflow: hidden;
  background-color: white;
  /* border-style: solid; */
  /* border-color: #0DB3A7; */
  border-width: 1px;
  margin-top: 15px;
  margin-left: 15px;
  margin-right: 15px;
}
.list-item-header {
  padding-left: 15px;
  min-height: 40px;
}
.list-item-content {
  min-height: 80px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom-style: solid;
  border-bottom-color: #eee;
  border-bottom-width: 1px;
  border-top-color: #eee;
  border-top-style: solid;
  border-top-width: 1px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.item-header-left {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 14px;
  color: #333;
}
.GD-number-text {
  font-size: 15px;
  margin-left: 12px;
  color: #333;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.tag-common {
  height: 24px;
  font-size: 13px;
  border-radius: 12px;
  color: #0DB3A7;
  margin-right: 10px;
  text-align: center;
}
.item-content-text {
  font-size: 15px;
  color: #555;
  margin-left: 15px;
  line-height: 26px;
  letter-spacing: 1px;
}
.list-item-btn {
  min-height: 44px;
  color: #0DB3A7;
  font-size: 16px;
}
.unsigned-btn {
  color: #F40604;
}
.empty-container {
  padding-top: 20%;
  margin-bottom: 50%
}
</style>
