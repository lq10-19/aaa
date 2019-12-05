<template>
  <div class="page">
    <div class="section">
      <img class="success-img" src="../../assets/img/success.png" />
      <p>您的贷款申请已经提交</p>
      <p class="line"></p>
      <img class="mp-img" src="../../assets/img/bqyhxcx.png" />
      <p class="msg">关注佰仟易行微信小程序</p>
      <p class="msg">了解更多车信息</p>
    </div>
  </div>
</template>

<script>
import { storeRemove } from "@/utils/common.js";
export default {
  metaInfo: {
    title: "提交成功"
  },
  mounted() {
    storeRemove();
  }
};
</script>
<style lang="scss" scoped>
.page {
  flex-direction: column;
  align-items: center;
  .section {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .success-img {
      margin-top: 1.2rem;
      width: 1.8rem;
      height: 1.8rem;
    }
    p {
      font-size: 0.32rem;
      font-weight: 400;
      margin-top: 0.6rem;
    }
    .msg {
      margin-top: 0.2rem;
      color: #999999;
      font-size: 0.28rem;
    }
    .mp-img {
      margin-top: 0.3rem;
      width: 2.4rem;
      height: 2.4rem;
    }
    .line {
      width: 90%;
      height: 2px;
      background: rgba(231, 231, 231, 1);
    }
  }
}
</style>