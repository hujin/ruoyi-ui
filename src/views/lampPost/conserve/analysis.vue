<template>
    <div class="app-container conserve-analysis" style="background:#eee;height:calc(100vh - 50px)">
        <div class="c-container">
            <div class="item" @click="goPerson">
                <div class="icon" style="background:#6395F9"></div>
                <div class="item-title">人员</div>
                <div class="item-desc">统计分析</div>
                <div class="item-en">PERSON</div>
            </div>
            <div class="item" @click="goTime">
                <div class="icon"></div>
                <div class="item-title">巡查时间及内容</div>
                <div class="item-desc">统计分析</div>
                <div class="item-en">TIME</div>
            </div>
            <div class="item" @click="goAddress" >
                <div class="icon" style="background:#6ADCAF"></div>
                <div class="item-title">巡查地点</div>
                <div class="item-desc">统计分析</div>
                <div class="item-en">TIME</div>
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
        goPerson(){
            this.$router.push('/lampPost/conserve/analysis-person')
        },
        goAddress(){
            this.$router.push('/lampPost/conserve/analysis-address')

        },
        goTime(){
            this.$router.push('/lampPost/conserve/analysis-time')

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