<template>
    <div class="platform-page">
        <div class="header">
            <el-dropdown>
                <div class="el-dropdown-link">
                    <el-avatar :size="32"></el-avatar>
                    <span class="nickname">系统管理员</span>
                    <i class="el-icon-arrow-down el-icon--right" style="font-size:20px"></i>
                </div>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>权限</el-dropdown-item>
                    <el-dropdown-item>退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <div class="content">
            <div class="system-list">
                <div class="system-item" 
                     v-for="(item, index) in list" 
                     :key="index" 
                     @click="go(item)">
                    <img :src="item.icon" alt="" class="img">
                </div>
            </div>
        </div>
    </div>
</template> 
<script>
import { mapGetters, mapState } from "vuex";


export default {
    data(){
        return {
            lampPost:require(`../../assets/images/platform/icon-1.png`),
            lighting:require(`../../assets/images/platform/icon-2.png`),
            wellLid:require(`../../assets/images/platform/icon-3.png`),
            hydrops:require(`../../assets/images/platform/icon-4.png`),
            video:require(`../../assets/images/platform/icon-5.png`),
            openPlatform:require(`../../assets/images/platform/icon-6.png`),
            cockpit:require(`../../assets/images/platform/icon-7.png`),
            environment:require(`../../assets/images/platform/icon-8.png`),

        }
    },
    methods:{
        go(item){
            this.$router.push(item.path)
        }
    },
    computed:{
        ...mapGetters(["systemList"]),
        list() {
            let systemList =  JSON.parse(JSON.stringify(this.systemList));
            systemList.forEach(item => {
                let key = item.path.replace('/', '')
                item['icon'] = this[key]
            })

            return systemList
        }

    },
    created(){
       
    }
}
</script>
<style lang="scss">
.platform-page{
    width: 100%;
    height: 100%;
    background-image: url("../../assets/images/platform/bg.png");
    background-size: cover;
    display: flex;
    flex-direction: column;

    .header{
        height: 56px;
        width: 100%;
        background-color: rgba(255,255,255, .27);
        display: flex;
        align-items: center;
        justify-content: flex-end;
        box-sizing: border-box;
        padding-right: 16px;

        .el-dropdown-link{
            display: flex;
            align-items: center;

            .nickname{
                font-size: 20px;
                line-height: 28px;
                color: rgba(0,0,0,.9);
                margin-left: 8px;
            }
        }
    }

    .content{
        flex: 1;
        height: 0;
        position: relative;

        .system-list{
            width: 1128px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
            display: flex;
            flex-wrap: wrap;

            .system-item{
                width: 360px;
                height: 210px;
                margin-right: 24px;
                margin-bottom: 24px;
                background-color: #fff;
                cursor: pointer;

                &:nth-child(3n){
                    margin-right: 0;
                }

                .img{
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
}
</style>