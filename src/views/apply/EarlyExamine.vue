<template>
  <div class="page">
    <div class="section">
      <div class="title">系统正在对您提交的信息进行预审。</div>
      <van-progress :percentage="percentage" color="#FFCC00" :show-pivot="false" />
      <div class="remarks">
        <p>这个过程可能需要2分钟左右时长</p>
        <p>预审结果请留意短信通知</p>
      </div>
    </div>
    <div class="bottom">
      <button @click="goOrderList">查看订单列表</button>
    </div>
  </div>
</template>

<script>
import { storeRemove } from "@/utils/common.js";
let start = null;
export default {
  metaInfo: {
    title: "信息预审"
  },
  components: {},
  data() {
    return {
      mobile: null,
      percentage: 0,
      timerId: null,
      timeStep: 300,
      step: 0.1,
      maxPercentage: 95
    };
  },
  created() {},
  mounted() {
    storeRemove();
    if (window.requestAnimationFrame) {
      this.timerId = window.requestAnimationFrame(this.percentageAdd);
    } else {
      this.timerId = window.setTimeout(this.percentageAdd, this.timeStep);
    }
    const query = this.$route.query;
    this.mobile = query.mobile;
  },
  methods: {
    percentageAdd(timestamp) {
      if (window.requestAnimationFrame) {
        if (!start) {
          start = timestamp;
        }
        const progress = timestamp - start;
        this.percentage += this.step;
        if (this.percentage > this.maxPercentage) {
          this.percentage = this.maxPercentage;
          window.cancelAnimationFrame(this.timerId);
        }
        if (this.percentage < 100) {
          window.requestAnimationFrame(this.percentageAdd);
        }
      } else {
        this.percentage += this.step;
        if (this.percentage > this.maxPercentage) {
          this.percentage = this.maxPercentage;
          window.clearTimeout(this.timerId);
        }
        window.setTimeout(this.percentageAdd, this.timeStep);
      }
    },
    goOrderList() {
      this.$router.push({
        path: "orderList",
        query: {
          mobile: this.mobile
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.page {
  flex-direction: column;
  align-items: center;
  .section {
    margin-top: 1rem;
    .title {
      font-size: 0.32rem;
      font-weight: bold;
      margin-bottom: 0.4rem;
    }
    .van-progress {
      margin-bottom: 0.6rem;
    }
    .remarks {
      color: #999999;
    }
  }
  .bottom {
    margin-top: 0.3rem;
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding-top: 0.3rem;
    button {
      width: 4.8rem;
      @include button;
    }
  }
}
</style>