<template>
    <div class="hydrops-now">
        <div class="row">
            <div class="left1">
                <div class="name">今日最大水位</div>
                <div class="water">
                    <div class="num">{{info.maxWaterLevel || 0}}</div>
                    <div class="symbol">cm</div>
                </div>
                <div class="desc">液位预警值:{{info.warningThresholdValue || 0}}cm</div>
            </div>
            <div class="right1">
                <div class="column">
                    <div class="item">
                        <div class="label">当前水位</div>
                        <div class="val">{{info.currentWaterLevel || 0}}cm</div>
                    </div>
                    <div class="item">
                        <div class="label">积水速度</div>
                        <div class="val">{{info.waterLevelUpSpeed}}cm²/h</div>
                    </div>
                </div>
                <div class="column">
                    <div class="item">
                        <div class="label">排水速度</div>
                        <div class="val">{{info.waterLevelDownSpeed || 0}}cm²/h</div>
                    </div>
                    <div class="item">
                        <div class="label">积水时长</div>
                        <div class="val">{{info.warningContinueTime || '暂无'}}</div>
                    </div>
                </div>
                
            </div>
        </div>
        <div class="content">
            <video src="" style="width:100%;height:100%"></video>
        </div>
    </div>
</template>
<script>
import resize from '@/views/dashboard/mixins/resize'
import { getRealTimeOverview } from "@/api/hydrops";

export default {
    mixins: [resize],
    props:{
        
        id:{
            type:String | Number,
            default:''
        }
    },
    data(){
        return {
            info:{
                currentWaterLevel: '',
                maxWaterLevel: '',
                warningContinueTime: '',
                warningThresholdValue: '',
                waterLevelDownSpeed: '',
                waterLevelUpSpeed: ''
            }
        }
    },
    watch:{
       id:{
        handler(val){
            if (val) {
                this.getRealTimeOverview(val)
            }
        },
        immediate:true
       }
    },
    methods:{
        handleClick(tab, event){

        },
        getRealTimeOverview(id){
            getRealTimeOverview({deviceUid:id}).then(res => {
                if (res.code == 200) {
                    if (res.data) {
                        this.$set(this, 'info', res.data)
                    }
                }
            })
        }
        
    },
    created(){
       
    }
}
</script>
<style lang="scss">
.hydrops-now{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 24px;
    display: flex;
    flex-direction: column;
    background-color: #fff;

    .row{
        display: flex;
        background-color: #F8F9FB;
        box-sizing: border-box;
        height: 137px;
    }

    .left1{
        position: relative;
        width: 206px;
        margin-right: 61px;
        box-sizing: border-box;
        background: rgba(64,158,254,0.08);
        display: flex;
        flex-direction: column;
        align-items: center;

        .name{
            font-size: 20px;
            font-weight: 400;
            color: rgba(0,0,0,0.8);
            line-height: 22px;
            margin-top: 19px;
        }

        .water{
            display: flex;
            align-items: baseline;

            .num{
                font-size: 48px;
                font-weight: bold;
                color: rgba(0,0,0,0.9);
            }
        }

        .desc{
            font-size: 14px;
            font-weight: 400;
            color: rgba(0,0,0,0.4);
        }

    }
  
    .right1{
        flex: 1;
        width: 0;
        display: flex;
        align-items: center;

        .column{
            margin-right: 48px;

            .item{
                display: flex;
                align-items: center;

                .label{
                    font-size: 16px;
                    font-weight: 400;
                    color: rgba(0,0,0,0.6);
                    line-height: 24px;
                    margin-right: 16px;
                }
            }

            .item + .item{
                margin-top: 16px;
            }
        }

       
    }

    .content{
        margin-top: 25px;
        height: 0;
        flex: 1;
    }

    .el-tabs{
        height: 100%;
        display: flex;
        flex-direction: column;

        
    }

    .el-tabs__content{
        flex: 1;
        height: 0;

        .el-tab-pane{
            width: 100%;
            height: 100%;
        }
    }
}
</style>