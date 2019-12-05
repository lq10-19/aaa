<template>
    <div class="loan">
        <ul>
            <li>
                <p>列表</p>
                <div class="img">
                    <img src="http://pic15.nipic.com/20110628/1369025_192645024000_2.jpg" preview="0"
                        preview-text="描述文字">
                </div>
            </li>
            <li>
                <p>详情</p>
                <div class="img">
                    <img src="http://pic37.nipic.com/20140113/8800276_184927469000_2.png" preview="1"
                        preview-text="描述文字">
                    <img src="http://pic37.nipic.com/20140113/8800276_184927469000_2.png" preview="1"
                        preview-text="描述文字">
                    <img src="http://pic37.nipic.com/20140113/8800276_184927469000_2.png" preview="1"
                        preview-text="描述文字">
                    <img src="http://img1.imgtn.bdimg.com/it/u=2153937626,1074119156&fm=214&gp=0.jpg" preview="1"
                        preview-text="描述文字">
                    <img src="http://img1.imgtn.bdimg.com/it/u=2153937626,1074119156&fm=214&gp=0.jpg" preview="1"
                        preview-text="描述文字">
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
    export default {
        name: "enclosureInfo",
        data() {
            return {
            }
        },
        created() {
         
        },
        methods: {
           
        }
    }
</script>
<style lang="scss" scoped>
    .loan {
        padding: 0.05rem;

        .img {
            display: flex;
            flex-wrap: wrap;

            img {
                margin: 0.1rem;
                width: 2.25rem;
                height: 2.25rem;
            }
        }

    }
</style>