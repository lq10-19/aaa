<template>
  <div class="page">
    <div v-if="isMarried" class="section spouse">
      <div class="beCareful">配偶信息</div>
      <div class="form">
        <van-cell-group>
          <van-field v-model="spouseInfo.name" label="配偶姓名" placeholder="请输入配偶姓名"/>
          <van-field v-model="spouseInfo.idCard" label="配偶证件号码" placeholder="配偶证件号码"/>
          <van-field v-model="spouseInfo.mobile" label="配偶手机号码" placeholder="请输入手机号"/>
        </van-cell-group>
      </div>
    </div>
    <div v-else class="section contacts">
      <div class="beCareful">联系人信息</div>
      <div class="form">
        <van-cell-group>
          <van-field v-model="contactsInfo.name" label="联系人姓名" placeholder="联系人姓名"/>
          <van-field v-model="contactsInfo.mobile" label="联系人手机号" placeholder="联系人手机号"/>
          <PopupPicker v-model="contactsInfo.relation" label="与申请人关系" :columns="relationList"></PopupPicker>
        </van-cell-group>
      </div>
    </div>
    <div class="btn-wrapper">
      <button class="btn left" @click="goBack">上一步</button>
      <button class="btn right" @click="confirmCheck">下一步</button>
    </div>
    <MaskLoading :show="showLoading"></MaskLoading>
  </div>
</template>

<script>
import { Toast } from "vant";
import { storeGet, storeSet, storeRemove } from "@/utils/common.js";
import PopupPicker from "@/components/PopupPicker.vue";
import MaskLoading from "@/components/MaskLoading.vue";
let relationTemp = null;
export default {
  metaInfo: {
    title: "佰仟车抵贷"
  },
  components: {
    PopupPicker,
    MaskLoading
  },
  data() {
    return {
      showLoading: false,
      isMarried: false,
      driveImgUrl: null,
      applicationId: null,
      contractNo: null,
      typeno: null,
      companyInfo: {
        name: null,
        trade: null,
        occupation: null,
        address: null,
        phoneNumber: null
      },
      spouseInfo: {
        applicationId: null,
        name: null,
        idCard: null,
        mobile: null
      },
      contactsInfo: {
        applicationId: null,
        name: null,
        mobile: null,
        relation: null,
        relationCode: null
      },
      relationList: []
    };
  },
  created() {
    this.init();
  },
  mounted() {},
  beforeRouteEnter(to, from, next) {
    next(vm => {});
  },
  methods: {
    async init() {
      const query = this.$route.query;
      const applicationId = query.applicationId;
      const contractNo = query.contractNo;
      const typeno = query.typeno;
      if (!applicationId || !contractNo || !typeno) {
        Toast("未获取到订单id或合同id或typeno");
        return;
      }
      this.applicationId = applicationId;
      this.contractNo = contractNo;
      this.typeno = typeno;
      this.contactsInfo.applicationId = applicationId;
      this.spouseInfo.applicationId = applicationId;
      try {
        this.showLoading = true;
        await this.queryStatusCodeInfo();
        await this.getDetail(contractNo);
      } catch (error) {
        console.error(error);
      } finally {
        this.showLoading = false;
      }
    },
    goUpload() {
      this.$router.push({
        path: "addDriveImg"
      });
    },
    goBack() {
      this.$router.go(-1);
    },
    confirmCheck() {
      if (this.isMarried) {
        const spouseInfo = this.spouseInfo;
        if (!spouseInfo.applicationId) {
          Toast("未获取到订单id");
          return;
        }
        if (!spouseInfo.name) {
          Toast("请填写姓名");
          return;
        }
        const regChinese = /^[\u4e00-\u9fa5]+$/;
        if (!regChinese.test(spouseInfo.name)) {
          Toast("请填写中文姓名");
          return;
        }
        if (!spouseInfo.mobile) {
          Toast("请填写手机号");
          return;
        }
        if (!/^1\d{10}$/.test(spouseInfo.mobile)) {
          Toast("请正确填写手机号码");
          return false;
        }
        if (!spouseInfo.idCard) {
          Toast("请填写证件号码");
          return;
        }
        if (spouseInfo.idCard.length < 18) {
          Toast("请正确填写身份证号码");
          return;
        }
      } else {
        const contactsInfo = this.contactsInfo;
        if (!contactsInfo.applicationId) {
          Toast("未获取到订单id");
          return;
        }
        if (!contactsInfo.name) {
          Toast("请填写联系人姓名");
          return;
        }
        const regChinese = /^[\u4e00-\u9fa5]+$/;
        if (!regChinese.test(contactsInfo.name)) {
          Toast("请填写中文姓名");
          return;
        }
        if (!contactsInfo.mobile) {
          Toast("请填写联系人手机号");
          return;
        }
        if (!/^1\d{10}$/.test(contactsInfo.mobile)) {
          Toast("请正确填写手机号码");
          return false;
        }
        if (!contactsInfo.relation) {
          Toast("请选择与申请人关系");
          return;
        }
        const find = relationTemp.find(
          item => item.codeName === contactsInfo.relation
        );
        if (find) {
          contactsInfo.relationCode = find.codeId;
        } else {
          Toast("未知的与申请人关系");
          return;
        }
      }
      this.submit();
    },
    async submit() {
      this.showLoading = true;

      try {
        if (this.isMarried) {
          const url = "loanSpouseInfo/saveOrUpdate";
          await this.$request.post(url, this.spouseInfo);
        } else {
          const url = "loanContactInfo/saveOrUpdate";
          await this.$request.post(url, this.contactsInfo);
        }
        this.$router.push({
          path: "fileUpload_index",
          query: {
            contractNo: this.contractNo,
            typeno: this.typeno
          }
        });
      } catch (error) {
        console.error(error);
      } finally {
        this.showLoading = false;
      }
    },
    async queryStatusCodeInfo() {
      const url = "statusCodeInfoController/queryStatusCodeInfo";
      const resp = await this.$request.get(url, {
        params: {
          type: "relation"
        }
      });
      const temp = resp.data;
      this.relationList = temp.map(item => item.codeName);
      this.relationList = this.relationList.filter(item => item !== "配偶");
      relationTemp = temp;
    },
    async getDetail(contractNo) {
      const url = "loanApplicationInfo/getDetail";
      const resp = await this.$request.get(url, {
        params: {
          contractNo
        }
      });
      const personInfo = resp.data.personInfo;
      const spouseInfo = resp.data.spouseInfo;
      const contactInfo = resp.data.contactInfo;
      if (personInfo.marriageStatus === "已婚") {
        this.isMarried = true;
      } else {
        this.isMarried = false;
      }
      if (spouseInfo) {
        this.spouseInfo = spouseInfo;
      } else if (contactInfo) {
        this.contactsInfo = contactInfo;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.page {
  flex-direction: column;
  .section {
    &.img {
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
        button {
          background: none;
          background-color: white;
          color: #ffd11a;
          margin-top: 20px;
          margin-bottom: 20px;
          width: 4rem;
          height: 0.56rem;
          border: 2px solid rgba(255, 209, 26, 1);
          border-radius: 27px;
        }
      }
    }
  }
  .btn-wrapper {
    display: flex;
    justify-content: space-between;
    width: 80%;
    height: 0.94rem;
    padding: 0.8rem 0.4rem;
    .btn {
      width: 2.7rem;
    }

    .left {
      @include button;
    }

    .right {
      @include button;
    }
  }
}
</style>