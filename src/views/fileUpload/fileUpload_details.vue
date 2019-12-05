<template>
  <div class="page">
    <div class="content clearfix">
      <p class="title">{{subTitle}}</p>
      <ul class="imgShowBox clearfix">
        <li v-if="0==3">
          <img
            preview="1"
            src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3300305952,1328708913&fm=27&gp=0.jpg"
            alt
          >
          <span class="exampleImg">示例图片</span>
          <p class="explain">（可点击放大滑动查看）</p>
        </li>
          <li v-for="(item,index) in imgBlobList" :key="index">
            <div class="show">
              <!-- <div class="picture" :style="'backgroundImage:url('+item.imgBlob+')'"></div> -->
              <img  preview="1" :src="item.pdfJpg" alt="">
              <i class="delete" @click="deleteImg(item)"></i>
            </div>
            <p class="explain">上传成功</p>
            <div class="shade"></div>
          </li>
        <li>
          <div class="show">
            <div class="picture"></div>
            <!-- <img :src="imgBlob" alt=""> -->
            <div class="upload">
              <input
                class="hides"
                ref="referenceUploadp"
                type="file"
                accept="image/*"
                @change="upload($event)"
              >
            </div>
          </div>
          <p class="explain">点击上传</p>
        </li>
      </ul>
      <div class="buttonBox">
        <p @click="goBackFun" class="backButton">返回继续上传</p>
      </div>
    </div>
   
    <MaskLoading :show="showLoading" text="上传中..."></MaskLoading>
   
  </div>
</template>

<script>
import Exif from "exif-js";
import { Toast, Dialog } from "vant";
import { randomWord, imgPreview, storeSet } from "../../utils/common.js";
import MaskLoading from "@/components/MaskLoading.vue";
export default {
  metaInfo() {
    return {
      title: this.title
    };
  },
  data() {
    return {
      title: "",
      type: "",
      contractNo: null,
      isMust: null,
      subTitle: "",
      showLoading: false,
      imgBlobList: [],
      imgBlob: null,
      picValue: null,
      fileList: [],
      fileName: [],
      cid: null, //身份证
      cname: null, //姓名
      imgSum: null
    };
  },

  created() {
    this.title = this.$route.query.typeName;
    this.type = this.$route.query.type;
    this.contractNo = this.$route.query.contractNo;
    this.isMust = this.$route.query.isMust;
    this.subTitle = this.$route.query.typeName;
    this.queryCidAndName();
  },
  mounted() {},
  methods: {
    // 上传图片
    uploadImg() {
      let queryData = {
        fileList: this.fileList,
        fileName: this.fileName,
        inputuser: "BCR", //上传人
        type: this.type, //附件类型
        applyId: this.contractNo, //合同号
        typeCod: this.type, //附件类型标识
        cid: this.cid, //客户身份证ID
        cname: this.cname, //身份证名称
        isMust: this.isMust //是否必填
      };
      this.showLoading = true;
      this.$request
        .post("docAttachmentUpload/saveDocAttachmentUpload", queryData)
        .then(res => {
          this.showLoading = false;
          if (res.code == "200") {
            this.queryFileDetails();
          }
        })
        .catch(error => {
          this.showLoading = false;
          console.log("error" + error);
        });
    },
    //删除图片
    deleteImg(item) {
      let _this = this;
      Dialog.confirm({
        message: "确定删除这张图片吗？",
        beforeClose
      })
        .then(res => console.log(res))
        .catch(e => console.log(e));
      function beforeClose(action, done) {
        if (action === "confirm") {
          setTimeout(done, 1000);
          setTimeout(() => {
            _this.deleteImgFun(item);
          }, 1000);
        } else {
          done();
        }
      }
    },
    //删除图片接口
    deleteImgFun(item) {
      this.$request
        .get(
          "docAttachmentUpload/deleteDocAttachmentUpload?docno=" +
            item.docno +
            "&type=" +
            item.type
        )
        .then(res => {
          if (res.code == "200") {
            Toast("册除成功");
            this.queryFileDetails();
          }
        })
        .catch(error => {
          console.log("error" + error);
        });
    },
    async upload(e) {
      if (this.imgSum >= 9) {
        Toast("最多只能上传9张");
        return;
      }
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.picValue = files[0];
      this.imgBlob = await imgPreview(this.picValue);
      // this.imgBlob = this.imgBlob.replace(/^data:image\/\w+;base64,/, "");
      // this.imgBlobList = [];
      this.imgBlobList.push({ imgBlob: this.imgBlob });
      this.fileList = [];
      this.fileName = [];
      let imgData = this.imgBlob.replace(/^data:image\/\w+;base64,/, "");
      this.fileList.push(imgData);
      this.fileName.push(files[0].name);
      this.uploadImg();
    },
    //查询附件详情
    queryFileDetails() {
      this.$request
        .get(
          "docAttachmentUpload/queryDocAttachmentUpload?objectno=" +
            this.contractNo +
            "&type=" +
            this.type
        )
        .then(res => {
          if (res.code == "200") {
            this.imgBlobList = res.data;
            this.imgSum = this.imgBlobList.length;
            this.$previewRefresh();
          }
        })
        .catch(error => {
          console.log("error" + error);
        });
    },
    //查询生份证跟名字
    queryCidAndName() {
      this.$request
        .get("loanApplicationInfo/getDetail?contractNo=" + this.contractNo)
        .then(res => {
          if (res.code == "200") {
            this.cid = res.data.personInfo.idCard;
            this.cname = res.data.personInfo.name;
            this.queryFileDetails();
          }
        })
        .catch(error => {
          console.log("error" + error);
        });
    },
    goBackFun() {
      this.$router.go(-1);
    }
  },
  components: {
    MaskLoading
  }
};
</script>
<style lang="scss" scoped>
.content {
  width: 100%;
  .title {
    height: 0.96rem;
    font-size: 0.28rem;
    font-weight: 400;
    color: rgba(0, 0, 0, 1);
    line-height: 1rem;
    text-align: left;
    padding-left: 0.3rem;
  }
  .imgShowBox {
    padding: 0 0.3rem;
    box-sizing: border-box;
    width: 100%;
    li {
      width: 3.35rem;
      height: 3.35rem;
      background: rgba(255, 255, 255, 1);
      border-radius: 0.12rem;
      position: relative;
      margin-bottom: 0.8rem;
      position: relative;
      img {
        width: 100%;
        height: 100%;
        border-radius: 0.12rem;
      }
      .exampleImg {
        position: absolute;
        width: 1.2rem;
        height: 1.2rem;
        border-radius: 0.6rem;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        font-size: 0.28rem;
        font-weight: 700;
        color: rgba(0, 0, 0, 1);
        line-height: 1.2rem;
        pointer-events: none;
      }
      .clear {
        position: absolute;
        z-index: 100;
        top: 0.2rem;
        right: 0.2rem;
        width: 0.32rem;
        height: 0.32rem;
        background: url("../../assets/img/clear_icon(1).png") no-repeat
          center/100%;
      }
      .explain {
        font-size: 0.26rem;
        color: rgba(153, 153, 153, 1);
        line-height: 0.48rem;
      }
      .shade {
        position: absolute;
        z-index: 20;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 0.12rem;
        pointer-events: none;
      }
    }
    li:nth-of-type(2n + 1) {
      float: left;
    }
    li:nth-of-type(2n) {
      float: right;
    }
  }
}

