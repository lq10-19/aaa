<template>
  <div class="page">
    <div class="section">
      <div class="beCareful">车辆信息</div>
      <div class="form">
        <van-cell-group>
          <van-field
            label="车架号"
            placeholder="请选择车架号"
            v-model.trim="carInfo.carFrame"
            disabled
            is-link
            @click="showFrameList"
          />
        </van-cell-group>
        <van-field
          label="发动机号"
          :placeholder="massge1"
          v-model.trim="carInfo.engineNumber"
          :disabled="disabled1"
          clearable
          center
        />
        <van-field
          label="车牌号"
          :placeholder="massge"
          v-model.trim="carInfo.carNumber"
          :disabled="disabled"
          clearable
          center
        />
        <van-field
          label="车型型号"
          placeholder="请选择车架号"
          v-model.trim="carInfo.carType"
          disabled
          type="textarea"
          clearable
          center
          class="carid"
        />
      </div>
    </div>

    <div class="bottom">
      <button @click="nextCheck">提交申请</button>
    </div>
    <MaskLoading :show="showLoading"></MaskLoading>
    <!-- 车架号 -->
    <van-popup v-model="showFrameNumber" position="bottom" :overlay="true">
      <van-picker
        show-toolbar
        title="车架号"
        :columns="frameList"
        @cancel="onCancel"
        @confirm="onConfirm"
        @change="onChange"
      />
    </van-popup>
  </div>
</template>

