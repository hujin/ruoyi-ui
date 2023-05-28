<template>
  <div class="inspect-data container">
    <div class="left">
      <el-input placeholder="请输入内容"></el-input>
      <div class="tree-wrap">
        <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </div>
    </div>
    <div class="right">
        <div class="info-wrap">
            <img src="../../../assets/images/hydrops/icon-location.png" alt="" class="icon">
            <div class="name">{{baseInfo.road}}-井盖-{{baseInfo.name}}</div>
            <div class="box">
              <div class="status-circle"></div>
              <div class="status-text">设备在线-{{baseInfo.enable}}</div>
            </div>
            <div class="time">上报时间：{{new Date(baseInfo.monitorTime).Format('yyyy-MM-dd hh:mm:ss')}}</div>
        </div>
        <div class="base-info">
            <div class="base-info-container">
                <div class="left-wrap">
                    <div class="label">使用时长</div>
                    <div class="text">
                        <span class="num">{{info.useTime}}</span>
                        <span class="symbol">h</span>
                    </div>
                </div>
                <div class="center-wrap">
                    <div class="row">
                        <div class="item">
                            <div class="label">取电方式</div>
                            <div class="value">{{info.powerSupplyMethod}}</div>
                        </div>
                        <div class="item">
                            <div class="label">电  压</div>
                            <div class="value">{{info.voltage}}v</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="item">
                            <div class="label">巡检次数</div>
                            <div class="value">{{info.reportedTimes}}次</div>
                        </div>
                        <div class="item">
                            <div class="label">告警次数</div>
                            <div class="value">{{info.warningTimes}}次</div>
                        </div>
                    </div>
                </div>
                <img v-if="info.defencesStatus == 'ON'" src="@/assets/images/hydrops/icon-inspect-1.png" alt="">
                <img v-else src="@/assets/images/hydrops/icon-inspect-2.png" alt="">

                <el-button type="primary" plain style="margin-right:24px">查看详情</el-button>
            </div>
        </div>
        <div class="content">
            <div>
                <el-button type="primary" @click.stop="handleExport">导出</el-button>
            </div>
            <div class="grid-wrap">
                <el-table ref="tables" v-loading="loading" :data="list" @selection-change="handleSelectionChange">
                    <el-table-column label="上报时间" align="center" prop="reportTimestampStr"  />
                    <el-table-column label="状态" align="center" prop="statusDesc"  />
                    <el-table-column label="安装地址" align="center"  >
                      <template slot-scope="scope">
                          <div>{{scope.row.road}}{{scope.row.address}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="坐标" align="center"  >
                       <template slot-scope="scope">
                          <div>经度:{{scope.row.longitude}},纬度:{{scope.row.latitude}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="告警类型" align="center" prop="warningTypeDesc"  />
                    <el-table-column label="电池电压v" align="center" prop="batteryVoltage"  />
                    <el-table-column label="温度°C" align="center" prop="temp" />
                    <el-table-column label="信号强度" align="center" prop="signalStrength"  />
                </el-table>
            </div>
            <div class="page-wrap">
                <pagination
                    v-show="total>0"
                    :total="total"
                    :page.sync="queryParams.pageNum"
                    :limit.sync="queryParams.pageSize"
                    @pagination="getMonitorList"
                />
            </div>
        </div>
    </div>
  </div>
</template>
<script>

import { getRoadRelation,getMonitorDetail,getMonitorList } from "@/api/wellLid";


export default {
  
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "label",
      },
      treeData: [],
      ids:[],
      list:[],
      total:0,
      loading: false,
      queryParams: {
        manholeCoverId:'',
        pageNum: 1,
        pageSize: 10,
        road: undefined,
        status: undefined
      },
      info:{
        powerSupplyMethod: "",
        reportedTimes: 1,
        useTime: 0,
        voltage: "",
        warningTimes: 0,
        statusDesc:''
      },
      baseInfo:{
        road:'',
        name:'',
        enable:'',
        monitorTime:''
      },
      list:[],
      id:''
    };
  },
  methods:{
    handleExport(){
       this.download('/slp/slp/manhole/cover/reportedData/export', {
                status:this.queryParams.status,
                road:this.queryParams.road,
            }, `device_${new Date().getTime()}.xlsx`) 
    },
    handleSelectionChange(){

    },
    handleNodeClick(data){
        if (!data.id) {
          return;
        }
        this.id = data.id
        this.baseInfo.road = data.road,
        this.baseInfo.name = data.name;

        if (data.enable == '0') {
          this.baseInfo.enable = '非启用'
        } else if (data.enable == '1') {
          this.baseInfo.enable = '启用'
          
        } else if (data.enable == '2') {
          this.baseInfo.enable = '移除'

        }

        this.getMonitorStationDetail(data.id)
        this.getMonitorList(data.id)
    },
    getMonitorList(id){
      this.queryParams.manholeCoverId = id
      getMonitorList(this.queryParams).then(res => {
        if (res.code === 200) {
          if (this.queryParams.pageNum == 1 && res.rows.length > 0) {
          this.baseInfo.monitorTime = res.rows[0].reportTimestampStr

          }

          this.$set(this,'list', res.rows)
        }
      })
    },
    handleTabItemClick(val){
        if (val == this.active) {
            return;
        }

        this.active = val;
    },
    getRoadRelation(){
      getRoadRelation().then(res => {
         if(res.code == 200) {
            let list = [];
            if (res.data) {
              res.data.forEach(item => {
                let first = {
                  label:item.road,
                  children:[]
                }

                item.manholeCoverList.forEach(sub => {
                  first.children.push({
                    label:sub.address,
                    road:sub.road,
                    address:sub.address,
                    enable:sub.enable,
                    id:sub.id
                  })
                })

                list.push(first)
              })
              if (list.length > 0) {
                let item = list[0].children[0];
                this.id = item.id;
                this.baseInfo.road = item.road,
                this.baseInfo.name = item.name;
                if (item.enable == '0') {
                  this.baseInfo.enable = '非启用'
                } else if (item.enable == '1') {
                  this.baseInfo.enable = '启用'
          
                } else if (item.enable == '2') {
                  this.baseInfo.enable = '移除'

                }
                
                this.getMonitorStationDetail(this.id)
                this.getMonitorList(this.id)
              }
              this.$set(this, 'treeData', list)
            }
         }
      })
    },
    getMonitorDetail(id){
      getMonitorDetail(id).then(res => {
        if (res.code == 200) {

        }
      })
    },
    getMonitorStationDetail(id){
      getMonitorDetail(id).then(res => {
        if (res.code == 200) {
          this.$set(this, 'info', res.data)
        }
      })
    },

  },
  created(){
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.getMonitorStationDetail(this.id)
      this.getMonitorList(this.id)
    }
    this.getRoadRelation();
  }
};
</script>
<style lang="scss">
.inspect-data {
  width: 100%;
  height: 100%;
  position: absolute;
  box-sizing: border-box;
  padding: 16px 24px;
  display: flex;
  background-color: #eee;

  .left {
    width: 340px;
    height: 100%;
    margin-right: 16px;
    background-color: #fff;
    box-sizing: border-box;
    padding: 24px 10px;
    display: flex;
    flex-direction: column;
    border-radius: 4px;

    .tree-wrap {
      margin-top: 16px;
      flex: 1;
      height: 0;
      width: 100%;
      overflow-y: auto;
    }
  }

  .right {
    flex: 1;
    width: 0;
    height: 100%;
    display: flex;
    flex-direction: column;

    .info-wrap{
        height: 92px;
        width: 100%;
        box-sizing: border-box;
        background: #fff;
        border-radius: 4px;
        margin-bottom: 24px;
        display: flex;
        align-items: center;
        padding: 0 24px;

        .icon{
            width: 24px;
            height: 24px;
            margin-right: 8px;
        }

        .name{
            font-size: 20px;
            font-weight: 400;
            color: #000;
            line-height: 28px;
        }

        .box{
          margin-left: 24px;
          margin-right: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          height: 44px;
          padding: 0 14px;
          background-color: rgba(5,167,94,0.1);
        }

        .time{
            font-size: 16px;
            font-weight: 400;
            color: rgba(0,0,0,0.4);
            line-height: 24px;
            margin-left: 18px;
        }

        .status-circle{
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-left: auto;
            background-color: #05A75E;
        }

        .status-text{
            font-size: 20px;
            font-weight: 400;
            color: #05A75E;
            margin-left: 9px;
        }
    }

    .base-info{
        width: 100%;
        height: 140px;
        background-color: #fff;
        border-radius: 4px;
        margin-bottom: 24px;
        box-sizing: border-box;
        padding: 24px;

        .base-info-container{
            width: 100%;
            height: 100%;
            background: #F8F9FB;
            border-radius: 4px;
            display: flex;
            align-items: center;
            overflow: hidden;

            .left-wrap{
                width: 124px;
                height: 100%;
                background-color: #e4effa;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                margin-right: 25px;

                .label {
                    font-size: 16px;
                    font-weight: 400;
                    color: rgba(0,0,0,0.45);
                    line-height: 22px;

                }

                .text{
                    display: flex;
                    align-items: baseline;

                    .num{
                        font-size: 30px;
                        font-weight: 500;
                        color: #000;
                        line-height: 38px;
                    }

                    .symbol{
                        font-size: 16px;
                    }
                }
            }

            .center-wrap{
                display: flex;
                flex-direction: column;
                justify-content: center;
                margin-right: auto;

                .row{
                    display: flex;

                    .item{
                        display: flex;
                        margin-right: 40px;
                        font-size: 16px;

                        .label{
                            width: 80px;
                            color: rgba(0,0,0,0.6);
                        }

                        .value{
                            width: 80px;
                            color: rgba(0,0,0,0.9);
                        }
                    }
                    
                }

                .row + .row {
                    margin-top: 16px;
                }
            }

            img{
                width: 153px;
                height: 58px;
                margin-right: 24px;
            }
        }
    }

    .content{
        flex: 1;
        height: 0;
        width: 100%;
        background-color: #fff;
        border-radius: 4px;
        box-sizing: border-box;
        padding: 24px;
        display: flex;
        flex-direction: column;

        .grid-wrap{
            flex: 1;
            height: 0;
            margin-top: 24px;
        }
    }
  }
}
</style>
