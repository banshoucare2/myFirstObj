<template>
  <div style="padding: 20px; background: #white;height:100%">
    <!-- <van-uploader :value="uploadList.map(a =>a.url)" multiple :after-read="afterRead" /> -->  
      <van-tabs class="uptabs" type="card" v-model="active" @click="onClick">
        <van-tab v-for="(item, index) in uploadListOld" :title="item.name" :key="index"></van-tab>
      </van-tabs>
      <div  style="margin-top: 20px;text-align: left;">
        <div  v-for="(attachItem, aindex) in attach" :key="aindex" style="margin-right: 5px;width: 30%;display: inline-block;position: relative;">          
          <van-icon v-if="!is_search" name="clear"@click="defn(aindex)"/>
          <van-image @click="preview(attachItem.url ||attachItem.path)" style="width:100px;height: 100px;" fit="cover" :src="uploadType(attachItem.url || attachItem.path)" >        
            <template slot="error">加载失败</template>
          </van-image>     
        </div>   
        <van-uploader v-if="!is_search" accept=".jpg,.jpeg,.png,.pdf,.docx,xls,xlsx" v-model="attach"  :after-read="afterRead" />   
      </div>
      <van-button type="primary" v-if="isSave" style="margin-top: 20px" @click="saveFn">保存</van-button>  
  </div>
</template>
<script>
import pdfUrl from '../../../assets/pdf.png'; // import 引入图片
import xlsxUrl from '../../../assets/xlsx.png'; // import 引入图片
import docxUrl from '../../../assets/docx.jpg'; // import 引入图片
import { BASE_CONFIG } from '@/constants/config'
import { getyzqbtFjConfig, attachmentUpload } from '@/service/customerCare'
import { Base64 } from "js-base64";
export default {
  name: "Upload-component",
  props: {
    is_search: {
      type: Boolean,
      default: false,       
    },
    isSave: {
      type: Boolean,
      default: false,       
    },
    uploadList: {
      type: Array,
      default: ''
    },
    result: {
      type: Object,
      default: '',
    }
  },
  data() {
    return {
      index: 0,
      fileList: [],
      attach: [],
      active: 0,
      uploadListOld: [],
      propsOption: { children: "child", label: "name" },
      currentAttachment: {},
      clearFilterText: '',
      filterText: "",
      selectName: '',
      selectId: ''
    };
  },
  created() {
   this.init()
  },

  methods: {
    afterRead (files, detail) {
      let formData = new FormData();
      formData.append("file", files.file);
      let this1 =  this
      let selectindex = this1.index
      attachmentUpload({file:files.file}).then((res) => {
        if (res.code == 0 && res.data) {
          res.data.isDe = 1
          res.data.bussType = this1.uploadListOld[selectindex].name
          this1.uploadListOld[selectindex].attach.push(res.data)
          this1.attach =  this1.uploadListOld[selectindex].attach
          //  console.log(res.data)
        } else {
          this.$toast('文件上传失败！')
        }
      });
    },
    uploadType(url) {
      if (!url) {
        return
      }
      if (url.includes('.docx') || url.includes('.doc')) {
        return docxUrl
      }
      if (url.includes('.xls') || url.includes('.xlsx')) {
        return xlsxUrl
      }
      if (url.includes('.pdf') || url.includes('.PDF')) {
        return pdfUrl
      }
      return url
    },
    init() {
      this.uploadListOld = this.uploadList
    },
    defn (aindex) {
      this.uploadListOld[this.index].attach = this.uploadListOld[this.index].attach.filter((a,index) => aindex !=index)
      this.attach = this.uploadListOld[this.index].attach
    },
    onClick(index, title) {
     this.index = index
     this.attach =this.uploadListOld[index].attach
    },
    preview(filePath) {
      let url =
      BASE_CONFIG.docs_host +
        "onlinePreview?url=" +
        encodeURIComponent(Base64.encode(filePath));
      window.open(url, "", "width=1000,height=1000");
    },
  },
  components: {
  },
};
</script>

<style scoped>
/deep/ .van-icon-clear {
  position: absolute;
  right: -15px;
  top:-15px
}
/deep/ .van-uploader {
  vertical-align: bottom;
}
/deep/ .van-uploader__preview {
  display: none;
}
/deep/ .van-tabs__nav--card .van-tab.van-tab--active {
  background-color:#07c160
}
/deep/ .van-tabs__nav--card   {
  border: 1px solid #07c160 ;
}
/deep/ .uptabs .van-tabs__content {
  height: inherit!important;
}
.title {
    font-size: 1.1em;
    font-weight: bold;
    color: #015478;
    text-align: left;
    padding: 10px 10px 10px 20px;
  }
</style>