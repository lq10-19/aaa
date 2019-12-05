<template>
  <div class="page">
    <!-- 公司 -->
    <div class="section driving">
      <div class="beCareful">客户认证</div>
      <div class="form">
        <van-button
          plain
          hairline
          type="info"
          @click="goUploadBusinessLicense"
          class="idCardBtn"
          round
          color="#FFCC00"
          icon="scan"
        >企业执照认证</van-button>
        <div class="tips">基本信息</div>
        <van-cell-group>
          <van-field
            label="公司名称"
            placeholder="请先上传企业执照"
            disabled
            v-model="companyInfo.companyName"
          />
          <van-field
            label="统一社会信用代码"
            placeholder="请先上传企业执照"
            disabled
            v-model="companyInfo.companyId"
          />
          <PopupAddress class="address" v-model.trim="companyInfo.workAddDetail" title="经营地址"></PopupAddress>
          <van-field
            v-model.trim="companyInfo.detailedAddress"
            clearable
            label="详细地址"
            placeholder="请输入详细地址"
          />
          <van-field label="法人姓名" placeholder="请先上传企业执照" disabled v-model="companyInfo.legalName" />
          <van-field
            label="法人身份证号码"
            placeholder="请填写身份证号码"
            v-model.trim="companyInfo.legalIdCard"
            maxlength="18"
            clearable
            center
          />
          <van-field
            type="number"
            label="法人手机号码"
            placeholder="请填写手机号码"
            v-model.trim="companyInfo.legalPhone"
            maxlength="11"
            clearable
            center
          />
          <van-field
            label="保证人"
            placeholder="请添加保证人"
            disabled
            is-link
            @click="goGuarantor"
            v-model="companyInfo.guarantor"
          />
        </van-cell-group>
      </div>
    </div>

    <div class="bottom">
      <button @click="nextCheck">下一步</button>
      <!-- <button @click="test" class="test">重置申请</button> -->
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
    title: "客户信息"
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
      companyInfo: {
        companyName: "",
        companyId: "",
        workAddDetail: "",
        detailedAddress: "",
        province: "",
        city: "",
        district: "",
        legalName: "",
        legalIdCard: "",
        legalPhone: "",
        guarantor: ""
      },
      imgUrl: null,
      showLoading: false,
      noAnchored: null,
      companyMsg: {}
    };
  },
  watch: {},
  created() {
    //非挂靠标识
    if (this.$route.query.noAnchored) {
      this.noAnchored = this.$route.query.noAnchored;
    }
    if (storeGet("customerType") == "公司非挂靠") {
      this.noAnchored = 1;
    }
    if (storeGet("serialno")) {
      this.serialno = storeGet("serialno");
    }
    if (storeGet("companyMsg")) {
      this.companyMsg = storeGet("companyMsg");
      if (!storeGet("queryCompanyInfo")) {
        //获取公司信息
        this.queryCompanyInfo();
      } else {
        //获取页面缓存
        this.getCache();
      }
    } else {
      //获取页面缓存
      this.getCache();
    }
  },
  mounted() {},
  methods: {
    //获取页面缓存
    getCache() {
      if (storeGet("companyInfo")) {
        this.companyInfo = storeGet("companyInfo");
        if (!storeGet("queryCompanyInfo")) {
          this.companyInfo.legalIdCard = "";
          this.companyInfo.legalPhone = "";
          this.companyInfo.guarantor = "";
        }
        if (!this.companyInfo.province) {
          this.companyInfo.workAddDetail = "";
          this.companyInfo.detailedAddress = "";
          console.log("没有省");
        }
        if (!this.companyInfo.city) {
          this.companyInfo.workAddDetail = "";
          this.companyInfo.detailedAddress = "";
          console.log("没有市");
        }
        if (!this.companyInfo.district) {
          this.companyInfo.workAddDetail = "";
          this.companyInfo.detailedAddress = "";
          console.log("没有区");
        }
      }
      //传参公司信息
      if (this.$route.query.name) {
        this.companyInfo.companyName = this.$route.query.name;
      }
      if (this.$route.query.regNum) {
        this.companyInfo.companyId = this.$route.query.regNum;
      }
      if (this.$route.query.person) {
        this.companyInfo.legalName = this.$route.query.person;
      }
      //传参保证人姓名
      if (this.$route.query.guarantorName) {
        this.companyInfo.guarantor = this.$route.query.guarantorName;
      }
      console.log(this.companyInfo, "公司缓存");
    },
    //获取公司信息
    queryCompanyInfo() {
      let url = `CompanyInfoController/queryCompanyInfo`;
      let isAnchored = "";
      if (this.noAnchored == 1) {
        isAnchored = "0";
      } else {
        isAnchored = "1";
      }
      let param = {
        customerName: this.companyMsg.customerName,
        certId: this.companyMsg.certId,
        certType: "Ent04", //客户证件类型 Ind01 个人 ，Ent04 营业执照
        isAnchored //是否挂靠 1是 0否
      };
      this.$requestBx
        .post(url, param)
        .then(res => {
          if (res.code == 200) {
            if (res.data.workAddDetail) {
              this.companyInfo.workAddDetail = res.data.workAddDetail;
            } else {
              this.companyInfo.workAddDetail = "";
            }
            if (res.data.detailedAddress) {
              this.companyInfo.detailedAddress = res.data.detailedAddress;
            } else {
              this.companyInfo.detailedAddress = "";
            }
            this.companyInfo.province = res.data.province;
            this.companyInfo.city = res.data.city;
            this.companyInfo.district = res.data.district;
            //this.companyInfo.legalName = res.data.legalPerson;
            if (res.data.legalPersonId) {
              this.companyInfo.legalIdCard = res.data.legalPersonId;
            }
            if (res.data.mobiletelePhone) {
              this.companyInfo.legalPhone = res.data.mobiletelePhone;
            }
            storeSet(this.companyInfo, "companyInfo");
            console.log(this.companyInfo, "公司");
            //获取页面缓存
            this.getCache();
          } else {
            Toast(`${res.message}`);
          }
        })
        .catch(error => {
          console.log(error);
        });
      storeSet("1", "queryCompanyInfo");
    },
    //上传企业执照
    goUploadBusinessLicense() {
      this.$router.push({
        path: "/uploadBusinessLicense",
        query: {}
      });
    },
    //添加保证人
    goGuarantor() {
      if (this.noAnchored == 1) {
        this.$router.push({
          path: "/guarantorInfo",
          query: { noAnchored: 1 }
        });
      } else {
        this.$router.push({
          path: "/guarantorInfo",
          query: {}
        });
      }
    },
    //下一步
    nextCheck() {
      if (!this.companyInfo.companyName) {
        Toast("请先上传企业执照");
        return;
      }
      if (!this.companyInfo.companyId) {
        Toast("请先上传企业执照");
        return;
      }
      if (!this.companyInfo.workAddDetail) {
        Toast("请选择经营地址");
        return;
      }
      const addressTemp = storeGet("addressTemp");
      if (!this.companyInfo.province) {
        this.companyInfo.province = addressTemp[0].code;
      }
      if (!this.companyInfo.city) {
        this.companyInfo.city = addressTemp[1].code;
      }
      if (!this.companyInfo.district) {
        this.companyInfo.district = addressTemp[2].code;
      }
      if (!this.companyInfo.legalName) {
        Toast("请填写法人姓名");
        return;
      }
      if (!this.companyInfo.legalIdCard) {
        Toast("请填写身份证号码");
        return;
      }
      if (
        !/^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(
          this.companyInfo.legalIdCard
        )
      ) {
        Toast("请输入正确的身份证号码");
        return;
      }
      if (!/^1\d{10}$/.test(this.companyInfo.legalPhone)) {
        Toast("请输入正确的手机号码");
        return;
      }
      if (!this.companyInfo.guarantor) {
        Toast("请添加保证人");
        return;
      }
      this.next();
    },
    next() {
      let url = "create/createCust";
      //公司信息
      let info = storeGet("companyMsg");
      info.serialno = this.serialno;
      info.certType = "Ent04";
      info.customerType = "05";
      if (this.noAnchored == 1) {
        info.isAnchored = "2";
      } else {
        info.isAnchored = "1";
      }
      info.workAddDetail = this.companyInfo.workAddDetail;
      //info.workAddId = this.companyInfo.companyAddressId;
      info.detailedAddress = this.companyInfo.detailedAddress;
      info.province = this.companyInfo.province;
      info.city = this.companyInfo.city;
      info.district = this.companyInfo.district;
      info.legalCeryId = this.companyInfo.legalIdCard;
      info.mobiletelePhone = this.companyInfo.legalPhone;
      //保证人信息
      info.guarantorResult = storeGet("guarantorMsg");
      info.guarantorResult.serialno = this.serialno;
      info.guarantorResult.mobiletelephone = storeGet(
        "guarantorInfo"
      ).mobiletelephone;
      //配偶信息
      if (storeGet("guarantorPartnerInfo")) {
        info.guarantorResult.spouseName = storeGet("guarantorPartnerInfo").name;
        info.guarantorResult.spousetel = storeGet("guarantorPartnerInfo").phone;
        info.guarantorResult.spouseCertId = storeGet(
          "guarantorPartnerInfo"
        ).idCard;
      }
      //是否挂靠(实际用车人)
      if (this.noAnchored == 1) {
        info.guarantorResult.isAnchored = "2";
        info.guarantorResult.isActualCarMan = "0";
      } else {
        info.guarantorResult.isAnchored = "1";
        info.guarantorResult.isActualCarMan = "1";
      }
      //联系人信息
      if (storeGet("guarantorContactsInfo")) {
        info.contactsinfoResult = storeGet("guarantorContactsInfo");
      } else {
        info.contactsinfoResult = {
          participantName: "",
          participantPhone: "",
          participantadd: "",
          province: "",
          city: "",
          area: "",
          township: ""
        };
      }
      if (storeGet("guarantorInfo").message == "已婚") {
        info.guarantorResult.marriage = "2";
        if (storeGet("customerType") == "公司挂靠") {
          if (!info.guarantorResult.spouseName) {
            Toast("请添加配偶姓名");
            return;
          }
          if (!info.guarantorResult.spouseCertId) {
            Toast("请添加配偶身份证号码");
            return;
          }
          if (!info.guarantorResult.spousetel) {
            Toast("请添加配偶手机号码");
            return;
          }
        }
      } else if (storeGet("guarantorInfo").message == "未婚") {
        info.guarantorResult.marriage = "1";
        if (storeGet("customerType") == "公司挂靠") {
          if (!info.contactsinfoResult.participantName) {
            Toast("请输入联系人姓名");
            return;
          }
          if (!info.contactsinfoResult.participantPhone) {
            Toast("请输入联系人手机号码");
            return;
          }
          if (!info.contactsinfoResult.participantadd) {
            Toast("请输入联系人所在地区");
            return;
          }
          if (!info.contactsinfoResult.province) {
            Toast("请输入联系人所在地区");
            return;
          }
          if (!info.contactsinfoResult.city) {
            Toast("请输入联系人所在地区");
            return;
          }
          if (!info.contactsinfoResult.area) {
            Toast("请输入联系人所在地区");
            return;
          }
          if (!info.contactsinfoResult.township) {
            Toast("请输入联系人详细地址");
            return;
          }
        }
      }
      this.showLoading = true;
      this.$requestBx
        .post(url, info)
        .then(res => {
          this.showLoading = false;
          if (res.code == "200") {
            this.list = res.data;
            storeSet(this.list, "list");
            this.$router.push({
              path: "/carInsuranceInfo",
              query: {}
            });
          } else {
            Toast(`${res.message}`);
          }
        })
        .catch(error => {
          this.showLoading = false;
          console.log("error" + error);
        });
    }
  },
  beforeDestroy() {
    const addressTemp = storeGet("addressTemp");
    if (!this.companyInfo.province) {
      this.companyInfo.province = addressTemp[0].code;
    }
    if (!this.companyInfo.city) {
      this.companyInfo.city = addressTemp[1].code;
    }
    if (!this.companyInfo.district) {
      this.companyInfo.district = addressTemp[2].code;
    }
    storeSet(this.companyInfo, "companyInfo");
    storeSet(this.list, "list");
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
      font-size: 0.3rem;
      .van-cell__title {
        width: 2.5rem;
        color: #666;
      }
      // .van-field__control::placeholder {
      //   //color: #000;
      // }
    }
  }
  .van-button--info {
    color: #ffcc00;
    border: 1px solid #ffcc00;
  }
}
</style>