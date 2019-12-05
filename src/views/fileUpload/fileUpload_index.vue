<template>
  <div class="page">
      <div class="content">
          <ul>
              <p class="title">附件信息</p>
              <li @click="goDetailsFun(item)" v-for="(item,index) in fileList" :key='index'>
                <p><span  :style="{color:item.isMust=='01'?'red':'#fff'}">* </span>{{index+1}}.{{item.typeName}}
                    <span v-if="item.total=='0'"  class="isUpload">(未上传)</span>
                    <span v-else class="isUpload">({{item.total}}张)</span>
                </p>
                <p class='goUpload' v-show="item.total=='0'">去上传</p>
                <p class='warn'>{{item.warn}}</p>
              </li>
          </ul>
          <div class="buttonBox">
            <p @click="goBackFun" class="backButton">上一步</p><p @click="submitFun" class='submit'>提交</p>
          </div>
      </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import { storeGet, storeSet, storeRemove,JGEvent} from "@/utils/common.js";
export default {
  metaInfo: {
    title: "附件材料上传"
  },
  data() {
    return {
      contractNo: null, //合同号
      typeno: null, //产品小类
      fileList: [
        // {fileId:'0',fileType:'carRegisterFile',fileName:'车辆登记证',fileState:0,warn:''},  //fileState 0 未上传  1 已上传
        // {fileId:'2',fileType:'bankFile',fileName:'银行流水',fileState:0,warn:'（非必传，如上传可能为您增加贷款额度）'},
        // {fileId:'3',fileType:'houseFile',fileName:'房产证',fileState:0,warn:'（非必传，如上传可能为您增加贷款额度）'},
        // {fileId:'4',fileName:'申请人身份证',fileState:1,warn:''},
        // {fileId:'5',fileName:'车辆行驶证',fileState:1,warn:''},
        // {fileId:'6',fileName:'驾驶证',fileState:1,warn:''},
        // {fileId:'7',fileName:'人行征信授权书',fileState:1,warn:''},
        // {fileId:'8',fileName:'百行征信授权书',fileState:1,warn:''},
        // {fileId:'9',fileName:'个人征信授权书',fileState:1,warn:''}
      ]
    };
  },

  created() {
    this.contractNo = this.$route.query.contractNo;
    this.typeno = this.$route.query.typeno;
    this.getImgList();
  },
  mounted() {},
  methods: {
    // 获取订单列表
    getImgList() {
      this.$request
        .post("docDimension/queryDocDimension", {
          customertype: "03", //客户类型 写死
          businesscategory: "01", //业务类型 写死
          // 'objectno':'1619018632',//合同号
          // 'type':'2019062500000002'//产品小类
          objectno: this.contractNo, //合同号
          type: this.typeno //产品小类
        })
        .then(res => {
          if (res.code == "200") {
            this.fileList = res.data;
          }
        })
        .catch(error => {
          console.log("error" + error);
        });
    },
    goDetailsFun(item) {
      // if(item.total!=0){
      //     return;
      // }
      this.$router.push({
        path: "fileUpload_details",
        query: {
          type: item.type,
          typeName: item.typeName,
          contractNo:this.contractNo,
          isMust:item.isMust
        }
      });
    },
    submitFun() {
        JGEvent("submit-file");
        let isUploadFlag = true;
        this.fileList.forEach((v,i)=> {
            if(v.total=='0'&&v.isMust=='01'){
                isUploadFlag = false;
            }       
        });
        if(!isUploadFlag){
            Toast('请上传所有带*号文件')
            return;
        };
        this.$request
        .post("submit/contract", {
          serialno: this.contractNo //合同号
        })
        .then(res => {
          if (res.code == "200") {
            storeRemove();//提交成功,清楚本地缓存数据
            this.$router.push({
              path: "fileUpload_success",
              query: {}
            });
          }
        })
        .catch(error => {
          console.log("error" + error);
        });
    },
    goBackFun() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="scss" scoped>
.content {
  width: 100%;
  ul {
    .title {
      height: 0.86rem;
      font-size: 0.28rem;
      color: rgba(136, 136, 136, 1);
      line-height: 1rem;
      padding-left: 0.3rem;
      text-align: left;
    }
    li {
      height: 1rem;
      padding: 0 0.3rem;
      width: 100%;
      box-sizing: border-box;
      border-bottom: 1px solid #f2f3f5;
      background: #fff;
      position: relative;
      p:nth-of-type(1) {
        font-size: 0.32rem;
        font-weight: 400;
        color: rgba(0, 0, 0, 1);
        line-height: 1rem;
        float: left;
        .isUpload {
          color: #999;
        }
      }
      p:nth-of-type(2) {
        font-size: 0.32rem;
        color: rgba(153, 153, 153, 1);
        line-height: 1rem;
        float: right;
        margin-right: 0.33rem;
      }
      p:nth-of-type(2):after {
        content: "";
        display: block;
        width: 0.12rem;
        height: 0.22rem;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 0.3rem;
        background: url("../../assets/img/goback@2x.png") no-repeat center/100%;
      }
      .warn {
        font-size: 0.22rem;
        font-weight: 400;
        color: rgba(248, 72, 89, 1);
        line-height: 0.3rem;
        position: absolute;
        top: 0.7rem;
        left: 0.4rem;
      }
    }
  }
}
.buttonBox {
  margin-top: 0.79rem;
  p {
    width: 2.7rem;
    height: 0.9rem;
    line-height: 0.9rem;
    border-radius: 0.45rem;
    float: left;
  }
  .backButton {
    border: 1px solid rgba(153, 153, 153, 1);
    font-size: 0.36rem;
    color: rgba(102, 102, 102, 1);
    margin-left: 0.8rem;
  }
  .submit {
    width: 2.7rem;
    height: 0.9rem;
    background: linear-gradient(
      180deg,
      rgba(254, 235, 167, 1),
      rgba(255, 204, 0, 1)
    );
    font-size: 0.36rem;
    font-weight: 500;
    color: rgba(0, 0, 0, 1);
    margin-left: 0.5rem;
  }
}
</style>