<template>
  <div class="page">
    <div class="section">
      <div class="img-wrapper">
        <p class="p1">根据您的车辆估值，您的贷款额度上限为</p>
        <p class="p2">¥ {{this.info.loanMaxSum}}</p>
      </div>
      <div class="money">
        <p class="title">申请贷款金额</p>
        <div class="input-wrapper">
          <span>￥</span>
          <van-field
            v-model.trim="loanSum"
            placeholder="请输入您希望的贷款金额"
            right-icon="replay"
            @blur="onChange"
            @click-right-icon="onChange"
          />
        </div>
      </div>
      <div class="plan">
        <p class="title">分期方案选择</p>
        <div class="plan-list">
          <div class="header">
            <div class="item">每月还款额</div>
            <div class="item">分期期数</div>
          </div>
          <div class="row">
            <div class="item">{{monthrepayment}}元</div>
            <div class="item term">
              <!-- <van-dropdown-menu>
                <van-dropdown-item v-model="selectOption" :options="options" @change="onChange"/>
              </van-dropdown-menu>-->
              <van-field
                class="term"
                v-model="selectOption"
                @click="onClick"
                right-icon="arrow-down"
                disabled
              />
              <van-popup v-model="isShowPopup" position="bottom">
                <van-picker
                  show-toolbar
                  title="分期数"
                  :columns="options"
                  @confirm="onConfirm"
                  @cancel="onCancel"
                />
              </van-popup>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <button @click="nextCheck">下一步</button>
      </div>
      <MaskLoading :show="showLoading"></MaskLoading>
    </div>
  </div>
</template>

