<template>
  <div class="page"> 
    <div class="topBanner">
      <ul>
        <li><img src="../../assets/img/banner2.png" alt=""></li>
      </ul>
    </div>
    <div class="textListBox">
      <ul>
        <li>
          <p>50万</p>
          <p>额度最高</p>
        </li>
        <li>
          <p>1.0%</p>
          <p>月费率最低</p>
        </li>
         <li>
          <p>36期</p>
          <p>期限最长</p>
        </li>
      </ul>
    </div>
    <div class="contentBox">
      <div class="iconListBox">
        <ul>
          <li><img src="../../assets/img/xianshang.png" alt=""><p>线上申请</p></li>
          <li><img src="../../assets/img/shenhe.png" alt=""><p>审核通过</p></li>
          <li><img src="../../assets/img/xianxia.png" alt=""><p>线下办理</p></li>
          <li><img src="../../assets/img/fafang.png" alt=""><p>贷款发放</p></li>
        </ul>
      </div>
      <div class="applyListBox">
        <ul>
          <li>
            <p>审核方式</p>
            <p>线上申请，线下办理抵押登记</p>
          </li>
          <li>
            <p>申请条件</p>
            <p>20岁(不含融资年限) - 60岁(含融资年限)</p>
          </li>
          <li>
            <p>所需材料</p>
            <p>中国大陆居民二代身份证、本人实名制手机号、车 辆登记证、车辆行驶证</p>
          </li>
        </ul>
      </div>
    </div>
    <div class="bottom">
      <button @click="goApply">立即申请</button>
    </div>
  </div>
</template>

<script>
import {JGEvent} from "@/utils/common.js";
export default {
  metaInfo: {
    title: "佰车融"
  },
  components: {

  },
  data() {
    return {
      MaskLoading:false
    };
  },
  created() {
  },
  mounted(){},
  

  methods: {
    goApply(){
      JGEvent("go-applyMain");
      this.$router.push({
        path:'carInfo',
        query:{
          channel:this.$route.query.channel,
          loanCompany:this.$route.query.loanCompany
        }
      })
    }
  
  },
  watch: {
 
  }
};
</script>
<style lang="scss" scoped>
.page {
  flex-direction: column;
  padding-bottom: 2rem;
  .topBanner{
    width: 100%;
    height: 3.08rem;
    ul{
      li{
        img{
          height: 3.08rem;
        }
      }
    }
  }
  .textListBox{
    width:6.88rem;
    height:1.84rem;
    background:linear-gradient(180deg,rgba(254,235,167,1),rgba(255,204,0,1));
    border-radius:0.12rem;
    margin: 0 auto;
    ul{
      display: flex;
      justify-content: space-around;
      height:1.84rem;
      li{
        p{
          color: #000;
        }
        p:nth-of-type(1){
          font-size: 0.48rem;
          line-height: 0.8rem;
          font-weight: 700;
          margin-top: 0.3rem;
        }
        p:nth-of-type(2){
          font-size: 0.26rem;
          lighting-color: 0.4rem;
        }
      }
    }
  }
  .contentBox{
    margin: 0 auto;
    margin-top: 0.35rem;
    width:7rem;
    height:7rem;
    background:rgba(255,255,255,1);
    border-radius:0.12rem;
    padding-bottom: 0.5rem;
  }
  .iconListBox{
    padding: 0.5rem 0.4rem 0 0.4rem;
    ul{
      display: flex;
      justify-content: space-around;
      li{
        position: relative;
        img{
          width: 0.8rem;
          height: 0.8rem;
          display: block;
          margin: 0 auto;
        }
        p{
          font-size: 0.24rem;
          color:#666;
          line-height: 0.8rem;
        }
      }
      li:after{
        content:'';
        display: block;
        position: absolute;
        top: 25%;
        left: 109%;
        border-top: 1px dashed #000;
        width: 0.39rem;
      }
      li:last-child:after{
         display: none;
      }
    }
  }
  .applyListBox{
    padding:0 0.3rem;
    box-sizing: border-box;
    ul{
      li{
        margin-top: 0.2rem;
        p{
          text-align: left;
        }
        p:nth-of-type(1){
          font-size:0.32rem;
          font-weight:700;
          color:rgba(10,10,10,1);
          line-height: 0.7rem;
        }
        p:nth-of-type(2){
          font-size:0.28rem;
          line-height: 0.4rem;
          font-weight:400;
          color:rgba(102,102,102,1);
        }
      }
    }
  }
  .bottom {
    // flex: 1 0 auto;
    // display: flex;
    // flex-direction: column;
    // justify-content: flex-start;
    // align-items: center;
    position: fixed;
    width: 100%;
    height: 0.98rem;
    bottom:0;
    left:0;
    button {
      width: 100%;
      height: 0.98rem;
      background:linear-gradient(180deg,rgba(254,235,167,1),rgba(255,204,0,1));
      font-size:0.36rem;
      font-weight:700;
      color:rgba(0,0,0,1);
      line-height:0.98rem;
    }
    .test {
      margin-top: 0.3rem;
    }
  }
}
</style>