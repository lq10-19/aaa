<template>
  <div class="bigBox">
    <div class="line"></div>
    <div class="title">
      <div>订单状态</div>
      <div class="title_state">{{contractstatusName}}</div>
    </div>
    <div class="div">
      <van-cell title="合同号" :value="bankMsg.serialno" size="large" :border="false" class="item" />
      <van-cell title="申请时间" :value="bankMsg.applydate" size="large" :border="false" class="item" />
      <van-cell title="产品类型" :value="bankMsg.typename" size="large" :border="false" class="item" />
      <van-cell
        title="融资金额"
        :value="'￥' + bankMsg.businesssum"
        size="large"
        :border="false"
        class="item"
      />
      <van-cell
        title="分期期限"
        :value="bankMsg.periods + '期'"
        size="large"
        :border="false"
        class="item"
      />
    </div>
    <div class="line"></div>
    <van-cell
      class="title_text"
      title="客户信息"
      is-link
      :to="{ path: 'customerInformation', query: {serialno}}"
    />
    <van-cell
      class="title_text"
      title="车辆及保险信息"
      is-link
      :to="{ path: 'carInformation', query: {serialno}}"
    />
    <van-cell
      class="title_text"
      title="融资信息"
      is-link
      :to="{ path: 'financingInformation', query: {serialno}}"
    />
    <MaskLoading :show="showLoading"></MaskLoading>
  </div>
</template>

<script>
import { Toast } from "vant";
import MaskLoading from "@/components/MaskLoading.vue";
export default {
  metaInfo() {
    return {
      title: "订单详情"
    };
  },
  components: { MaskLoading },
  data() {
    return {
      serialno: "", //合同号
      contractstatusName: "",
      activeNames: [], //默认打开的折叠面板
      bankMsg: {
        contractStatusName: "", //订单状态
        serialno: "", //业务编号
        applydate: "", //申请时间
        typename: "", //产品类型
        businesssum: "", //融资金额
        periods: "" //分期期限
      }, //客户信息对象
      contactsList: [], //联系人列表
      serialList: [], //合同附件列表
      showLoading: true
    };
  },
  created() {
    if (this.$route.query.serialno) {
      this.serialno = this.$route.query.serialno;
    }
    if (this.$route.query.contractstatusName) {
      this.contractstatusName = this.$route.query.contractstatusName;
    }
    // if (this.$route.query.from) {
    //   if (this.$route.query.from == 0) {
    //     this.flag = 0;
    //   } else if (this.$route.query.from == 1) {
    //     this.flag = 1;
    //   }
    // }
    //查询合同详情
    this.queryAppyDetail();
  },
  mounted() {},
  methods: {
    //查询合同详情
    queryAppyDetail() {
      this.showLoading = true;
      let url = `CustomerInfoController/queryAppyDetail?serialno=${this.serialno}`;
      return this.$requestBx
        .get(url)
        .then(res => {
          if (res.code == 200) {
            this.bankMsg = res.data;
            //个人
            if (res.data.customerType == "03") {
              //公司
            } else if (res.data.customerType == "05") {
            }
            this.showLoading = false;
          } else {
            this.showLoading = false;
            Toast(`${res.message}`);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
    // //获取所有已签合同文件
    // queryBySerialNo() {
    //   let url = `docAttachmentCtr/queryBySerialNo`;
    //   let param = {
    //     serialNo: this.serialNo
    //   };
    //   this.$requestCl
    //     .post(url, param)
    //     .then(res => {
    //       if (res.data && res.data.length > 0) {
    //         this.serialList = res.data;
    //         //console.log(this.serialList);
    //       }
    //     })
    //     .catch(error => {
    //       console.log("error" + error);
    //     });
    // },
  }
};
</script>
<style lang="scss" scoped>
.bigBox {
  font-family: PingFang SC;
  .title {
    padding: 0.3rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.34rem;
    font-weight: 500;
    color: #000;
    background: #fff;
    border-bottom: 0.01rem solid rgba(243, 243, 243, 1);
    .title_state {
      text-align: center;
      font-size: 0.3rem;
      line-height: 0.54rem;
      width: 1.7rem;
      height: 0.54rem;
      background: rgba(255, 244, 186, 1);
      border: 0.02rem solid rgba(255, 193, 0, 1);
      border-radius: 0.27rem;
    }
  }
  .div {
    .item {
      text-align: left;
      font-size: 0.3rem;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
    }
    .van-cell__title {
      font-size: 0.3rem;
    }
  }
  .title_text::v-deep {
    text-align: left;
    padding: 0.3rem;
    font-size: 0.34rem;
    font-weight: 500;
    color: #000;
    background: #fff;
  }
}

.line {
  width: 100%;
  height: 0.2rem;
  background: #f2f3f5;
}
</style>