<script>
import { Toast, Dialog } from "vant";
import { storeGet, storeSet, storeRemove } from "@/utils/common.js";
import MaskLoading from "@/components/MaskLoading.vue";
import PopupPicker from "@/components/PopupPicker.vue";
let start = null;
export default {
  metaInfo: {
    title: "确认贷款方案"
  },
  components: {
    MaskLoading,
    PopupPicker
  },
  data() {
    return {
      isShowPopup: false,
      showLoading: false,
      info: {},
      options: [],
      selectOption: null,
      monthrepayment: null,
      loanSum: 0,
      lastLoanSum: 0,
      contractNo: null,
      applicationId: null
    };
  },
  created() {},
  mounted() {
    this.getResult();
  },
  methods: {
    async getResult() {
      const url = "continue/apply";
      const query = this.$route.query;
      const applicationId = query.applicationId;
      const contractNo = query.contractNo;
      if (!applicationId || !contractNo) {
        Toast("无效的申请");
        return;
      }
      this.contractNo = contractNo;
      this.applicationId = applicationId;
      try {
        this.showLoading = true;
        const resp = await this.$request.post(url, {
          applicationId: applicationId,
          serialno: contractNo
        });
        this.info = resp.data;
        this.options = this.info.busConfigInfo.map(item => item.term);
        this.options = this.options.sort((a, b) => {
          return a-b;
        });
        this.selectOption = this.info.busConfigInfo.find(
          item => item.typeno == this.info.typeno
        ).term;
        this.monthrepayment = this.info.amountCalculateRes.monthrepayment;
        this.loanSum = this.info.loanMaxSum;
        this.lastLoanSum = this.info.loanMaxSum;
        const tempResp = await this.getDetail(contractNo);
        const tempDetail = tempResp.data;
        if (tempDetail.applicationInfo.loanAmount) {
          this.loanSum = tempDetail.applicationInfo.loanAmount;
          this.lastLoanSum = this.loanSum;
        }
      } catch (error) {
        console.error(error);
        if (error.data.code == "404") {
          Dialog.alert({
            title: "提示信息",
            message: "您的申请额度已过有效期,请重新申请"
          }).then(() => {
            this.$router.push({
              path: "carInfo"
            });
            storeRemove();
          });
        }
      } finally {
        this.showLoading = false;
      }
    },
    async onChange() {
      this.loanSum = parseFloat(this.loanSum);
      const temp = parseFloat(this.info.loanMinSum);
      if (this.loanSum < temp) {
        Toast(`金额不能小于${this.info.loanMinSum}`);
        return;
      }
      if (this.loanSum > this.info.loanMaxSum) {
        Toast(`金额不能大于${this.info.loanMaxSum}`);
        return;
      }
      this.lastLoanSum = this.loanSum;
      const item = this.info.busConfigInfo.find(
        item => item.term == this.selectOption
      );
      try {
        this.showLoading = true;
        const url = "/businessType/getInfo";
        const resp = await this.$request.post(url, {
          loanMaxSum: this.info.loanMaxSum,
          loanMinSum: this.info.loanMinSum,
          loanSum: this.loanSum,
          objectNo: this.contractNo,
          sort: item.sort,
          term: item.term,
          typeno: item.typeno,
          versionid: ""
        });
        this.info.amountCalculateRes = resp.data.amountCalculateRes;
        this.info.feeList = resp.data.feeList;
        this.info.loanMaxSum = resp.data.loanMaxSum;
        this.info.loanMinSum = resp.data.loanMinSum;
        this.info.paymentrate = resp.data.paymentrate;
        this.info.typeno = resp.data.typeno;
        this.monthrepayment = resp.data.amountCalculateRes.monthrepayment;
      } catch (error) {
        console.error(error);
      } finally {
        this.showLoading = false;
      }
    },
    async nextCheck() {
      if (this.lastLoanSum != this.loanSum) {
        this.onChange();
        return;
      }
      try {
        this.showLoading = true;
        const typeno = await this.next();
        await this.updateLoanAmount();
        this.$router.push({
          path: "replenish",
          query: {
            contractNo: this.contractNo,
            applicationId: this.applicationId,
            typeno: typeno
          }
        });
      } catch (error) {
        console.error(error);
      } finally {
        this.showLoading = false;
      }
    },
    async next() {
      const item = this.info.busConfigInfo.find(
        item => item.term == this.selectOption
      );
      const url = "submit/feeInfo";
      const data = {
        accountexpenses: "",
        actionCode: "1",
        applicationId: this.applicationId,
        applydate: "",
        businessSubmitTime: "",
        businesscurrency: "",
        businesssum: this.loanSum,
        contractStatus: "",
        contractStatus2: "",
        creditrate: this.info.amountCalculateRes.creditrate,
        creditrates: this.info.amountCalculateRes.creditrates,
        customerexpenses: "",
        feeList: this.info.feeList,
        finalrate: "",
        loanratetermid: "",
        loansum: "",
        monthrepayment: this.info.amountCalculateRes.monthrepayment,
        monthrepayment2: this.info.amountCalculateRes.monthrepayment2,
        paymentrate: this.info.paymentrate,
        paymentsum: this.info.amountCalculateRes.paymentsum,
        periods: item.term,
        planlastmoney: 0,
        reinforceFlag: "",
        repaymentmethod: "",
        rpttermid: "",
        serialno: this.contractNo,
        tempsaveflag: "",
        transFormFlag: "",
        typename: item.typename,
        typeno: item.typeno
      };
      const feeValueMap = this.info.amountCalculateRes.feeValueMap;
      data.feeList.forEach(item => {
        item.amount = feeValueMap[item.termid];
      });
      await this.$request.post(url, data);
      return item.typeno;
    },
    updateLoanAmount() {
      const url = "loanApplicationInfo/updateLoanAmount";
      const item = this.info.busConfigInfo.find(
        item => item.term == this.selectOption
      );
      const data = {
        applicationId: this.applicationId,
        loanAmount: this.loanSum,
        loanPeriods: item.term,
        monthPayment: this.info.amountCalculateRes.monthrepayment
      };
      return this.$request.post(url, data);
    },
    onClick() {
      this.isShowPopup = true;
    },
    onConfirm(value) {
      this.selectOption = value;
      this.onChange();
      this.isShowPopup = false;
    },
    onCancel() {
      this.isShowPopup = false;
    },
    getDetail(contractNo) {
      const url = "loanApplicationInfo/getDetail";
      return this.$request.get(url, {
        params: {
          contractNo
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.page {
  flex-direction: column;
  align-items: center;
  background-color: white;
  .section {
    display: flex;
    flex-direction: column;
    align-items: center;
    .img-wrapper {
      margin-top: 0.3rem;
      width: 6.7rem;
      height: 2.4rem;
      background-image: url(../../assets/img/bg.png);
      background-size: cover;
      .p1 {
        margin-top: 0.49rem;
        font-size: 0.26rem;
        font-weight: bold;
      }
      .p2 {
        margin-top: 0.51rem;
        font-size: 0.6rem;
        font-weight: bold;
      }
    }
    .money {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-top: 0.4rem;
      .title {
        font-size: 0.36rem;
        font-weight: bold;
      }
      .input-wrapper {
        display: flex;
        align-items: center;
        margin-top: 0.9rem;
        span {
          font-size: 0.7rem;
        }
        .van-field {
          font-size: 0.36rem;
          padding: 0 0.3rem;
          border-bottom: 1px solid #e7e7e7;
        }
      }
    }
    .plan {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-top: 0.6rem;
      .title {
        font-size: 0.36rem;
        font-weight: bold;
      }
      .plan-list {
        width: 6.7rem;
        margin-top: 0.3rem;
        .header {
          display: flex;
          background-color: #ffdd33;
          //border-radius: 10px;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          height: 0.8rem;
          align-items: center;
          justify-content: space-around;
          .item {
            font-size: 0.3rem;
          }
        }
        .row {
          background-color: #e7e7e7;
          display: flex;
          height: 0.84rem;
          align-items: center;
          justify-content: space-around;
          .item {
            font-size: 0.3rem;
            padding-right: 0.7rem;
            &.term {
              padding-right: 0;
              height: 100%;
              .term {
                height: 100%;
                background-color: #e7e7e7;
                width: 1.7rem;
              }
              .term::v-deep {
                .van-field__control {
                  color: black !important;
                }
              }
            }
          }
          .van-radio::v-deep {
            .van-icon.van-icon-success {
              border: 1px solid black;
            }
          }
        }
        .row:last-of-type {
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
        }
      }
    }
    .bottom {
      margin-top: 0.7rem;
      button {
        width: 5.8rem;
        @include button;
      }
    }
  }
}
</style>
