<template>
  <div class="page">
    <div class="section">
      <div class="beCareful">配偶信息</div>
      <div class="form">
        <van-field
          v-model.trim="partnerInfo.name"
          clearable
          label="姓名"
          right-icon="scan"
          placeholder="请输入姓名"
          @click-right-icon="goUploadIdCard('partner')"
        />
        <van-field
          label="身份证号码"
          placeholder="请输入身份证号码"
          v-model.trim="partnerInfo.idCard"
          maxlength="18"
          clearable
          center
        />
        <van-field
          label="手机号码"
          placeholder="请输入手机号码"
          v-model.trim="partnerInfo.phone"
          maxlength="11"
          clearable
          center
        />
      </div>
    </div>

    <div class="bottom">
      <button @click="nextCheck">确认</button>
    </div>
    <MaskLoading :show="showLoading"></MaskLoading>
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
  metaInfo: {
    title: "配偶信息"
  },
  components: {
    PopupDatetimePicker,
    AddImg,
    MaskLoading,
    PopupAddress
  },
  data() {
    return {
      partnerInfo: {
        name: "",
        idCard: "",
        phone: ""
      },
      showLoading: false,
      selfMsg: {}
    };
  },
  created() {
    //恢复视口
    this.leave();
    // if (storeGet("selfMsg")) {
    //   this.selfMsg = storeGet("selfMsg");
    //   //获取客户配偶信息
    //   this.queryCustomerInfo();
    // }
    //获取页面缓存
    this.getCache();
  },
  mounted() {},
  beforeRouteEnter(to, from, next) {
    next(vm => {});
  },
  methods: {
    //失焦恢复视口
    leave() {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
    //获取页面缓存
    getCache() {
      if (storeGet("partnerInfo")) {
        this.partnerInfo = storeGet("partnerInfo");
      }
      if (this.$route.query.myPartnerName) {
        this.partnerInfo.name = this.$route.query.myPartnerName;
      }
      if (this.$route.query.myPartnerIdCard) {
        this.partnerInfo.idCard = this.$route.query.myPartnerIdCard;
      }
    },
    //获取客户配偶信息
    queryCustomerInfo() {
      let url = `CustomerInfoController/queryCustomerInfo`;
      let param = {
        customerName: this.selfMsg.customerName,
        certId: this.selfMsg.certId,
        certType: "Ind01", //客户证件类型 Ind01 个人 ，Ent04 营业执照
        customerType: "03" //客户类型 03个人，05公司
      };
      this.$requestBx
        .post(url, param)
        .then(res => {
          if (res.code == 200) {
            this.partnerInfo.name = res.data.spouseName;
            this.partnerInfo.idCard = res.data.spouseCertId;
            this.partnerInfo.phone = res.data.spousetel;
            //有缓存拿缓存
            this.getCache();
          } else {
            Toast(`${res.message}`);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //上传身份证
    goUploadIdCard(from) {
      this.$router.push({
        path: "/uploadIdCard",
        query: { from }
      });
    },
    //确认
    nextCheck() {
      if (!this.partnerInfo.name) {
        Toast("请输入姓名");
        return;
      }
      if (!this.partnerInfo.idCard) {
        Toast("请输入身份证号码");
        return;
      }
      if (
        !/^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(
          this.partnerInfo.idCard
        )
      ) {
        Toast("请输入正确的身份证号码");
        return;
      }
      if (!/^1\d{10}$/.test(this.partnerInfo.phone)) {
        Toast("请输入正确的手机号码");
        return;
      }
      this.next();
    },
    async next() {
      try {
        storeSet(this.partnerInfo, "partnerInfo");
        this.showLoading = true;
        const url = "loanCarInfo/saveOrUpdate";
        // const resp = await this.$request.post(url, this.carForm);
        // const carInfo = Object.assign({},
        this.$router.push({
          path: "/personal",
          query: { partnerName: this.partnerInfo.name }
        });
      } catch (error) {
        //console.error(error);
      } finally {
        this.showLoading = false;
      }
    }
  },
  beforeDestroy() {
    storeSet(this.partnerInfo, "partnerInfo");
  }
};
</script>
<style lang="scss" scoped>
.page {
  flex-direction: column;
  .section {
    .beCareful {
      line-height: 0.8rem;
    }
    &.driving {
      flex: 0 0 28%;
      .img-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: white;
        img {
          margin-top: 0.3rem;
          width: 2.9rem;
          height: 2rem;
        }
        .button {
          background: none;
          background-color: white;
          color: #ffd11a;
          margin-top: 0.2rem;
          margin-bottom: 0.2rem;
          width: 6.18rem;
          height: 0.56rem;
          border: 0.02rem solid rgba(255, 209, 26, 1);
          border-radius: 0.27rem;
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
    padding-top: 0.8rem;
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
  width: 6.18rem;
  margin: 0.5rem auto;
  background: #fff;
  font-size: 0.32rem;
  font-weight: 500;
}
.form {
  background: #fff;
  .van-cell::v-deep {
    .van-field__label {
      width: 2.5rem;
      text-align: left;
      margin-right: 0.2rem;
      color: #666;
      font-size: 0.3rem;
      line-height: 0.3rem;
      padding: 0.1rem 0;
    }
    .van-cell__value {
      .van-field__body {
        .van-field__control {
          color: #000;
          font-size: 0.3rem;
          line-height: 0.3rem;
          padding: 0.1rem 0;
        }
        // .van-field__control::placeholder {
        //   //color: #000;
        // }
      }
    }
  }
  .tips {
    text-align: left;
    font-size: 0.32rem;
    height: 0.8rem;
    line-height: 0.8rem;
    margin-bottom: 0.2rem;
    margin-left: 0.3rem;
    font-weight: 500;
  }
}
.form::v-deep {
  .address {
    .van-cell {
      .van-cell__title {
        width: 2.5rem;
        color: #666;
      }
      // .van-field__control::placeholder {
      //   //color: #000;
      // }
    }
  }
  .van-field__right-icon {
    color: #ffcc00;
  }
}
.selectRight {
  display: flex;
  justify-content: space-around;
}
</style>