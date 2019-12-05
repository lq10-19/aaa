<template>
  <div class="addID">
    <p class="tip">请核对自动识别结果，如有误请更正</p>
    <div class="bigBox">
      <div class="box">
        <div class="photo">
          <img src alt />
          <!-- <img :src="headerImageUrl" /> -->
          <!-- <van-icon name="scan" class="icon" size="0.4rem" /> -->
          <div class="again">
            <van-icon
              name="photograph"
              size="0.5rem"
              class="icon"
              color="#FFCC00"
              @click="againAddIdCard"
            />
            <span>重拍</span>
          </div>
        </div>
        <div class="information">
          <van-cell-group class="van-cell-group">
            <van-field
              v-model.trim="form.name"
              label="公司名称"
              placeholder="请输入公司名称"
              class="van-field"
              clearable
            />
            <van-field
              v-model="form.regNum"
              label="统一社会信用代码"
              placeholder="请输入统一社会信用代码"
              class="van-field2"
              @input="inputCorporateCode"
              clearable
            />
            <van-field
              v-model="form.person"
              label="法定代表人"
              placeholder="请输入法定代表人"
              class="van-field"
              clearable
            />
            <van-field
              v-model.trim="form.address"
              label="注册地址"
              placeholder="请输入注册地址"
              class="van-field address"
              type="textarea"
              autosize
              clearable
            />
          </van-cell-group>
        </div>
      </div>
    </div>
    <div class="btn_box">
      <button class="btn" @click="submit">确定</button>
    </div>
  </div>
</template>

<script>
import {
  randomWord,
  isWeiXin,
  isIOS,
  storeGet,
  storeSet,
  storeRemove,
  JGEvent
} from "@/utils/common.js";
import store from "store";
import { Toast, Dialog, Icon } from "vant";
export default {
  data() {
    return {
      form: {
        url: "", //附件
        regNum: "", //注册号
        name: "", //公司名称
        capital: "", //注册资本
        person: "", //法定代表人
        address: "", //地址
        business: "", //经营范围
        type: "", //主体类型
        period: "", //营业期限
        composingForm: "", //组成形式
        requestId: "" //唯一请求ID
      },
      showLoading: false,
      headerImageUrl: "http://bqyx-qiniu.bqrzzl.com/idCard_zhen@2x.png",
      message: {}
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const BizLicenseOcr = storeGet("BizLicenseOcr");
      if (BizLicenseOcr) {
        vm.form.regNum = BizLicenseOcr.regNum;
        vm.form.name = BizLicenseOcr.name;
        vm.form.capital = BizLicenseOcr.capital;
        vm.form.person = BizLicenseOcr.person;
        vm.form.address = BizLicenseOcr.address;
        vm.form.business = BizLicenseOcr.business;
        vm.form.type = BizLicenseOcr.type;
        vm.form.period = BizLicenseOcr.period;
        vm.form.composingForm = BizLicenseOcr.composingForm;
        vm.form.requestId = BizLicenseOcr.requestId;
        vm.form.url = BizLicenseOcr.url;
      }
    });
  },
  created() {},
  mounted() {
    document.getElementsByTagName("body")[0].style.background = "rgba(242, 243, 245, 1)";
    document.getElementsByTagName("title")[0].textContent = "信息确认";
  },
  methods: {
    //重拍
    againAddIdCard() {
      this.$router.push({
        path: "/uploadBusinessLicense"
      });
    },
    //确定
    submit() {
      const form = this.form;
      if (!form.name) {
        Toast("请输入公司名称");
        return;
      }
      if (!form.regNum) {
        Toast("请输入统一社会信用代码");
        return;
      }
      // if (!/[0-9]{13}$|[0-9]{13}-[0-9]{2}$/.test(form.regNum)) {
      //   Toast("请输入正确的统一社会信用代码");
      //   return;
      // }
      if (!form.person) {
        Toast("请输入法定代表人");
        return;
      }
      if (!form.address) {
        Toast("请输入注册地址");
        return;
      }
      Dialog.confirm({
        title: "证件信息有误会影响授信结果，请确认",
        message: `${this.form.name}\n${this.form.regNum}`
      })
        .then(() => {
          //缓存公司信息
          this.update();
        })
        .catch(() => {});
    },
    //监听输入统一社会信用代码
    inputCorporateCode() {
      let value = this.form.regNum;
      this.form.regNum = this.form.regNum.toUpperCase();
      if (value.length > 18) {
        this.form.regNum = value.slice(0, 18);
      }
    },
    //缓存公司信息
    update() {
      //缓存相关数据
      this.message = {
        customerName: this.form.name,
        certId: this.form.regNum,
        legalPerson: this.form.person,
        registerAddDetail: this.form.address,
        businessLicenseUrl: this.form.url
      };
      //跳转保险分期主页
      this.goCarInsuranceApply();
    },
    //跳转保险分期主页
    goCarInsuranceApply() {
      //判断ocr是否同一公司
      let same = "";
      if (storeGet("companyMsg")) {
        if (this.form.regNum != storeGet("companyMsg").certId) {
          storeRemove("queryCompanyInfo");
          storeSet("no", "companySame");
          same = "no"
        } else {
          storeSet("1", "queryCompanyInfo");
          storeRemove("companySame");
          same = "yes"
        }
      }
      storeSet(this.message, "companyMsg");
      this.$router.push({
        path: "/company",
        query: {
          name: this.form.name,
          regNum: this.form.regNum,
          person: this.form.person,
          same
        }
      });
    }
  }
};
</script>


