<template>
  <div class="page">
    <div class="section id-card">
      <div class="beCareful">身份证信息</div>
      <addImg
        v-show="!headerImageUrl || !portraitImageUrl"
        title="点击上传身份证照片"
        @click.native="goUpload"
      ></addImg>
      <div class="img-box" v-show="headerImageUrl && portraitImageUrl">
        <div class="img-wrapper">
          <div class="item">
            <img :src="headerImageUrl" />
            <span>身份证(人像面)</span>
          </div>
          <div class="item">
            <img :src="portraitImageUrl" />
            <span>身份证(国徽面)</span>
          </div>
          <div class="item live" v-show="live">
            <img src="../../assets/img/finish.png" />
            <span>活体检测/已完成</span>
          </div>
        </div>
        <div class="btn">
          <div class="button" @click="goUpload">
            <span class="icon picture"></span>
            <span>重新上传</span>
          </div>
        </div>
      </div>
    </div>
    <div class="section personal">
      <div class="beCareful">基本信息</div>
      <div class="form">
        <van-cell-group>
          <van-field v-model.trim="form.name" label="姓名" placeholder="请先上传身份证" disabled />
          <!-- <PopupPicker v-model.trim="form.education" label="学历" :columns="educationList"></PopupPicker> -->
          <PopupPicker
            v-model.trim="form.marriageStatus"
            label="婚姻状况"
            :columns="marriageStatusList"
          ></PopupPicker>
          <van-field
            v-model.trim="form.houseAddress"
            label="住宅地址"
            placeholder="住宅地址"
            @focus="onFocus"
          />
          <PopupPicker v-model.trim="form.houseType" label="房屋性质" :columns="houseTypeList"></PopupPicker>
          <van-field v-model.trim="form.mobile" label="手机号码" placeholder="手机号码" />
          <van-field v-model.trim="form.smsCode" label="短信验证码" placeholder="请输入短信验证码">
            <van-button slot="button" size="small" type="default" @click="getSmsCode">{{btnText}}</van-button>
          </van-field>
        </van-cell-group>
      </div>
    </div>
    <div class="section document">
      <van-checkbox v-model="isReadDocument" @change="readDocumentChange" checked-color="#ffd11a">
        <span>
          我已阅读并同意
          <a @click="goDocument(1)" :style="documentStyle.personalAuthorization">《百行征信授权书》</a>、
          <a @click="goDocument(2)" :style="documentStyle.informationAuthorization">《三方征信授权书》</a>、
          <a @click="goDocument(3)" :style="documentStyle.personalCreditReporting">《授权书（个人征信业务）》</a>、
          <a @click="goDocument(4)" :style="documentStyle.riskWarining">《反欺诈风险提示》</a>，并同意采取填写手机验证码的方式签署上述授权文件。（点击文件名称查看相应文件条款）
        </span>
      </van-checkbox>
    </div>
    <div class="bottom">
      <button @click="nextCheck">下一步</button>
    </div>
    <MaskLoading :show="showLoading"></MaskLoading>
  </div>
</template>

