<template>
  <div class="page">
    <!-- <p class="tip">客户类型一经选定不可更改</p> -->
    <div class="section">
      <div class="beCareful">
        客户类型
        <span>（选定并下一步后不可变更）</span>
      </div>
      <div class="form">
        <van-cell-group>
          <van-field
            label="客户类型"
            placeholder="请选择客户类型"
            v-model="customerType"
            disabled
            is-link
            @click="showReasonList"
          />
        </van-cell-group>
      </div>
    </div>
    <div class="section">
      <div class="beCareful">产品信息</div>
      <div class="form">
        <van-cell-group>
          <van-field
            label="产品类型"
            placeholder="请选择产品类型"
            v-model="productType"
            disabled
            is-link
            @click="showProductList"
          />
        </van-cell-group>
      </div>
      <div class="form">
        <van-cell-group>
          <van-cell
            title="保险种类"
            title-style="text-align: left; flex: none; width: 1.7rem; font-size: 0.3rem; color: #666;"
            value-class="selectRight"
          >
            <template slot="title">
              <span class="custom-title">保险种类</span>
              <van-icon name="info-o" class="titleIcon" @click="showTips" />
            </template>
            <template slot="default">
              <van-checkbox
                style="font-size: 0.3rem;"
                ref="checkboxes"
                :disabled="item.state"
                checked-color="#ffcc00FF"
                v-for="(item,i) in insuranceList"
                :key="i"
                v-model="item.checked"
              >{{item.itemName}}</van-checkbox>
            </template>
          </van-cell>

          <van-field
            type="number"
            label="商业险投保金额"
            placeholder="请输入金额"
            v-model.trim="insuranceInfo.businessInsurance"
            @input="test(insuranceInfo.businessInsurance)"
            maxlength="9"
            clearable
            center
          />
          <van-field
            v-if="showCompulsoryInsurance"
            type="number"
            label="交强险投保金额"
            placeholder="请输入金额"
            v-model.trim="insuranceInfo.compulsoryInsurance"
            @input="test(insuranceInfo.compulsoryInsurance)"
            maxlength="9"
            clearable
            center
          />
        </van-cell-group>
      </div>
    </div>

    <div class="bottom">
      <button @click="nextCheck">下一步</button>
      <!-- <button @click="test" class="test">重置申请</button> -->
    </div>
    <MaskLoading :show="showLoading"></MaskLoading>
    <!-- 产品类型 -->
    <van-popup v-model="showProduct" position="bottom" :overlay="true">
      <van-picker
        show-toolbar
        title="产品类型"
        :columns="productList"
        @cancel="onCancel0"
        @confirm="onConfirm0"
        @change="onChange0"
      />
    </van-popup>

    <!-- 客户类型 -->
    <van-popup v-model="showReason" position="bottom" :overlay="true">
      <van-picker
        show-toolbar
        title="客户类型"
        :columns="customerList"
        @cancel="onCancel1"
        @confirm="onConfirm1"
        @change="onChange1"
      />
    </van-popup>
  </div>
</template>

