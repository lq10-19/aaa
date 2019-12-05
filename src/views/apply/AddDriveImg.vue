<template>
  <div class="addID">
    <div class="title">请上传您的驾驶证</div>
    <div class="box">
      <!--  人像面-->
      <div class="show">
        <div class="picture" :style="'backgroundImage:url('+imgBlob+')'"></div>
        <div class="upload" v-show="!imgBlob">
          <input
            class="hides"
            ref="referenceUploadp"
            type="file"
            accept="image/*"
            @change="upload($event)"
          >
        </div>
        <div v-show="imgBlob" class="mask">
          <div class="identification">仅供本次业务使用</div>
          <i class="delete" @click="deleteImg"></i>
        </div>
      </div>
      <div class="tips">请拍照或本地上传您的驾驶证照片</div>
    </div>
    <!-- <div class="waring">本操作将严格保护您的隐私安全，请放心操作</div> -->
    <div class="btn_box">
      <button class="btn" :class="{'disable': !imgBlob}" @click="submitCheck">上传</button>
    </div>
    <MaskLoading :show="showLoading" text="上传中..."></MaskLoading>
  </div>
</template>

<script>
import { Toast } from "vant";
import { imgPreview, storeSet, storeGet } from "@/utils/common.js";
import MaskLoading from "@/components/MaskLoading.vue";
export default {
  metaInfo: {
    title: "驾驶证上传"
  },
  components: {
    MaskLoading
  },
  data() {
    return {
      showLoading: false,
      imgBlob: null,
      picValue: null
    };
  },
  created() {},
  mounted() {},
  methods: {
    // 删除
    deleteImg(res) {
      this.imgBlob = null;
      this.$refs.referenceUploadp.value = null;
      this.picValue = null;
    },
    async upload(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.picValue = files[0];
      // this.imgPreview(this.picValue, );
      this.imgBlob = await imgPreview(this.picValue);
    },
    submitCheck() {
      if (!this.picValue) {
        Toast("请上传驾驶证照片");
        return;
      }
      this.submit();
    },
    submit() {
      this.showLoading = true;
      window.setTimeout(() => {
        this.showLoading = false;
        const tempData = storeGet();
        tempData.driveImgUrl = "jsz.jpeg";
        storeSet(tempData);
        this.$router.push({
          path: "replenish"
        });
      }, 1500);
    }
  }
};
</script>


<style lang='scss' scoped>
.title {
  width: 100%;
  height: 1rem;
  line-height: 1rem;
  text-align: center;
  font-size: 0.3rem;
  font-weight: 500;
  margin-top: 0.2rem;
}

.tips {
  width: 100%;
  height: 0.8rem;
  line-height: 0.8rem;
  text-align: center;
  font-size: 0.28rem;
  color: rgba(102, 102, 102, 1);
  margin-bottom: 0.2rem;
}

.box {
  .show {
    position: relative;
    top: 0;
    left: 0;
    margin: 0 auto;
    width: 5.8rem;
    height: 3.6rem;
    background: rgba(255, 255, 255, 1);
    border-radius: 0.1rem;

    .picture {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background-position: center center;
      background-repeat: no-repeat;
      background-size: 100%;
      border-radius: 0.1rem;
    }

    .mask {
      width: 100%;
      height: 100%;
      overflow: hidden;
      position: absolute;
      top: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.1);
    }

    .identification {
      border: 2px solid rgba(255, 255, 255, 1);
      height: 0.42rem;
      line-height: 0.42rem;
      border-radius: 0.21rem;
      font-size: 0.24rem;
      width: 2.26rem;
      text-align: center;
      position: absolute;
      top: 0.2rem;
      right: 0.2rem;
      color: rgba(255, 255, 255, 1);
    }

    .delete {
      display: block;
      height: 0.42rem;
      width: 0.42rem;
      background: url("../../assets/img/clear_icon(1).png") no-repeat;
      background-size: 100%;
      border-radius: 0.21rem;
      font-size: 0.24rem;
      position: absolute;
      top: 0.2rem;
      left: 0.2rem;
      color: rgba(255, 255, 255, 1);
    }

    .upload {
      position: absolute;
      left: 2.35rem;
      top: 1.25rem;
      width: 1.1rem;
      height: 1.1rem;
      background: url("../../assets/img/add@2x.png") no-repeat;
      background-size: 100%;
      z-index: 2;

      .hides {
        width: 100%;
        height: 100%;
        opacity: 0;
      }
    }
  }
}

.waring {
  width: 100%;
  text-align: center;
  font-size: 0.26rem;
  color: rgba(248, 72, 89, 1);
}

.btn_box {
  width: 100%;

  .btn {
    display: block;
    width: 5.8rem;
    @include button;
    margin: 0 auto;
    &.disable {
      background: rgba(220, 220, 220, 1);
      color: rgba(255, 255, 255, 1);
    }
  }
}
</style>