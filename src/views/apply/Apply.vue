<template>
  <div class="page">
    <div class="section img">
      <img src="../../assets/img/banner.png" />
    </div>
    <div class="section info">
      <div class="item">
        <img src="../../assets/img/che.png" />
        <div>不验车</div>
      </div>
      <div class="item">
        <img src="../../assets/img/gao.png" />
        <div>额度高</div>
      </div>
      <div class="item">
        <img src="../../assets/img/kuai.png" />
        <div>放款快</div>
      </div>
      <div class="item">
        <img src="../../assets/img/di.png" />
        <div>利息低</div>
      </div>
    </div>
    <div class="section form">
      <div class="form">
        <van-cell-group>
          <van-field v-model.trim="form.loadAmount" label="期望贷款金额" placeholder="请输入期望贷款金额" />
          <PopupAddress v-model.trim="form.cityName" title="办理城市"></PopupAddress>
          <van-field v-model.trim="form.personName" label="姓名" placeholder="请输入姓名" />
          <van-field v-model.trim="form.mobile" label="手机号码" placeholder="请输入手机号码" />
        </van-cell-group>
      </div>
      <button @click="submitCheck">提交申请</button>
    </div>
    <MaskLoading :show="showLoading"></MaskLoading>
  </div>
</template>

<script>
import { Toast } from "vant";
import { storeGet, storeSet, storeRemove, JGEvent } from "@/utils/common.js";
import MaskLoading from "@/components/MaskLoading.vue";
import PopupAddress from "@/components/PopupAddress.vue";
let start = null;
export default {
  metaInfo: {
    title: "留资"
  },
  components: { MaskLoading, PopupAddress },
  data() {
    return {
      showLoading: false,
      form: {
        loadAmount: null,
        cityId: null,
        cityName: null,
        personName: null,
        mobile: null
      }
    };
  },
  created() {},
  mounted() {},
  methods: {
    async submitCheck() {
      JGEvent("retain-money");
      const form = this.form;
      const tempLoadAmount = parseInt(form.loadAmount);
      if (isNaN(tempLoadAmount) || tempLoadAmount <= 0) {
        Toast("请输入正确的贷款金额");
        return;
      }
      if (!form.cityName) {
        Toast("请选择办理城市");
        return;
      }
      if (!form.personName) {
        Toast("请输入姓名");
        return;
      }
      if (!/^1\d{10}$/.test(form.mobile)) {
        Toast("请输入正确的手机号码");
        return;
      }
      const addressTemp = storeGet("addressTemp");
      const data = {
        loadAmount: tempLoadAmount,
        cityId: addressTemp[2].code,
        cityName: form.cityName,
        personName: form.personName,
        mobile: form.mobile
      };
      this.showLoading = true;
      try {
        await this.submit(data);
        this.$router.push({
          path: "applyResult"
        });
      } catch (error) {
        console.error(error);
      } finally {
        storeRemove("addressTemp");
        this.showLoading = false;
      }
    },
    submit(data) {
      this.showLoading = true;
      const url = "loanReservation/insertLoanReservation";
      return this.$request.post(url, data);
    }
  }
};
</script>
<style lang="scss" scoped>
.page {
  flex-direction: column;
  align-items: center;
  .section {
    &.img {
      img {
        height: 3.08rem;
      }
    }
    &.info {
      width: 6.88rem;
      background-color: #ffffff;
      display: flex;
      padding: 0.2rem;
      border-radius: 3px;
      box-sizing: border-box;
      .item {
        flex: 0 1 25%;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      img {
        width: 0.8rem;
        height: 0.8rem;
      }
    }
    &.form {
      margin-top: 0.3rem;
      width: 6.88rem;
      background-color: #ffffff;
      button {
        margin-top: 0.88rem;
        margin-bottom: 0.67rem;
        width: 5.8rem;
        @include button;
      }
    }
  }
}
</style>