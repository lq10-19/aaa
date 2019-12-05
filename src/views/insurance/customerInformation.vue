<template>
  <div class="bigBox">
    <!-- 客户信息 -->
    <div class="form" v-if="customerType=='03'">
      <div class="title">客户信息</div>
      <ul>
        <li class="item">
          <span class="key">客户名称</span>
          <span class="value">{{customerMsg.customerName}}</span>
        </li>
        <li class="item">
          <span class="key">身份证号码</span>
          <span class="value">{{customerMsg.certId}}</span>
        </li>
        <li class="item">
          <span class="key">证件有效期</span>
          <span class="value">{{customerMsg.certDateStart}}-{{customerMsg.certDateEnd}}</span>
        </li>
        <li class="item">
          <span class="key">手机号码</span>
          <span class="value">{{customerMsg.phone}}</span>
        </li>
        <li class="item">
          <span class="key">民族</span>
          <span class="value">{{customerMsg.nationality}}</span>
        </li>
        <li class="item">
          <span class="key">婚姻状况</span>
          <span class="value">{{customerMsg.marriage}}</span>
        </li>
        <li class="item">
          <span class="key">地址</span>
          <span class="value">{{customerMsg.familyAddDetail}}</span>
        </li>
      </ul>
    </div>
    <!-- 公司信息 -->
    <div class="form" v-if="customerType=='05'">
      <div class="title">公司信息</div>
      <ul>
        <li class="item">
          <span class="key">公司名称</span>
          <span class="value">{{companyMsg.workcorp}}</span>
        </li>
        <li class="item">
          <span class="key">统一社会信用代码</span>
          <span class="value">{{companyMsg.certId}}</span>
        </li>
        <li class="item">
          <span class="key">注册地址</span>
          <span class="value">{{companyMsg.registerAddDetail}}</span>
        </li>
        <li class="item">
          <span class="key">经营地址</span>
          <span class="value">{{companyMsg.workAddDetail}}{{companyMsg.detailedAddress}}</span>
        </li>
        <li class="item">
          <span class="key">法人姓名</span>
          <span class="value">{{companyMsg.legalPerson}}</span>
        </li>
        <li class="item">
          <span class="key">身份证号码</span>
          <span class="value">{{companyMsg.legalPersonId}}</span>
        </li>
        <li class="item">
          <span class="key">手机号码</span>
          <span class="value">{{companyMsg.mobiletelePhone}}</span>
        </li>
      </ul>
    </div>
    <!-- 实际用车人信息 -->
    <div class="form" v-if="customerType=='05'">
      <div class="title" v-if="hangupflag=='1'">实际用车人信息</div>
      <div class="title" v-if="hangupflag=='2'">保证人信息</div>
      <ul>
        <li class="item">
          <span class="key">客户名称</span>
          <span class="value">{{guarantorMsg.customername}}</span>
        </li>
        <li class="item">
          <span class="key">身份证号码</span>
          <span class="value">{{guarantorMsg.certid}}</span>
        </li>
        <li class="item">
          <span class="key">证件有效期</span>
          <span class="value">{{guarantorMsg.certDateStart}}-{{guarantorMsg.certDateEnd}}</span>
        </li>
        <li class="item">
          <span class="key">手机号码</span>
          <span class="value">{{guarantorMsg.mobiletelephone}}</span>
        </li>
        <li class="item">
          <span class="key">民族</span>
          <span class="value">{{guarantorMsg.nationality}}</span>
        </li>
        <li class="item">
          <span class="key">婚姻状况</span>
          <span class="value">{{guarantorMsg.marriage}}</span>
        </li>
        <li class="item">
          <span class="key">地址</span>
          <span class="value">{{guarantorMsg.familyAddDetail}}</span>
        </li>
      </ul>
    </div>
    <div v-if="customerType=='03'||hangupflag=='1'">
      <!-- 配偶信息 -->
      <div class="form" v-if="marriage=='已婚'">
        <div class="title">配偶信息</div>
        <ul>
          <li class="item">
            <span class="key">姓名</span>
            <span class="value">{{partnerMsg.spouseName}}</span>
          </li>
          <li class="item">
            <span class="key">身份证号码</span>
            <span class="value">{{partnerMsg.spousetel}}</span>
          </li>
          <li class="item">
            <span class="key">手机号码</span>
            <span class="value">{{partnerMsg.spouseCertId}}</span>
          </li>
        </ul>
      </div>
      <!-- 联系人信息 -->
      <div class="form" v-if="marriage=='未婚'">
        <div class="title">联系人信息</div>
        <ul>
          <li class="item">
            <span class="key">关系</span>
            <span class="value">{{contactsMsg.participantStatus}}</span>
          </li>
          <li class="item">
            <span class="key">姓名</span>
            <span class="value">{{contactsMsg.participantName}}</span>
          </li>
          <li class="item">
            <span class="key">手机号码</span>
            <span class="value">{{contactsMsg.participantPhone}}</span>
          </li>
          <li class="item">
            <span class="key">地址</span>
            <span class="value">{{contactsMsg.participantadd}}{{contactsMsg.township}}</span>
          </li>
        </ul>
      </div>
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
      title: "客户信息"
    };
  },
  components: {},
  data() {
    return {
      serialno: "",
      contentTitle: "",
      contractNo: "",
      customerType: "", //客户类型
      marriage: "", //婚姻状况
      hangupflag: "", //挂靠1  非挂靠2
      customerMsg: {}, //个人
      companyMsg: {}, //公司
      guarantorMsg: {}, //保证人
      partnerMsg: {}, //配偶
      contactsMsg: {} //联系人
    };
  },
  created() {
    this.serialno = this.$route.query.serialno;
    //查询合同详情
    this.queryAppyDetail();
  },
  mounted() {},
  methods: {
    //查询合同详情
    queryAppyDetail() {
      let url = `CustomerInfoController/queryAppyDetail?serialno=${this.serialno}`;
      return this.$requestBx
        .get(url)
        .then(res => {
          if (res.code == 200) {
            this.customerType = res.data.customerType;
            //个人
            if (res.data.customerType == "03") {
              this.customerMsg = res.data.result;
              this.marriage = res.data.result.marriage;
              this.partnerMsg = {
                spouseName: res.data.result.spouseName,
                spousetel: res.data.result.spousetel,
                spouseCertId: res.data.result.spouseCertId
              };
              this.contactsMsg = res.data.result.contactsinfoResult;
              //公司
            } else if (res.data.customerType == "05") {
              this.hangupflag = res.data.hangupflag;
              this.companyMsg = res.data.endInfoResult;
              this.guarantorMsg = res.data.endInfoResult.guarantorResult;
              this.marriage = res.data.endInfoResult.guarantorResult.marriage;
              this.partnerMsg = {
                spouseName: res.data.endInfoResult.guarantorResult.spouseName,
                spousetel: res.data.endInfoResult.guarantorResult.spousetel,
                spouseCertId:
                  res.data.endInfoResult.guarantorResult.spouseCertId
              };
              if (res.data.endInfoResult.guarantorResult.contactsinfoResult) {
                this.contactsMsg =
                  res.data.endInfoResult.guarantorResult.contactsinfoResult;
              }
            }
          } else {
            Toast(`${res.message}`);
          }
        })
        .catch(error => {
          console.log(error);
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
  padding-bottom: 2rem;
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
        height: 100%;
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
          line-height: 0.4rem;
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