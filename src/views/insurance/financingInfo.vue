<template>
  <div class="page">
    <div class="section">
      <div class="beCareful">分期信息</div>
      <div class="form">
        <van-cell-group>
          <van-field
            label="分期期限"
            placeholder="请选择分期期限"
            v-model.trim="financingInfo.term"
            disabled
            is-link
            @click="showStagesList"
          />
        </van-cell-group>
        <van-field
          label="首付比例"
          placeholder="计算中..."
          v-model.trim="showInfo.paymentrate"
          clearable
          center
          disabled
        />
        <van-field
          v-if="showCompulsoryInsurance"
          label="保证金比例"
          placeholder="计算中..."
          v-model.trim="showInfo.bondRate"
          clearable
          center
          disabled
        />
      </div>

      <div class="section">
        <div class="beCareful">融资信息</div>
        <div class="form">
          <van-field
            label="投保总金额"
            placeholder="计算中..."
            v-model.trim="showInfo.insuredTotalAmount"
            clearable
            center
            disabled
          />
          <van-field
            label="融资总金额"
            placeholder="计算中..."
            v-model.trim="showInfo.businessSum"
            clearable
            center
            disabled
          />
          <div class="tips">
            <p>
              <span></span>
              商业险融资金额&emsp;&emsp;{{showInfo.viFinAmount}}
            </p>
            <p v-if="showCompulsoryInsurance">
              <span></span>
              交强险融资金额&emsp;&emsp;{{showInfo.clivtaFinAmount}}
            </p>
          </div>
          <van-field
            v-if="BX01"
            :label="BX01"
            placeholder="计算中..."
            v-model.trim="showInfo.insuranceService"
            clearable
            center
            disabled
          />
        </div>
      </div>
    </div>

    <div class="section driving">
      <div class="beCareful">合同明细</div>
      <div class="form">
        <van-field
          label="首付金额"
          placeholder="计算中..."
          v-model.trim="showInfo.paymentSum"
          clearable
          center
          disabled
        />
        <van-field
          v-if="showCompulsoryInsurance&&BX02"
          :label="BX02"
          placeholder="计算中..."
          v-model.trim="showInfo.insuranceBondRate"
          clearable
          center
          disabled
        />
        <van-field
          label="自付保费差额"
          placeholder="计算中..."
          v-model.trim="showInfo.insuranceNalance"
          clearable
          center
          disabled
        />
        <van-field
          label="每月还款金额"
          placeholder="计算中..."
          v-model.trim="showInfo.monthrepayment"
          clearable
          center
          disabled
        />
      </div>
    </div>

    <div class="section driving">
      <div class="beCareful">首期费用</div>
      <div class="form">
        <van-field
          label="首期款项"
          placeholder="计算中..."
          v-model.trim="showInfo.firstPayment"
          clearable
          center
          disabled
        />
      </div>
    </div>

    <div class="bottom">
      <button @click="nextCheck">确认，下一步</button>
    </div>
    <MaskLoading :show="showLoading"></MaskLoading>
    <!-- 分期期限 -->
    <van-popup v-model="showStages" position="bottom" :overlay="true">
      <van-picker
        show-toolbar
        title="分期期限"
        :columns="stagesList"
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
  metaInfo() {
    return {
      title: "融资信息"
    };
  },
  components: {
    PopupDatetimePicker,
    AddImg,
    MaskLoading,
    PopupAddress
  },
  data() {
    return {
      serialno: null,
      customerType: null,
      financingInfo: {
        term: "请选择分期期限"
      },
      showInfo: {
        paymentrate: "", //首付比例
        bondRate: "", //保证金比例
        insuredTotalAmount: "", //投保总金额
        businessSum: "", //融资总金额
        viFinAmount: "", //商业险融资金额
        clivtaFinAmount: "", //交强险融资金额
        insuranceService: "", //保险服务费
        paymentSum: "", //首付金额
        insuranceBondRate: "", //保险保证金
        insuranceNalance: "", //自付保费差额
        monthrepayment: "", //月还款金额
        firstPayment: "" //首期款项
      },
      stagesNumberList: [
        // { term: "12" }
      ],
      showStages: false,
      stagesList: [],
      showLoading: false,
      showCompulsoryInsurance: true,
      BX01: "", //保险服务费
      BX02: "" //保险保证金
    };
  },
  watch: {
    //监听勾选
    // insuranceList: {
    //   handler: function(newVal) {
    //     console.log(newVal);
    //     if (newVal[1].checked) {
    //       this.showCompulsoryInsurance = true;
    //     } else {
    //       this.showCompulsoryInsurance = false;
    //     }
    //   },
    //   deep: true //深度监听
    // }
  },
  created() {
    // if (storeGet("showCompulsoryInsurance") == false) {
    //   this.showCompulsoryInsurance = storeGet("showCompulsoryInsurance");
    // } else {
    //   this.showCompulsoryInsurance = true;
    // }
    if (storeGet("customerType")) {
      this.customerType = storeGet("customerType");
    }
    if (storeGet("serialno")) {
      this.serialno = storeGet("serialno");
    }
    if (this.$route.query.serialno) {
      this.serialno = this.$route.query.serialno;
    }
    if (this.$route.query.typeNo) {
      this.typeNo = this.$route.query.typeNo;
    }
    //获取融资信息
    //this.getBusCalculateInfo(this.financingInfo.term);
    //获取融资信息
    if (storeGet("financingInfo")) {
      this.financingInfo = storeGet("financingInfo");
      this.getBusCalculateInfo(this.financingInfo.term);
    } else {
      this.getBusCalculateInfo();
    }
  },
  mounted() {
    document.getElementsByTagName("body")[0].style.background = "#f3f3f3";
    document.getElementsByTagName("title")[0].textContent = "融资信息";
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {});
  },
  methods: {
    //打开分期选择
    showStagesList() {
      this.showStages = true;
    },
    onChange(picker, value, index) {
      // console.log(picker, value, index);
      // this.financingInfo.term = value;
    },
    onConfirm(picker, value, index) {
      console.log(picker, value, index);
      this.financingInfo.term = picker;
      this.showStages = false;
      //清空期数列表
      this.stagesList = [];
      //获取融资信息
      this.getBusCalculateInfo(this.financingInfo.term);
    },
    onCancel() {
      this.showStages = false;
    },
    //获取融资信息
    getBusCalculateInfo(termParam) {
      this.showLoading = true;
      let url = "business/getBusCalculateInfo";
      let param = {};
      if (termParam) {
        param = {
          serialno: this.serialno, //合同号
          //serialno: "", //合同号
          term: termParam
        };
      } else {
        param = {
          serialno: this.serialno //合同号
          //serialno: "", //合同号
        };
      }
      this.$requestBx
        .post(url, param)
        .then(res => {
          this.showLoading = false;
          if (res.code == "200") {
            this.financingInfo = res.data;
            this.stagesNumberList = res.data.termList;
            res.data.termList.forEach(element => {
              this.stagesList.push(element.term);
            });
            //动态获取保险服务费和保险保证金
            if (res.data.feeList.length > 0) {
              res.data.feeList.forEach(element => {
                if (element.termid == "BX01") {
                  this.BX01 = element.termname;
                }
                if (element.termid == "BX02") {
                  this.BX02 = element.termname;
                }
              });
            }
            if (res.data.insType == "01") {
              this.showCompulsoryInsurance = false;
            } else if (res.data.insType == "01,02") {
              this.showCompulsoryInsurance = true;
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
          this.showLoading = false;
          console.log("error" + error);
        });
    },
    //下一步
    nextCheck() {
      if (this.financingInfo.term == "请选择分期期限") {
        Toast("请选择分期期限");
        return;
      }
      this.next();
    },
    next() {
      this.showLoading = true;
      let url = "submit/acctFee";
      let param = {
        serialno: this.serialno,
        typeNo: this.typeNo,
        paymentrate: this.financingInfo.paymentrate,
        paymentSum: this.financingInfo.paymentSum,
        periods: this.financingInfo.term,
        businessSum: this.financingInfo.businessSum,
        monthrepayment: this.financingInfo.monthrepayment,
        feeList: this.financingInfo.feeList,
        bondRate: this.financingInfo.bondRate,
        insuredTotalAmount: this.financingInfo.insuredTotalAmount,
        insuranceService: this.financingInfo.insuranceService,
        insuranceBondRate: this.financingInfo.insuranceBondRate,
        insuranceNalance: this.financingInfo.insuranceNalance,
        viFinAmount: this.financingInfo.viFinAmount,
        clivtaFinAmount: this.financingInfo.clivtaFinAmount,
        insFinAmount: this.financingInfo.insFinAmount,
        firstPayment: this.financingInfo.firstPayment
      };
      this.$requestBx
        .post(url, param)
        .then(res => {
          this.showLoading = false;
          if (res.code == 200) {
            if (this.customerType == "个人") {
              this.$router.push({
                path: "/personal",
                query: {}
              });
            } else if (this.customerType == "公司挂靠") {
              this.$router.push({
                path: "/company",
                query: {}
              });
            } else if (this.customerType == "公司非挂靠") {
              this.$router.push({
                path: "/company",
                query: { noAnchored: 1 }
              });
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
    numFilter(num) {
      if (num) {
        let realVal = parseFloat(num).toFixed(2) + " 元";
        return realVal;
      } else {
        return "0 元";
      }
    }
  },
  beforeDestroy() {
    storeSet(this.financingInfo, "financingInfo");
  }
};
</script>
<style lang="scss" scoped>
.page {
  flex-direction: column;
  .section {
    &.driving {
      //flex: 0 0 28%;
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
    padding: 0.8rem 0;
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
  width: 50%;
  margin: 0.1rem auto;
  background: #fff;
}
.form {
  background: #fff;
  .van-cell::v-deep {
    font-size: 0.32rem;
    line-height: 0.64rem;
    .van-field__label {
      width: 2.5rem;
      text-align: left;
      margin-right: 0.5rem;
      color: #666;
    }
    .van-cell__value {
      .van-field__body {
        .van-field__control {
          color: #000;
        }
        // .van-field__control::placeholder {
        //   //color: #000;
        // }
      }
    }
  }
}
.form {
  .tips {
    padding-top: 0.2rem;
    padding-bottom: 0.2rem;
    //height: 1rem;
    background: rgba(242, 245, 251, 1);
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
.selectRight {
  display: flex;
  justify-content: space-around;
}
</style>