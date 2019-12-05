<template>
  <div class="bigBox">
    <div class="form">
      <div class="title">申请人身份信息</div>
      <ul>
        <li class="item">
          <span class="key">姓名</span>
          <span class="value">{{personInfo.name}}</span>
        </li>
        <li class="item">
          <span class="key">性别</span>
          <span class="value">{{personInfo.sex}}</span>
        </li>
        <li class="item">
          <span class="key">民族</span>
          <span class="value">{{personInfo.nation}}</span>
        </li>
        <li class="item">
          <span class="key">身份证号码</span>
          <span class="value">{{personInfo.idCard}}</span>
        </li>
        <li class="item">
          <span class="key">出生年月日</span>
          <span class="value">{{personInfo.birthday}}</span>
        </li>
        <li class="item">
          <span class="key">签发机关</span>
          <span class="value">{{personInfo.issueOffice }}</span>
        </li>
        <li class="item">
          <span class="key">住址</span>
          <span class="value">{{personInfo.houseAddress}}</span>
        </li>
        <li class="item">
          <span class="key">有效日期</span>
          <span class="value">{{personInfo.validDateEnd }}</span>
        </li>
      </ul>
    </div>

    <div class="form">
      <div class="title">其他信息</div>
      <ul>
        <!-- <li class="item">
          <span class="key">学历</span>
          <span class="value">{{personInfo.education}}</span>
        </li> -->
        <li class="item">
          <span class="key">婚姻状况</span>
          <span class="value">{{personInfo.marriageStatus}}</span>
        </li>
        <li class="item">
          <span class="key">房屋性质</span>
          <span class="value">{{personInfo.houseType}}</span>
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
  metaInfo: {
    title: "申请人信息"
  },
  components: {},
  data() {
    return {
      contractNo:"",
      personInfo:null //申请人身份信息
    };
  },
  created() {
    this.contractNo = this.$route.query.contractNo;
    this.getContractNoInfo();
  },
  mounted() {
  },
  methods: {
    //获取合同详情
    getContractNoInfo() {
      this.$request
        .get("loanApplicationInfo/getDetail?contractNo="+this.contractNo)
        .then(res => {
          if (res.code == "200") {
            this.personInfo = res.data.personInfo;
          }
        })
        .catch(error => {
          console.log("error" + error);
        });
    },
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