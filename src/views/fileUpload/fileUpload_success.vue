<template>
  <div class="page">
      <div class="content">
         <div class="successIcon">
             <img src="../../assets/img/success.png" alt="">
             <p>您的贷款申请已经提交</p>
         </div>
         <div class="list">
             <p class="title">如何查询我的贷款申请进度</p>
             <ul>
                 <li v-for="(item,index) in listData" :key="index">
                     <p cla>{{item.name}}</p>
                     <img :src="item.url" alt="">
                     <p v-html="item.text"></p>
                 </li>
             </ul>
         </div>
      </div>
  </div>
</template>

<script>
export default {
  metaInfo: {
    title: "提交"
  },
  data() {
    return {
        listData:[
            {name:'方式一',url:require("../../assets/img/bqyhxcx.png"),text:'扫码或微信搜索关注<br>“佰仟易行”微信小程序'},
            {name:'方式二',url:require("../../assets/img/gzh.png"),text:'扫码或微信搜索关注<br>“佰仟融资租赁”微信公众号'},
            {name:'方式三',url:require("../../assets/img/bqyh.png"),text:'扫码或应用市场搜索<br>“佰仟易行”App后登录查看'}
        ]
    };
  },
 
  created() {
    
  },
  mounted() {
      
  },
  methods: {
    
  }
};
</script>
<style lang="scss" scoped>
    .content{
        width: 100%;
       .successIcon{
           width:6.9rem;
           padding-top: 1.21rem;
           margin: 0 auto;
           border-bottom: 1px solid #e7e7e7;
           img{
               width: 1.8rem;
               height: 1.8rem;
               display: block;
               margin: 0 auto;
           }
           p{
                text-align: center;
                font-size:0.32rem;
                font-weight:400;
                color:rgba(0,0,0,1);
                line-height: 1.6rem;
           }
       }
    }
    .list{
        .title{
            font-size:0.32rem;
            font-weight:400;
            color:rgba(153,153,153,1);
            line-height: 1.5rem;
        }
        ul{
            display: flex;
            justify-content: space-around;
            width: 6.5rem;
            margin: 0 auto;
            flex-wrap:wrap;
            li{
                width: 2.9rem;
                margin-bottom: 0.5rem;
                p:nth-of-type(1){
                    font-size:0.3rem;
                    line-height: 0.8rem;
                    font-weight:400;
                    color:rgba(0,0,0,1);
                }
                img{
                    width: 2.4rem;
                    height: 2.4rem;
                    display: block;
                    margin: 0 auto;
                }
                 p:nth-of-type(2){
                    font-size:0.24rem;
                    font-weight:400;
                    color:rgba(102,102,102,1);
                    line-height:0.3rem;
                    margin-top: 0.2rem;
                    width: 2.9rem;
                }
            }
        }
    }
    
</style>