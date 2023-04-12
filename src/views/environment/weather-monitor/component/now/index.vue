<template>
    <div class="now">
        <div class="row">
            <div class="left1">
                <div class="info">
                    <div class="info-item">
                        <label>温度</label>
                        <span>27°</span>
                    </div>
                    <div class="info-item">
                        <label>风向</label>
                        <span>东南风</span>
                    </div>
                    <div class="info-item">
                        <label>相对湿度</label>
                        <span>45%</span>
                    </div>
                    <div class="info-item">
                        <label>风速</label>
                        <span>2级 1.2m/s</span>
                    </div>
                </div>
                <div class="box-h36">海拔高度 15m</div>
            </div>
            <div class="right">
                <div class="list">
                    <div class="list-item" v-for="(item,index) in list" :key="index">
                        <img :src="item.icon" alt="" class="icon">
                        <div class="text">{{item.label}}</div>
                        <div class="text">{{item.value}}</div>

                    </div>
                </div>
            </div>
        </div>
        <div class="content">
            <el-tabs v-model="active" @tab-click="handleClick">
                <el-tab-pane label="24小时实况数据" name="first">
                    <el-table ref="tables" :data="tableData" style="width:100%;height:100%">
                        <el-table-column type="index" width="50" align="center" />
                        <el-table-column label="时间" width="120" align="center" />
                        <el-table-column label="温度°C" width="120" align="center" />
                        <el-table-column label="相对湿度%" width="120" align="center" />
                        <el-table-column label="气压hpa" width="120" align="center" />
                        <el-table-column label="降雨量mm" width="120" align="center" />
                        <el-table-column label="辐射μT" width="120" align="center" />
                        <el-table-column label="紫外线W/㎡" width="120" align="center" />
                        <el-table-column label="PM2.5ug/㎡" width="120" align="center" />
                        <el-table-column label="PM10ug/㎡" width="120" align="center" />
                        <el-table-column label="风向" width="120" align="center" />
                        <el-table-column label="风速m/s" width="120" align="center" />
                        <el-table-column label="海拔高度m" width="120" align="center" />

                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="24小时实况曲线" name="second">
                    <div class="chart" ref="chart" id="chart" style="width:100%;height:100%"></div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
import * as echarts from 'echarts'
import resize from '@/views/dashboard/mixins/resize'

export default {
    mixins: [resize],
    data(){
        return {
            list:[{
                icon:require('@/assets/images/environ/icon-1.png'),
                label:'气压',
                value:'145hPa'
            },{
                icon:require('@/assets/images/environ/icon-2.png'),
                label:'降雨量',
                value:'0mm'
            },{
                icon:require('@/assets/images/environ/icon-3.png'),
                label:'光照强度',
                value:'150ulx'
            },{
                icon:require('@/assets/images/environ/icon-4.png'),
                label:'辐射',
                value:'0.02ut'
            },{
                icon:require('@/assets/images/environ/icon-5.png'),
                label:'紫外线',
                value:'2w/m'
            },{
                icon:require('@/assets/images/environ/icon-6.png'),
                label:'PM10',
                value:'0.02ug/m³'
            },{
                icon:require('@/assets/images/environ/icon-7.png'),
                label:'PM2.5',
                value:'7ug/m³'
            }],
            active:'first',
            tableData:[],
            chart:null
        }
    },
    watch:{
        active(val){
            if (val == 'second') {
                this.$nextTick(() => {
                    this.initChart()
                })
            }
        }
    },
    methods:{
        handleClick(tab, event){

        },
        initChart(){
            var el = this.$refs['chart'];
            this.chart = echarts.init(el)
            const colors = ['#5470C6', '#91CC75', '#EE6666'];
            this.chart.setOption({
                    color: colors,
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross'
                        }
                    },
                    grid: {
                        right: '20%'
                    },
                    toolbox: {
                        feature: {
                            dataView: { show: true, readOnly: false },
                            restore: { show: true },
                            saveAsImage: { show: true }
                        }
                    },
                    legend: {
                        data: ['Evaporation', 'Precipitation', 'Temperature']
                    },
                    xAxis: [
                        {
                            type: 'category',
                            axisTick: {
                                alignWithLabel: true
                            },
                            // prettier-ignore
                            data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: 'Evaporation',
                            position: 'right',
                            alignTicks: true,
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    color: colors[0]
                                }
                            },
                            axisLabel: {
                                formatter: '{value} ml'
                            }
                        },
    {
      type: 'value',
      name: 'Precipitation',
      position: 'right',
      alignTicks: true,
      offset: 80,
      axisLine: {
        show: true,
        lineStyle: {
          color: colors[1]
        }
      },
      axisLabel: {
        formatter: '{value} ml'
      }
    },
    {
      type: 'value',
      name: '温度',
      position: 'left',
      alignTicks: true,
      axisLine: {
        show: true,
        lineStyle: {
          color: colors[2]
        }
      },
      axisLabel: {
        formatter: '{value} °C'
      }
    }
  ],
  series: [
    {
      name: 'Evaporation',
      type: 'bar',
      data: [
        2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
      ]
    },
    {
      name: 'Precipitation',
      type: 'bar',
      yAxisIndex: 1,
      data: [
        2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
      ]
    },
    {
      name: 'Temperature',
      type: 'line',
      yAxisIndex: 2,
      data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
    }
  ]
})
        }
    },
    created(){
       
    }
}
</script>
<style lang="scss">
.now{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 24px;
    display: flex;
    flex-direction: column;

    .row{
        display: flex;
    }

    .left1{
        width: 310px;
        margin-right: 61px;
    }

    .info{
        display: flex;
        flex-wrap: wrap;
        margin-top: 4px;

        .info-item{
            width: 50%;
            font-size: 16px;
            font-weight: 400;
            margin-bottom: 4px;
            display: flex;

            label{
                width: 64px;
                margin-right: 10px;
                color: rgba(0,0,0,0.6);

            }

            span{
                color: rgba(0,0,0,0.9);

            }
        }
    }

    .box-h36{
        width: 100%;
        height: 36px;
        margin-top: 12px;
        box-sizing: border-box;
        background-color: #DCE2FF;
        border-radius: 4px;
        border: 1px solid #536DE6;
        font-size: 16px;
        font-weight: 400;
        color: #536DE6;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .right{
        flex: 1;
        width: 0;

        .list{
            display: flex;
            margin-top: 6px;

            .list-item{
                margin-right: 32px;

                .icon{
                    width: 24px;
                    height: 24px;
                    margin-bottom: 8px;
                }

                .text{
                    font-size: 16px;
                    font-weight: 400;
                    color: rgba(0,0,0,0.9);
                    line-height: 24px;
                }
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