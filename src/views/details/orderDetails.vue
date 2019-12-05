<template>
  <div class="bigBox">
    <div class="state">
      <div class="stateName">
        <p>
          订单状态
          <span>{{contractStatusName}}</span>
        </p>
      </div>
      <div class="appliMsg">
        <p>
          <span class="key">申请人姓名</span>
          <span class="value">{{name}}</span>
        </p>
        <p>
          <span class="key">合同号</span>
          <span class="value">{{contractNo}}</span>
        </p>
        <p>
          <span class="key">申请时间</span>
          <span class="value">{{appDate}}</span>
        </p>
      </div>
    </div>
    <div class="information">
      <div class="form">
        <ul>
          <li class="item" @click="goLoanMsg">
            <span class="text">贷款信息</span>
            <img src="../../assets/img/goback@2x.png" />
          </li>
          <li class="item" @click="goApplicantMsg">
            <span class="text">申请人信息</span>
            <img src="../../assets/img/goback@2x.png" />
          </li>
          <li class="item" @click="goContactsMsg">
            <span class="text">{{haveSpouse?"配偶":"联系人"}}信息</span>
            <img src="../../assets/img/goback@2x.png" />
          </li>
          <li class="item" @click="goEnclosureMsg">
            <span class="text">附件信息</span>
            <img src="../../assets/img/goback@2x.png" />
          </li>
        </ul>
      </div>
    </div>
    <button
      @click="cancel"
      v-if="(subStatus=='070030')||(subStatus=='070040')||(subStatus=='240010')"
    >取消订单</button>
    <!-- <button @click="cancel">取消订单</button> -->
  </div>
</template>

<script>
import Vue from "vue";
import { Toast, Dialog } from "vant";
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
    title: "订单详情"
  },
  components: {},
  data() {
    return {
      contractNo: "",
      contractStatusName: null,
      subStatus: null,
      contractNoInfo: null,
      name: null,
      mobile: "",
      applicationId: "",
      haveSpouse: false
    };
  },
  created() {
    this.contractNo = this.$route.query.contractNo;
    this.contractStatusName = this.$route.query.contractStatusName;
    this.appDate = this.$route.query.appDate;
    this.subStatus = this.$route.query.subStatus;
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
            this.contractNoInfo = res.data;
            //console.log(this.contractNoInfo);
            this.name = this.contractNoInfo.personInfo.name;
            this.mobile = this.contractNoInfo.personInfo.mobile;
            this.applicationId = this.contractNoInfo.applicationInfo.applicationId;
            // console.log("aaa", this.applicationId, this.mobile);
            // console.log("aaa2",res.data.spouseInfo)
            if (res.data.spouseInfo) {
              //console.log("yes");
              this.haveSpouse = true;
            } else {
              //console.log("no");
              this.haveSpouse = false;
            }
          }
        })
        .catch(error => {
          console.log("error" + error);
        });
    },
    //取消订单
    cancel() {
      let _this = this;
      Dialog.confirm({
        message: "确定取消这笔车抵贷申请吗？",
        beforeClose
      })
        .then(res => console.log(res))
        .catch(e => console.log(e));
      function beforeClose(action, done) {
        if (action === "confirm") {
          setTimeout(done, 1000);
          setTimeout(_this.cancelFun, 2000);
        } else {
          done();
        }
      }
    },
    //取消订单
    cancelFun() {
      JGEvent("cancellation-order");
      //console.log(this);
      this.$request
        .get("loanApplicationInfo/cancel?applicationId=" + this.applicationId)
        .then(res => {
          if (res.code == "200") {
            this.$router.push({
              path: "/orderList",
              query: { mobile: this.mobile }
            });
          }
        })
        .catch(error => {
          console.log("error" + error);
        });
    },
    //贷款信息
    goLoanMsg() {
      this.$router.push({
        path: "/loanMsg",
        query: { contractNo: this.contractNo }
      });
    },
    //申请人信息
    goApplicantMsg() {
      this.$router.push({
        path: "/applicantMsg",
        query: { contractNo: this.contractNo }
      });
    },
    //联系人信息
    goContactsMsg() {
      this.$router.push({
        path: "/contactsMsg",
        query: { contractNo: this.contractNo }
      });
    },
    //附件信息
    goEnclosureMsg() {
      this.$router.push({
        path: "/enclosureMsg",
        query: { contractNo: this.contractNo }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.bigBox {
  .state {
    margin: 0.2rem auto;
    height: 3.66rem;
    width: 100%;
    background-color: #fff;
    .stateName {
      height: 1.22rem;
      font-size: 0.34rem;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(0, 0, 0, 1);
      line-height: 1.22rem;
      border-bottom: 0.01rem solid rgba(243, 243, 243, 1);
      p {
        margin-left: 0.3rem;
        text-align: left;
        position: relative;
        span {
          display: inline-block;
          position: absolute;
          right: 0.3rem;
          top: 0.33rem;
          width: 2.5rem;
          height: 0.54rem;
          background: rgba(255, 244, 186, 1);
          border: 0.02rem solid rgba(255, 193, 0, 1);
          border-radius: 0.27rem;
          line-height: 0.54rem;
          text-align: center;
        }
      }
    }
    .appliMsg {
      font-size: 0.3rem;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      p {
        height: 0.8rem;
        line-height: 0.8rem;
        position: relative;
        .key {
          position: absolute;
          left: 0.5rem;
        }
        .value {
          position: absolute;
          right: 0.3rem;
        }
      }
    }
  }
  .information {
    .form {
      width: 100%;

      ul {
        width: 100%;

        .item {
          width: 100%;
          height: 1rem;
          line-height: 1rem;
          background: #fff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid $bg-color;

          .text {
            width: 2rem;
            margin-left: 0.3rem;
            text-align: left;
            font-size: 0.32rem;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(0, 0, 0, 1);
          }
          img {
            width: 0.12rem;
            height: 0.22rem;
            margin-right: 0.3rem;
          }
        }
      }
    }
  }
}
button {
  margin-top: 0.8rem;
  width: 5.8rem;
  @include button;
}
</style>