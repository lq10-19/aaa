<template>
  <div>
    <van-cell @click="onClick" :title="label" :value="selectValue" is-link />
    <van-popup v-model="show" position="bottom">
      <van-picker
        show-toolbar
        :title="label"
        :columns="columns"
        @confirm="onConfirm"
        @cancel="onCancel"
        :default-index="defaultIndex"
      />
    </van-popup>
  </div>
</template>

<script>
export default {
  model: {
    event: "change"
  },
  props: {
    columns: {
      type: Array,
      required: true
    },
    value: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      default: "请选择"
    },
    defaultIndex: {
      type: Number,
      default: 0
    }
  },
  data: function() {
    return {
      show: false,
      selectValue: null
    };
  },
  mounted() {
    if (this.value) {
      this.selectValue = this.value;
    } else {
      this.selectValue = `请选择${this.label}`;
    }
  },
  methods: {
    // 获取焦点 弹出选择框
    onClick() {
      this.show = true;
    },
    // 选值
    onConfirm(value, index) {
      this.selectValue = value;
      this.$emit("change", this.selectValue);
      this.show = false;
    },
    onCancel() {
      this.show = false;
    }
  },
  watch: {
    value: function(val, oldVal) {
      if (val && val !== oldVal) {
        this.selectValue = this.value;
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