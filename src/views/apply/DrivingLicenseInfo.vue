<template>
  <div class="page car-info">
    <div class="section">
      <div class="beCareful">请核实您的车辆信息，可点击修改</div>
      <div class="driving-license-img">
        <img :src="imgUrl" alt />
      </div>
      <div class="form">
        <van-cell-group>
          <van-field v-model.trim="form.carNo" label="车牌号码" placeholder="请输入车牌号码" />
          <van-field v-model.trim="form.carType" label="车辆类型" placeholder="车辆类型" />
          <van-field v-model.trim="form.carOwner" label="所有人" placeholder="所有人" />
          <van-field v-model.trim="form.address" label="住址" placeholder="住址" />
          <van-field v-model.trim="form.usingType" label="使用性质" placeholder="使用性质" />
          <van-field v-model.trim="form.brandModel" label="品牌型号" placeholder="品牌型号" />
          <van-field v-model.trim="form.carIdentityCode" label="识别代码" placeholder="识别代码" />
          <van-field v-model.trim="form.engineNo" label="发动机号" placeholder="发动机号" />
          <PopupDatetimePicker v-model.trim="form.registerDate" label="注册日期"></PopupDatetimePicker>
          <PopupDatetimePicker v-model.trim="form.issueDate" label="发证日期"></PopupDatetimePicker>
        </van-cell-group>
      </div>
    </div>
    <div class="btn_box">
      <button class="btn left" @click="againUpload">重新上传</button>
      <button class="btn right" @click="confirmCheck">确认</button>
    </div>
    <MaskLoading :show="showLoading" text="上传中..."></MaskLoading>
  </div>
</template>

<script>
import { Toast } from "vant";
import PopupDatetimePicker from "@/components/PopupDatetimePicker.vue";
import { storeGet, storeSet, storeRemove, JGEvent } from "@/utils/common.js";
import MaskLoading from "@/components/MaskLoading.vue";
export default {
  metaInfo: {
    title: "行驶证信息确认"
  },
  components: {
    PopupDatetimePicker,
    MaskLoading
  },
  data() {
    return {
      showLoading: false,
      imgUrl: null,
      form: {
        address: "",
        applicationId: "",
        brandModel: "",
        carIdentityCode: "",
        carNo: "",
        carOwner: "",
        carType: "",
        createDate: "",
        engineNo: "",
        imgUrl: "",
        issueDate: null,
        modifyDate: "",
        registerDate: null,
        usingType: ""
      }
    };
  },

  created() {},
  mounted() {},
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const drivingLicense = storeGet("drivingLicense");
      const drivingLicenseOrc = storeGet("drivingLicenseOrc");
      const order = storeGet("order");
      if (order && order.applicationId) {
        vm.form.applicationId = order.applicationId;
      } else {
        storeRemove();
        Toast("获取订单信息异常");
        return;
      }
      if (drivingLicenseOrc) {
        vm.imgUrl = drivingLicenseOrc.httpUrl;
        vm.form.carOwner = drivingLicenseOrc.carAll;
        vm.form.carNo = drivingLicenseOrc.carNumber;
        vm.form.usingType = drivingLicenseOrc.nature;
        vm.form.carType = drivingLicenseOrc.carType;
        vm.form.brandModel = drivingLicenseOrc.carModel;
        vm.form.carIdentityCode = drivingLicenseOrc.carCode;
        vm.form.engineNo = drivingLicenseOrc.carEngine;
        vm.form.issueDate = drivingLicenseOrc.certificationDate;
        vm.form.registerDate = drivingLicenseOrc.registerDate;
        vm.form.address = drivingLicenseOrc.address;
      }
      if (drivingLicense) {
        vm.imgUrl = drivingLicense.imgUrl;
        vm.form.carOwner = drivingLicense.carOwner;
        vm.form.carNo = drivingLicense.carNo;
        vm.form.usingType = drivingLicense.usingType;
        vm.form.carType = drivingLicense.carType;
        vm.form.brandModel = drivingLicense.brandModel;
        vm.form.carIdentityCode = drivingLicense.carIdentityCode;
        vm.form.engineNo = drivingLicense.engineNo;
        vm.form.issueDate = drivingLicense.issueDate;
        vm.form.registerDate = drivingLicense.registerDate;
        vm.form.address = drivingLicense.address;
      }
    });
  },
  methods: {
    againUpload() {
      JGEvent("upload-driver-img-again");
      this.$router.push({
        path: "addDrivingLicense"
      });
    },
    async confirmCheck() {
      JGEvent("driver-info-confirm");
      const form = this.form;
      if (!form.carNo) {
        Toast("请填写车牌号码");
        return;
      }
      if (!form.carType) {
        Toast("请填写车辆类型");
        return;
      }
      if (!form.carOwner) {
        Toast("请填写所有人");
        return;
      }
      if (!form.address) {
        Toast("请填写住址");
        return;
      }
      if (!form.usingType) {
        Toast("请填写使用性质");
        return;
      }
      if (!form.brandModel) {
        Toast("请填写品牌型号");
        return;
      }
      if (!form.carIdentityCode) {
        Toast("请填写识别代码");
        return;
      }
      if (!form.engineNo) {
        Toast("请填写发动机号");
        return;
      }
      if (!form.registerDate) {
        Toast("请填写注册日期");
        return;
      }
      if (!form.issueDate) {
        Toast("请填写发证日期");
        return;
      }

      try {
        this.showLoading = true;
        this.form.imgUrl = this.imgUrl;
        const dealerPrice = await this.queryVehicleprice();
        const resp = await this.confirm();
        if (resp.code == "409") {
          this.$router.push({
            path: "apply"
          });
          return;
        }
        const drivingLicense = this.form;
        const drivingLicenseOrc = storeGet("drivingLicenseOrc");
        drivingLicenseOrc.dealerPrice = dealerPrice;
        storeSet(drivingLicense, "drivingLicense");
        storeSet(drivingLicenseOrc, "drivingLicenseOrc");
        const order = storeGet("order");
        this.$router.push({
          path: "carInfo",
          query: {
            channel: order.channel,
            loanCompany: order.loanCompany
          }
        });
      } catch (error) {
        console.error(error);
      } finally {
        this.showLoading = false;
      }
    },
    confirm() {
      const url = "loanDrivingLicense/saveOrUpdate";
      return this.$request.post(url, this.form);
    },
    queryVehicleprice() {
      //查询车辆评估价
      const url = `${this.$baseInfo.VUE_APP_API_URL_THIRDPARTY}/get/cayChek`;
      return this.$request
        .post(url, {
          vin: this.form.carIdentityCode
        })
        .then(resp => {
          const data = resp.data;
          if (data && data[0] && data[0].dealer_price) {
            return Promise.resolve(data[0].dealer_price);
          } else {
            Toast("未查询到车辆评估价格");
            return Promise.reject();
          }
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.cancel {
  font-size: 0.36rem;
}

.car-info {
  flex-direction: column;
  align-items: center;
  .section {
    width: 100%;
    .beCareful {
      box-sizing: border-box;
      width: 100%;
      text-align: center;
      height: 0.6rem;
      line-height: 0.6rem;
      background: rgba(248, 72, 89, 1);
      font-size: 0.28rem;
      font-family: PingFangSC-Regular;
      color: rgba(255, 255, 255, 1);
    }
    .driving-license-img {
      display: flex;
      height: 2.26rem;
      background-color: #3f3f3f;
      justify-content: space-around;
      img {
        width: 3.42rem;
      }
    }
  }
  .btn_box {
    display: flex;
    justify-content: space-between;
    width: 80%;
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
}
</style>