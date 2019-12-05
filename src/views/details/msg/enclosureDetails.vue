<template>
  <div class="bigBox">
    <div v-if="!isPDF">
      <img
        @click="viewDetails(item.pdfJpg)"
        v-for="(item,i) in imgUrlList"
        :key="i"
        :src="item.pdfJpg"
      />
    </div>
    <!-- <div v-if="isPDF">
      <div class="PDF" @click="goDemo(item.type,i)" v-for="(item,i) in imgUrlList"
        :key="i">
        <p class="str">点击查看</p>
        <p>{{item.filename.replace(/.pdf/,'')}}</p>
      </div>
    </div> -->
  </div>
</template>

<script>
import { ImagePreview } from "vant";
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
      imgUrlList: [],
      isPDF: false,
      contractNo: "",
      type: ""
    };
  },
  created() {
    this.contractNo = this.$route.query.contractNo;
    this.type = this.$route.query.type;
    this.queryDocAttachmentUpload();
  },
  mounted() {},
  methods: {
    viewDetails(img) {
      ImagePreview([img]);
    },
    //查询附件图片
    queryDocAttachmentUpload() {
      let url = "docAttachmentUpload/queryDocAttachmentUpload";
      let param = {
        objectno: this.contractNo, //合同号
        type: this.type //附件类型
      };
      this.$request
        .get(url, { params: param })
        .then(res => {
          //console.log(res, 909);
          this.imgUrlList = res.data;
        })
        .catch(error => {
          console.log("error" + error);
        });
    },
    //查看PDF
    // goDemo(type,index) {
    //   this.$router.push({
    //     path: "/demo",
    //     query: { contractNo: this.contractNo, type ,index}
    //   });
    // }
  }
};
</script>
<style lang="scss" scoped>
.bigBox {
  width: 7.3rem;
  text-align: left;
  margin: 0.1rem auto;
  div {
    img {
      display: inline-block;
      width: 3.35rem;
      height: 3.35rem;
      //border: 0.01rem solid #000;
      background: #000;
      margin: 0.15rem;
    }
    .PDF {
      display: inline-block;
      width: 3.35rem;
      height: 3.35rem;
      margin: 0.15rem;
      background: #ccc;
      p{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin: 0 auto;
        margin-top: 0.2rem;
        text-align: center;
      }
      .str{
        color: red;
        margin-top: 1.2rem;
      }
    }
  }
}
</style>