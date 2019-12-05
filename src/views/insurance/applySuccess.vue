<template>
  <div class="page">
    <div class="section">
      <img class="success-img" src="../../assets/img/success.png" />
      <p>您的贷款申请已经提交</p>
      <p class="line"></p>
      <!-- <img class="mp-img" src="../../assets/img/bqyhxcx.png" />
      <p class="msg">关注佰仟易行微信小程序</p>
      <p class="msg">了解更多车辆信息</p>-->
      <div class="bottom">
        <button @click="nextCheck">查看合同</button>
        <button @click="goBack" class="test">回到首页</button>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import PopupPicker from "@/components/PopupPicker.vue";
import PopupDatetimePicker from "@/components/PopupDatetimePicker.vue";
import MaskLoading from "@/components/MaskLoading.vue";
import queryString from "querystring";
import {
  randomWord,
  isWeiXin,
  isIOS,
  storeGet,
  storeSet,
  storeRemove,
  JGEvent
} from "@/utils/common.js";
export default {
  metaInfo: {
    title: "提交成功"
  },
  data() {
    return {
      customerId: ""
    };
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === "carInsuranceInfo") {
      console.log("返回小程序");
      if (this.checkEnv()) {
        import("weixin-js-sdk").then(wx => {
          wx.miniProgram.switchTab({
            url: "/pages/home/main",
            fail: () => {
              Toast("跳转页面失败，请重试");
            }
          });
        });
      }
    } 
    next();
  },
  created() {
    storeRemove("carInfo");
    storeRemove("myInfo");
    storeRemove("BizLicenseOcr");
    storeRemove("companyInfo");
    storeRemove("companyMsg");
    storeRemove("contactsInfo");
    storeRemove("guarantorContactsInfo");
    storeRemove("guarantorInfo");
    storeRemove("guarantorMsg");
    storeRemove("guarantorPartnerInfo");
    storeRemove("guarantorPartnerMsg");
    storeRemove("idCardOcr");
    storeRemove("partnerInfo");
    storeRemove("selfMsg");
    storeRemove("queryCustomerInfo");
    storeRemove("queryCompanyInfo");
    storeRemove("customerSame");
    storeRemove("companySame");
    storeRemove("continueApply");
    if (this.$route.query.customerId) {
      this.customerId = this.$route.query.customerId;
    }
  },
  mounted() {
    document.getElementsByTagName("body")[0].style.background = "#fff";
  },
  methods: {
    //查看合同
    nextCheck() {
      this.$router.push({
        path: "/insuranceOrderList",
        query: { customerId: this.customerId }
      });
    },
    //回到首页
    goBack() {
      console.log("返回");
      // import("weixin-js-sdk").then(wx => {
      //   wx.miniProgram.switchTab({
      //     url: "/pages/home/main",
      //     fail: () => {
      //       Toast("跳转页面失败");
      //     }
      //   });
      // });
      if (this.checkEnv()) {
        import("weixin-js-sdk").then(wx => {
          wx.miniProgram.switchTab({
            url: "/pages/home/main",
            fail: () => {
              Toast("跳转页面失败，请重试");
            }
          });
        });
      }
    },
    //判断环境
    checkEnv() {
      return window.__wxjs_environment === "miniprogram";
    }
  }
};
</script>
<style lang="scss" scoped>
.page {
  flex-direction: column;
  align-items: center;
  background: #fff;
  .section {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .success-img {
      margin-top: 1.2rem;
      width: 1.8rem;
      height: 1.8rem;
    }
    p {
      font-size: 0.32rem;
      font-weight: 400;
      margin-top: 0.6rem;
    }
    .msg {
      margin-top: 0.2rem;
      color: #999999;
      font-size: 0.28rem;
    }
    .mp-img {
      margin-top: 0.3rem;
      width: 2.4rem;
      height: 2.4rem;
    }
    .line {
      width: 90%;
      height: 2px;
      background: rgba(231, 231, 231, 1);
    }
    .bottom {
      width: 90%;
      //flex: 1 0 auto;
      display: flex;
      //flex-direction: column;
      justify-content: space-around;
      //align-items: center;
      padding-top: 0.8rem;
      button {
        width: 2.5rem;
        @include button;
      }
      .test {
        background: #fff;
        border: 0.03rem solid #999;
        color: #888;
      }
    }
  }
}
</style>