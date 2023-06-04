<template>
  <div class="hydrops-monitor container">
    <div class="left">
      <el-input placeholder="请输入内容"></el-input>
      <div class="tree-wrap">
        <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </div>
    </div>
    <div class="right">
        <div class="info-wrap">
            <img src="../../../assets/images/environ/icon-location.png" alt="" class="icon">
            <div class="name">{{baseInfo.road}}-积水-{{baseInfo.name}}</div>
            <div class="box">
              <div class="status-circle"></div>
              <div class="status-text">设备在线-{{baseInfo.enable}}</div>
            </div>
            <div class="time" v-if="baseInfo.monitorTime">上报时间：{{new Date(baseInfo.monitorTime).Format('yyyy-MM-dd hh:mm:ss')}}</div>
            
        </div>
        <div class="tab-header">
            <div class="tab-header-item" @click="handleTabItemClick(item.value)" :class="{active: item.value == active}" v-for="(item,index) in tabHeaderList" :key="index">{{item.text}}</div>
        </div>
        <div class="content">
            <i-now :id="id" v-if="active == 1"></i-now>
            <i-history  :id="id" v-if="active == 2"></i-history>
            <i-data :id="id" v-if="active == 3"></i-data>
            <i-history-video v-if="active == 4"></i-history-video>
        </div>
    </div>
  </div>
</template>
<script>
import iHistory from './component/history'
import iNow from './component/now'
import iData from './component/data'
import iHistoryVideo from './component/history-video'

import { getRoadRelation,getLastReportTime } from "@/api/hydrops";

export default {
  dicts: ['sys_road','sys_roadside'],

  components:{
    iHistory,
    iNow,
    iData,
    iHistoryVideo
  },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "label",
      },
      treeData: [],
      tabHeaderList:[{
        text:'实时数据',
        value:1
      },{
        text:'历史数据',
        value:2
      },{
        text:'数据分析',
        value:3,
      },{
        text:'视频回放',
        value:4
      }],
      active:1,
     
      baseInfo:{
        road:'',
        name:'',
        enable:'',
        monitorTime:''
      },
      id:''
    };
  },
  methods:{
    handleNodeClick(data){
        if (!data.id) {
          return;
        }
        this.id = data.id
        this.baseInfo.road = this.selectDictLabel(this.dict.type.sys_road, data.road),
        this.baseInfo.name = data.name;

        if (data.enable == '0') {
          this.baseInfo.enable = '非启用'
        } else if (data.enable == '1') {
          this.baseInfo.enable = '启用'
          
        } else if (data.enable == '2') {
          this.baseInfo.enable = '移除'
        }

        this.getLastReportTime()

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
                  label:this.selectDictLabel(this.dict.type.sys_road, item.road),
                  children:[]
                }

                item.monitorList.forEach(sub => {
                  first.children.push({
                    label:sub.address,
                    road:sub.road,
                    name:sub.name,
                    address:sub.address,
                    enable:sub.enable,
                    id:sub.uid
                  })
                })

                list.push(first)
              })
              if (list.length > 0) {
                let item = list[0].children[0];
                this.id = item.id;
                this.baseInfo.road =  this.selectDictLabel(this.dict.type.sys_road, item.road),
                this.baseInfo.name = item.name;
                if (item.enable == '0') {
                  this.baseInfo.enable = '非启用'
                } else if (item.enable == '1') {
                  this.baseInfo.enable = '启用'
          
                } else if (item.enable == '2') {
                  this.baseInfo.enable = '移除'

                }
                
              }
              this.$set(this, 'treeData', list)
            }
         }
      })
    },
    getLastReportTime(){
      getLastReportTime({
        deviceUid:this.id
      }).then(res => {
        if (res.code == 200) {
          if (res.data) {
            this.baseInfo.monitorTime = res.data
          }
        }
      })
    }
    
  },
  created(){
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.getLastReportTime();
    }
    this.getRoadRelation();
  }
};
</script>
<style lang="scss">
.hydrops-monitor {
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
        margin-bottom: 16px;
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

    .tab-header{
        height: 40px;
        width: 100%;
        display: flex;

        .tab-header-item{
            width: 112px;
            height: 40px;
            background-color: #EBF1FF;
            margin-right: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 3px 3px 0 0;
            font-size: 16px;
            font-weight: 400;
            color: #A2A9BC;
            cursor: pointer;

            &.active{
                background-color: #fff;
                color: #409EFE;
                font-weight: 500;
            }
        }
    }

    .content{
        flex: 1;
        height: 0;
        width: 100%;
        // background-color: #fff;
        border-radius: 0px 4px 4px 4px;
    }
  }
}
</style>
