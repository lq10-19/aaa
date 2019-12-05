<template>
  <div class="page id-card-info">
    <div class="section">
      <div class="beCareful">注：在确认前，身份证文字类信息都可以点击修改。</div>
      <div class="img-wrapper">
        <div class="left box">
          <img :src="headerImageUrl" />
        </div>
        <div class="right box">
          <img :src="portraitImageUrl" />
        </div>
      </div>
      <div class="form">
        <van-cell-group>
          <van-field v-model.trim="form.name" label="姓名" placeholder="姓名" disabled />
          <van-field v-model.trim="form.sex" label="性别" placeholder="性别" />
          <van-field v-model.trim="form.nation" label="民族" placeholder="民族" />
          <van-field v-model.trim="form.idCard" label="身份证号" placeholder="身份证号" disabled />
          <van-field v-model.trim="form.birthday" label="出生日期" placeholder="出生日期" disabled />
          <van-field v-model.trim="form.issueOffice" label="签发机关" placeholder="签发机关" />
          <van-field v-model.trim="form.cardAddress" label="住址" placeholder="住址" />
          <van-field v-model.trim="form.validDate" label="有效日期" placeholder="有效日期" disabled />
        </van-cell-group>
      </div>
    </div>
    <div class="btn-wrapper">
      <button class="btn left" @click="againAddIdCard">重新上传</button>
      <button class="btn right" @click="confirmCheck">确认</button>
    </div>
    <!-- <div class="btn-test">
      <van-checkbox v-model="needLive">活体检测</van-checkbox>
    </div>-->
    <MaskLoading :show="showLoading"></MaskLoading>
    <a ref="spanId" :href="href"></a>
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
  JGEvent
} from "@/utils/common.js";

