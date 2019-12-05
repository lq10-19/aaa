<template>
  <div class="page">
    <!-- 个人 -->
    <div class="section driving">
      <div class="beCareful">客户认证</div>
      <div class="form">
        <van-button
          plain
          hairline
          type="info"
          @click="goUploadIdCard('self')"
          class="idCardBtn"
          round
          color="#FFCC00"
          icon="scan"
        >身份证认证</van-button>
        <div class="tips">基本信息</div>
        <van-cell-group>
          <van-field label="姓名" placeholder="请先上传身份证" disabled v-model="myInfo.name" />
          <van-field label="身份证号码" placeholder="请先上传身份证" disabled v-model="myInfo.idCard" />
          <van-field
            label="婚姻状况"
            placeholder="请选择婚姻状况"
            v-model.trim="myInfo.message"
            disabled
            is-link
            @click="showMessageList"
          />
          <van-field
            type="number"
            label="手机号码"
            placeholder="请填写手机号码"
            v-model.trim="myInfo.phone"
            maxlength="11"
            clearable
            center
          />
          <van-field
            v-if="myInfo.message!='已婚'"
            label="联系人"
            placeholder="请添加联系人"
            is-link
            @click="goContacts"
            v-model="myInfo.contacts"
          />
          <van-field
            v-if="myInfo.message=='已婚'"
            label="配偶"
            placeholder="请添加配偶信息"
            is-link
            @click="goPartner"
            v-model="myInfo.partner"
          />
        </van-cell-group>
      </div>
    </div>

    <div class="bottom">
      <button @click="nextCheck">下一步</button>
      <!-- <button @click="test" class="test">重置申请</button> -->
    </div>

    <MaskLoading :show="showLoading"></MaskLoading>

    <!-- 婚姻状况 -->
    <van-popup v-model="showMessage" position="bottom" :overlay="true">
      <van-picker
        show-toolbar
        title="婚姻状况"
        :columns="messageList"
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
      myInfo: {
        name: "",
        idCard: "",
        phone: "",
        contacts: "",
        partner: "",
        message: ""
      },
      showMessage: false,
      messageTypeList: [
        { itemName: "已婚", itemNo: 1 },
        { itemName: "未婚", itemNo: 2 }
      ],
      messageList: ["已婚", "未婚"],
      imgUrl: null,
      showLoading: false,
      selfMsg: {}
    };
  },
  watch: {
    //监听婚姻状况
  },
  created() {
    if (storeGet("serialno")) {
      this.serialno = storeGet("serialno");
    }
    if (storeGet("myInfo")) {
      this.myInfo = storeGet("myInfo");
    }
    if (storeGet("selfMsg")) {
      this.selfMsg = storeGet("selfMsg");
      if (!storeGet("queryCustomerInfo")) {
        //获取客户信息
        this.queryCustomerInfo();
      }
    }
    //获取页面缓存
    this.getCache();
  },
  mounted() {},
  methods: {
    //获取页面缓存
    getCache() {
      //传参姓名和身份证号
      if (this.$route.query.myName) {
        this.myInfo.name = this.$route.query.myName;
      }
      if (this.$route.query.myIdCard) {
        this.myInfo.idCard = this.$route.query.myIdCard;
      }
      // //传参婚姻状况
      // if (this.$route.query.message) {
      //   this.myInfo.message = this.$route.query.message;
      //   if (this.$route.query.message == "已婚") {
      //     this.myInfo.partner = this.$route.query.getPartnerName;
      //   } else if (this.$route.query.message == "未婚") {
      //     this.myInfo.contacts = this.$route.query.getContactsName;
      //   }
      // }
      //传参配偶姓名
      if (this.$route.query.partnerName) {
        this.myInfo.partner = this.$route.query.partnerName;
      }
      //传参联系人姓名
      if (this.$route.query.contactsName) {
        this.myInfo.contacts = this.$route.query.contactsName;
      }
    },
    //获取客户婚否信息
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
            if (res.data.marriage == "已婚") {
              console.log("已婚");
              this.myInfo.phone = res.data.phone;
              this.myInfo.partner = res.data.spouseName;
              this.myInfo.message = "已婚";
            } else {
              console.log("未婚");
              this.myInfo.phone = res.data.phone;
              this.myInfo.message = "未婚";
            }
            let partnerInfo = {
              name: res.data.spouseName,
              idCard: res.data.spouseCertId,
              phone: res.data.spousetel
            };
            if (!storeGet("partnerInfo")) {
              storeSet(partnerInfo, "partnerInfo");
            }
            if (storeGet("customerSame")) {
              storeSet(partnerInfo, "partnerInfo");
            }
            if (res.data.contactsinfoResult) {
              let contactsInfo = res.data.contactsinfoResult;
              this.myInfo.contacts =
                res.data.contactsinfoResult.participantName;
              if (!storeGet("contactsInfo")) {
                storeSet(contactsInfo, "contactsInfo");
              }
              if (storeGet("customerSame")) {
                storeSet(contactsInfo, "contactsInfo");
              }
            }
            //获取页面缓存
            this.getCache();
          } else {
            Toast(`${res.message}`);
          }
        })
        .catch(error => {
          console.log(error);
        });
      storeSet("1", "queryCustomerInfo");
    },
    //打开婚姻状况
    showMessageList() {
      this.showMessage = true;
    },
    onChange(picker, value, index) {
      // console.log(picker, value, index);
      // this.myInfo.message = value;
    },
    onConfirm(picker, value, index) {
      console.log(picker, value, index);
      this.myInfo.message = picker;
      this.showMessage = false;
      if (this.myInfo.message == "已婚") {
        this.myInfo.partner = storeGet("partnerInfo").name;
      } else {
        this.myInfo.contacts = storeGet("contactsInfo").participantName;
      }
    },
    onCancel() {
      this.showMessage = false;
    },
    //上传身份证
    goUploadIdCard(from) {
      this.$router.push({
        path: "/uploadIdCard",
        query: { from }
      });
    },
    //添加联系人
    goContacts() {
      this.$router.push({
        path: "/contactsInfo",
        query: {}
      });
    },
    //添加配偶
    goPartner() {
      this.$router.push({
        path: "/partnerInfo",
        query: {}
      });
    },
    //下一步
    nextCheck() {
      if (!this.myInfo.name) {
        Toast("请先上传身份证");
        return;
      }
      if (!this.myInfo.idCard) {
        Toast("请先上传身份证");
        return;
      }
      if (this.myInfo.message == "") {
        Toast("请选择婚姻状况");
        return;
      }
      if (!/^1\d{10}$/.test(this.myInfo.phone)) {
        Toast("请输入正确的手机号码");
        return;
      }
      if (this.myInfo.message == "已婚") {
        if (!this.myInfo.partner) {
          Toast("请添加配偶信息");
          return;
        }
      } else if (this.myInfo.message == "") {
        if (!this.myInfo.contacts) {
          Toast("请添加联系人");
          return;
        }
      } else {
        if (!this.myInfo.contacts) {
          Toast("请添加联系人");
          return;
        }
      }
      this.next();
    },
    next() {
      let url = "create/createCust";
      //个人信息(含配偶)
      let info = storeGet("selfMsg");
      info.serialno = this.serialno;
      info.phone = this.myInfo.phone;
      // info.certType = "Ind01";
      info.customerType = "03";
      if (storeGet("partnerInfo")) {
        info.spouseName = storeGet("partnerInfo").name;
        info.spousetel = storeGet("partnerInfo").phone;
        info.spouseCertId = storeGet("partnerInfo").idCard;
      }
      //联系人信息
      if (storeGet("contactsInfo")) {
        info.contactsinfoResult = storeGet("contactsInfo");
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
      if (this.myInfo.message == "已婚") {
        info.marriage = "2";
        if (!info.spouseName) {
          Toast("请添加配偶姓名");
          return;
        }
        if (!info.spouseCertId) {
          Toast("请添加配偶身份证号码");
          return;
        }
        if (!info.spousetel) {
          Toast("请添加配偶手机号码");
          return;
        }
      } else if (this.myInfo.message == "未婚") {
        info.marriage = "1";
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
      this.showLoading = true;
      this.$requestBx
        .post(url, info)
        .then(res => {
          this.showLoading = false;
          if (res.code == "200") {
            console.log(res.data);
            //this.customerId = res.data;
            //storeSet(this.customerId, "customerId");
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
    storeSet(this.myInfo, "myInfo");
    //storeSet(this.customerId, "customerId");
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
        //   color: #777979;
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
    }
  }
  .van-button--info {
    color: #ffcc00;
    border: 1px solid #ffcc00;
  }
}
</style>