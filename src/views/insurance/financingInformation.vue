<template>
  <div class="bigBox">
    <!-- 分期信息 -->
    <div class="form">
      <div class="title">分期信息</div>
      <ul>
        <li class="item">
          <span class="key">分期期限</span>
          <span class="value">{{financingInfo.term}}期</span>
        </li>
        <li class="item">
          <span class="key">首付比例</span>
          <span class="value">{{showInfo.paymentrate}}</span>
        </li>
        <li class="item" v-if="insType=='01,02'&&BX02">
          <span class="key">保证金比例</span>
          <span class="value">{{showInfo.bondRate}}</span>
        </li>
      </ul>
    </div>
    <!-- 融资信息 -->
    <div class="form">
      <div class="title">融资信息</div>
      <ul>
        <li class="item">
          <span class="key">投保总金额</span>
          <span class="value">￥{{showInfo.insuredTotalAmount}}</span>
        </li>
        <li class="item">
          <span class="key">融资金额</span>
          <span class="value">￥{{showInfo.businessSum}}</span>
        </li>
        <div class="tips">
          <p>
            <span></span>
            商业险融资金额&emsp;{{showInfo.viFinAmount}} 元
          </p>
          <p v-if="insType=='01,02'">
            <span></span>
            交强险融资金额&emsp;{{showInfo.clivtaFinAmount}} 元
          </p>
        </div>
        <li class="item" v-if="insType!=''">
          <span class="key">保险服务费</span>
          <span class="value">￥{{showInfo.insuranceService}}</span>
        </li>
      </ul>
    </div>
    <!-- 合同明细 -->
    <div class="form">
      <div class="title">合同明细</div>
      <ul>
        <li class="item">
          <span class="key">首付金额</span>
          <span class="value">￥{{showInfo.paymentSum}}</span>
        </li>
        <li class="item" v-if="insType=='01,02'&&BX02">
          <span class="key">保险保证金</span>
          <span class="value">￥{{showInfo.insuranceBondRate}}</span>
        </li>
        <li class="item">
          <span class="key">自付保费差额</span>
          <span class="value">￥{{showInfo.insuranceNalance}}</span>
        </li>
        <li class="item">
          <span class="key">每月还款金额</span>
          <span class="value">￥{{showInfo.monthrepayment}}</span>
        </li>
      </ul>
    </div>
    <!-- 首付费用 -->
    <div class="form">
      <div class="title">首付费用</div>
      <ul>
        <li class="item">
          <span class="key">首付款项</span>
          <span class="value">￥{{showInfo.firstPayment}}</span>
        </li>
      </ul>
    </div>
    <div style="width:100%;height:2rem;"></div>
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
  metaInfo() {
    return {
      title: "融资信息"
    };
  },
  components: {},
  data() {
    return {
      serialno: "",
      financingInfo: {
        // businessCalculateLoan: {
        //   serialno: null,
        //   paymentrate: 10,
        //   bondRate: null,
        //   insuredTotalAmount: 0,
        //   insuranceService: null,
        //   insuranceBondRate: null,
        //   insuranceNalance: null,
        //   paymentSum: 5000,
        //   term: "10",
        //   viFinAmount: null,
        //   clivtaFinAmount: null,
        //   insFinAmount: null,
        //   businessSum: 45000,
        //   firstPayment: null,
        //   monthrepayment: 4572.5,
        //   typeName: null,
        //   typeNo: null,
        //   feeList: null,
        //   loansum: null,
        //   feeValueMap: null,
        //   termList: null
        // }
      },
      showInfo: {},
      insType: "",
      BX02: false
    };
  },
  created() {
    if (this.$route.query.serialno) {
      this.serialno = this.$route.query.serialno;
    }
    //this.getContractNoInfo();
    //查询合同详情
    this.queryAppyDetail();
  },
  mounted() {},
  methods: {
    //查询合同详情
    queryAppyDetail() {
      let url = `CustomerInfoController/queryAppyDetail?serialno=${this.serialno}`;
      return this.$requestBx
        .get(url)
        .then(res => {
          if (res.code == 200) {
            this.financingInfo = res.data.businessCalculateLoan;
            this.insType = res.data.insuranceInfo.insType;
            if (res.data.businessCalculateLoan.feeList.length > 0) {
              res.data.businessCalculateLoan.feeList.forEach(element => {
                if (element.termid == "BX02") {
                  this.BX02 = true;
                }
              });
            }
            //数据格式化展示
            this.showInfo.paymentrate = this.financingInfo.paymentrate + "%";
            this.showInfo.bondRate = this.financingInfo.bondRate + "%";
            this.showInfo.insuredTotalAmount = this.numFilter(
              this.financingInfo.insuredTotalAmount
            );
            this.showInfo.businessSum = this.numFilter(
              this.financingInfo.businessSum
            );
            this.showInfo.viFinAmount = this.numFilter(
              this.financingInfo.viFinAmount
            );
            this.showInfo.clivtaFinAmount = this.numFilter(
              this.financingInfo.clivtaFinAmount
            );
            this.showInfo.insuranceService = this.numFilter(
              this.financingInfo.insuranceService
            );
            this.showInfo.paymentSum = this.numFilter(
              this.financingInfo.paymentSum
            );
            this.showInfo.insuranceBondRate = this.numFilter(
              this.financingInfo.insuranceBondRate
            );
            this.showInfo.insuranceNalance = this.numFilter(
              this.financingInfo.insuranceNalance
            );
            this.showInfo.monthrepayment = this.numFilter(
              this.financingInfo.monthrepayment
            );
            this.showInfo.firstPayment = this.numFilter(
              this.financingInfo.firstPayment
            );
          } else {
            Toast(`${res.message}`);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    numFilter(num) {
      if (num) {
        let realVal = parseFloat(num).toFixed(2);
        return realVal;
      } else {
        return "0";
      }
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
      .tips {
        padding-top: 0.2rem;
        padding-bottom: 0.2rem;
        //height: 1rem;
        //background: rgba(242, 245, 251, 1);
        background: #fff;
        p {
          margin: auto 0.35rem;
          text-align: left;
          line-height: 0.5rem;
          height: 0.5rem;
          font-size: 0.26rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(105, 118, 170, 1);
          span {
            margin-right: 0.1rem;
            margin-bottom: 0.05rem;
            display: inline-block;
            width: 0.1rem;
            height: 0.1rem;
            background: rgba(105, 118, 170, 1);
            border-radius: 50%;
          }
        }
      }
    }
  }
}
</style>