export default {
  metaInfo: {
    title: "身份证信息"
  },
  components: {
    PopupPicker,
    PopupDatetimePicker,
    MaskLoading
  },
  data() {
    return {
      form: {
        age: 0,
        applicationId: "",
        areaId: "",
        areaName: "",
        birthday: "",
        cardAddress: "",
        cardBack: "",
        cardFront: "",
        cell: "",
        cityId: "",
        cityName: "",
        createDate: "",
        customerId: "",
        education: "",
        educationCode: "",
        houseAddress: "",
        houseType: "",
        houseTypeCode: "",
        householdRegister: "",
        idCard: "",
        issueOffice: "",
        marriageStatus: "",
        marriageStatusCode: "",
        mobile: "",
        modifyDate: "",
        name: "",
        nation: "",
        provinceId: "",
        provinceName: "",
        room: "",
        sex: "",
        street: "",
        township: "",
        validDate: "",
        validDateEnd: "",
        validDateStart: ""
      },
      showLoading: false,
      headerImageUrl: null,
      portraitImageUrl: null,
      orderNo: null,
      nonce: null,
      appId: this.$baseInfo.VUE_APP_API_APPID,
      secret: this.$baseInfo.VUE_APP_API_SECRET,
      isShow: false,
      href: null,
      needLive: false
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const idCardOcr = storeGet("idCardOcr");
      const order = storeGet("order");
      if (idCardOcr) {
        vm.form.name = idCardOcr.name;
        vm.form.sex = idCardOcr.sex;
        vm.form.nation = idCardOcr.nation;
        vm.form.idCard = idCardOcr.idcard;
        vm.form.birthday = idCardOcr.birth;
        vm.form.issueOffice = idCardOcr.authority;
        vm.form.cardAddress = idCardOcr.address;
        vm.form.validDate = idCardOcr.validDate;
        vm.headerImageUrl = idCardOcr.idCardFrontImageUrl;
        vm.portraitImageUrl = idCardOcr.idCardBehindImageUrl;
      }
      if (order) {
        vm.form.applicationId = order.applicationId;
      }
    });
  },
  created() {},
  mounted() {
    this.orderNo = randomWord(false, 32);
    this.nonce = randomWord(false, 32);
    this.needLive = process.env.VUE_APP_RUNTIME === "production";
  },
  methods: {
    // 重新提交
    againAddIdCard() {
      JGEvent("idcard-info-upload-again");
      this.$router.push({
        path: "addIdCard"
      });
    },
    confirmCheck() {
      JGEvent("idcard-info-confirm");
      const form = this.form;
      if (!form.name) {
        Toast("请输入姓名");
        return;
      }
      // const drivingLicense = storeGet("drivingLicense");
      // if (drivingLicense.name !== form.name) {
      //   Toast("身份证姓名和行驶证姓名不一致");
      //   return;
      // }
      if (!form.sex) {
        Toast("请输入性别");
        return;
      }
      if (!form.nation) {
        Toast("请输入民族");
        return;
      }
      if (!form.idCard) {
        Toast("请输入省份证号");
        return;
      }
      if (!form.birthday) {
        Toast("请输入出生日期");
        return;
      }
      if (!form.issueOffice) {
        Toast("请输入签发机关");
        return;
      }
      if (!form.cardAddress) {
        Toast("请输入住址");
        return;
      }
      if (!form.validDate) {
        Toast("请输入有效日期");
        return;
      }
      if (!this.checkValidDate(form.validDate)) {
        return;
      }
      this.confirm();
    },
    async confirm() {
      try {
        this.showLoading = true;
        const url = "loanPersonInfo/saveOrUpdate";
        await this.$request.post(url, this.form);
        const resp = await this.livingBody();
        if (this.checkEnv()) {
          import("weixin-js-sdk").then(wx => {
            const params = {
              webankAppId: this.appId,
              version: "1.0.0",
              nonce: this.nonce,
              orderNo: this.orderNo,
              h5faceId: resp.data.h5faceId,
              resultType: 0,
              userId: 1234,
              sign: resp.data.sign,
              _bqt: Date.now()
            };
            const paramsStr = queryString.stringify(params);
            wx.miniProgram.navigateTo({
              url: "/pages/user/liveBody/main?" + paramsStr,
              fail: () => {
                Toast("跳转页面失败");
              }
            });
          });
        } else {
          if (this.needLive) {
            storeSet(this.orderNo, "livingBodyOrderNo");
            this.jump(resp);
          } else {
            this.$router.push({
              path: "personalInfo",
              query: { code: 0 }
            });
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.showLoading = false;
      }
    },
    // 活体识别
    async livingBody() {
      const returnUrl = window.location.href.replace(
        "idCardInfo",
        "personalInfo"
      );
      const params = {
        appId: this.appId, //腾讯云线下对接分配的 AppId
        secret: this.secret, //腾讯云线下对接分配的 AppId的密钥
        orderNo: this.orderNo, //随机数订单号
        name: this.form.name, //客户证件姓名
        idNo: this.form.idCard, //客户证件号码
        userId: 1234, //用户id
        version: "1.0.0", //版本号
        nonceStr: this.nonce, //随机的32位字符串
        url: returnUrl,
        resultType: "0", // 是否显示结果页面 0显示
        from: "browser", // 表示在哪里启动刷脸
        sourcePhotoStr: "", // 比对源照片非必填
        sourcePhotoType: "1" /** 比对源照片类型 */
      };

      return this.$request.post("ocr/h5LiveDetection", params).then(res => {
        if (res.code != "200") {
          Toast("发起活体检测失败");
          return Promise.reject();
        }
        return Promise.resolve(res);
      });
    },
    jump(resp) {
      const url = resp.data.redirectUrl + "&t=" + Date.now();
      window.location.href = url;
    },
    checkValidDate(dateStr) {
      const index = dateStr.indexOf("-");
      if (index < 0) {
        Toast("无效的身份证有效日期");
        return false;
      }
      const startDate = dateStr.substring(0, index);
      const endDate = dateStr.substring(index + 1);
      if (endDate === "长期") {
        return true;
      }
      const date = dayjs(endDate, "YYYYMMDD");
      if (!date.isValid()) {
        Toast("无效的身份证有效日期");
        return false;
      }
      if (date.isBefore(dayjs())) {
        Toast("身份证已过有效期");
        return false;
      }
      return true;
    },
    checkEnv() {
      return window.__wxjs_environment === "miniprogram";
    }
  },
  watch: {
    form: {
      handler: function(val, oldVal) {
        const form = this.form;
        const idCardOcr = storeGet("idCardOcr");
        const temp = {
          name: this.form.name,
          sex: this.form.sex,
          nation: this.form.nation,
          idcard: this.form.idCard,
          birth: this.form.birthday,
          authority: this.form.issueOffice,
          address: this.form.cardAddress,
          validDate: this.form.validDate
        };
        const idCardOcrTemp = Object.assign({}, idCardOcr, temp);
        storeSet(idCardOcrTemp, "idCardOcr");
      },
      deep: true
    }
  }
};
</script>
<style lang="scss" scoped>
.cancel {
  font-size: 0.36rem;
}

.id-card-info {
  width: 100%;
  flex-direction: column;
  .section {
    .beCareful {
      width: 100%;
      text-align: center;
      height: 0.6rem;
      line-height: 0.6rem;
      background: rgba(248, 72, 89, 1);
      font-size: 0.28rem;
      font-family: PingFangSC-Regular;
      color: rgba(255, 255, 255, 1);
    }
    .img-wrapper {
      width: 100%;
      height: 2.1rem;
      margin: 0.07rem 0;
      display: flex;
      justify-content: space-around;

      .box {
        width: 3.2rem;
        height: 2.1rem;
        border: 1px solid #000;

        img {
          width: 3.2rem;
          height: 2.1rem;
        }
      }
    }
    .form {
      .item {
        &.date-range {
          .range-wrapper {
            display: flex;
            .popup-datetime-picker {
              width: 1.5rem;
            }
            .separate {
              margin-right: 0.1rem;
            }
          }
        }
      }
    }
  }
  .btn-wrapper {
    box-sizing: border-box;
    width: 100%;
    display: flex;
    justify-content: space-between;
    height: 0.94rem;
    padding: 0.8rem 0.4rem;
    .btn {
      width: 2.7rem;
    }

    .left {
      @include button;
      color: #666666;
      background: none;
      background-color: $bg-color;
      border: 2px solid #999999;
    }

    .right {
      @include button;
    }
  }
  .btn-test {
    box-sizing: border-box;
    padding-left: 30%;
    width: 100%;
    margin-top: 0.3rem;
  }
}
</style>