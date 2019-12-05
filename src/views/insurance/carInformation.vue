<template>
  <div class="bigBox">
    <div class="form">
      <div class="title">车辆信息</div>
      <ul>
        <li class="item">
          <span class="key">车架号</span>
          <span class="value">{{carMsg.carFrame}}</span>
        </li>
        <li class="item">
          <span class="key">发动机号</span>
          <span class="value">{{carMsg.engineNumber}}</span>
        </li>
        <li class="item">
          <span class="key">车牌号</span>
          <span class="value">{{carMsg.carNumber}}</span>
        </li>
        <li class="item">
          <span class="key">车辆型号</span>
          <span class="value">{{carMsg.carType}}</span>
        </li>
      </ul>
    </div>

    <div class="form">
      <div class="title">保险信息</div>
      <ul>
        <li class="item">
          <span class="key">保险种类</span>
          <span class="value checkbox">
            <van-checkbox v-model="checked1" disabled>商业险</van-checkbox>
            <van-checkbox v-model="checked2" disabled v-if="financingMsg.clivtaInsuredAmount!=0">交强险</van-checkbox>
          </span>
        </li>
        <li class="item">
          <span class="key">商业险投保金额</span>
          <span class="value">￥{{financingMsg.viInsuredAmount}}</span>
        </li>
        <!-- <li class="item">
          <span class="key">商业险融资金额</span>
          <span class="value">20000</span>
        </li>-->
        <li class="item" v-if="financingMsg.clivtaInsuredAmount!=0">
          <span class="key">交强险投保金额</span>
          <span class="value">￥{{financingMsg.clivtaInsuredAmount}}</span>
        </li>
        <!-- <li class="item">
          <span class="key">交强险融资金额</span>
          <span class="value">20000</span>
        </li>-->
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
  metaInfo() {
    return {
      title: "车辆&保险信息"
    };
  },
  components: {},
  data() {
    return {
      serialno: "",
      checked1: true,
      checked2: true,
      carMsg: {},
      financingMsg: {}
    };
  },
  created() {
    if (this.$route.query.serialno) {
      this.serialno = this.$route.query.serialno;
    }
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
            this.carMsg = res.data.insuranceInfo;
            this.financingMsg.viInsuredAmount = this.numFilter(
              res.data.insuranceInfo.viInsuredAmount
            );
            this.financingMsg.clivtaInsuredAmount = this.numFilter(
              res.data.insuranceInfo.clivtaInsuredAmount
            );
            if (res.data.insuranceInfo.insType == "01") {
              this.checked2 = false;
            } else {
              this.checked2 = true;
            }
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
        height: 100%;
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
          line-height: 0.4rem;
          color: rgba(0, 0, 0, 1);
          // overflow: hidden;
          // text-overflow: ellipsis;
          // white-space: nowrap;
        }
        .checkbox {
          display: flex;
          justify-content: space-around;
        }
      }
    }
  }
}
</style>