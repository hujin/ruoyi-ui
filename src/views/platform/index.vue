<template>
    <div class="platform-page">
        <div class="header">
            <el-dropdown>
                <div class="el-dropdown-link">
                    <el-avatar :src="avatar" :size="32"></el-avatar>
                    <span class="nickname">{{nickName}}</span>
                    <i class="el-icon-arrow-down el-icon--right" style="font-size:20px"></i>
                </div>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>权限</el-dropdown-item>
                    <el-dropdown-item divided @click.native="logout">退出</el-dropdown-item>
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
import Cookies from 'js-cookie'

export default {
    data(){
        return {
            lampPost:require(`../../assets/images/platform/icon-1.png`),
            lighting:require(`../../assets/images/platform/icon-2.png`),
            hydrops:require(`../../assets/images/platform/icon-4.png`),
            wellLid:require(`../../assets/images/platform/icon-3.png`),
            video:require(`../../assets/images/platform/icon-5.png`),
            openPlatform:require(`../../assets/images/platform/icon-6.png`),
            cockpit:require(`../../assets/images/platform/icon-7.png`),
            environment:require(`../../assets/images/platform/icon-8.png`),
            index:require(`../../assets/images/platform/icon-9.png`),

        }
    },
    methods:{
        go(item){
            console.log(item)
            if (item.name == 'Lighting') {
                window.open(`http://202.101.162.69:18900/#/login?accessToken=${Cookies.get('Admin-Token')}&type=4`)
                // location.href = `http://202.101.162.69:18900/#/login?accessToken=${Cookies.get('Admin-Token')}&type=4`
            } else if (item.name == 'Cockpit') {
                window.open(item.path)

            } else {
                
                this.$router.push(item.path)
            }
        },
        async logout() {
            this.$confirm('确定注销并退出系统吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$store.dispatch('LogOut').then(() => {
                location.href = '/platform';
                })
            }).catch(() => {});
        }
    },
    computed:{
        ...mapGetters(["systemList"]),
        ...mapState({
            nickName: state => state.user.nickName,
            avatar: state => state.user.avatar,
        }),
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
            cursor: pointer;

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