<template>
  <div id="container">
    <div class="pdfList"></div>
    <MaskLoading :show="showLoading"></MaskLoading>
  </div>
</template>
<script>
import MaskLoading from "@/components/MaskLoading.vue";
let PDFJS = null;
export default {
  data() {
    return {
      pdfDataList: [],
      showLoading: true,
      contractNo: "",
	  type: "",
	  index: "",
	  fileValue: "",
    };
  },
  components: {
    MaskLoading
  },
  created() {
    this.contractNo = this.$route.query.contractNo;
	this.type = this.$route.query.type;
	this.index = this.$route.query.index;
    //获取附件信息
    this.queryDocAttachmentUpload();
  },
  mounted() {},
  methods: {
    //查询附件PDF
    queryDocAttachmentUpload() {
      let url = "docAttachmentUpload/queryDocAttachmentUpload";
      let param = {
        objectno: this.contractNo, //合同号
        type: this.type //附件类型
      };
      this.$request
        .get(url, {params:param})
        .then(res => {
          console.log(res, 909);
		  this.fileValue = res.data[this.index].fileBase;
		  console.log(this.fileValue);
		  this.getPdf();
        })
        .catch(error => {
          console.log("error" + error);
        });
    },
    //处理PDF
    getPdf() {
      //this.fileValue = ``;
      this.pdfDataList.push({
        fileValue: this.fileValue
      });
      //动态加载组件
      import("pdfjs-dist").then(lib => {
        PDFJS = lib;
        this.showPdf();
      });
    },
    getBase64() {
      //这里是我用来请求后台返回给我返回base64格式的文件发的ajax请求
      let url =
        "fileSignConfig/getPdfBase64ByPath?filePath=" +
        this.$route.query.filePDF;
      this.$request
        .get(url)
        .then(res => {
          if (res.data) {
            this.pdfDataList.push({
              fileValue: res.data
            });
            this.showPdf();
          } else {
            Toast("获取文件失败，请稍后再试");
          }
        })
        .catch(error => {
          console.log("error" + error);
        });
    },
    async showPdf() {
      let pdfList = document.querySelector(".pdfList"); //通过querySelector选择DOM节点,使用document.getElementById()也一样
      for (let value of this.pdfDataList) {
        //遍历后台传过来的pdfDataList
        let base64 = value.fileValue; //获得bas464编码
        let decodedBase64 = window.atob(base64); //使用浏览器自带的方法解码
        let pdf = await PDFJS.getDocument({ data: decodedBase64 }); //返回一个pdf对象
        let pages = pdf.numPages; //声明一个pages变量等于当前pdf文件的页数
        for (let i = 1; i <= pages; i++) {
          //循环页数
          let canvas = document.createElement("canvas");
          let page = await pdf.getPage(i); //调用getPage方法传入当前循环的页数,返回一个page对象
          let scale = 2; //缩放倍数，1表示原始大小
          let viewport = page.getViewport(scale);
          let context = canvas.getContext("2d"); //创建绘制canvas的对象
          canvas.height = viewport.height; //定义canvas高和宽
          canvas.width = viewport.width;
          let renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          await page.render(renderContext);

          canvas.className = "canvas"; //给canvas节点定义一个class名,这里我取名为canvas
          pdfList.appendChild(canvas); //插入到pdfList节点的最后
          console.log("成功了");
          this.showLoading = false;
        }
      }
    }
  }
};
</script>