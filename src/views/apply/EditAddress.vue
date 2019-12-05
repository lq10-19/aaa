<template>
  <div class="page">
    <div class="section">
      <div class="form">
        <van-cell-group>
          <PopupAddress v-model.trim="addressText"></PopupAddress>
          <van-field v-model.trim="township" label="乡镇" placeholder="乡镇"/>
          <van-field v-model.trim="streetVillage" label="街道/村" placeholder="街道/村"/>
          <van-field v-model.trim="building" label="小区" placeholder="小区"/>
          <van-field v-model.trim="doorNumber" label="房间" placeholder="房间"/>
        </van-cell-group>
      </div>
    </div>
    <div class="bottom">
      <button @click="saveCheck">保存</button>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import { storeGet, storeSet, storeRemove } from "@/utils/common.js";
import PopupAddress from "@/components/PopupAddress.vue";
export default {
  metaInfo: {
    title: "住宅地址"
  },
  components: {
    PopupAddress
  },
  data() {
    return {
      cityData: [],
      addressText: "",
      township: "",
      streetVillage: "",
      building: "",
      doorNumber: "",
      allAddress: ""
    };
  },
  created() {},
  mounted() {
    const editAddresTemp = storeGet("editAddresTemp");
    if (editAddresTemp) {
      this.addressText = editAddresTemp.addressText;
      this.township = editAddresTemp.township;
      this.streetVillage = editAddresTemp.streetVillage;
      this.building = editAddresTemp.building;
      this.doorNumber = editAddresTemp.doorNumber;
    }
  },
  methods: {
    saveCheck() {
      if (!this.addressText) {
        Toast("请选择所属地区");
        return;
      }
      // if (!this.township) {
      //   Toast("请填写乡镇");
      //   return;
      // }
      // if (!this.streetVillage) {
      //   Toast("请填写街道/存");
      //   return;
      // }
      // if (!this.building) {
      //   Toast("请填写小区");
      //   return;
      // }
      // if (!this.doorNumber) {
      //   Toast("请填写房间");
      //   return;
      // }
      this.allAddress =
        this.addressText +
        `${this.township}${this.streetVillage}${this.building}${
          this.doorNumber
        }`;
      this.save();
    },
    save() {
      const tempDataSet = storeGet();
      tempDataSet.editAddresTemp = this.$data;
      storeSet(tempDataSet);
      this.$router.back();
    }
  }
};
</script>
<style lang="scss" scoped>
.page {
  flex-direction: column;
  .bottom {
    padding-top: 0.4rem;
    button {
      width: 5.8rem;
      @include button;
    }
  }
}
</style>