<script>
import PopupAddress from "@/components/PopupAddressBx.vue";
import { Toast, Popup, Picker, Button, Area } from "vant";
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
    MaskLoading,
    PopupAddress
  },
  data() {
    return {
      serialno: "",
      customerType: "",
      carInfo: {
        // carFrame: "", //车架号
        // engineNumber: "", //发动机号
        // carNumber: "", //车牌号
        // brandId: "", //品牌id
        // seriesId: "", //系列id
        // typeId: "", //款式id
        // carBrand: "", //品牌名称
        // carSeries: "", //系列名称
        // carType: "" //款式名称
      },
      frameNumberList: [
        // {
        //   carFrame: "123", //车架号
        //   engineNumber: "123", //发动机号
        //   carNumber: "123", //车牌号
        //   brandId: "", //品牌id
        //   seriesId: "", //系列id
        //   typeId: "", //款式id
        //   carBrand: "", //品牌名称
        //   carSeries: "", //系列名称
        //   carType: "baoma" //款式名称
        // },
        // {
        //   carFrame: "987", //车架号
        //   engineNumber: "987", //发动机号
        //   carNumber: "987", //车牌号
        //   brandId: "", //品牌id
        //   seriesId: "", //系列id
        //   typeId: "", //款式id
        //   carBrand: "", //品牌名称
        //   carSeries: "", //系列名称
        //   carType: "mm" //款式名称
        // }
      ],
      showFrameNumber: false,
      frameList: [],
      showLoading: false,
      disabled: true,
      disabled1: true,
      massge: "请输入车牌号",
      massge1: "请输入发动机号"
    };
  },
  // beforeRouteLeave(to, from, next) {
  //   if (to.name !== "applySuccess") {
  //     storeRemove("myInfo");
  //     console.log("返回");
  //   } else {
  //     console.log("是");
  //   }
  //   next();
  // },
  created() {
    if (storeGet("serialno")) {
      this.serialno = storeGet("serialno");
    }
    if (storeGet("customerType")) {
      this.customerType = storeGet("customerType");
    }
    if (storeGet("carInfo")) {
      this.carInfo = storeGet("carInfo");
    }
    //获取车辆信息
    this.getCarFrameInfo();
    //this.carInfo.carType = "杀戮空间的卢萨卡到家了萨建档立卡撒讲道理萨克讲道理萨克点击萨拉肯德基萨拉克的就撒来看待家里看到家里看到家里肯德基萨拉丁卡家里看到爱讲道理卡建档立卡加上道路"
  },
  mounted() {},
  methods: {
    //获取车辆信息
    getCarFrameInfo() {
      let url = "car/getCarFrameInfo";
      let customerType = "03";
      // if (this.customerType == "个人") {
      //   customerType = "03";
      // } else {
      //   customerType = "05";
      // }
      let list = [];
      if (storeGet("list")) {
        list = storeGet("list");
      }
      let param = {
        serialno: this.serialno,
        customerType,
        list
      };
      this.$requestBx
        .post(url, param)
        .then(res => {
          if (res.code == 200) {
            if (res.data.length > 0) {
              this.frameNumberList = res.data;
              res.data.forEach(element => {
                this.frameList.push(element.carFrame);
              });
              this.carInfo = res.data[0];
              if (!this.carInfo.carNumber) {
                this.disabled = false;
                this.massge = "请输入车牌号";
              } else {
                this.disabled = true;
                this.massge = "请输入车牌号";
              }
              if (!this.carInfo.engineNumber) {
                this.disabled1 = false;
                this.massge1 = "请输入发动机号";
              } else {
                this.disabled1 = true;
                this.massge1 = "请输入发动机号";
              }
            }
          } else {
            Toast(`${res.message}`);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //打开车架号
    showFrameList() {
      this.showFrameNumber = true;
    },
    onChange(picker, value, index) {
      // console.log(picker, value, index);
      // this.carInfo.carFrame = value;
    },
    onConfirm(picker, value, index) {
      console.log(picker, value, index);
      this.carInfo.carFrame = picker;
      this.showFrameNumber = false;
      this.carInfo = this.frameNumberList[value];
      if (!this.carInfo.carNumber) {
        this.disabled = false;
        this.massge = "请输入车牌号";
      } else {
        this.disabled = true;
        this.massge = "请输入车牌号";
      }
      if (!this.carInfo.engineNumber) {
        this.disabled1 = false;
        this.massge1 = "请输入发动机号";
      } else {
        this.disabled1 = true;
        this.massge1 = "请输入发动机号";
      }
    },
    onCancel() {
      this.showFrameNumber = false;
    },
    //下一步
    nextCheck() {
      if (!this.carInfo.carFrame) {
        Toast("请选择车架号");
        return;
      }
      if (!this.carInfo.engineNumber) {
        Toast("请输入发动机号");
        return;
      }
      if (!this.carInfo.carNumber) {
        Toast("请输入车牌号");
        return;
      }
      this.next();
    },
    next() {
      storeSet(this.carInfo, "carInfo");
      this.showLoading = true;
      let url = "submit/contractCar";
      let param = this.carInfo;
      param.serialno = this.serialno;
      //param.serialno = "1618018748";
      this.$requestBx
        .post(url, param)
        .then(res => {
          this.showLoading = false;
          if (res.code == 200) {
            //Toast("提交申请成功");
            this.$router.push({
              path: "/applySuccess",
              query: {}
            });
          } else {
            Toast(`${res.message}`);
          }
        })
        .catch(error => {
          this.showLoading = false;
          console.log("error" + error);
        });
    }
  },
  beforeDestroy() {
    storeSet(this.carInfo, "carInfo");
  }
};
</script>
<style lang="scss" scoped>
.page {
  flex-direction: column;
  .section {
    .beCareful {
      line-height: 0.8rem;
    }
    &.driving {
      flex: 0 0 28%;
      .img-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: white;
        img {
          margin-top: 0.3rem;
          width: 2.9rem;
          height: 2rem;
        }
        .button {
          background: none;
          background-color: white;
          color: #ffd11a;
          margin-top: 0.2rem;
          margin-bottom: 0.2rem;
          width: 6.18rem;
          height: 0.56rem;
          border: 0.02rem solid rgba(255, 209, 26, 1);
          border-radius: 0.27rem;
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
    padding-top: 0.8rem;
    button {
      width: 5.8rem;
      @include button;
    }
    .test {
      margin-top: 0.3rem;
    }
  }
}
.selectRight {
  text-align: left;
}
.idCardBtn {
  width: 6.18rem;
  margin: 0.5rem auto;
  background: #fff;
  font-size: 0.32rem;
  font-weight: 500;
}
.form {
  background: #fff;
  .van-cell::v-deep {
    .van-field__label {
      width: 2.5rem;
      text-align: left;
      margin-right: 0.2rem;
      color: #666;
      font-size: 0.3rem;
      line-height: 0.3rem;
      padding: 0.1rem 0;
    }
    .van-cell__value {
      .van-field__body {
        .van-field__control {
          color: #000;
          font-size: 0.3rem;
          line-height: 0.3rem;
          padding: 0.1rem 0;
        }
        // .van-field__control::placeholder {
        //   //color: #000;
        // }
      }
    }
  }
  .tips {
    text-align: left;
    font-size: 0.32rem;
    height: 0.8rem;
    line-height: 0.8rem;
    margin-bottom: 0.2rem;
    margin-left: 0.3rem;
    font-weight: 500;
  }
}
.form::v-deep {
  .address {
    .van-cell {
      font-size: 0.3rem;
      .van-cell__title {
        width: 2.5rem;
        color: #666;
      }
      .van-field__control:disabled {
        color: #000;
      }
      // .van-field__control::placeholder {
      //   //color: #000;
      // }
    }
  }
  .van-button--info {
    color: #ffcc00;
    border: 1px solid #ffcc00;
  }
  .carid {
    textarea {
      // display: block;
      // overflow: hidden;
      //text-overflow: ellipsis;
      //white-space: nowrap;
      line-height: 0.5rem !important;
      height: 100%;
    }
  }
}
</style>