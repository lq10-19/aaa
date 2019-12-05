<template>
  <div class="popup-datetime-picker">
    <van-cell @click="onClick" :title="label" :value="dateText" is-link />
    <van-popup v-model="show" position="bottom">
      <van-datetime-picker v-model="currentDate" type="date" @confirm="confirm" @cancel="onCancel" />
    </van-popup>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: "日期"
    },
    value: {
      type: String,
      default: "2019-01-01"
    }
  },
  model: {
    event: "change"
  },
  data() {
    return {
      show: false,
      currentDate: new Date(),
      dateText: null
    };
  },

  created() {},
  mounted() {
    if (this.value) {
      this.currentDate = new Date(this.value);
      this.dateText = this.value;
    } else {
      this.dateText = "请选择日期";
    }
  },
  methods: {
    onClick() {
      this.show = true;
    },
    // 确认 上传数据
    confirm(res) {
      this.dateText = this.formatDate(res);
      this.$emit("change", this.dateText);
      this.show = false;
    },
    formatDate(date) {
      var myyear = date.getFullYear();
      var mymonth = date.getMonth() + 1;
      var myweekday = date.getDate();

      if (mymonth < 10) {
        mymonth = "0" + mymonth;
      }
      if (myweekday < 10) {
        myweekday = "0" + myweekday;
      }
      return myyear + "-" + mymonth + "-" + myweekday;
    },
    onCancel() {
      this.show = false;
    }
  },
  watch: {
    value: function() {
      if (this.value) {
        this.currentDate = new Date(this.value);
        this.dateText = this.value;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.van-cell::v-deep {
  .van-cell__title {
    flex: none;
    width: 2rem;
    text-align: left;
    margin-right: 0.2rem;
  }
  .van-cell__value {
    text-align: left;
    color: #323233;
  }
}
</style>
