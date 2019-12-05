<template>
  <div class="addID">
    <p class="tip">请核对自动识别结果，如有误请更正</p>
    <div class="bigBox">
      <div class="box">
        <div class="photo">
          <img src alt />
          <!-- <img :src="headerImageUrl" /> -->
          <!-- <van-icon name="scan" class="icon" size="0.4rem" /> -->
          <div class="again" @click="againAddIdCard">
            <van-icon name="photograph" size="0.5rem" class="icon" color="#FFCC00" />
            <span>重拍</span>
          </div>
        </div>
        <div class="information">
          <van-cell-group class="van-cell-group">
            <van-field
              v-model.trim="form.name"
              label="姓名"
              placeholder="请输入姓名"
              class="van-field"
              clearable
            />
            <van-field
              v-model="form.idCard"
              label="身份证号"
              placeholder="请输入身份证号"
              class="van-field"
              @input="inputIdCard"
              maxlength="18"
              clearable
            />
            <van-field
              v-model="form.nation"
              label="民族"
              placeholder="请输入民族"
              class="van-field"
              clearable
            />
            <van-field
              v-model.trim="form.cardAddress"
              label="住址"
              placeholder="请输入住址"
              class="van-field2"
              type="textarea"
              autosize
              clearable
            />
          </van-cell-group>
        </div>
      </div>
      <div class="line"></div>
      <div class="box box2">
        <div class="photo">
          <img src alt />
          <!-- <img :src="portraitImageUrl" /> -->
          <!-- <van-icon name="scan" class="icon" size="0.4rem" /> -->
          <div class="again" @click="againAddIdCard">
            <van-icon name="photograph" size="0.5rem" class="icon" color="#FFCC00" />
            <span>重拍</span>
          </div>
        </div>
        <div class="information">
          <van-cell-group class="van-cell-group">
            <van-field
              v-model.trim="form.issueOffice"
              label="签发机关"
              placeholder="请输入签发机关"
              class="van-field"
              clearable
            />
            <van-field
              v-model="form.validDate"
              label="有效期"
              placeholder="请输入有效期"
              class="van-field"
              clearable
            />
          </van-cell-group>
        </div>
      </div>
    </div>
    <div class="btn_box">
      <button class="btn" @click="submit">确定</button>
    </div>
  </div>
</template>

