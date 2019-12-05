<template>
  <div class="bigBox">
    <div class="form">
      <div class="title">车辆信息</div>
      <ul>
        <li class="item">
          <span class="key">车架号</span>
          <span class="value">{{carInfo.carVin}}</span>
        </li>
        <li class="item">
          <span class="key">车型</span>
          <span class="value">{{carInfo.carType}}</span>
        </li>
        <li class="item">
          <span class="key">车辆出厂日期</span>
          <span class="value">{{carInfo.productionDate}}</span>
        </li>
        <li class="item">
          <span class="key">车辆登记日期</span>
          <span class="value">{{carInfo.registerDate}}</span>
        </li>
        <li class="item">
          <span class="key">车辆颜色</span>
          <span class="value">{{carInfo.carColor}}</span>
        </li>
        <li class="item">
          <span class="key">过户次数</span>
          <span class="value">{{carInfo.transferTimes}}</span>
        </li>
      </ul>
    </div>

    <div class="form">
      <div class="title">贷款信息</div>
      <ul>
        <li class="item">
          <span class="key">贷款金额</span>
          <span class="value">{{applicationInfo.loanAmount}}元</span>
        </li>
        <li class="item">
          <span class="key">贷款期数</span>
          <span class="value">{{applicationInfo.loanPeriods}}期</span>
        </li>
        <li class="item">
          <span class="key">月供</span>
          <span class="value">{{applicationInfo.monthPayment}}元</span>
        </li>
      </ul>
    </div>
  </div>
</template>


<script>
import { Toast } from "vant";
import {
  randomWord,
  formatJson,
  storeGet,
  storeSet,
  storeRemove
} from "@/utils/common.js";
export default {
  metaInfo: {
    title: "贷款信息"
  },
  components: {},
  data() {
    return {
      contractNo: "",
      carInfo: null, //车辆信息
      applicationInfo: null //贷款信息取值
    };
  },
  created() {
    this.contractNo = this.$route.query.contractNo;
    this.getContractNoInfo();
  },
  mounted() {},
  methods: {
    // 获取合同详情
    getContractNoInfo() {
      this.$request
        .get("loanApplicationInfo/getDetail?contractNo=" + this.contractNo)
        .then(res => {
          if (res.code == "200") {
            this.carInfo = res.data.carInfo;
            this.applicationInfo = res.data.applicationInfo;
            //console.log(this.contractNoInfo);
          }
        })
        .catch(error => {
          console.log("error" + error);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.bigBox {
  font-size: 0.32rem;
  font-family: PingFangSC-Regular;
  font-weight: 400;

  .form {
    width: 100%;
    .title {
      margin-left: 0.3rem;
      color: rgba(136, 136, 136, 1);
      font-size: 0.28rem;
      line-height: 1rem;
      text-align: left;
    }
    ul {
      width: 100%;

      .item {
        width: 100%;
        height: 1rem;
        background: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid $bg-color;

        .key {
          line-height: 1rem;
          margin-left: 0.3rem;
          text-align: left;
          color: rgba(102, 102, 102, 1);
        }
        .value {
          width: 4rem;
          text-align: right;
          margin-right: 0.3rem;
          line-height: 0.35rem;
          color: rgba(0, 0, 0, 1);
          // overflow: hidden;
          // text-overflow: ellipsis;
          // white-space: nowrap;
        }
      }
    }
  }
}
</style>