<script>
import { Toast } from "vant";
import queryString from "querystring";
import {
  randomWord,
  formatJson,
  storeGet,
  storeSet,
  JGEvent
} from "@/utils/common.js";
import PopupPicker from "@/components/PopupPicker.vue";
import AddImg from "@/components/AddImg.vue";
import CustomForm from "@/components/CustomForm.vue";
import personalJson from "@/assets/form/personalInfo.json";
import MaskLoading from "@/components/MaskLoading.vue";
let tempEducation = null;
let tempHouseType = null;
let tempMarriageStatus = null;
export default {
  metaInfo() {
    return {
      title: "个人信息"
    };
  },
  components: {
    AddImg,
    PopupPicker,
    CustomForm,
    MaskLoading
  },
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
        validDateStart: "",
        smsCode: ""
      },
      btnText: "获取验证码",
      timerId: -1,
      timeCount: 0,
      educationList: [],
      marriageStatusList: [],
      houseTypeList: [],
      headerImageUrl: null,
      portraitImageUrl: null,
      isReadDocument: false,
      showLoading: false,
      live: false,
      documentStyle: {
        personalAuthorization: {
          color: "#7986B2"
        },
        informationAuthorization: {
          color: "#7986B2"
        },
        personalCreditReporting: {
          color: "#7986B2"
        },
        riskWarining: {
          color: "#7986B2"
        }
      }
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const tempData = storeGet();
      if (!tempData) {
        return;
      }
      const personalInfo = tempData.personalInfo;
      if (personalInfo) {
        vm.form = personalInfo;
      }
      const idCardOcr = tempData.idCardOcr;
      if (idCardOcr) {
        vm.headerImageUrl = idCardOcr.idCardFrontImageUrl;
        vm.portraitImageUrl = idCardOcr.idCardBehindImageUrl;
        vm.form.name = idCardOcr.name;
      }
      const order = tempData.order;
      if (order) {
        vm.form.applicationId = order.applicationId;
      }
      const editAddresTemp = tempData.editAddresTemp;
      if (editAddresTemp) {
        vm.form.houseAddress = editAddresTemp.allAddress;
      }
    });
  },
  created() {
    this.initData();
  },
  mounted() {
    const parsed = queryString.parse(location.search);
    const livingBodyOrderNo = storeGet("livingBodyOrderNo");
    if (livingBodyOrderNo) {
      //订单号检查
      if (!livingBodyOrderNo == parsed.orderNo) {
        Toast("无效的活体检测结果");
        return;
      }
    }
    if (parsed && parsed.code == 0) {
      this.live = true;
    }
    if (this.$route.query.code == 0) {
      //测试用
      this.live = true;
    }
    const documentTemp = storeGet("documentTemp") || {};
    if (documentTemp.personalAuthorization === 1) {
      this.documentStyle.personalAuthorization.color = "#F84859";
    }
    if (documentTemp.informationAuthorization === 1) {
      this.documentStyle.informationAuthorization.color = "#F84859";
    }
    if (documentTemp.personalCreditReporting === 1) {
      this.documentStyle.personalCreditReporting.color = "#F84859";
    }
    if (documentTemp.riskWarining === 1) {
      this.documentStyle.riskWarining.color = "#F84859";
    }
  },
  methods: {
    initData() {
      // this.queryStatusCodeInfo("education").then(resp => {
      //   const temp = resp.data;
      //   this.educationList = temp.map(item => item.codeName);
      //   tempEducation = temp;
      // });
      this.queryStatusCodeInfo("marriageStatus").then(resp => {
        const temp = resp.data;
        this.marriageStatusList = temp.map(item => item.codeName);
        tempMarriageStatus = temp;
      });
      this.queryStatusCodeInfo("houseType").then(resp => {
        const temp = resp.data;
        this.houseTypeList = temp.map(item => item.codeName);
        tempHouseType = temp;
      });
    },
    goUpload() {
      JGEvent("personal-info-click-upload-idcard-img");
      this.$router.push({
        path: "addIdCard"
      });
    },
    onFocus() {
      this.$router.push({
        path: "editAddress"
      });
    },
    async nextCheck() {
      JGEvent("personal-confirm");
      if (!this.live) {
        Toast("活体检测未通过");
        return;
      }
      try {
        this.showLoading = true;
        this.beforeSave();
        if (!this.dataCheck()) {
          return;
        }
        await this.checkSmsCode();
        await this.save();
        const applyId = await this.generateContract();
        await this.pdfSign(applyId);
        await this.next();
        this.$router.push({
          path: "earlyExamine",
          query: {
            mobile: this.form.mobile
          }
        });
      } catch (error) {
        console.error(error);
      } finally {
        this.showLoading = false;
      }
    },
    beforeSave() {
      const editAddresTemp = storeGet("editAddresTemp");
      const addressTemp = storeGet("addressTemp");
      const idCardOcr = storeGet("idCardOcr");
      if (!editAddresTemp || !addressTemp) {
        Toast("请填写住宅地址");
        throw new Error("请填写住宅地址");
      }
      this.form.areaId = addressTemp[2].code;
      this.form.areaName = addressTemp[2].name;
      this.form.birthday = idCardOcr.birth;
      this.form.cardAddress = idCardOcr.address;
      this.form.cardBack = idCardOcr.idCardBehindImageUrl;
      this.form.cardFront = idCardOcr.idCardFrontImageUrl;
      this.form.cell = editAddresTemp.building;
      this.form.cityId = addressTemp[1].code;
      this.form.cityName = addressTemp[1].name;
      this.form.customerId = "";
      //学历
      // this.form.educationCode = tempEducation.find(
      //   item => item.codeName === this.form.education
      // );
      // if (this.form.educationCode) {
      //   this.form.educationCode = this.form.educationCode.codeId;
      // } else {
      //   this.form.educationCode = "";
      // }
      //房屋性质
      this.form.houseTypeCode = tempHouseType.find(
        item => item.codeName === this.form.houseType
      );
      if (this.form.houseTypeCode) {
        this.form.houseTypeCode = this.form.houseTypeCode.codeId;
      } else {
        this.form.houseTypeCode = "";
      }
      //婚姻状况
      this.form.marriageStatusCode = tempMarriageStatus.find(
        item => item.codeName === this.form.marriageStatus
      );
      if (this.form.marriageStatusCode) {
        this.form.marriageStatusCode = this.form.marriageStatusCode.codeId;
      } else {
        this.form.marriageStatusCode = "";
      }
      this.form.householdRegister = "";
      this.form.idCard = idCardOcr.idcard;
      this.form.issueOffice = idCardOcr.authority;
      this.form.nation = idCardOcr.nation;
      this.form.provinceId = addressTemp[0].code;
      this.form.provinceName = addressTemp[0].name;
      this.form.room = editAddresTemp.doorNumber;
      this.form.sex = idCardOcr.sex;
      this.form.street = editAddresTemp.streetVillage;
      this.form.township = editAddresTemp.township;
      this.form.validDate = idCardOcr.validDate;
      this.form.validDateStart = idCardOcr.validDate.substring(0, 8);
      this.form.validDateEnd = idCardOcr.validDate.substring(9);
    },
    dataCheck() {
      const form = this.form;
      if (!form.name) {
        Toast("请填写姓名");
        return false;
      }
      // const drivingLicense = storeGet("drivingLicense");
      // if (form.name !== drivingLicense.carOwner) {
      //   Toast("行驶证姓名和身份证姓名不匹配");
      //   return;
      // }
      // if (!form.education) {
      //   Toast("请选择学历");
      //   return false;
      // }
      if (!form.marriageStatus) {
        Toast("请选择婚姻状况");
        return false;
      }
      if (!form.houseAddress) {
        Toast("请填写住宅地址");
        return false;
      }
      if (!form.houseType) {
        Toast("请选择房屋性质");
        return false;
      }
      if (!form.mobile) {
        Toast("请填写手机号码");
        return false;
      }
      if (!/^1\d{10}$/.test(form.mobile)) {
        Toast("请正确填写手机号码");
        return false;
      }
      if (!this.checkReadDocument()) {
        Toast("请查阅授权文件");
        return false;
      }
      if (!this.isReadDocument) {
        Toast("请查阅并同意签署文件");
        return false;
      }
      return true;
    },
    save() {
      const url = "loanPersonInfo/saveOrUpdate";
      return this.$request.post(url, this.form);
    },
    next() {
      const url = "loanApplicationInfo/submitToDecisionEngine";
      return this.$request
        .get(url, {
          params: {
            applicationId: this.form.applicationId
          }
        })
        .then(resp => {
          const data = resp.data;
          if (data.message == "OK" && data.result == "success") {
            return Promise.resolve();
          } else {
            Toast(JSON.stringify(resp.data));
            return Promise.reject();
          }
        });
    },
    generateContract() {
      const url = "loanApplicationInfo/generateContract";
      return this.$request
        .get(url, {
          params: {
            applicationId: this.form.applicationId
          }
        })
        .then(resp => {
          if (resp.data.result != "success" || resp.data.message != "OK") {
            Toast(`合同生成失败 ${resp.data.message}`);
            return Promise.reject("合同生成失败");
          } else if (!resp.data.contractNo) {
            Toast(`合同生成失败`);
            return Promise.reject("合同生成失败");
          } else {
            storeSet(resp.data.contractNo, "contractNo");
            return Promise.resolve(resp.data.contractNo);
          }
        });
    },
    goDocument(type) {
      switch (type) {
        case 1:
          this.$router.push({
            path: "personalAuthorization"
          });
          break;
        case 2:
          this.$router.push({
            path: "informationAuthorization"
          });
          break;
        case 3:
          this.$router.push({
            path: "personalCreditReporting"
          });
          break;
        case 4:
          this.$router.push({
            path: "riskWarning"
          });
          break;
        default:
          break;
      }
    },
    queryStatusCodeInfo(type) {
      const url = "statusCodeInfoController/queryStatusCodeInfo";
      return this.$request.get(url, {
        params: {
          type: type
        }
      });
    },
    readDocumentChange() {
      if (!this.isReadDocument) {
        return;
      }
      if (this.isReadDocument && !this.checkReadDocument()) {
        Toast(
          "请阅读《授权书（个人征信业务）》,《百行征信授权书》,《三方征信授权书》,《反欺诈风险提示》"
        );
      }
    },
    checkReadDocument() {
      const documentTemp = storeGet("documentTemp") || {};
      if (documentTemp.personalAuthorization != 1) {
        this.isReadDocument = false;
        return false;
      }
      if (documentTemp.informationAuthorization != 1) {
        this.isReadDocument = false;
        return false;
      }
      if (documentTemp.personalCreditReporting != 1) {
        this.isReadDocument = false;
        return false;
      }
      if (documentTemp.riskWarining != 1) {
        this.isReadDocument = false;
        return false;
      }
      return true;
    },
    pdfSign(applyId) {
      const order = storeGet("order");
      const url = "pdfSign/savePdfSign";
      const data = {
        inputuser: this.form.name,
        applyId: applyId,
        cname: this.form.name,
        cid: this.form.idCard,
        applicationId: order.applicationId,
        phoneNumber: this.form.mobile
      };
      return this.$request.post(url, data);
    },
    async getSmsCode() {
      if (!this.live) {
        Toast("请先上传身份证并通过活体检测");
        return;
      }
      if (!this.form.mobile) {
        Toast("请输入手机号");
        return;
      }
      if (!/^1\d{10}$/.test(this.form.mobile)) {
        Toast("请正确填写手机号码");
        return false;
      }
      if (this.timerId != -1) {
        Toast("已发送验证码");
        return;
      }
      this.showLoading = true;
      try {
        const url = `${this.$baseInfo.VUE_APP_API_URL_THIRDPARTY}/shortMsg/getVerifyCode`;
        const resp = await this.$request.post(url, {
          templateType: 9,
          mobile: this.form.mobile
        });
        Toast("已发送验证码");
      } catch (error) {
        console.error(error);
      } finally {
        this.showLoading = false;
      }
      this.timeCount = 60;
      this.btnText = `已发送(${this.timeCount})`;
      this.timerId = window.setInterval(() => {
        this.timeCount--;
        if (this.timeCount < 0) {
          window.clearInterval(this.timerId);
          this.timerId = -1;
          this.btnText = "获取验证码";
        } else {
          this.btnText = `已发送(${this.timeCount})`;
        }
      }, 1000);
    },
    async checkSmsCode() {
      if (!this.form.mobile) {
        Toast("请输入手机号");
        return Promise.reject();
      }
      if (!/^1\d{10}$/.test(this.form.mobile)) {
        Toast("请正确填写手机号码");
        return Promise.reject();
      }
      if (!this.form.smsCode) {
        Toast("请填写短信验证码");
        return Promise.reject();
      }
      if (process.env.VUE_APP_RUNTIME != "production") {
        if (this.form.smsCode == "000000") {
          return Promise.resolve();
        }
      }
      const url = `${this.$baseInfo.VUE_APP_API_URL_THIRDPARTY}/shortMsg/checkVerifyCode`;
      const resp = await this.$request.post(url, {
        verifyCode: this.form.smsCode,
        mobile: this.form.mobile
      });
      if (resp.code != 200) {
        Toast("验证码错误");
        return Promise.reject();
      } else {
        return Promise.resolve();
      }
      return;
    }
  },
  watch: {
    form: {
      handler: function(val, oldVal) {
        const tempData = storeGet();
        tempData.personalInfo = this.form;
        storeSet(tempData);
      },
      deep: true
    }
  }
};
</script>
<style lang="scss" scoped>
.page {
  flex-direction: column;
  .section {
    &.id-card {
      flex: 0 0 4rem;
      .img-box {
        display: flex;
        flex-direction: column;
        background-color: white;
        justify-content: center;
        align-items: center;
        height: 3rem;
        .img-wrapper {
          display: flex;
          .item {
            &.live {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-around;
              img {
                width: 0.7rem;
                height: 0.7rem;
              }
            }
          }
        }
        img {
          width: 2rem;
          height: 1.34rem;
          margin: 0 0.2rem;
        }
        .btn {
          margin-top: 0.2rem;
          .button {
            width: 4rem;
            height: 0.56rem;
            border: 2px solid rgba(255, 209, 26, 1);
            border-radius: 27px;
            background-color: white;
            color: #ffd11a;
            display: flex;
            justify-content: center;
            align-items: center;
          }
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
    &.personal {
      flex: 0 0 4rem;
      .item {
        &.sms-code {
          display: flex;
          align-items: stretch;
          padding-top: 12px;
          background-color: $bg-color;
          input {
            height: 100%;
            flex: 1 1 70%;
            padding-left: 0.3rem;
          }
          button {
            height: 100%;
            flex: 1 1 30%;
          }
        }
      }
      .van-button {
        .van-button__text {
          color: #ffd11a;
        }
      }
    }
    &.document {
      flex: 0 0 2rem;
      padding: 0.2rem 0.2rem;
    }
    .beCareful {
      /* width: 100%; */
      height: 0.8rem;
      padding-left: 0.28rem;
      text-align: left;

      line-height: 1rem;
      font-size: 0.28rem;
      font-family: PingFangSC-Regular;
      color: rgba(136, 136, 136, 1);
      background-color: $bg-color;
    }
  }
  .bottom {
    flex: 0 0 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 0.56rem;
    button {
      width: 5.8rem;
      @include button;
    }
  }
}
</style>