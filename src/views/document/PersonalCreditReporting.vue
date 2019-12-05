<template>
  <div class="bigbox">
    <p class="title">授权书（个人征信业务）</p>
    <div
      class="title_1 indent weight_600"
    >尊敬的客户：为了维护您的权益，请在签署本授权书前，仔细阅读本授权书各条款（特别是黑体字条款），关注您在授权书中的权利、义务。如有任何疑问，请向我司咨询。</div>
    <div class="title_2 indent color_666">佰仟融资租赁有限公司：</div>
    <div class="indent top_1">
      <span class="color_666">一、本人同意并不可撤销地授权：</span>
      <span
        class="color_333"
      >贵公司按照国家相关规定采集并向金融信用信息基础数据库及其他依法成立的征信机构提供本人个人信息和包括信贷信息在内的信用信息（包含本人因未及时履行合同义务产生的不良信息）。</span>
    </div>
    <div class="indent top_1">
      <span class="color_666">二、本人同意并不可撤销地授权：</span>
      <span
        class="color_333"
      >贵公司可以根据国家有关规定，自本授权书签署之日至约定用途的业务结清之日时，有权向金融信用信息基础数据库及其他依法成立的征信机构查询、打印、保存本人的信用信息，可以进行贷后管理及异议核查，并用于下述用途：</span>
    </div>
    <div class="indent color_FF3A31 top_1">
      <i class="icon"></i> 客户准入资格审查、贷款审批。
    </div>
    <div class="indent color_666 top_1">三、如果贵公司超出本授权书范围进行数据报送和查询使用，则贵公司应承担与此有关的法律责任。</div>
    <div class="indent color_333 top_1">四、若本人在贵公司业务未获批准办理，本授权书及本人信用报告等资料无须退回本人。</div>
    <div
      class="color_333 top_4"
    >本人声明：本人已仔细阅读上述所有条款，并已特别注意字体加黑的内容。贵公司已应本人要求对相关条款予以明确说明。本人对所有条款的含义及相应的法律后果已全部通晓并充分理解，本人自愿作出上述授权、承诺和声明。</div>
    <div class="color_000 top_6 Signature">
      <p>
        本人姓名：
        <span class="name">{{name}}</span>
      </p>
      <p>
        证件名称及号码：身份证/
        <span class="cardNumber">{{idcard}}</span>
      </p>
      <p>
        签署日期：
        <span class="date">{{date}}</span>
      </p>
    </div>
  </div>
</template>
<script>
import { getNowFormatDate, storeGet, storeSet } from "../../utils/common.js";
import { Toast } from "vant";
export default {
  metaInfo: {
    title: "授权书（个人征信业务）"
  },
  data() {
    return {
      date: getNowFormatDate(" 年 ", " 月 ", " 日 ") || "查询中...",
      name: null,
      idcard: null
    };
  },
  created() {
    const idCardOcr = storeGet("idCardOcr");
    if (idCardOcr) {
      this.name = idCardOcr.name;
      this.idcard = idCardOcr.idcard;
    } else {
      Toast("未获取到个人信息");
    }
  },
  mounted() {
    if (this.name && this.idcard) {
      const documentTemp = storeGet("documentTemp") || {};
      documentTemp.personalCreditReporting = 1;
      storeSet(documentTemp, "documentTemp");
    }
  }
};
</script>
<style lang='scss' scoped>
.bigbox {
  background-color: #fff;
  padding: 0.5rem 0.3rem 1rem 0.3rem;
  text-align: left;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  line-height: 0.48rem;
  font-size: 0.28rem;

  .title {
    font-size: 0.34rem;
    color: rgba(0, 0, 0, 1);
    line-height: 0.34rem;
    text-align: center;
    font-weight: 500;
  }

  .title_1 {
    margin-top: 0.4rem;
    font-size: 0.28rem;
    color: rgba(0, 0, 0, 1);
    line-height: 0.48rem;
  }

  .title_2 {
    margin-top: 0.3rem;
  }

  .Signature {
    font-size: 0.3rem;
  }

  .indent {
    text-indent: 0.5rem;
  }

  .weight_600 {
    font-weight: 600;
  }

  .weight_700 {
    font-weight: 700;
  }

  .weight_800 {
    font-weight: 800;
  }

  .weight_900 {
    font-weight: 900;
  }

  .color_666 {
    color: #666666;
  }

  .color_333 {
    color: #333333;
  }

  .color_000 {
    color: #000000;
  }

  .color_FF3A31 {
    color: #ff3a31;
  }

  .top_1 {
    margin-top: 0.1rem;
  }

  .top_2 {
    margin-top: 0.2rem;
  }

  .top_4 {
    margin-top: 0.4rem;
  }

  .top_6 {
    margin-top: 0.6rem;
  }

  .icon {
    display: inline-block;
    width: 0.25rem;
    height: 0.25rem;
    background: url("../../assets/img/gou@2x.png") no-repeat;
    background-size: 100% 100%;
    transform: translateY(0.02rem);
  }
}
</style>