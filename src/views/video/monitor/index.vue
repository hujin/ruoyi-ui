<template>
  <div class="inspect-data container">
    <div class="left">
      <div class="tabs">
        <div class="tab" :class="{active: type == 1}" @click="handleTypeChange(1)">实时视频</div>
        <div class="tab" :class="{active: type == 2}" @click="handleTypeChange(2)">历史回放</div>
      </div>
      <div class="padding">
        <el-input placeholder="请输入内容"></el-input>

      </div>
      <div class="tree-wrap">
        <el-tree :data="treeData" show-checkbox :props="defaultProps" @check-change="handleNodeClick"></el-tree>
      </div>
    </div>
    <div class="right">
        <div class="video-wrap">
          <template v-if="videoType == 1">
            <div class="video-item-1"></div>
          </template>
          <template v-if="videoType == 2">
            <div class="video-item-4"></div>
            <div class="video-item-4"></div>
            <div class="video-item-4"></div>
            <div class="video-item-4"></div>

          </template>
          <template v-if="videoType == 3">
            <div class="video-item-9"></div>
            <div class="video-item-9"></div>
            <div class="video-item-9"></div>
            <div class="video-item-9"></div>
            <div class="video-item-9"></div>
            <div class="video-item-9"></div>
            <div class="video-item-9"></div>
            <div class="video-item-9"></div>
            <div class="video-item-9"></div>
          </template>
          <template v-if="videoType == 4">
            <div class="video-item-16"></div>
            <div class="video-item-16"></div>
            <div class="video-item-16"></div>
            <div class="video-item-16"></div>
            <div class="video-item-16"></div>
            <div class="video-item-16"></div>
            <div class="video-item-16"></div>
            <div class="video-item-16"></div>
            <div class="video-item-16"></div>
            <div class="video-item-16"></div>
            <div class="video-item-16"></div>
            <div class="video-item-16"></div>
            <div class="video-item-16"></div>
            <div class="video-item-16"></div>
            <div class="video-item-16"></div>
            <div class="video-item-16"></div>
          </template>

        </div>
        <div class="btn-wrap">
          <div class="btn" @click="handleVideoTypeChange(item.value)" :class="{active: item.value == videoType}" v-for="(item, index) in videoTypeList" :key="index">{{item.text}}</div>
         
        </div>
    </div>
  </div>
</template>
<script>

import { getRoadRelation,getRealTimeUrl } from "@/api/video";

export default {
  
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "label",
      },
      treeData: [],
      loading: false,
      videoType:1,
      videoTypeList:[{
        text:'单屏',
        value:1
      },{
        text:'四分屏',
        value:2
      },{
        text:'九分屏',
        value:3
      },{
        text:'十六分屏',
        value:4
      }],
      type:1,
      id:''
    };
  },
  methods:{
    handleVideoTypeChange(val){
      this.videoType = val;
    },
    handleTypeChange(val){
      this.type = val;
    },  
    handleNodeClick(data, isCheck){
        if (!data.id) {
          return;
        }
        console.log(data, isCheck)
        if (this.type == 1 ) {
          if (isCheck) {
            this.getRealTimeUrl(data.id)
          }
        }
        // this.getMonitorStationDetail(data.id)
        // this.getMonitorList(data.id)
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
                  children:[],
                  disabled:true
                }

                item.monitorManagementSubVoList.forEach((sub, subIndex) => {
                  first.children.push({
                    label:sub.categoryName,
                    id:null,
                    disabled:true,
                    children:[]
                  })

                  if (sub.monitorList) {
                    sub.monitorList.forEach((third, thirdindex) => {
                      first.children[subIndex].children.push({
                        id:third.id,
                        label: third.name,
                        road:third.road,
                        address:third.address,
                        enable:third.enable,
                      })
                    })
                  }
                })

                list.push(first)
              })
              
              this.$set(this, 'treeData', list)
            }
         }
      })
    },
    
    getRealTimeUrl(id){
      getRealTimeUrl({id}).then(res => {
        
      })
    }
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
    padding-top: 0;
    display: flex;
    flex-direction: column;
    border-radius: 4px;

    .tabs{
      height: 40px;
      width: 100%;
      display: flex;
      margin-bottom: 24px;

      .tab{
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        color: #A2A9BC;
        background-color: #EBF1FF;

        &.active{
          background-color: #fff;
          color: #409EFE;
          font-weight: 500;
        }
      }
    }

    .padding{
      padding: 0 10px;
    }

    .tree-wrap {
      padding: 0 10px;

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

    .video-wrap{
      flex: 1;
      height: 0;
      width: 100%;
      display: flex;
      flex-wrap: wrap;

      .video-item-1{
        width: 100%;
        height: 100%;
        background-color: #d8d8d8;
      }

      .video-item-4{
      }
    }

    .btn-wrap{
      margin-top: 24px;
      display: flex;
      justify-content: center;

      .btn{
        height: 40px;
        line-height: 40px;
        padding: 0 32px;
        box-sizing: border-box;
        border:1px solid #409EFE;
        color: #409EFE;
        font-size: 16px;
        border-radius: 3px;
        cursor: pointer;

        &.active{
          background-color: #409EFE;
          color: #fff;
        }
      }

      .btn + .btn {
        margin-left: 24px;
      }
    }
  }
}
</style>
