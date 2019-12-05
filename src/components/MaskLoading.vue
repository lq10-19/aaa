<template>
  <div>
    <van-popup v-model="isShow">
      <van-loading color="#FFCC00">{{text}}</van-loading>
    </van-popup>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      require: true
    },
    text: {
      type: String,
      default: "加载中"
    }
  },
  computed: {
    isShow: {
      get() {
        return this.show;
      },
      set() {}
    }
  }
};
</script>
<style lang='scss' scoped>
.van-popup {
  background-color: transparent;
}
</style>
