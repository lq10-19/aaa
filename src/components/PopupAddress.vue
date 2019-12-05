<template>
  <div>
    <van-field
      v-model="tempValue"
      :label="title"
      right-icon="arrow"
      :placeholder="`请选择${title}`"
      @focus="onFocus"
    />
    <van-popup v-model="show" position="bottom">
      <van-area
        :area-list="areaList"
        value="110101"
        @change="onChange"
        @confirm="onConfirm"
        @cancel="onCancel"
      />
    </van-popup>
    <MaskLoading :show="showLoading" text="加载省市区数据..."></MaskLoading>
  </div>
</template>

<script>
import { storeGet, storeSet, storeRemove } from "@/utils/common.js";
import MaskLoading from "@/components/MaskLoading.vue";
let cityData = [];
export default {
  components: { MaskLoading },
  model: {
    event: "change"
  },
  props: {
    title: {
      type: String,
      default: "选择省市区"
    },
    value: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      showLoading: false,
      areaList: {
        province_list: {},
        city_list: {},
        county_list: {}
      },
      show: false,
      tempValue: null
    };
  },
  created() {
    this.getCity();
  },
  mounted() {
    if (this.value) {
      this.tempValue = this.value;
    }
  },
  methods: {
    async getCity() {
      this.showLoading = true;
      try {
        const url = `${
          this.$baseInfo.VUE_APP_API_URL_THIRDPARTY
        }areaQuery/getProvince`;
        const resp = await this.$request.get(url);
        cityData = resp.data;
        this.initCity();
      } catch (error) {
        console.error(error);
      } finally {
        this.showLoading = false;
      }
    },
    initCity() {
      const province = cityData[0];
      cityData.forEach(item => {
        this.areaList.province_list[item.provinceCode] = item.provinceName;
      });
      const citys = province.cityMapList[province.provinceCode];
      citys.forEach(item => {
        this.areaList.city_list[item.cityCode] = item.cityName;
      });
      const oneCity = citys[0];
      const areas = oneCity.districtMap[oneCity.cityCode];
      areas.forEach(item => {
        this.areaList.county_list[item.areaCode] = item.areaName;
      });
    },
    onFocus() {
      document.activeElement.blur(); //屏蔽默认键盘弹出；
      this.show = true;
    },
    onChange(picker, values, index) {
      if (index === 0) {
        const province = cityData.find(
          item => item.provinceCode == values[0].code
        );
        const citys = province.cityMapList[province.provinceCode];
        this.areaList.city_list = {};
        citys.forEach(item => {
          this.areaList.city_list[item.cityCode] = item.cityName;
        });
        const oneCity = citys[0];
        const areas = oneCity.districtMap[oneCity.cityCode];
        this.areaList.county_list = {};
        areas.forEach(item => {
          this.areaList.county_list[item.areaCode] = item.areaName;
        });
      }
      if (index === 1) {
        const province = cityData.find(
          item => item.provinceCode == values[0].code
        );
        const citys = province.cityMapList[province.provinceCode];
        const oneCity = citys.find(item => item.cityCode == values[1].code);
        const areas = oneCity.districtMap[oneCity.cityCode];
        this.areaList.county_list = {};
        areas.forEach(item => {
          this.areaList.county_list[item.areaCode] = item.areaName;
        });
      }
    },
    onConfirm(values, indexs) {
      this.tempValue = `${values[0].name}${values[1].name}${values[2].name}`;
      this.$emit("change", this.tempValue);
      this.show = false;
      const tempData = storeGet();
      tempData.addressTemp = values;
      storeSet(tempData);
    },
    onCancel() {
      this.show = false;
    }
  },
  watch: {
    value: function(val, oldVal) {
      if (val && val !== oldVal) {
        this.tempValue = this.value;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.van-cell::v-deep {
  .van-field__label {
    width: 2rem;
    text-align: left;
    margin-right: 0.2rem;
  }
}
</style>