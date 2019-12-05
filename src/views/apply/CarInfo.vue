<template>
  <div class="page">
    <div class="section driving">
      <div class="beCareful">行驶证信息</div>
      <AddImg v-if="!imgUrl" title="点击上传行驶证照片" @click.native="goUpload"></AddImg>
      <div v-else class="img-wrapper">
        <img :src="imgUrl" />
        <div class="button" @click="goUpload">
          <span class="icon picture"></span>
          <span>重新上传</span>
        </div>
      </div>
    </div>
    <div class="section car">
      <div class="beCareful">车辆信息</div>
      <div class="form">
        <van-cell-group>
          <van-field v-model.trim="carForm.carVin" label="车架号" placeholder="请先上传行驶证" disabled />
          <van-field v-model.trim="carForm.carType" label="车型" placeholder="车型" disabled />
          <PopupDatetimePicker v-model.trim="carForm.productionDate" label="车辆出厂日期"></PopupDatetimePicker>
          <PopupDatetimePicker v-model.trim="carForm.registerDate" label="车辆登记日期"></PopupDatetimePicker>
          <van-field v-model.trim="carForm.carColor " label="车辆颜色" placeholder="车辆颜色" />
          <van-field v-model.trim="carForm.transferTimes " label="过户次数" placeholder="过户次数" />
        </van-cell-group>
      </div>
    </div>
    <div class="bottom">
      <button @click="nextCheck">下一步</button>
      <button @click="test" class="test">重置申请</button>
    </div>
    <MaskLoading :show="showLoading"></MaskLoading>
  </div>
</template>

