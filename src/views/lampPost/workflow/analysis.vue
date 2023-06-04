<template>
    <div class="app-container conserve-analysis" style="background:#eee;height:calc(100vh - 50px)">
        <div class="c-container">
            <div class="item" @click="goDepart">
                <div class="icon" style="background:#6AD6DC"></div>
                <div class="item-title">申请单位</div>
                <div class="item-desc">统计分析</div>
                <div class="item-en">UNIT</div>
            </div>
            <div class="item" @click="goUse">
                <div class="icon"></div>
                <div class="item-title">设备使用情况</div>
                <div class="item-desc">统计分析</div>
                <div class="item-en">USE</div>
            </div>
            <div class="item" @click="goOrder" >
                <div class="icon" style="background:#8096FF"></div>
                <div class="item-title">工单</div>
                <div class="item-desc">统计分析</div>
                <div class="item-en">ORDER</div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {

        }
    },
    methods:{
        goDepart(){
            this.$router.push('/lampPost/workflow/analysis-workflow')
        },
        goOrder(){
            this.$router.push('/lampPost/workflow/analysis-apply')

        },
        goUse(){
            this.$router.push('/lampPost/workflow/analysis-device')

        }
    }
}
</script>
<style lang="scss">
.conserve-analysis{
    display: flex;
    flex-direction: column;

    .c-container{
        flex: 1;
        width: 100%;
        height: 0;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 0 136px;

        .item{
            width: 396px;
            height: 500px;
            background-color: #f8f8f8;
            border-radius: 26px;
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;

            .icon{
                width: 120px;
                height: 120px;
                background-color: #f7c32d;
                border-radius: 50%;
                margin-top: -60px;
            }

            .item-title{
                margin-top: 174px;
                font-size: 34px;
                font-weight: 500;
                color: #333333;
            }

            .item-desc{
                font-size: 26px;
                font-weight: 400;
                color: #333333;
            }

            .item-en{
                margin-top: 60px;
                font-size: 80px;
                font-weight: 600;
                color: #EEEEEE;

            }
        }
    }
}
</style>