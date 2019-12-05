<template>
  <div class="page">
    <div class="section driving">
      <div class="beCareful">{{title}}</div>
      <div class="form">
        <van-button
          plain
          hairline
          type="info"
          @click="goUploadIdCard('guarantor')"
          class="idCardBtn"
          round
          color="#FFCC00"
          icon="scan"
        >身份证认证</van-button>
        <van-cell-group>
          <van-field
            label="姓名"
            placeholder="请先上传身份证"
            disabled
            v-model="guarantorInfo.customername"
          />
          <van-field label="身份证号码" placeholder="请先上传身份证" disabled v-model="guarantorInfo.certid" />
          <van-field
            label="婚姻状况"
            placeholder="请选择婚姻状况"
            v-model="guarantorInfo.message"
            disabled
            is-link
            @click="showMessageList"
          />
          <van-field
            type="number"
            label="手机号码"
            placeholder="请填写手机号码"
            v-model.trim="guarantorInfo.mobiletelephone"
            maxlength="11"
            clearable
            center
          />
        </van-cell-group>
      </div>
    </div>
    <div v-if="noAnchored!='1'">
      <!-- 配偶信息 -->
      <div class="section" v-if="guarantorInfo.message=='已婚'">
        <div class="beCareful">配偶信息</div>
        <div class="form">
          <van-field
            v-model.trim="guarantorPartnerInfo.name"
            clearable
            label="姓名"
            right-icon="scan"
            placeholder="请输入姓名"
            @click-right-icon="goUploadIdCard('guarantorPartner')"
          />
          <van-field
            label="身份证号码"
            placeholder="请输入身份证号码"
            v-model.trim="guarantorPartnerInfo.idCard"
            maxlength="18"
            clearable
            center
          />
          <van-field
            label="手机号码"
            placeholder="请输入手机号码"
            v-model.trim="guarantorPartnerInfo.phone"
            maxlength="11"
            clearable
            center
          />
        </div>
      </div>
      <!-- 联系人信息 -->
      <div class="section" v-if="guarantorInfo.message!='已婚'">
        <div class="beCareful">联系人信息</div>
        <div class="form">
          <van-cell-group>
            <van-field
              label="关系"
              placeholder="请选择联系人关系"
              v-model.trim="participantStatus"
              disabled
              is-link
              @click="showReasonList"
            />
          </van-cell-group>
          <van-field
            v-model.trim="contactsInfo.participantName"
            clearable
            label="联系人姓名"
            placeholder="请输入联系人姓名"
          />
          <van-field
            label="手机号码"
            placeholder="请输入手机号码"
            v-model.trim="contactsInfo.participantPhone"
            maxlength="11"
            clearable
            center
          />
          <PopupAddress class="address" v-model.trim="contactsInfo.participantadd" title="所在地区"></PopupAddress>
          <van-field
            v-model.trim="contactsInfo.township"
            clearable
            label="详细地址"
            placeholder="请输入详细地址"
          />
        </div>
      </div>
    </div>

    <div class="bottom">
      <button @click="nextCheck">确认</button>
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
    <!-- 联系人关系 -->
    <van-popup v-model="showRelationship" position="bottom" :overlay="true">
      <van-picker
        show-toolbar
        title="客户类型"
        :columns="contactsList"
        @cancel="onCancel1"
        @confirm="onConfirm1"
        @change="onChange1"
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
  // metaInfo: {
  //   title: "保证人信息"
  // },
  components: {
    PopupDatetimePicker,
    AddImg,
    MaskLoading,
    PopupAddress
  },
  data() {
    return {
      title: "保证人信息",
      guarantorInfo: {
        customername: "",
        certid: "",
        mobiletelephone: "",
        message: "",
        serialno: ""
      },
      messageTypeList: [
        { itemName: "已婚", itemNo: 1 },
        { itemName: "未婚", itemNo: 2 }
      ],
      messageList: ["已婚", "未婚"],
      guarantorPartnerInfo: {
        name: "",
        idCard: "",
        phone: ""
      },
      showMessage: false,
      contactsTypeList: [
        { itemName: "配偶", itemNo: "01" },
        { itemName: "父亲", itemNo: "02" },
        { itemName: "母亲", itemNo: "03" },
        { itemName: "直系亲属", itemNo: "04" },
        { itemName: "非直系亲属", itemNo: "05" },
        { itemName: "同事", itemNo: "06" },
        { itemName: "朋友", itemNo: "07" },
        { itemName: "其他", itemNo: "99" }
      ],
      contactsList: [
        "配偶",
        "父亲",
        "母亲",
        "直系亲属",
        "非直系亲属",
        "同事",
        "朋友",
        "其他"
      ],
      participantStatus: "",
      contactsInfo: {
        participantStatus: "",
        participantName: "",
        participantPhone: "",
        participantadd: "",
        province: "",
        city: "",
        area: "",
        township: ""
      },
      showRelationship: false,
      showLoading: false,
      noAnchored: null,
      companyMsg: {}
    };
  },
  created() {
    if (storeGet("serialno")) {
      this.guarantorInfo.serialno = storeGet("serialno");
    }
    //非挂靠标识
    if (storeGet("customerType") == "公司非挂靠") {
      this.noAnchored = 1;
      console.log(this.noAnchored);
      console.log("保证人");
      this.title = "保证人信息";
      document.getElementsByTagName("title")[0].textContent = "保证人信息";
    } else {
      console.log("实际用车人信息");
      this.title = "实际用车人信息";
      document.getElementsByTagName("title")[0].textContent = "实际用车人信息";
    }
    if (storeGet("guarantorMsg")) {
      this.guarantorInfo = storeGet("guarantorMsg");
      console.log(storeGet("queryCustomerInfo"));
      console.log(!storeGet("queryCustomerInfo"));
      if (!storeGet("queryCustomerInfo")) {
        //获取保证人信息
        this.queryCustomerInfo();
      }
    }
    //获取页面缓存
    this.getCache();
  },
  mounted() {},
  beforeRouteEnter(to, from, next) {
    next(vm => {});
  },
  methods: {
    //获取页面缓存
    getCache() {
      if (storeGet("guarantorInfo")) {
        this.guarantorInfo = storeGet("guarantorInfo");
        console.log("保证人缓存", this.guarantorInfo);
      }
      if (storeGet("guarantorPartnerInfo")) {
        this.guarantorPartnerInfo = storeGet("guarantorPartnerInfo");
        console.log("配偶缓存", this.guarantorPartnerInfo);
      }
      if (storeGet("guarantorContactsInfo")) {
        if (storeGet("guarantorContactsInfo").participantStatus) {
          this.participantStatus = storeGet(
            "guarantorContactsInfo"
          ).participantStatus;
        }
        this.contactsInfo = storeGet("guarantorContactsInfo");
        console.log("联系人缓存", this.contactsInfo);
        this.contactsTypeList.forEach(element => {
          if (element.itemNo == this.contactsInfo.participantStatus) {
            this.participantStatus = element.itemName;
          }
        });
        if (!storeGet("guarantorContactsInfo").province) {
          this.contactsInfo.participantadd = "";
        }
        if (!storeGet("guarantorContactsInfo").city) {
          this.contactsInfo.participantadd = "";
        }
        if (!storeGet("guarantorContactsInfo").area) {
          this.contactsInfo.participantadd = "";
        }
      }
      if (this.$route.query.myName) {
        this.guarantorInfo.customername = this.$route.query.myName;
      }
      if (this.$route.query.myIdCard) {
        this.guarantorInfo.certid = this.$route.query.myIdCard;
      }
      if (this.$route.query.myPartnerName) {
        this.guarantorPartnerInfo.name = this.$route.query.myPartnerName;
      }
      if (this.$route.query.myPartnerIdCard) {
        this.guarantorPartnerInfo.idCard = this.$route.query.myPartnerIdCard;
      }
      console.log("bzr", this.guarantorInfo);
      console.log("lxr", this.contactsInfo);
      console.log("po", this.guarantorPartnerInfo);
    },
    //获取保证人信息
    queryCustomerInfo() {
      let url = `CustomerInfoController/queryCustomerInfo`;
      let param = {
        customerName: this.guarantorInfo.customername,
        certId: this.guarantorInfo.certid,
        certType: "Ind01", //客户证件类型 Ind01 个人 ，Ent04 营业执照
        customerType: "03" //客户类型 03个人，05公司
      };
      this.$requestBx
        .post(url, param)
        .then(res => {
          if (res.code == 200) {
            if (storeGet("guarantorMsg")) {
              this.guarantorInfo = storeGet("guarantorMsg");
              console.log("保证人信息", this.guarantorInfo);
            }
            //获取婚否
            if (res.data.marriage == "已婚") {
              this.guarantorInfo.message = "已婚";
            } else {
              this.guarantorInfo.message = "未婚";
            }
            this.guarantorInfo.mobiletelephone = res.data.phone;
            storeSet(this.guarantorInfo, "guarantorInfo");
            console.log("强行变更保证人", this.guarantorInfo);
            //获取联系人
            if (res.data.contactsinfoResult) {
              this.contactsInfo = res.data.contactsinfoResult;
              this.participantStatus =
                res.data.contactsinfoResult.participantStatus;
              this.contactsTypeList.forEach(element => {
                if (element.itemNo == this.contactsInfo.participantStatus) {
                  this.participantStatus = element.itemName;
                }
              });
            }
            storeSet(this.contactsInfo, "guarantorContactsInfo");
            console.log("强行变更联系人", this.contactsInfo);
            //获取配偶
            this.guarantorPartnerInfo.name = res.data.spouseName;
            this.guarantorPartnerInfo.idCard = res.data.spouseCertId;
            this.guarantorPartnerInfo.phone = res.data.spousetel;
            storeSet(this.guarantorPartnerInfo, "guarantorPartnerInfo");
            console.log("强行变更配偶", this.guarantorPartnerInfo);
            //获取页面缓存
            this.getCache();
          } else if (res.code == "404") {
            //保证人信息置空
            if (storeGet("guarantorMsg")) {
              this.guarantorInfo = storeGet("guarantorMsg");
              console.log("保证人信息", this.guarantorInfo);
            }
            this.guarantorInfo.message = "请选择婚姻状况";
            this.guarantorInfo.mobiletelephone = "";
            storeSet(this.guarantorInfo, "guarantorInfo");
            //联系人信息置空
            let contactsInfo = {
              participantStatus: "",
              participantName: "",
              participantPhone: "",
              participantadd: "",
              province: "",
              city: "",
              area: "",
              township: ""
            };
            storeSet(contactsInfo, "guarantorContactsInfo");
            //配偶信息置空
            let guarantorPartnerInfo = {
              name: "",
              idCard: "",
              phone: ""
            };
            storeSet(guarantorPartnerInfo, "guarantorPartnerInfo");
          }
          // else {
          //   Toast(`${res.message}`);
          // }
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
      // this.guarantorInfo.message = value;
    },
    onConfirm(picker, value, index) {
      console.log(picker, value, index);
      this.guarantorInfo.message = picker;
      this.showMessage = false;
    },
    onCancel() {
      this.showMessage = false;
    },
    //打开关系
    showReasonList() {
      this.showRelationship = true;
    },
    onChange1(picker, value, index) {
      // console.log(picker, value, index);
      // this.participantStatus = value;
      //this.contactsInfo.participantStatus = this.contactsTypeList[index].itemNo;
    },
    onConfirm1(picker, value, index) {
      console.log(picker, value, index);
      this.participantStatus = picker;
      this.contactsInfo.participantStatus = this.contactsTypeList[value].itemNo;
      this.showRelationship = false;
    },
    onCancel1() {
      this.showRelationship = false;
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
      if (!this.guarantorInfo.customername) {
        Toast("请先上传身份证");
        return;
      }
      if (!this.guarantorInfo.certid) {
        Toast("请先上传身份证");
        return;
      }
      if (this.guarantorInfo.message == "") {
        Toast("请选择婚姻状况");
        return;
      }
      if (!/^1\d{10}$/.test(this.guarantorInfo.mobiletelephone)) {
        Toast("请输入正确的手机号码");
        return;
      }
      if (this.noAnchored != 1) {
        if (this.guarantorInfo.message == "已婚") {
          if (!this.guarantorPartnerInfo.name) {
            Toast("请输入姓名");
            return;
          }
          if (!this.guarantorPartnerInfo.idCard) {
            Toast("请输入身份证号码");
            return;
          }
          if (
            !/^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(
              this.guarantorPartnerInfo.idCard
            )
          ) {
            Toast("请输入正确的身份证号码");
            return;
          }
          if (!/^1\d{10}$/.test(this.guarantorPartnerInfo.phone)) {
            Toast("请输入正确的手机号码");
            return;
          }
        } else if (this.guarantorInfo.message != "已婚") {
          if (this.participantStatus == "") {
            Toast("请选择联系人关系");
            return;
          }
          if (!this.contactsInfo.participantName) {
            Toast("请输入联系人姓名");
            return;
          }
          if (!/^1\d{10}$/.test(this.contactsInfo.participantPhone)) {
            Toast("请输入正确的手机号码");
            return;
          }
          if (!this.contactsInfo.participantadd) {
            Toast("请选择所在地区");
            return;
          }
          const addressTemp = storeGet("addressTemp");
          if (!this.contactsInfo.province) {
            this.contactsInfo.province = addressTemp[0].code;
          }
          if (!this.contactsInfo.city) {
            this.contactsInfo.city = addressTemp[1].code;
          }
          if (!this.contactsInfo.area) {
            this.contactsInfo.area = addressTemp[2].code;
          }
          if (!this.contactsInfo.township) {
            Toast("请输入详细地址");
            return;
          }
        }
      }
      this.next();
    },
    next() {
      storeSet(this.guarantorInfo, "guarantorInfo");
      storeSet(this.guarantorPartnerInfo, "guarantorPartnerInfo");
      storeSet(this.contactsInfo, "guarantorContactsInfo");
      this.$router.push({
        path: "/company",
        query: { guarantorName: this.guarantorInfo.customername }
      });
    }
  },
  beforeDestroy() {
    storeSet(this.guarantorInfo, "guarantorInfo");
    storeSet(this.guarantorPartnerInfo, "guarantorPartnerInfo");
    storeSet(this.contactsInfo, "guarantorContactsInfo");
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
  .van-field__right-icon {
    color: #ffcc00;
  }
  .van-button--info {
    color: #ffcc00;
    border: 1px solid #ffcc00;
  }
  .address {
    .van-field__right-icon {
      color: #969799;
    }
    .van-cell {
      font-size: 0.3rem;
      .van-cell__title {
        width: 2.5rem;
        color: #666;
      }
    }
  }
}
.selectRight {
  display: flex;
  justify-content: space-around;
}
</style>