<template>
  <div class="page">
    <div class="section">
      <div class="beCareful">联系人信息</div>
      <div class="form">
        <van-cell-group>
          <van-field
            label="关系"
            v-model.trim="participantStatus"
            placeholder="请选择联系人关系"
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

    <div class="bottom">
      <button @click="nextCheck">确认</button>
      <!-- <button @click="test" class="test">重置申请</button> -->
    </div>
    <MaskLoading :show="showLoading"></MaskLoading>
    <!-- 关系 -->
    <van-popup v-model="showRelationship" position="bottom" :overlay="true">
      <van-picker
        show-toolbar
        title="客户类型"
        :columns="contactsList"
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
    title: "联系人信息"
  },
  components: {
    PopupDatetimePicker,
    AddImg,
    MaskLoading,
    PopupAddress
  },
  data() {
    return {
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
      selfMsg: {}
    };
  },
  watch: {
    //监听婚姻状况
  },
  created() {
    //恢复视口
    this.leave();
    // if (storeGet("selfMsg")) {
    //   this.selfMsg = storeGet("selfMsg");
    //   //获取客户联系人信息
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
      if (storeGet("contactsInfo")) {
        if (storeGet("contactsInfo").participantStatus) {
          this.participantStatus = storeGet("contactsInfo").participantStatus;
        }
        console.log(222);
        this.contactsInfo = storeGet("contactsInfo");
        this.contactsTypeList.forEach(element => {
          if (element.itemNo == this.contactsInfo.participantStatus) {
            this.participantStatus = element.itemName;
          }
        });
        if (!storeGet("contactsInfo").province) {
          this.contactsInfo.participantadd = "";
        }
        if (!storeGet("contactsInfo").city) {
          this.contactsInfo.participantadd = "";
        }
        if (!storeGet("contactsInfo").area) {
          this.contactsInfo.participantadd = "";
        }
      }
    },
    //获取客户联系人信息
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
            if (res.data.contactsinfoResult) {
              this.contactsInfo = res.data.contactsinfoResult;
              this.contactsTypeList.forEach(element => {
                if (element.itemNo == this.contactsInfo.participantStatus) {
                  this.participantStatus = element.itemName;
                }
              });
              //有缓存拿缓存
              this.getCache();
            }
          } else {
            Toast(`${res.message}`);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //打开关系
    showReasonList() {
      this.showRelationship = true;
    },
    onChange(picker, value, index) {
      // console.log(picker, value, index);
      // this.participantStatus = value;
      //this.contactsInfo.participantStatus = this.contactsTypeList[index].itemNo;
    },
    onConfirm(picker, value, index) {
      console.log(picker, value, index);
      this.participantStatus = picker;
      console.log(this.contactsTypeList[value]);
      this.contactsInfo.participantStatus = this.contactsTypeList[value].itemNo;
      this.showRelationship = false;
    },
    onCancel() {
      this.showRelationship = false;
    },
    //下一步
    nextCheck() {
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
      this.next();
    },
    next() {
      storeSet(this.contactsInfo, "contactsInfo");
      this.$router.push({
        path: "/personal",
        query: { contactsName: this.contactsInfo.participantName }
      });
    }
  },
  beforeDestroy() {
    storeSet(this.contactsInfo, "contactsInfo");
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
    // flex: 1 0 auto;
    // display: flex;
    // flex-direction: column;
    // justify-content: flex-start;
    // align-items: center;
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