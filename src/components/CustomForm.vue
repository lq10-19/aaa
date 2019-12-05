<template>
  <div class="form">
    <van-cell-group>
      <template v-for="field in formField">
        <template v-if="field.displayFlag === 1">
          <template v-if="field.inputType ==='text'">
            <van-field
              :key="field.id"
              v-model="field.tempValue"
              :label="field.itemName"
              :placeholder="`请输入${field.itemName}`"
              @change="onChange"
            />
          </template>
          <template v-else-if="field.inputType ==='date'">
            <PopupDatetimePicker
              :key="field.id"
              v-model="field.tempValue"
              :label="field.itemName"
              @change="onChange"
            ></PopupDatetimePicker>
          </template>
          <template v-else-if="field.inputType ==='select'">
            <PopupPicker
              :key="field.id"
              v-model="field.tempValue"
              :label="field.itemName"
              :columns="field.values"
              @change="onChange"
            ></PopupPicker>
          </template>
          <template v-else-if="field.inputType ==='smsCode'">
            <van-field
              :key="field.id"
              v-model="field.tempValue"
              :label="field.itemName"
              :placeholder="`请输入${field.itemName}`"
              @change="onChange"
            >
              <van-button slot="button" size="small" type="default">获取验证码</van-button>
            </van-field>
          </template>
          <template v-if="field.inputType ==='address'">
            <van-field
              :key="field.id"
              v-model="field.tempValue"
              :label="field.itemName"
              :placeholder="`请输入${field.itemName}`"
              right-icon="arrow"
              @focus="editAddress"
              @change="onChange"
            />
          </template>
        </template>
      </template>
    </van-cell-group>
  </div>
</template>

<script>
import { Toast } from "vant";
import { storeGet, storeSet } from "@/utils/common.js";
import PopupDatetimePicker from "@/components/PopupDatetimePicker.vue";
import PopupPicker from "@/components/PopupPicker.vue";
export default {
  components: {
    PopupDatetimePicker,
    PopupPicker
  },
  model: {
    prop: "formDefine",
    event: "change"
  },
  props: {
    formDefine: {
      type: Array,
      required: true
    },
    formName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      value: null,
      formField: []
    };
  },
  mounted() {
    this.initFormData();
    this.getCache();
  },
  methods: {
    initFormData() {
      let temp = this.formDefine;
      temp = temp.sort((a, b) => {
        return a.sortNo - b.sortNo;
      });
      temp.forEach(item => (item.tempValue = null));
      this.formField = temp.filter(item => item.enableFlag === 1);
    },
    getCache() {
      const temp = storeGet();
      const cacheData = temp[this.formName];
      if (!cacheData) {
        return;
      }
      for (let item of cacheData) {
        const find = this.formField.find(field => field.id === item.id);
        if (!find) {
          continue;
        }
        switch (find.inputType) {
          case "text":
            find.tempValue = item.tempValue;
            break;
          case "date":
            find.tempValue = new Date(item.tempValue);
            break;
          default:
            find.tempValue = item.tempValue;
        }
      }
    },
    validate() {
      return new Promise((resovle, reject) => {
        for (let field of this.formField) {
          if (field.displayFlag === 0) {
            continue;
          }
          if (field.requiredFlag === 1 && !field.tempValue) {
            Toast(`请填写${field.itemName}`);
            reject(field);
          }
        }
        resovle();
      });
    },
    onChange() {
      const tempData = storeGet();
      const oldData = tempData[this.formName] || [];
      const newData = this.formField.map(item => {
        return {
          id: item.id,
          tempValue: item.tempValue
        };
      });
      Object.assign(oldData, newData);
      tempData[this.formName] = oldData;
      storeSet(tempData);
    },
    editAddress() {
      this.$router.push({
        path: "editAddress"
      });
    }
  }
};
</script>
<style lang='scss' scoped>
.form {
  .van-cell::v-deep {
    .van-field__label {
      width: 2rem;
      text-align: left;
      margin-right: 0.2rem;
    }
  }
}
</style>
