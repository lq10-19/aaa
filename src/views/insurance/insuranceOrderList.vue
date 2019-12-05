<template>
  <div class="bigBox">
    <ul v-if="flag">
      <li class="item" v-for="(item,i) in orderList" :key="i" @click="goOrderDetails(item)">
        <div class="msg">
          <p class="idCard">
            合同号：
            <span>{{item.serialno}}</span>
          </p>
          <span class="state" v-if="item.contractstatus2!='060020'">{{item.contractstatusName}}</span>
          <span class="state" v-if="item.contractstatus2=='060020'">继续申请</span>
        </div>
        <div class="msg2">
          <p class="money">
            申请金额：
            <span>{{item.businesssum}}</span>
          </p>
          <p class="time">
            申请时间：
            <span>{{item.inputdate}}</span>
          </p>
        </div>
      </li>
    </ul>

    <div class="bigbox" v-if="!flag">
      <img class="nullImg" src="../../assets/img/wu@2x.png" />
      <p class="nullTxt">暂时没有订单~</p>
    </div>
    <MaskLoading :show="showLoading"></MaskLoading>
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
import MaskLoading from "@/components/MaskLoading.vue";
export default {
  metaInfo() {
    return {
      title: "保险分期订单"
    };
  },
  components: {
    MaskLoading
  },
  data() {
    return {
      userId: "",
      customerId: "",
      flag: true, //默认没有合同
      orderList: [
        // {
        //   serialno: 123456789,
        //   inputdate: "2019-10-1",
        //   contractstatus2Name: "审核通过",
        //   contractstatus2: "",
        //   businesssum: 10000
        // }
      ],
      showLoading: false
    };
  },
  created() {
    if (this.$route.query.customerId) {
      this.customerId = this.$route.query.customerId;
    }
    if (this.$route.query.userId) {
      this.userId = this.$route.query.userId;
      storeSet(this.$route.query.userId, "userId");
    }
    if (this.$route.query.userType) {
      storeSet(this.$route.query.userType, "userType");
    }
    if (storeGet("userId")) {
      this.userId = storeGet("userId");
    }
    //获取订单列表
    this.contractList();
  },
  mounted() {},
  methods: {
    //获取订单列表
    contractList() {
      this.showLoading = true;
      let url = "query/contractList";
      let param = {
        accountUserId: this.userId,
        //accountUserId: "15b4e70dade74074a68bde9dc8960a3a",
        //accountUserId: "e1d82862724e465ca4d01aa2a65865fc",
        //accountUserId: "6b22d15322e3477e866f0aff3284bcaf",
        userType: storeGet("userType")
        //userType: "1"
      };
      this.$requestBx
        .post(url, param)
        .then(res => {
          this.showLoading = false;
          if (res.code == "200") {
            if (res.data.length > 0) {
              this.flag = true;
              this.orderList = res.data;
            } else {
              this.flag = false;
            }
          } else {
            Toast(`${res.message}`);
          }
        })
        .catch(error => {
          this.showLoading = false;
          console.log("error" + error);
        });
    },
    //合同详情
    goOrderDetails(item) {
      if (item.contractstatus2 == "060020") {
        storeSet(item, "continueApply");
        this.$router.push({
          path: "/carInsuranceApply",
          query: {
            userId: this.userId,
            userType: storeGet("userType")
          }
        });
      } else {
        this.$router.push({
          path: "/insuranceOrderDetails",
          query: {
            serialno: item.serialno,
            contractstatusName: item.contractstatusName
          }
        });
      }
    }
    //继续申请
    // goContinue(item) {
    //   JGEvent("see-contract-details");
    //   this.$router.push({
    //     path: "/continue",
    //     query: {
    //       contractstatus2: item.contractstatus2,
    //       serialno: item.serialno,
    //       contractstatus2Name: item.contractstatus2Name,
    //       inputdate: item.inputdate
    //     }
    //   });
    // }
  }
};
</script>
<style lang="scss" scoped>
.bigBox {
  font-family: PingFang SC;
  padding-bottom: 1rem;
  ul {
    width: 7.1rem;
    margin: 0.1rem auto;
    li {
      padding: 0.25rem;
      height: 2.08rem;
      margin: 0.2rem auto;
      border-radius: 0.25rem;
      background: #fff;
      font-size: 0.3rem;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 0.55rem;
      .msg {
        text-align: left;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        .idCard {
          color: rgba(51, 51, 51, 1);
          font-size: 0.32rem;
          font-weight: 500;
        }
        .state {
          display: inline-block;
          background: rgba(255, 244, 186, 1);
          border: 0.02rem solid rgba(255, 192, 0, 1);
          border-radius: 0.27rem;
          width: 2.3rem;
          height: 0.54rem;
          text-align: center;
          font-size: 0.3rem;
          line-height: 0.54rem;
        }
      }
      .msg2 {
        border-top: 0.01rem solid rgba(221, 221, 221, 1);
        margin-top: 0.2rem;
        padding-top: 0.2rem;
        color: #666666;
        p {
          color: rgba(102, 102, 102, 1);
          font-size: 0.3rem;
          font-weight: 500;
          line-height: 0.6rem;
          text-align: left;
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