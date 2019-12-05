<template>
  <div class="body_box">
    <p class="title">反欺诈风险提示</p>
    <p class="title-a">尊敬的客户：</p>
    <p class="p">
      针对近期市场上存在不法人员唆使客户诈骗车贷公司及融资租赁公司的现象，佰仟融资租赁有限公司（下称“佰仟”）在此提示您：
      <span
        class="bottom-black"
      >为维护您自身信息安全，保持良好信用记录，请拒绝参与欺诈，一经发现必将被追究法律责任。</span>
    </p>
    <p class="p">如您在办理佰仟汽车融资租赁业务时遇到他人承诺或自称：</p>
    <p class="p">1. 如成功办理贷款业务或融资租赁业务，无需还款或可以少还款。</p>
    <p class="p">2. 可以给您一辆车在多家金融机构/融资租赁公司重复办理贷款业务或融资租赁业务。</p>
    <p class="p">3. 答应给您办理大额信用卡或其它贷款业务，以便您顺利申请融资租赁业务。</p>
    <p class="p">4. 答应代您还款的情况（如销售人员或其他人员代为还款等）。</p>
    <p class="p">如出现以上情形，您可能已经上当受骗，为避免您不经意沦为诈骗犯罪的共犯，保障自身合法权益，请立即向佰仟反映并停止贷款或融资租赁申请。</p>
    <p class="p title-a">在此佰仟公司郑重提醒：</p>
    <p class="p">1. 请务必使用您本人真实身份及真实个人资料申请贷款业务或融资租赁业务，如发现提供虚假资料，我们将立即报警，交由公安部门处理。</p>
    <p class="p">2. 卷入欺诈案件的客户，如逾期未还款,您可能会承担以下风险：</p>
    <p class="p">首先，根据合同约定对于逾期客户佰仟可以收取相应的逾期滞纳金，逾期时间越长，您所承担的滞纳金越高并且会对您造成不良信用记录。</p>
    <p class="p">其次，一旦逾期还款被起诉，不但要还清所有款项，还要进一步承担催收费、律师费、诉讼费等款项。如还拒绝还款，您名下的所有个人财产将被法院强制拍卖以偿还欠款。</p>
    <p
      class="p"
    >最后，被申请执行人的身份信息将被录入到最高院的被执行人信息查询平台，您将来申请银行贷款等金融机构融资都会受到限制；同时，根据最高院规定，因为被执行而被采取限制消费措施的公民，将在乘坐高铁或动车一等座、飞机，以及酒店娱乐高消费、子女就读私立学校、购买高额理财产品等方面都将受到限制。</p>
    <p class="p">3. 此外，参与欺诈的客户如情节严重的，还将被追究刑事责任、定罪判刑。</p>
    <p class="p">4. 如您有任何疑问，请直接与佰仟公司的员工洽谈，或拨打佰仟融资租赁有限公司客户服务热线：40099-87-105</p>
    <p class="p">本人已阅读并了解以上“反欺诈风险提示”的全部内容，本人如有以上情节造成贵司经济损失的，愿意承担一切法律责任。</p>
    <div class="sign">
      <p>
        客户签字:
        <span class="name">{{name}}</span>
      </p>
      <p>
        日 期：
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
    title: "反欺诈风险提示"
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
      documentTemp.riskWarining = 1;
      storeSet(documentTemp, "documentTemp");
    }
  }
};
</script>

<style lang='scss' scoped>
.body_box {
  text-align: left;
  background-color: #fff;
  padding: 0.5rem 0.3rem 1rem 0.3rem;

  font-family: PingFangSC-Medium;
  font-weight: 500;
  line-height: 0.48rem;
  font-size: 0.28rem;
  color: #333333;
  .title {
    font-size: 0.34rem;
    color: black;
    line-height: 0.34rem;
    text-align: center;
    font-weight: 500;
  }
  .title-a {
    margin-top: 0.4rem;
    font-weight: 600;
    font-size: 0.28rem;
    color: black;
    line-height: 0.48rem;
  }
  .p {
    text-indent: 0.6rem;
  }
  .bottom-black {
    font-weight: bolder;
    text-decoration: underline;
  }
  .sign {
    margin-left: 40%;
  }
}
</style>