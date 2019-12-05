<template>
  <div class="page">
    <div class="section">
      <img src="../../assets/img/refuse.png">
      <p>对不起，您的贷款申请已被拒绝。</p>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import { storeGet, storeSet, storeRemove } from "@/utils/common.js";
let start = null;
export default {
  metaInfo: {
    title: "信息预审"
  },
  components: {},
  data() {
    return {};
  },
  created() {},
  mounted() {}
};
</script>
<style lang="scss" scoped>
.page {
  flex-direction: column;
  align-items: center;
  .section {
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
      margin-top: 1.2rem;
      margin-bottom: 0.6rem;
      width: 1.8rem;
      height: 1.8rem;
    }
    p {
      font-size: 0.32rem;
      font-weight: bold;
    }
  }
}
</style>