<script>
import PopupAddress from "@/components/PopupAddressBx.vue";
import { Toast, Popup, Picker, Button, Area, Icon } from "vant";
import dayjs from "dayjs";
import { storeGet, storeSet, storeRemove, JGEvent } from "@/utils/common.js";
import PopupDatetimePicker from "@/components/PopupDatetimePicker.vue";
import AddImg from "@/components/AddImg.vue";
import MaskLoading from "@/components/MaskLoading.vue";
import store from "store";
export default {
  metaInfo: {
    title: "保险分期"
  },
  components: {
    PopupDatetimePicker,
    AddImg,
    MaskLoading,
    PopupAddress
  },
  data() {
    return {
      productType: "请选择产品类型",
      productTypeCode: "0",
      productList: [],
      productTypeList: [
        // {
        //   typename: "产品名称",
        //   typeno: "产品编号",
        //   productsupertype: "产品大类"
        // }
      ],
      businessType: null, //产品编号
      customerType: "个人",
      customerTypeList: [
        { itemName: "个人", itemNo: 1 },
        { itemName: "公司挂靠", itemNo: 2 },
        { itemName: "公司非挂靠", itemNo: 3 }
      ],
      customerList: ["个人", "公司挂靠", "公司非挂靠"],
      showProduct: false,
      showReason: false,
      insuranceInfo: {
        businessInsurance: "",
        compulsoryInsurance: ""
      },
      insuranceList: [
        { itemName: "商业险", itemNo: 1, state: true, checked: true },
        { itemName: "交强险", itemNo: 2, state: false, checked: false }
      ],
      showCompulsoryInsurance: false,
      showLoading: false,
      from: {
        // storeid: "2016111800000018", //展厅编号
        // inputuserid: "1", //当前登录的userid
        // dealerid: "2019061700000001", //经销商编号
        // manageuserid: "111", //金融经理编号(暂不需要)
        // from: "QdbApplication" //小程序
      },
      continueApplyData: {},
      serialno: null
    };
  },
  watch: {
    //监听勾选
    insuranceList: {
      handler: function(newVal) {
        console.log(newVal);
        if (newVal[1]) {
          if (newVal[1].checked) {
            this.showCompulsoryInsurance = true;
            if (this.insuranceInfo.compulsoryInsurance == "0") {
              this.insuranceInfo.compulsoryInsurance = "";
            }
          } else {
            this.showCompulsoryInsurance = false;
          }
        }
      },
      deep: true //深度监听
    }
  },
  beforeRouteEnter(to, from, next) {
    // 注意，在路由进入之前，组件实例还未渲染，所以无法获取this实例，只能通过vm来访问组件实例
    if (from.name === "financingInfo") {
      console.log("自然返回");
    } else if (from.name === "insuranceOrderList") {
      console.log("继续申请");
      storeRemove("productType");
      storeRemove("productTypeCode");
      storeRemove("businessType");
      storeRemove("showCompulsoryInsurance");
    } else {
      console.log("小程序进入");
      storeRemove("serialno");
      storeRemove("customerType");
      //清空所有缓存
      store.clearAll();
    }
    next();
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === "financingInfo") {
      console.log("下一页");
    } else if (to.name === "insuranceOrderList") {
      console.log("返回订单列表");
      storeRemove("serialno");
      storeRemove("customerType");
      //清空所有缓存
      store.clearAll();
    } else {
      console.log("退回小程序");
      storeRemove("serialno");
      storeRemove("customerType");
      //清空所有缓存
      store.clearAll();
    }
    next();
  },
  created() {
    // 重新申请
    if (storeGet("serialno")) {
      this.serialno = storeGet("serialno");
      console.log(this.serialno, "合同号");
    }
    if (storeGet("customerType")) {
      this.customerType = storeGet("customerType");
      console.log(this.customerType, "客户类型");
    }

    //从小程序入口获得二维码参数
    console.log(this.$route.query, "url参数");
    if (this.$route.query) {
      this.from = this.$route.query;
    }
    //继续申请获取参数
    if (storeGet("continueApply")) {
      console.log("获得继续申请数据");
      this.continueApplyData = storeGet("continueApply");
      this.serialno = storeGet("continueApply").serialno;
      this.from.dealerid = storeGet("continueApply").dealerid;
      this.from.inputuserid = storeGet("continueApply").inputuserid;
      this.from.storeid = storeGet("continueApply").storeid;
      this.from.manageuserid = storeGet("continueApply").manageuserid;
      if (storeGet("continueApply").customerType == "03") {
        this.customerType = "个人";
      } else if (storeGet("continueApply").customerType == "05") {
        if (storeGet("continueApply").hangupflag == "1") {
          console.log("公司挂靠");
          this.customerType = "公司挂靠";
        } else if (storeGet("continueApply").hangupflag == "2") {
          console.log("公司非挂靠");
          this.customerType = "公司非挂靠";
        }
      }
    }
    //获取产品列表
    this.getListInfo();
  },
  mounted() {},
  methods: {
    showTips() {
      if (this.productTypeList[this.productTypeCode].mark == "Y") {
        Toast("仅可融商业险");
      } else if (this.productTypeList[this.productTypeCode].mark == "N") {
        Toast("商业险、交强险皆可融");
      }
    },
    test(num) {
      if (num) {
        if (/^\d{1,6}(\.\d{1,2})?$/.test(num)) {
          console.log("y");
        } else {
          console.log("n");
          Toast("请输入正确的投保金额");
        }
      }
    },
    //打开产品类型
    showProductList() {
      if (this.productTypeList.length <= 0) {
        Toast(`请联系销售经理配置产品`);
        return;
      }
      this.showProduct = true;
    },
    onChange0(picker, value, index) {
      //console.log("切换产品类型:", picker, value, index);
      //this.productType = value;
    },
    onConfirm0(picker, value, index) {
      console.log("选择产品类型:", picker, value, index);
      this.productType = picker;
      this.showProduct = false;
      //产品编号
      this.productTypeCode = value;
      console.log("产品编号", this.productTypeCode);
      console.log(this.productTypeList[value]);
      if (this.productTypeList[value].mark == "Y") {
        this.insuranceInfo = { businessInsurance: "" };
        this.insuranceList = [
          { itemName: "商业险", itemNo: 1, state: true, checked: true }
        ];
        this.showCompulsoryInsurance = false;
      } else if (this.productTypeList[value].mark == "N") {
        this.insuranceInfo = { businessInsurance: "", compulsoryInsurance: "" };
        this.insuranceList = [
          { itemName: "商业险", itemNo: 1, state: true, checked: true },
          { itemName: "交强险", itemNo: 2, state: false, checked: false }
        ];
        this.showCompulsoryInsurance = true;
      }
      this.businessType = this.productTypeList[value].typeno;
    },
    onCancel0() {
      this.showProduct = false;
    },
    //打开客户类型
    showReasonList() {
      //判断客户类型可否更改
      if (Object.keys(this.continueApplyData).length > 0) {
        Toast("继续申请不可变更客户类型");
        return;
      }
      if (this.serialno) {
        Toast("已选定客户类型不可变更");
        return;
      }
      this.showReason = true;
    },
    onChange1(picker, value, index) {
      //console.log("切换客户类型:", picker, value, index);
      //this.customerType = value;
    },
    onConfirm1(picker, value, index) {
      console.log("选择客户类型:", picker, value, index);
      this.customerType = picker;
      this.showReason = false;
      //清空产品列表
      this.productList = [];
      this.productType = "请选择产品类型";
      this.productTypeCode = "0";
      this.businessType = ""; //产品编号
      this.insuranceInfo = { businessInsurance: "", compulsoryInsurance: "" };
      this.insuranceList = [
        { itemName: "商业险", itemNo: 1, state: true, checked: true },
        { itemName: "交强险", itemNo: 2, state: false, checked: false }
      ];
      this.showCompulsoryInsurance = true;
      //获取产品列表
      this.getListInfo();
    },
    onCancel1() {
      this.showReason = false;
    },
    //获取产品列表
    getListInfo() {
      // const resp = await this.$request.post(url, this.carForm);
      // const carInfo = Object.assign({}, this.carForm);
      this.showLoading = true;
      let url = "business/getListInfo";
      let customerType = "";
      if (this.customerType == "个人") {
        customerType = "03";
      } else {
        customerType = "05";
      }
      let param = {
        dealerid: this.from.dealerid, //经销商编号
        customerType //客户类型 03个人 05公司
        //typeNo: "" //产品大类
      };
      this.$requestBx
        .post(url, param)
        .then(res => {
          this.showLoading = false;
          if (res.code == "200") {
            if (res.data.length > 0) {
              this.productTypeList = res.data;
              res.data.forEach(element => {
                this.productList.push(element.typename);
              });
              //第一次进入
              this.productType = res.data[0].typename;
              this.businessType = res.data[0].typeno;
              this.productTypeCode = 0;
              if (res.data[0].mark == "Y") {
                this.insuranceInfo = { businessInsurance: "" };
                this.insuranceList = [
                  {
                    itemName: "商业险",
                    itemNo: 1,
                    state: true,
                    checked: true
                  }
                ];
                this.showCompulsoryInsurance = false;
              } else if (res.data[0].mark == "N") {
                this.insuranceInfo = {
                  businessInsurance: "",
                  compulsoryInsurance: ""
                };
                this.insuranceList = [
                  {
                    itemName: "商业险",
                    itemNo: 1,
                    state: true,
                    checked: true
                  },
                  {
                    itemName: "交强险",
                    itemNo: 2,
                    state: false,
                    checked: false
                  }
                ];
                this.showCompulsoryInsurance = true;
              }
              //继续进件
              console.log(this.continueApplyData, "继续申请数据");
              if (Object.keys(this.continueApplyData).length > 0) {
                console.log("继续申请获取产品列表");
                this.productType = this.continueApplyData.typeName;
                this.businessType = this.continueApplyData.businessType;
                for (let i = 0; i < this.productTypeList.length; i++) {
                  if (this.businessType == this.productTypeList[i].typeno) {
                    this.productTypeCode = i;
                  }
                }
                if (this.continueApplyData.insType == "01") {
                  if (this.continueApplyData.mark == "Y") {
                    this.showCompulsoryInsurance = false;
                    this.insuranceList = [
                      {
                        itemName: "商业险",
                        itemNo: 1,
                        state: true,
                        checked: true
                      }
                    ];
                  } else if (this.continueApplyData.mark == "N") {
                    this.insuranceList = [
                      {
                        itemName: "商业险",
                        itemNo: 1,
                        state: true,
                        checked: true
                      },
                      {
                        itemName: "交强险",
                        itemNo: 2,
                        state: false,
                        checked: false
                      }
                    ];
                  }
                } else {
                  this.showCompulsoryInsurance = true;
                  this.insuranceList = [
                      {
                        itemName: "商业险",
                        itemNo: 1,
                        state: true,
                        checked: true
                      },
                      {
                        itemName: "交强险",
                        itemNo: 2,
                        state: false,
                        checked: true
                      }
                    ];
                }
                this.insuranceInfo.businessInsurance = this.continueApplyData.viInsuredAmount;
                this.insuranceInfo.compulsoryInsurance = this.continueApplyData.clivtaInsuredAmount;
              }
              //获取缓存
              if (storeGet("businessType")) {
                this.businessType = storeGet("businessType");
                this.productType = storeGet("productType");
                this.productTypeCode = storeGet("productTypeCode");
                console.log(
                  this.productType,
                  this.productTypeCode,
                  this.businessType,
                  "缓存"
                );
                if (this.productTypeList[this.productTypeCode].mark == "Y") {
                  this.insuranceInfo = { businessInsurance: "" };
                  this.insuranceList = [
                    {
                      itemName: "商业险",
                      itemNo: 1,
                      state: true,
                      checked: true
                    }
                  ];
                  this.showCompulsoryInsurance = false;
                } else if (
                  this.productTypeList[this.productTypeCode].mark == "N"
                ) {
                  this.insuranceInfo = {
                    businessInsurance: "",
                    compulsoryInsurance: ""
                  };
                  this.insuranceList = [
                    {
                      itemName: "商业险",
                      itemNo: 1,
                      state: true,
                      checked: true
                    },
                    {
                      itemName: "交强险",
                      itemNo: 2,
                      state: false,
                      checked: false
                    }
                  ];
                  if (storeGet("insuranceInfo").compulsoryInsurance > 0) {
                    this.insuranceList[1].checked = true;
                  }
                }
                //获取缓存
                if (storeGet("insuranceInfo")) {
                  this.insuranceInfo = storeGet("insuranceInfo");
                  console.log(this.insuranceInfo, "金额");
                }
                if (storeGet("showCompulsoryInsurance")) {
                  this.showCompulsoryInsurance = storeGet(
                    "showCompulsoryInsurance"
                  );
                }
              }
              //清空所有缓存
              store.clearAll();
              console.log(this.insuranceList, "列表");
            } else {
              Toast(`请联系销售经理配置产品`);
            }
          } else {
            Toast(`${res.message}`);
          }
        })
        .catch(error => {
          this.showLoading = false;
          console.log("error" + error);
        });
    },
    //下一步
    nextCheck() {
      console.log(this.productList, 111);
      if (this.productList.length <= 0) {
        Toast("暂无产品");
        return;
      }
      if (this.productType == "请选择产品类型") {
        Toast("请选择产品类型");
        return;
      }
      if (!this.insuranceInfo.businessInsurance) {
        Toast("请输入商业险投保金额");
        return;
      }
      if (
        /^\d{1,6}(\.\d{1,2})?$/.test(this.insuranceInfo.businessInsurance) ==
        false
      ) {
        Toast("请输入正确的投保金额");
        return;
      }
      //勾选交强险
      if (this.showCompulsoryInsurance) {
        if (!this.insuranceInfo.compulsoryInsurance) {
          Toast("请输入交强险投保金额");
          return;
        }
        if (
          /^\d{1,6}(\.\d{1,2})?$/.test(
            this.insuranceInfo.compulsoryInsurance
          ) == false
        ) {
          Toast("请输入正确的投保金额");
          return;
        }
      } else {
        this.insuranceInfo.compulsoryInsurance = "0";
      }
      this.next();
    },
    next() {
      this.showLoading = true;
      let url = "create/apply";
      let customerType = "";
      let hangupflag = "";
      let isActualCarMan = "";
      if (this.customerType == "个人") {
        customerType = "03";
        hangupflag = "2";
        isActualCarMan = "1";
      } else if (this.customerType == "公司挂靠") {
        customerType = "05";
        hangupflag = "1";
        isActualCarMan = "2";
      } else if (this.customerType == "公司非挂靠") {
        customerType = "05";
        hangupflag = "2";
        isActualCarMan = "1";
      }
      let insType = "";
      if (this.showCompulsoryInsurance) {
        insType = "01,02";
      } else {
        insType = "01";
      }
      //console.log(this.productTypeList, this.productTypeCode);
      // if (!this.businessType) {
      //   this.businessType = this.productTypeList[this.productTypeCode].typeno;
      // }
      console.log(this.productTypeList, this.productTypeCode, "非缓存");
      let param = {
        inputuserid: this.from.inputuserid, //当前登录的userid
        dealerid: this.from.dealerid, //经销商编号
        storeid: this.from.storeid, //展厅编号
        manageuserid: this.from.manageuserid, //金融经理编号
        businessType: this.businessType, //产品编号
        customerType, //客户类型 03个人 05公司
        hangupflag, //是否挂靠 1是 2否
        isActualCarMan, //是否实际用车人 1是 2否
        insType, //保险类型 01商业险 02交强险
        viInsuredAmount: this.insuranceInfo.businessInsurance, //商业投保金额
        clivtaInsuredAmount: this.insuranceInfo.compulsoryInsurance, //交强险金额
        accountUserId: this.from.userId, //当前登录用户唯一标识id
        userType: this.from.userType, // 1:小程序 2:APP 3:其他
        serialno: this.serialno
      };
      this.$requestBx
        .post(url, param)
        .then(res => {
          this.showLoading = false;
          if (res.code == "200") {
            console.log(res.data);
            //保存合同号
            storeSet(res.data.serialno, "serialno");
            storeSet(this.from.userId, "userId");
            storeSet(this.from.userType, "userType");
            storeSet(this.customerType, "customerType");
            storeSet(this.productType, "productType");
            storeSet(this.productTypeCode, "productTypeCode");
            storeSet(this.businessType, "businessType");
            storeSet(this.insuranceInfo, "insuranceInfo");
            storeSet(this.showCompulsoryInsurance, "showCompulsoryInsurance");
            if (Object.keys(this.continueApplyData).length > 0) {
              storeSet(this.continueApplyData, "continueApply");
            }
            this.$router.push({
              path: "/financingInfo",
              query: {
                customerType: this.customerType,
                serialno: res.data.serialno,
                typeNo: this.businessType
              }
            });
          }
        })
        .catch(error => {
          this.showLoading = false;
          console.log("error" + error);
        });
    }
  },
  beforeDestroy() {
    storeSet(this.from.userId, "userId");
    storeSet(this.from.userType, "userType");
    storeSet(this.customerType, "customerType");
    storeSet(this.productType, "productType");
    storeSet(this.productTypeCode, "productTypeCode");
    storeSet(this.businessType, "businessType");
    storeSet(this.insuranceInfo, "insuranceInfo");
    storeSet(this.showCompulsoryInsurance, "showCompulsoryInsurance");
    if (Object.keys(this.continueApplyData).length > 0) {
      storeSet(this.continueApplyData, "continueApply");
    }
  }
};
</script>
<style lang="scss" scoped>
.page {
  flex-direction: column;
  .tip {
    width: 100%;
    text-align: center;
    background-color: #fffbf2ff;
    color: #ffcd03ff;
    padding: 0.2rem 0;
  }
  .section {
    .beCareful {
      line-height: 0.8rem;
      span {
        color: #ffcd03ff;
        font-size: 0.26rem;
      }
    }
    &.driving {
      flex: 0 0 28%;
      .img-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: white;
        img {
          margin-top: 0.3rem;
          width: 2.9rem;
          height: 2rem;
        }
        .button {
          background: none;
          background-color: white;
          color: #ffd11a;
          margin-top: 0.2rem;
          margin-bottom: 0.2rem;
          width: 6.18rem;
          height: 0.56rem;
          border: 0.02rem solid rgba(255, 209, 26, 1);
          border-radius: 0.27rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        span.icon {
          &.picture {
            display: inline-block;
            background-image: url(../../assets/img/picture.png);
            background-size: cover;
            width: 0.37rem;
            height: 0.29rem;
            margin-right: 0.1rem;
          }
        }
      }
    }
    &.car {
      @media screen and (max-height: 667px) {
        flex: 0 1 45%;
      }
      @media screen and (min-height: 668px) {
        flex: 0 1 40%;
      }
    }
  }
  .bottom {
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding-top: 0.8rem;
    button {
      width: 5.8rem;
      @include button;
    }
    .test {
      margin-top: 0.3rem;
    }
  }
}
.selectRight {
  text-align: left;
}
.idCardBtn {
  width: 6.18rem;
  margin: 0.5rem auto;
  background: #fff;
  font-size: 0.32rem;
  font-weight: 500;
}
.form {
  background: #fff;
  .van-cell::v-deep {
    .van-field__label {
      width: 2.5rem;
      text-align: left;
      margin-right: 0.2rem;
      color: #666;
      font-size: 0.3rem;
      line-height: 0.3rem;
      padding: 0.1rem 0;
    }
    .van-cell__value {
      .van-field__body {
        .van-field__control {
          color: #000;
          font-size: 0.3rem;
          line-height: 0.3rem;
          padding: 0.1rem 0;
        }
        // .van-field__control::placeholder {
        //   color: #000;
        // }
      }
    }
  }
  .tips {
    text-align: left;
    font-size: 0.32rem;
    height: 0.8rem;
    line-height: 0.8rem;
    margin-bottom: 0.2rem;
    margin-left: 0.3rem;
    font-weight: 500;
  }
  .titleIcon {
    display: inline-block;
    margin-left: 0.15rem;
    position: absolute;
    top: 0.25rem;
  }
}
.form::v-deep {
  .address {
    .van-cell {
      font-size: 0.3rem;
      .van-cell__title {
        width: 2.5rem;
        color: #666;
      }
      // .van-field__control::placeholder {
      //   //color: #000;
      // }
    }
  }
  .van-button--info {
    color: #ffcc00;
    border: 1px solid #ffcc00;
  }
}
.selectRight {
  display: flex;
  //justify-content: space-around;
  .van-checkbox:nth-child(1) {
    margin-left: 1rem;
  }
  .van-checkbox:nth-child(2) {
    margin-left: 0.5rem;
  }
}
</style>