<template>
  <div class="body_box">
    <p class="title">信息使用授权书</p>
    <div class="title_1 weight_600">致：佰仟融资租赁有限公司</div>
    <div class="indent color_666 top_1">因本人向贵司申请融资业务，现本人不可撤销授权贵司以下事宜：</div>
    <div
      class="indent color_666 top_4"
    >1、本人授权贵司或贵司指定的第三方为审核本人融资申请资质或担保资质、贷后管理、异议核查、债权转让、向第三方合作担保征信企业披露等用途向中国人民银行个人信用信息基础数据库或其他与贵司合作的征信机构、第三方机构查询并使用本人及其配偶的个人征信信息及其他个人信息。贵司不得超出授权范围使用上述信息，否则应承担相应责任。</div>
    <div
      class="color_666 top_4"
    >2、本人授权贵司或贵司指定的第三方可将第1条查询所获信息及在融资业务存续过程中获取的本人个人信息提供给：中国人民银行个人信用信息基础数据库、贵司或贵司指定的第三方的关联公司、贵司或贵司指定的第三方合作的催收公司、数据公司等。本人授权贵司或贵司指定的第三方可在授权期间结束后因二次营销目的继续使用上述信息。</div>
    <div class="color_666 top_4">3、授权期间为：本授权书签订之日起至本人结清后续签订的《佰仟融资租赁合同》等融资主合同（若有）项下的全部债务之日止。</div>
    <div class="color_666 top_4">4、本人及配偶确认完全知晓并理解上述授权条款。</div>
    <div class="top_6 color_000">（以下为签字栏。）</div>
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
    title: "三方征信授权书"
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
      documentTemp.informationAuthorization = 1;
      storeSet(documentTemp, "documentTemp");
    }
  }
};
</script>

<style lang='scss' scoped>
.body_box {
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