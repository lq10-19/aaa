<template>
  <div class="addID">
    <p class="tip">拍摄时请确保证件边框完整、字迹清晰、亮度均衡</p>
    <div class="title"></div>
    <div class="box">
      <!--  人像面-->
      <div class="bk">
        <div class="show zheng">
          <div class="picture" :style="'backgroundImage:url('+portraitImage+')'"></div>
          <div class="upload" v-show="!portraitImage">
            <input
              class="hides"
              ref="referenceUploadp"
              type="file"
              accept="image/*"
              @change="upload($event)"
            />
          </div>
          <div v-show="portraitImage" class="mask">
            <div class="identification">仅供本次业务使用</div>
            <i class="delete" @click="deleteImg"></i>
          </div>
        </div>
      </div>
      <div class="tips">点击开始识别</div>
    </div>
    <div class="btn_box">
      <button class="btn" :class="{'disable': !portraitImage }" @click="submitCheck">下一步</button>
    </div>
    <van-loading
      size="50px"
      text-size="18"
      vertical
      class="loading"
      color="#1989fa"
      v-if="showLoading"
    >{{text}}</van-loading>
  </div>
</template>

<script>
import {
  randomWord,
  imgPreview,
  storeSet,
  storeGet,
  JGEvent
} from "@/utils/common.js";
import AddImg from "@/components/AddImg.vue";
import { Toast } from "vant";
export default {
  data() {
    return {
      //headerImage: null,
      portraitImage: null,
      type: null,
      picValue: null,
      showLoading: false,
      text: ""
    };
  },
  created() {},
  mounted() {
    document.getElementsByTagName("title")[0].textContent = "营业执照认证";
    document.getElementsByTagName("body")[0].style.background = "#fff";
  },
  methods: {
    // 删除
    deleteImg() {
      this.portraitImage = null;
      this.$refs.referenceUploadp.value = null;
      this.picValue = null;
    },
    // 上传证件
    async upload(e) {
      console.log(e);
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.picValue = files[0];
      try {
        this.text = "读取图片中...";
        this.showLoading = true;
        this.portraitImage = await imgPreview(this.picValue);
      } catch (error) {
        console.error(error);
      } finally {
        this.showLoading = false;
      }
    },
    async submitCheck() {
      if (!this.picValue) {
        Toast("请上传企业执照");
        return;
      }
      try {
        this.showLoading = true;
        this.text = "上传中...";
        const resp = await this.submit();
        if (resp.code == "200") {
          const BizLicenseOcr = resp.data;
          storeSet(BizLicenseOcr, "BizLicenseOcr");
          console.log("跳转2");
          this.$router.push({
            path: "/businessLicenseInfo"
          });
        } else {
          Toast(`${resp.message}`);
        }
      } catch (error) {
        console.error(error);
        Toast("读取图片失败");
      } finally {
        this.showLoading = false;
      }
    },
    //提交进行OCR
    submit() {
      this.showLoading = true;
      const param = {
        imageBase64: this.portraitImage.replace(/^.*?,/, "")
      };
      return this.$requestBx.post("ocr/queryBizLicenseOcrInfo", param);
    }
  }
};
</script>


<style lang='scss' scoped>
.title {
  width: 100%;
  height: 0.7rem;
  line-height: 1rem;
  text-align: center;
  font-size: 0.3rem;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: #ffcd03ff;
  //margin-top: 0.2rem;
}
.tip {
  width: 100%;
  text-align: center;
  background-color: #fffbf2ff;
  color: #ffcd03ff;
  padding: 0.2rem 0;
}
.tips {
  width: 100%;
  height: 0.8rem;
  line-height: 0.8rem;
  text-align: center;
  font-size: 0.28rem;
  color: rgba(102, 102, 102, 1);
  margin-bottom: 0.2rem;
}

.box {
  .show {
    position: relative;
    top: 0;
    left: 0;
    margin: 0 auto;
    width: 5.8rem;
    height: 3.6rem;
    //background: rgba(255, 255, 255, 1);
    border-radius: 0.1rem;

    .picture {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background-position: center center;
      background-repeat: no-repeat;
      background-size: 100%;
      border-radius: 0.1rem;
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
      display: block;
      height: 0.42rem;
      width: 0.42rem;
      background: url("../../assets/img/clear_icon(1).png") no-repeat;
      background-size: 100%;
      border-radius: 0.21rem;
      font-size: 0.24rem;
      position: absolute;
      top: 0.2rem;
      left: 0.2rem;
      color: rgba(255, 255, 255, 1);
    }

    .upload {
      position: absolute;
      left: 2.35rem;
      top: 1.25rem;
      width: 1.1rem;
      height: 1.1rem;
      background: url("../../assets/img/cl/sc@2x.png") no-repeat;
      background-size: 100%;
      z-index: 2;

      .hides {
        width: 100%;
        height: 100%;
        opacity: 0;
      }
    }
  }
}

.waring {
  width: 100%;
  text-align: center;
  font-size: 0.26rem;
  color: rgba(248, 72, 89, 1);
}

.btn_box {
  width: 100%;
  display: flex;
  justify-content: center;
  padding-bottom: 1rem;
  .btn {
    display: block;
    width: 5.8rem;
    margin-top: 0.28rem;
    height: 0.9rem;
    background: linear-gradient(
      180deg,
      rgba(254, 235, 167, 1),
      rgba(255, 204, 0, 1)
    );
    //box-shadow: 0 0.14rem 0.16rem 0 rgba(254, 235, 167, 1);
    border-radius: 0.44rem;
    font-weight: bold;
    line-height: 0.88rem;
    font-size: 0.36rem;
    color: #555;
    &.disable {
      background: rgba(220, 220, 220, 1);
      color: white;
    }
  }

  .green {
    background: linear-gradient(
      180deg,
      rgba(254, 235, 167, 1),
      rgba(255, 204, 0, 1)
    );
  }
}
.loading {
  position: fixed;
  top: 5rem;
  left: 2.9rem;
}
.zheng {
  background-image: url("../../assets/img/cl/ren@2x.png");
  background-size: 100% 100%;
}
.fan {
  background-image: url("../../assets/img/cl/fan@2x.png");
  background-size: 100% 100%;
}
.bk {
  background-image: url("../../assets/img/cl/1@2x.png");
  background-size: 100% 100%;
  margin: 0 0.7rem;
  padding: 0.12rem 0;
}
</style>