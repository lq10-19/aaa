<template>
  <div class="ADDIMG">
    <div class="add_box"></div>
    <p class="title">{{title}}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      require: true
    }
  }
};
</script>
<style lang="scss" scoped>
.ADDIMG {
  width: 7.5rem;
  height: 3rem;
  background: rgba(255, 255, 255, 1);

  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;

  .add_box {
    margin-top: 0.5rem;
    width: 2.3rem;
    height: 1.5rem;
    background: url("../assets/img/addImg@2x.png") no-repeat;
    background-size: 100%;
  }

  .title {
    margin-top: 0.41rem;
    height: 0.3rem;
    font-size: 0.3rem;
    font-weight: normal;
    color: rgba(10, 10, 10, 1);
    line-height: 0.3rem;
  }
}
</style>