.show {
  position: relative;
  top: 0;
  left: 0;
  margin: 0 auto;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 1);
  border-radius: 0.12rem;

  .picture {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 100%;
    border-radius: 0.12rem;
  }

  .mask {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.1);
  }

  .identification {
    border: 2px solid rgba(255, 255, 255, 1);
    height: 0.42rem;
    line-height: 0.42rem;
    border-radius: 0.21rem;
    font-size: 0.24rem;
    width: 2.26rem;
    text-align: center;
    position: absolute;
    top: 0.2rem;
    right: 0.2rem;
    color: rgba(255, 255, 255, 1);
  }

  .delete {
    position: absolute;
    z-index: 23;
    top: 0.2rem;
    right: 0.2rem;
    width: 0.32rem;
    height: 0.32rem;
    background: url("../../assets/img/clear_icon(1).png") no-repeat center/100%;
  }

  .upload {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 1.4rem;
    height: 1.4rem;
    background: url("../../assets/img/jia.png") no-repeat;
    background-size: 100%;
    z-index: 2;

    .hides {
      width: 100%;
      height: 100%;
      opacity: 0;
    }
  }
}
.buttonBox {
  margin-top: 0.79rem;
  width: 100%;
  display: block;
  p {
    width: 3.5rem;
    height: 0.9rem;
    line-height: 0.9rem;
    border-radius: 0.45rem;
  }
  .backButton {
    border: 1px solid rgba(153, 153, 153, 1);
    font-size: 0.36rem;
    color: rgba(102, 102, 102, 1);
    margin: 0 auto;
    margin-bottom: 1rem;
  }
}
</style>