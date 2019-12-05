<template>
  <div class="bigBox">
    <ul v-if="flag">
      <li class="item" v-for="(item,i) in orderList" :key="i" @click="getSubStatus(item)">
        <div class="msg">
          <p class="idCard">
            合同号：
            <span>{{item.contractNo}}</span>
          </p>
          <p class="time">
            申请时间：
            <span>{{item.appDate}}</span>
          </p>
        </div>
        <div class="state">
          <span>{{item.contractStatusName}}</span>
          <p v-if="item.applicationStatus=='30'">继续申请</p>
        </div>
      </li>
    </ul>

    <div class="bigbox" v-if="!flag">
      <img class="nullImg" src="../../assets/img/wu@2x.png" />
      <p class="nullTxt">暂时没有订单~</p>
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
  storeRemove,
  JGEvent
} from "@/utils/common.js";
export default {
  metaInfo: {
    title: "车抵贷订单"
  },
  components: {},
  data() {
    return {
      mobile: "",
      flag: false, //默认没有合同
      orderList: []
    };
  },
  created() {
    this.mobile = this.$route.query.mobile;
    this.getGoodsList();
  },
  mounted() {},
  methods: {
    // 获取订单列表
    getGoodsList() {
      this.$request
        .get("loanApplicationInfo/getListByMobile?mobile=" + this.mobile)
        .then(res => {
          if (res.code == "200") {
            if (res.data && res.data.length > 0) {
              this.flag = true;
            }
            this.orderList = res.data;
            this.orderList.forEach((v, i) => {
              v.appDate = v.appDate.replace(/\//g, "-");
            });
          }
        })
        .catch(error => {
          console.log("error" + error);
        });
    },
    //判断订单状态
    getSubStatus(item) {
      if (item.applicationStatus == "30") {
        this.goContinue(item);
      } else {
        this.goOrderDetails(item);
      }
    },
    //合同详情
    goOrderDetails(item) {
      JGEvent("see-contract-details");
      this.$router.push({
        path: "/orderDetails",
        query: {
          contractNo: item.contractNo,
          contractStatusName: item.contractStatusName,
          appDate: item.appDate,
          subStatus: item.subStatus
        }
      });
    },
    //继续申请
    goContinue(item) {
      JGEvent("see-contract-details");
      this.$router.push({
        path: "/continue",
        query: {
          applicationId: item.applicationId, //订单号
          contractNo: item.contractNo, //合同号
          contractStatusName: item.contractStatusName,
          appDate: item.appDate
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.bigBox {
  ul {
    width: 7.1rem;
    margin: 0.1rem auto;
    li {
      padding: 0.25rem;
      height: 1.08rem;
      margin: 0.2rem auto;
      border-radius: 0.25rem;
      background: #fff;
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      font-size: 0.3rem;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 0.55rem;
      .msg {
        text-align: left;
      }
      .state {
        span {
          display: inline-block;
          background: rgba(255, 244, 186, 1);
          border: 0.02rem solid rgba(255, 192, 0, 1);
          border-radius: 0.27rem;
          width: 2.3rem;
          height: 0.54rem;
          text-align: center;
          line-height: 0.54rem;
        }
        p {
          font-size: 0.28rem;
          font-weight: 500;
          color: rgba(255, 193, 7, 1);
          line-height: 0.56rem;
        }
      }
    }
  }
  .bigbox {
    position: absolute;
    width: 100%;
    font-size: 0.28rem;
    background: #f2f3f5;
    .nullImg {
      width: 3rem;
      height: 2rem;
      display: block;
      margin: 0 auto;
      margin-top: 3rem;
    }
    .nullTxt {
      width: 50%;
      margin: 0 auto;
      margin-top: 0.5rem;
      text-align: center;
      color: rgba(208, 208, 208, 1);
      font-size: 0.3rem;
    }
  }
}
</style>