<script>
import { Toast } from "vant";
import dayjs from "dayjs";
import { storeGet, storeSet, storeRemove, JGEvent } from "@/utils/common.js";
import PopupDatetimePicker from "@/components/PopupDatetimePicker.vue";
import AddImg from "@/components/AddImg.vue";
import MaskLoading from "@/components/MaskLoading.vue";
export default {
  metaInfo: {
    title: "车辆信息"
  },
  components: {
    PopupDatetimePicker,
    AddImg,
    MaskLoading
  },
  data() {
    return {
      imgUrl: null,
      carForm: {
        applicationId: "",
        brandId: "",
        carAge: 0,
        carBrand: "",
        carColor: "",
        carSeries: "",
        carStatus: "",
        carType: "",
        carVin: "",
        carguideprice: 0,
        createDate: "",
        mileage: 0,
        modifyDate: "",
        productionDate: null,
        registerDate: null,
        seriesId: "",
        transferTimes: 0,
        typeId: "",
        vehicleprice: 0
      },
      showLoading: false,
      loanCompany: "baiqian"
    };
  },
  created() {
    this.init();
  },
  mounted() {},
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const tempDataSet = storeGet();
      const drivingLicense = storeGet("drivingLicense");
      const order = storeGet("order");
      const carInfo = storeGet("carInfo");
      if (carInfo) {
        vm.carForm = carInfo;
      }
      if (drivingLicense) {
        vm.imgUrl = drivingLicense.imgUrl;
        vm.carForm.carVin = drivingLicense.carIdentityCode;
        vm.carForm.carType = drivingLicense.brandModel;
      }
      if (order) {
        vm.carForm.applicationId = order.applicationId;
      }
    });
  },
  methods: {
    // async init() {
    //   const order = storeGet("order");
    //   if (order && order.applicationId) {
    //     //创建过订单
    //     return;
    //   }
    //   const query = this.$route.query;
    //   let channel = query.channel || "";
    //   let loanCompany = query.loanCompany || "";
    //   if (!channel) {
    //     channel = "unknow channel";
    //   }
    //   try {
    //     this.showLoading = true;
    //     await this.createOrder(channel, loanCompany);
    //   } catch (error) {
    //     console.error(error);
    //   } finally {
    //     this.showLoading = false;
    //   }
    // },

    async init() {
      const query = this.$route.query;
      let channel = query.channel || "";
      let loanCompany = query.loanCompany || "";
      if (!channel) {
        channel = "unknow channel";
      }
      const order = storeGet("order");
      if (order && order.applicationId) {
        //创建过订单,且loanCompany相等
        if (order.loanCompany === loanCompany) {
          return;
        } else {
          //自动重置订单
          this.test();
        }
      }
      try {
        this.showLoading = true;
        await this.createOrder(channel, loanCompany);
      } catch (error) {
        console.error(error);
      } finally {
        this.showLoading = false;
      }
    },
    
    goUpload() {
      JGEvent("carinfo-click-upload-driver-img");
      this.$router.push({
        path: "addDrivingLicense"
      });
    },
    nextCheck() {
      JGEvent("carinfo-next");
      const carForm = this.carForm;
      if (!carForm.applicationId) {
        Toast("未获取到有效订单号");
        return;
      }
      if (!this.imgUrl) {
        Toast("请上传行驶证照片");
        return;
      }
      if (!carForm.carVin) {
        Toast("请填写车架号");
        return;
      }
      if (!carForm.carType) {
        Toast("请填写车型");
        return;
      }
      if (!carForm.productionDate) {
        Toast("请选择车辆出厂日期");
        return;
      }
      if (!carForm.registerDate) {
        Toast("请选择车辆登记日期");
        return;
      }
      if (!carForm.carColor) {
        Toast("请填写车辆颜色");
        return;
      }
      const regChinese = /^[\u4e00-\u9fa5]+$/;
      if (!regChinese.test(carForm.carColor)) {
        Toast("车辆颜色输入中文");
        return;
      }
      if (!/^[0-9]+$/.test(carForm.transferTimes)) {
        Toast("过户次数请填写大于等于0的整数");
        return;
      }
      carForm.transferTimes = parseInt(carForm.transferTimes);
      const productionDate = dayjs(carForm.productionDate);
      const registerDate = dayjs(carForm.registerDate);
      const now = dayjs();
      if (productionDate.isAfter(now)) {
        Toast("车辆出厂日期应该小于当前日期");
        return;
      }
      if (registerDate.isAfter(now)) {
        Toast("车辆登记日期应该小于当前日期");
        return;
      }
      if (!registerDate.isAfter(productionDate)) {
        Toast("车辆登记日期应该大于出厂日期");
        return;
      }
      const drivingLicenseOrc = storeGet("drivingLicenseOrc");
      if (drivingLicenseOrc) {
        carForm.brandId = drivingLicenseOrc.che300BrandId;
        carForm.carAge = ""; //后端处理
        carForm.carBrand = drivingLicenseOrc.che300CarBrand;
        carForm.carSeries = drivingLicenseOrc.che300CarSeries;
        carForm.seriesId = drivingLicenseOrc.che300SeriesId;
        carForm.carType = drivingLicenseOrc.che300CarType;
        carForm.typeId = drivingLicenseOrc.che300TypeId;
        carForm.carStatus = ""; //后端处理
        carForm.mileage = ""; //后端处理
        carForm.carguideprice = drivingLicenseOrc.che300GuidePrice;
        const priceTemp = parseFloat(drivingLicenseOrc.dealerPrice);
        if (isNaN(priceTemp)) {
          Toast("未能获取到车辆估价");
          return;
        }
        carForm.vehicleprice = priceTemp * 10000; //单位万元
      } else {
        Toast("未能获取到车辆完整信息");
        return;
      }
      this.next();
    },
    async next() {
      try {
        this.showLoading = true;
        const url = "loanCarInfo/saveOrUpdate";
        const resp = await this.$request.post(url, this.carForm);
        const carInfo = Object.assign({}, this.carForm);
        carInfo.imgUrl = this.imgUrl;
        storeSet(carInfo, "carInfo");
        this.$router.push({
          path: "personalInfo"
        });
      } catch (error) {
        console.error(error);
      } finally {
        this.showLoading = false;
      }
    },
    test() {
      JGEvent("carInfo-reset");
      storeRemove();
      const query = Object.assign({}, this.$route.query, {
        t: Date.now()
      });
      this.$router.replace({
        path: "carInfo",
        query: query
      });
      window.location.reload();
    },
    createOrder(channel, loanCompany) {
      const url = "loanApplicationInfo/create";
      return this.$request
        .get(url, {
          params: {
            loanCompany: loanCompany,
            channel: channel
          }
        })
        .then(resp => {
          this.carForm.applicationId = resp.data.applicationId;
          storeSet(resp.data, "order");
        });
    }
  },
  watch: {
    carForm: {
      handler: function(val, oldVal) {
        storeSet(this.carForm, "carInfo");
      },
      deep: true
    }
  }
};
</script>
<style lang="scss" scoped>
.page {
  flex-direction: column;
  .section {
    &.driving {
      flex: 0 0 28%;
      .img-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: white;
        img {
          margin-top: 30px;
          width: 2.9rem;
          height: 2rem;
        }
        .button {
          background: none;
          background-color: white;
          color: #ffd11a;
          margin-top: 20px;
          margin-bottom: 20px;
          width: 4rem;
          height: 0.56rem;
          border: 2px solid rgba(255, 209, 26, 1);
          border-radius: 27px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        span.icon {
          &.picture {
            display: inline-block;
            background-image: url(../../assets/img/picture.png);
            background-size: cover;
            width: 0.37rem;
            height: 0.29rem;
            margin-right: 0.1rem;
          }
        }
      }
    }
    &.car {
      @media screen and (max-height: 667px) {
        flex: 0 1 45%;
      }
      @media screen and (min-height: 668px) {
        flex: 0 1 40%;
      }
    }
  }
  .bottom {
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding-top: 0.3rem;
    button {
      width: 5.8rem;
      @include button;
    }
    .test {
      margin-top: 0.3rem;
    }
  }
}
</style>