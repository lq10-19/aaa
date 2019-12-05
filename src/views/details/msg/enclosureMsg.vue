<template>
  <div class="bigBox">
    <div class="form">
      <div class="title">附件信息</div>
      <ul>
        <li class="item" @click="goDetails(item.type)" v-for="(item,i) in msgData" :key="i">
          <span class="key">
            {{item.typeName}}
            <span class="value" v-if="item.docAttachmentDtos.length > 0">(已上传)</span>
          </span>
          <img src="../../../assets/img/goback@2x.png" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import {
  randomWord,
  formatJson,
  storeGet,
  storeSet,
  storeRemove
} from "@/utils/common.js";
export default {
  metaInfo() {
    return {
      title: this.title
    };
  },
  components: {},
  data() {
    return {
      title: "附件信息",
      contractNo: "",
      msgData: [] //附件列表
    };
  },
  created() {
    this.contractNo = this.$route.query.contractNo;
    this.queryDocDimension();
  },
  mounted() {},
  methods: {
    //查看详图
    goDetails(type) {
      this.$router.push({
        path: "/enclosureDetails",
        query: { contractNo: this.contractNo, type }
      });
    },
    // 获取附件信息
    queryDocDimension() {
      let url = "docDimension/queryBusinessType";
      let param = {
        customertype: "03", //客户类型 写死
        businesscategory: "01", //业务类型 写死
        serialno: this.contractNo //合同号
      };
      this.$request
        .get(url, { params: param })
        .then(res => {
          //console.log(res, 1010);
          this.msgData = res.data;
        })
        .catch(error => {
          console.log("error" + error);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.bigBox {
  font-size: 0.32rem;
  font-family: PingFangSC-Regular;
  font-weight: 400;

  .form {
    width: 100%;
    .title {
      margin-left: 0.3rem;
      color: rgba(136, 136, 136, 1);
      font-size: 0.28rem;
      line-height: 1rem;
      text-align: left;
    }
    ul {
      width: 100%;

      .item {
        width: 100%;
        height: 1rem;
        background: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid $bg-color;

        .key {
          line-height: 1rem;
          margin-left: 0.3rem;
          text-align: left;
          color: rgba(0, 0, 0, 1);
          .value {
            text-align: left;
            font-size: 0.28rem;
            color: rgba(153, 153, 153, 1);
          }
        }

        img {
          width: 0.12rem;
          height: 0.22rem;
          margin-right: 0.3rem;
        }
      }
    }
  }
}
</style>