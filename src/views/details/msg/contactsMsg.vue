<template>
  <div class="bigBox">
    <!-- <div class="form">
      <div class="title">单位信息</div>
      <ul>
        <li class="item">
          <span class="key">单位名称</span>
          <span class="value">佰仟融资租赁</span>
        </li>
        <li class="item">
          <span class="key">所属行业</span>
          <span class="value">金融</span>
        </li>
        <li class="item">
          <span class="key">单位地址</span>
          <span class="value">深圳市福田区彩田路7019号新浩e都19楼</span>
        </li>
        <li class="item">
          <span class="key">办公电话</span>
          <span class="value">0755-83076278</span>
        </li>
      </ul>
    </div> -->

    <div v-if="title=='配偶信息'" class="form">
      <div class="title">配偶信息</div>
      <ul>
        <li class="item">
          <span class="key">配偶姓名</span>
          <span class="value">{{randerData.name}}</span>
        </li>
        <li class="item">
          <span class="key">配偶证件号码</span>
          <span class="value">{{randerData.idCard }}</span>
        </li>
        <li class="item">
          <span class="key">配偶手机号码</span>
          <span class="value">{{randerData.mobile}}</span>
        </li>
      </ul>
    </div>

    <div v-if="title=='联系人信息'" class="form">
      <div class="title">联系人信息</div>
      <ul>
        <li class="item">
          <span class="key">联系人姓名</span>
          <span class="value">{{randerData.name}}</span>
        </li>
        <li class="item">
          <span class="key">联系人手机号码</span>
          <span class="value">{{randerData.mobile}}</span>
        </li>
        <li class="item">
          <span class="key">与申请人关系</span>
          <span class="value">{{randerData.relation}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import {
  randomWord,
  formatJson,
  storeGet,
  storeSet,
  storeRemove
} from "@/utils/common.js";
export default {
  metaInfo() {
    return {
      title: this.title
    };
  },
  components: {},
  data() {
    return {
      title: "",
      contentTitle: "",
      contractNo: "",
      randerData: null
    };
  },
  created() {
    this.title = "联系人信息";
    this.contractNo = this.$route.query.contractNo;
    this.getContractNoInfo();
  },
  mounted() {},
  methods: {
    // 获取合同详情
    getContractNoInfo() {
      this.$request
        .get("loanApplicationInfo/getDetail?contractNo=" + this.contractNo)
        .then(res => {
          //console.log("1");
          if (res.code == "200") {
            if (res.data.personInfo.marriageStatusCode == "1") {
              //0 已婚 1未婚 2离异
              this.randerData = res.data.contactInfo;
              if (!this.randerData) {
                Toast("暂时没有信息");
              }
              this.title = "联系人信息";
            } else {
              this.randerData = res.data.spouseInfo;
              if (!this.randerData) {
                Toast("暂时没有信息");
              }
              this.title = "配偶信息";
            }
          }
        })
        .catch(error => {
          console.log("error" + error);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.bigBox {
  font-size: 0.32rem;
  font-family: PingFangSC-Regular;
  font-weight: 400;

  .form {
    width: 100%;
    .title {
      margin-left: 0.3rem;
      color: rgba(136, 136, 136, 1);
      font-size: 0.28rem;
      line-height: 1rem;
      text-align: left;
    }
    ul {
      width: 100%;

      .item {
        width: 100%;
        height: 1rem;
        background: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid $bg-color;

        .key {
          line-height: 1rem;
          margin-left: 0.3rem;
          text-align: left;
          color: rgba(102, 102, 102, 1);
        }
        .value {
          width: 4rem;
          text-align: right;
          margin-right: 0.3rem;
          line-height: 0.35rem;
          color: rgba(0, 0, 0, 1);
          // overflow: hidden;
          // text-overflow: ellipsis;
          // white-space: nowrap;
        }
      }
    }
  }
}
</style>