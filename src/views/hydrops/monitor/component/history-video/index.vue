<template>
    <div class="monitor-history-video">
        <div class="video-wrap"></div>
        <div class="date-wrap">
            <div class="calendar-wrap">
                <div class="calendar-header">回放</div>
                <div class="calendar-body">
                    <el-calendar v-model="value"></el-calendar>

                </div>
            </div>
            <div class="time">
                <el-time-picker style="width:100%" v-model="start" placeholder="开始时间"></el-time-picker>
            </div>
            <div class="time">
                <el-time-picker style="width:100%" v-model="end" placeholder="结束时间"></el-time-picker>
            </div>
            <div class="operate">
                <el-button>清空</el-button>
                <el-button type="primary">确认</el-button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            value: new Date(),
            start:null,
            end:null
        }
    }
}
</script>
<style lang="scss">
.monitor-history-video{
    width: 100%;
    height: 100%;
    display: flex;

    .video-wrap{
        flex: 1;
        width: 0;
        height: 100%;
        background-color: #d2d2d2;
    }

    .date-wrap{
        width: 288px;
        height: 100%;
        background-color: #fff;

        .calendar-wrap{

            .calendar-header{
                height: 40px;
                width: 100%;
                background: rgba(64,158,254,0.1);
                font-size: 14px;
                font-weight: 400;
                color: #333333;
                box-sizing: border-box;
                padding-left: 16px;
                display: flex;
                align-items: center;
            }

            .calendar-body{
                width: 100%;
                // height: 275px;

                .el-calendar__header{
                    padding: 0;
                    height: 40px;
                    width: 100%;
                    position: relative;

                    .el-calendar__title{
                        width: 100%;
                        text-align: center;
                        font-size: 14px;
                    }

                    .el-calendar__button-group{
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;

                        .el-button-group{
                            position: relative;
                            width: 100%;
                            height: 100%;
                            
                            button:nth-child(1){
                                position: absolute;
                                left: 6px;
                                top: 6px;
                            }

                            button:nth-child(2){
                                display: none;
                            }

                            button:nth-child(3){
                                position: absolute;
                                right: 6px;
                                top: 6px;
                            }
                        }
                    }
                }

                .el-calendar__body{
                    padding: 12px 14px;
                }

                .el-calendar-day{
                    height: auto;
                    padding: 8px 0;
                    display: flex;
                    justify-content: center;
                }

                .el-calendar-table thead th{
                    padding: 4px 0;
                    font-weight: 500;
                    color: #333333;
                    font-size: 14px;
                }
            }
        }

        .time{
            width: 100%;
            box-sizing: border-box;
            padding: 0 14px;
            margin-bottom: 14px;
        }

        .operate{
            text-align: right;
            box-sizing: border-box;
            padding: 0 14px;
        }
    }
}
</style>