<script>
import {
  randomWord,
  isWeiXin,
  isIOS,
  storeGet,
  storeSet,
  storeRemove,
  JGEvent
} from "@/utils/common.js";
import store from "store";
import { Toast, Dialog, Icon } from "vant";
export default {
  data() {
    return {
      form: {
        age: 0,
        applicationId: "",
        areaId: "",
        areaName: "",
        birthday: "",
        cardAddress: "",
        cardBack: "",
        cardFront: "",
        cell: "",
        cityId: "",
        cityName: "",
        createDate: "",
        customerId: "",
        education: "",
        educationCode: "",
        houseAddress: "",
        houseType: "",
        houseTypeCode: "",
        householdRegister: "",
        idCard: "",
        issueOffice: "",
        marriageStatus: "",
        marriageStatusCode: "",
        mobile: "",
        modifyDate: "",
        name: "",
        nation: "",
        provinceId: "",
        provinceName: "",
        room: "",
        sex: "",
        street: "",
        township: "",
        validDate: "",
        validDateEnd: "",
        validDateStart: ""
      },
      // nationList: [], //民族列表
      // nationFlag: false,
      showLoading: false,
      headerImageUrl: "http://bqyx-qiniu.bqrzzl.com/idCard_zhen@2x.png",
      portraitImageUrl: "http://bqyx-qiniu.bqrzzl.com/idCard_fan@2x.png",
      mobile: "",
      openid: "",
      fromTo: "",
      message: {}, //缓存信息
      message2: {} //缓存信息
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const idCardOcr = storeGet("idCardOcr");
      if (idCardOcr) {
        //vm.form.id = idCardOcr.id; //ocr保存表id
        vm.form.name = idCardOcr.name;
        vm.form.nation = idCardOcr.nation;
        vm.form.idCard = idCardOcr.idcard;
        vm.form.sex = idCardOcr.sex;
        vm.form.issueOffice = idCardOcr.authority;
        vm.form.cardAddress = idCardOcr.address;
        vm.form.validDate = idCardOcr.validDate;
        vm.form.validDateStart = idCardOcr.validDate.split("-")[0];
        vm.form.validDateEnd = idCardOcr.validDate.split("-")[1];
        vm.headerImageUrl = idCardOcr.idCardFrontImageUrl;
        vm.portraitImageUrl = idCardOcr.idCardBehindImageUrl;
      }
    });
  },
  created() {
    //传参from
    if (this.$route.query.from) {
      this.fromTo = this.$route.query.from;
    }
  },
  mounted() {
    document.getElementsByTagName("body")[0].style.background =
      "rgba(242, 243, 245, 1)";
    document.getElementsByTagName("title")[0].textContent = "身份确认";
  },
  methods: {
    //重拍
    againAddIdCard() {
      this.$router.push({
        path: "uploadIdCard"
      });
    },
    //确定
    submit() {
      const form = this.form;
      if (!form.name) {
        Toast("请输入姓名");
        return;
      }
      if (!form.idCard) {
        Toast("请输入身份证号码");
        return;
      }
      if (
        !/^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(
          form.idCard
        )
      ) {
        Toast("请输入正确的身份证号码");
        return;
      }
      if (!form.nation) {
        Toast("请输入民族");
        return;
      }
      // if (form.nation == "汉") {
      //   form.nation = "汉";
      // } else if (!form.nation.endsWith("族")) {
      //   form.nation = form.nation + "族";
      // }
      if (!form.cardAddress) {
        Toast("请输入住址");
        return;
      }
      if (!form.issueOffice) {
        Toast("请输入签发机关");
        return;
      }
      if (!form.validDate) {
        Toast("请输入有效日期");
        return;
      } else if (form.validDate) {
        let validDateStart = form.validDate.split("-")[0];
        let validDateEnd = form.validDate.split("-")[1];
        let date = new Date();
        let year = date.getFullYear() + "";
        let month = date.getMonth() + 1 + "";
        if (month < 10) {
          month = "0" + month;
        }
        let strDate = date.getDate() + "";
        if (strDate < 10) {
          strDate = "0" + strDate;
        }
        let nowDate = year + month + strDate;
        //console.log(nowDate);
        if (validDateEnd == "长期") {
          if (
            /^[1-9]\d{7}$/.test(validDateStart) &&
            validDateStart <= nowDate
          ) {
            console.log("有效期正常");
          } else {
            Toast("有效期有误，请重新输入或扫描");
            return;
          }
        } else if (!/^[1-9]\d{7}$/.test(validDateEnd)) {
          Toast("有效期有误，请重新输入或扫描");
          return;
        } else if (validDateEnd < nowDate) {
          Toast("身份证已过期，请更换身份证扫描");
          return;
        } else {
          if (
            /^[1-9]\d{7}$/.test(validDateStart) &&
            validDateStart <= nowDate
          ) {
            console.log("有效期正常");
          } else {
            Toast("有效期有误，请重新输入或扫描");
            return;
          }
        }
      }
      Dialog.confirm({
        title: "身份有误会影响授信结果，请确认",
        message: `${this.form.name}\n${this.form.idCard}`
      })
        .then(() => {
          this.update();
        })
        .catch(() => {});
    },
    //监听输入身份证
    inputIdCard() {
      let value = this.form.idCard;
      this.form.idCard = this.form.idCard.toUpperCase();
      if (value.length > 18) {
        this.form.idCard = value.slice(0, 18);
      }
    },
    //更新客户信息
    update() {
      console.log("缓存");
      //缓存相关数据
      this.message = {
        cardFrontImageUrl: this.headerImageUrl,
        cardBehindImageUrl: this.portraitImageUrl,
        customerName: this.form.name,
        certId: this.form.idCard,
        certType: "Ind01",
        sex: this.form.sex,
        nationality: this.form.nation,
        familyAddDetail: this.form.cardAddress,
        certDateStart: this.form.validDateStart,
        certDateEnd: this.form.validDateEnd
      };
      //保证人
      this.message2 = {
        customername: this.form.name,
        certid: this.form.idCard,
        certType: "Ind01",
        nationality: this.form.nation,
        familyAddDetail: this.form.cardAddress,
        certDateStart: this.form.validDateStart,
        certDateEnd: this.form.validDateEnd
      };
      //跳转保险分期主页
      this.goCarInsuranceApply();
    },
    //跳转保险分期主页
    goCarInsuranceApply() {
      console.log("跳转");
      if (this.fromTo == "guarantor") {
        console.log("跳转1");
        //判断ocr是否同一客户
        if (storeGet("guarantorMsg")) {
          if (this.form.idCard != storeGet("guarantorMsg").certid) {
            storeRemove("queryCustomerInfo");
            storeSet("no", "customerSame");
            console.log("不同保证人");
          } else {
            storeSet("1", "queryCustomerInfo");
            storeRemove("customerSame");
            console.log("相同保证人");
          }
        }
        storeSet(this.message2, "guarantorMsg");
        this.$router.push({
          path: "/guarantorInfo",
          query: {
            myName: this.form.name,
            myIdCard: this.form.idCard
          }
        });
      } else if (this.fromTo == "guarantorPartner") {
        console.log("跳转2");
        storeSet(this.message, "guarantorPartnerMsg");
        this.$router.push({
          path: "/guarantorInfo",
          query: {
            myPartnerName: this.form.name,
            myPartnerIdCard: this.form.idCard
          }
        });
      } else if (this.fromTo == "partner") {
        console.log("跳转3");
        storeSet(this.message, "partnerMsg");
        this.$router.push({
          path: "/partnerInfo",
          query: {
            myPartnerName: this.form.name,
            myPartnerIdCard: this.form.idCard
          }
        });
      } else if (this.fromTo == "self") {
        console.log("跳转4");
        //判断ocr是否同一客户
        if (storeGet("selfMsg")) {
          if (this.form.idCard != storeGet("selfMsg").certId) {
            storeRemove("queryCustomerInfo");
            storeSet("no", "customerSame");
          } else {
            storeSet("1", "queryCustomerInfo");
            storeRemove("customerSame");
          }
        }
        storeSet(this.message, "selfMsg");
        this.$router.push({
          path: "/personal",
          query: {
            myName: this.form.name,
            myIdCard: this.form.idCard
          }
        });
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.tip {
  width: 100%;
  text-align: center;
  background-color: #f2f3f5;
  color: #888;
  padding: 0.2rem 0;
}
.bigBox {
  //margin-top: 1rem;
  .box {
    display: flex;
    background: #fff;
    //border-top: 0.01rem solid #333;
    .photo {
      width: 1.6rem;
      margin-left: 0.03rem;
      img {
        height: 1.2rem;
        width: 1.2rem;
        margin: 0 auto;
        margin-top: 0.5rem;
        border-radius: 0.1rem;
        background: #fff0cb;
      }
      .again {
        width: 2rem;
        margin: 0;
        position: relative;
        top: -1.05rem;
        left: 0.5rem;
        .icon {
          margin-left: 0.05rem;
        }
        span {
          display: block;
          font-size: 0.3rem;
          color: #ffcd03ff;
        }
      }
    }
    .information {
      width: 5.7rem;
      .van-cell-group {
        .van-field {
          font-size: 0.3rem;
          height: 1.2rem;
          vertical-align: middle;
          padding: 0.4rem 0.15rem;
          padding-left: 0.25rem;
          line-height: 0.4rem;
        }
        .van-cell {
          .van-field__label {
            color: #666;
          }
        }
        .van-field2::v-deep {
          font-size: 0.3rem;
          height: auto;
          vertical-align: middle;
          padding: 0.4rem 0.15rem;
          padding-left: 0.25rem;
          line-height: 0.4rem;
          // .van-field__body {
          //   line-height: 0.3rem;
          //   padding: 0.4rem 0.15rem;
          //   padding-left: 0.6rem;
          //   width: 4.5rem;
          // }
        }
      }
    }
  }
  .box2 {
    height: 2.4rem;
  }
  .line {
    background: rgba(242, 243, 245, 1);
    width: 100%;
    height: 0.2rem;
  }
}
.btn_box {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  padding-bottom: 1rem;
  .btn {
    display: block;
    width: 5.8rem;
    margin-top: 0.28rem;
    height: 0.9rem;
    background: linear-gradient(
      180deg,
      rgba(254, 235, 167, 1),
      rgba(255, 204, 0, 1)
    );
    //box-shadow: 0 0.14rem 0.16rem 0 rgba(186, 201, 254, 1);
    border-radius: 0.44rem;
    font-weight: bold;
    line-height: 0.88rem;
    font-size: 0.36rem;
    color: #555;
  }
}
.addID {
  text-align: left;
}
</style>