<style lang='scss' scoped>
.tip {
  width: 100%;
  text-align: center;
  background-color: #f2f3f5;
  color: #888;
  padding: 0.2rem 0;
}
.bigBox {
  //margin-top: 1rem;
  .box {
    display: flex;
    background: #fff;
    //border-top: 0.01rem solid #333;
    .photo {
      width: 1.6rem;
      margin-left: 0.03rem;
      img {
        height: 1.2rem;
        width: 1.2rem;
        margin: 0 auto;
        margin-top: 0.5rem;
        border-radius: 0.1rem;
        background: #fff0cb;
      }
      .again {
        width: 2rem;
        margin: 0;
        position: relative;
        top: -1.05rem;
        left: 0.5rem;
        .icon {
          margin-left: 0.05rem;
        }
        span {
          display: block;
          font-size: 0.3rem;
          color: #ffcd03ff;
        }
      }
    }
    .information {
      width: 5.7rem;
      .van-cell-group {
        .van-field::v-deep {
          font-size: 0.3rem;
          height: 1.2rem;
          line-height: 1.2rem;
          .van-cell__title {
            width: 1.5rem;
            margin-right: 0.3rem;
            color: #666;
          }
          .van-field__body {
            line-height: 0.4rem;
            padding: 0.4rem 0rem;
            //margin-left: 0.4rem;
            width: 4.2rem;
          }
        }
        .van-field2::v-deep {
          height: 1.2rem;
          line-height: 0.55rem;
          .van-cell__title {
            width: 1.3rem;
            margin-right: 0.5rem;
            color: #666;
          }
          .van-field__body {
            line-height: 0.4rem;
            padding: 0.4rem 0rem;
            vertical-align: middle;
            //margin-left: 0.6rem;
            width: 4.5rem;
          }
        }
        .van-cell {
          padding: 0.01rem 0.15rem;
          padding-left: 0.25rem;
        }
      }
    }
  }
}
.btn_box {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  padding-bottom: 1rem;
  .btn {
    display: block;
    width: 5.8rem;
    margin-top: 0.28rem;
    height: 0.9rem;
    background: linear-gradient(
      180deg,
      rgba(254, 235, 167, 1),
      rgba(255, 204, 0, 1)
    );
    //box-shadow: 0 0.14rem 0.16rem 0 rgba(186, 201, 254, 1);
    border-radius: 0.44rem;
    font-weight: bold;
    line-height: 0.88rem;
    font-size: 0.36rem;
    color: #555;
  }
}
.addID {
  text-align: left;
}
</style>