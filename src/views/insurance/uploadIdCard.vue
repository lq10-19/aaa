<template>
  <div class="addID">
    <p class="tip">拍摄时请确保身份证边框完整、字迹清晰、亮度均衡</p>
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
              @change="upload($event,'portrait')"
            />
          </div>
          <div v-show="portraitImage" class="mask">
            <div class="identification">仅供本次业务使用</div>
            <i class="delete" @click="deleteImg('portraitImage')"></i>
          </div>
        </div>
      </div>
      <div class="tips">点击开始识别正面（人像面）</div>
      <!-- 国徽面 -->
      <div class="bk">
        <div class="show fan">
          <div class="picture" :style="'backgroundImage:url('+headerImage+')'"></div>
          <div class="upload" v-show="!headerImage">
            <!-- accept="image/*;capture=camera" 直接调用了相机 -->
            <input
              class="hides"
              ref="referenceUploadh"
              type="file"
              accept="image/*"
              @change="upload($event,'Emblem')"
            />
          </div>
          <div v-show="headerImage" class="mask">
            <div class="identification">仅供本次业务使用</div>
            <i class="delete" @click="deleteImg('headerImage')"></i>
          </div>
        </div>
      </div>
      <div class="tips">点击开始识别背面（国徽面）</div>
    </div>
    <!-- <div class="waring">本操作将严格保护您的隐私安全，请放心操作</div> -->
    <div class="btn_box">
      <button class="btn" :class="{'disable': !headerImage||!portraitImage }" @click="submit">下一步</button>
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
import { Toast } from "vant";
export default {
  data() {
    return {
      from: "",
      headerImage: null,
      portraitImage: null,
      type: null,
      nonceSign: null,
      orderNo: null,
      nonce: null,
      appId: this.$baseInfo.VUE_APP_API_APPID,
      secret: this.$baseInfo.VUE_APP_API_SECRET,
      inputuserId: null,
      infoID: null,
      showLoading: false,
      text: ""
    };
  },
  created() {
    //传参from
    if (this.$route.query.from) {
      this.from = this.$route.query.from;
    }
  },
  mounted() {
    document.getElementsByTagName("title")[0].textContent = "身份证认证";
    document.getElementsByTagName("body")[0].style.background = "#fff";
    this.orderNo = randomWord(false, 32);
    this.nonce = randomWord(false, 32);
    this.inputuserId = randomWord(false, 20);
    this.init();
  },
  methods: {
    async init() {
      try {
        this.text = "加载中...";
        this.showLoading = true;
        await this.getSign();
      } catch (error) {
        console.error(error);
        Toast("获取sign失败");
      } finally {
        this.showLoading = false;
      }
    },
    //获取Sign
    getSign() {
      return this.$requestBx
        .post("ocr/getTencentOcrData", {
          userId: this.inputuserId,
          orderNo: this.orderNo,
          nonceStr: this.nonce,
          version: "1.0.0",
          appId: this.appId,
          signType: "SIGN",
          secret: this.secret
        })
        .then(res => {
          if (res.data.nonceSign) {
            this.nonceSign = res.data.nonceSign;
          } else {
            Toast("获取签名失败，请返回重新进入");
          }
        });
    },
    //提交进行OCR
    async submit() {
      if (!this.portraitImage || !this.headerImage) {
        return;
      }
      this.showLoading = true;
      this.text = "上传中...";
      const param = {
        frontBase: this.portraitImage.replace(/^.*?,/, ""), //正面
        behindBase: this.headerImage.replace(/^.*?,/, ""), //反面
        webankAppId: this.appId,
        version: "1.0.0",
        nonce: this.nonce,
        sign: this.nonceSign,
        orderNo: this.orderNo,
        userId: this.inputuserId
      };
      try {
        const resp = await this.$requestBx.post("ocr/getOcrAPIData", param);
        if (resp.code == "420") {
          Toast(`异常:${resp.message}`);
          throw new Error(resp.message);
        } else if (resp.code == "401") {
          Toast(`${resp.message}`);
        }
        const idCardOcr = resp.data;
        console.log("跳转");
        storeSet(idCardOcr, "idCardOcr");
        this.$router.push({
          path: "/idCardInfo2",
          query: { from: this.from }
        });
      } catch (error) {
        //console.error(error);
      } finally {
        this.showLoading = false;
      }
    },
    // 删除
    deleteImg(type) {
      if (type == "portraitImage") {
        this.portraitImage = null;
        this.$refs.referenceUploadp.value = null;
      } else {
        this.headerImage = null;
        this.$refs.referenceUploadh.value = null;
      }
    },
    // 上传身份证
    async upload(e, type) {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        return;
      }
      try {
        this.text = "读取图片...";
        this.showLoading = true;
        if (type === "portrait") {
          this.portraitImage = await imgPreview(files[0]);
          //console.log("人面", this.portraitImage);
        } else {
          this.headerImage = await imgPreview(files[0]);
          //console.log("国徽", this.headerImage);
        }
      } catch (error) {
        console.error(error);
        Toast("读取图片失败");
      } finally {
        this.showLoading = false;
      }
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