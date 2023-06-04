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
            <el-carousel style="width:100%;height:100%" height="100%" class="carousel">
              <template v-if="videoUrl.length > 0">
                <el-carousel-item v-for="(item, index) in videoUrl" :key="index" class="carousel-item"  style="width:100%;height:100%">
                  <div class="video-list">
                    <div class="video-item-1">
                      <video class="video-js" :id="'video-'+ (index)"  controls autoplay style="width:100%;height:100%"  v-if="videoUrl[index]"></video>
                    </div>
                  </div>
                  
                </el-carousel-item>
              </template>
              <template v-else>
                <el-carousel-item style="width:100%;height:100%">
                  <div class="video-list">

                    <div class="video-item-1">
                    </div>
                  </div>
                </el-carousel-item>
              </template>
              
            </el-carousel>
           
          </template>
          <template v-if="videoType == 2">
            <el-carousel style="width:100%;height:100%" height="100%">
              <template v-if="videoUrl.length > 0">
                <el-carousel-item v-for="index in Math.ceil(videoUrl.length / 4)" :key="index" style="width:100%;height:100%">
                  <div class="video-list">
                    <div class="video-item-4">
                      <video class="video-js" :id="'video-'+ ((index - 1) * 4 + 0) "  controls autoplay style="width:100%;height:100%"  v-if="videoUrl[(index - 1)*4 + 0]"></video>
                    </div>
                    <div class="video-item-4">
                      <video class="video-js" :id="'video-'+ ((index - 1) * 4 + 1) "  controls autoplay style="width:100%;height:100%"  v-if="videoUrl[(index - 1)*4 + 1]"></video>
                    </div>
                    <div class="video-item-4">
                      <video class="video-js" :id="'video-'+ ((index - 1) * 4 + 2) "  controls autoplay style="width:100%;height:100%"  v-if="videoUrl[(index - 1)*4 + 2]"></video>
                    </div>
                    <div class="video-item-4">
                      <video class="video-js" :id="'video-'+ ((index - 1) * 4 + 3) "  controls autoplay style="width:100%;height:100%"  v-if="videoUrl[(index - 1)*4 + 3]"></video>
                    </div>
                  </div>
                  
                </el-carousel-item>
              </template>
              <template v-else>
                <el-carousel-item style="width:100%;height:100%">
                  <div class="video-list">

                    <div class="video-item-4">
                    </div>
                    <div class="video-item-4">
                    </div>
                    <div class="video-item-4">
                    </div>
                    <div class="video-item-4">
                    </div>
                  </div>
                </el-carousel-item>
              </template>
              
            </el-carousel>
            

          </template>
          <template v-if="videoType == 3">
            <el-carousel style="width:100%;height:100%" height="100%">
              <template v-if="videoUrl.length > 0">
                <el-carousel-item v-for="index in Math.ceil(videoUrl.length / 9)" :key="index" style="width:100%;height:100%">
                  <div class="video-list">
                    <div class="video-item-9">
                      <video class="video-js" :id="'video-'+ ((index - 1) * 4 + 0) "  controls autoplay style="width:100%;height:100%"  v-if="videoUrl[(index - 1)*4 + 0]"></video>
                    </div>
                    <div class="video-item-9">
                      <video class="video-js" :id="'video-'+ ((index - 1) * 4 + 1) "  controls autoplay style="width:100%;height:100%"  v-if="videoUrl[(index - 1)*4 + 1]"></video>
                    </div>
                    <div class="video-item-9">
                      <video class="video-js" :id="'video-'+ ((index - 1) * 4 + 2) "  controls autoplay style="width:100%;height:100%"  v-if="videoUrl[(index - 1)*4 + 2]"></video>
                    </div>
                    <div class="video-item-9">
                      <video class="video-js" :id="'video-'+ ((index - 1) * 4 + 3) "  controls autoplay style="width:100%;height:100%"  v-if="videoUrl[(index - 1)*4 + 3]"></video>
                    </div>
                    <div class="video-item-9">
                      <video class="video-js" :id="'video-'+ ((index - 1) * 4 + 4) "  controls autoplay style="width:100%;height:100%"  v-if="videoUrl[(index - 1)*4 + 4]"></video>
                    </div>
                    <div class="video-item-9">
                      <video class="video-js" :id="'video-'+ ((index - 1) * 4 + 5) "  controls autoplay style="width:100%;height:100%"  v-if="videoUrl[(index - 1)*4 + 5]"></video>
                    </div>
                    <div class="video-item-9">
                      <video class="video-js" :id="'video-'+ ((index - 1) * 4 + 6) "  controls autoplay style="width:100%;height:100%"  v-if="videoUrl[(index - 1)*4 + 6]"></video>
                    </div>
                    <div class="video-item-9">
                      <video class="video-js" :id="'video-'+ ((index - 1) * 4 + 7) "  controls autoplay style="width:100%;height:100%"  v-if="videoUrl[(index - 1)*4 + 7]"></video>
                    </div>
                    <div class="video-item-9">
                      <video class="video-js" :id="'video-'+ ((index - 1) * 4 + 8) "  controls autoplay style="width:100%;height:100%"  v-if="videoUrl[(index - 1)*4 + 8]"></video>
                    </div>
                  </div>
                  
                </el-carousel-item>
              </template>
              <template v-else>
                 <el-carousel-item  style="width:100%;height:100%">
                  <div class="video-list">
                    <div class="video-item-9">
                    </div>
                    <div class="video-item-9">
                    </div>
                    <div class="video-item-9">
                    </div>
                    <div class="video-item-9">
                    </div>
                    <div class="video-item-9">
                    </div>
                    <div class="video-item-9">
                    </div>
                    <div class="video-item-9">
                    </div>
                    <div class="video-item-9">
                    </div>
                    <div class="video-item-9">
                    </div>
                  </div>
                  
                </el-carousel-item>
              </template>
            </el-carousel>

          </template>
          <template v-if="videoType == 4">
            <el-carousel style="width:100%;height:100%" height="100%">
              <template v-if="videoUrl.length > 0">
                <el-carousel-item v-for="index in Math.ceil(videoUrl.length / 16)" :key="index" style="width:100%;height:100%">
                  <div class="video-list">
                    <div class="video-item-16">
                      <video class="video-js" :id="'video-'+ ((index - 1) * 4 + 0) "  controls autoplay style="width:100%;height:100%"  v-if="videoUrl[(index - 1)*4 + 0]"></video>
                    </div>
                    <div class="video-item-16">
                      <video class="video-js" :id="'video-'+ ((index - 1) * 4 + 1) "  controls autoplay style="width:100%;height:100%"  v-if="videoUrl[(index - 1)*4 + 1]"></video>
                    </div>
                    <div class="video-item-16">
                      <video class="video-js" :id="'video-'+ ((index - 1) * 4 + 2) "  controls autoplay style="width:100%;height:100%"  v-if="videoUrl[(index - 1)*4 + 2]"></video>
                    </div>
                    <div class="video-item-16">
                      <video class="video-js" :id="'video-'+ ((index - 1) * 4 + 3) "  controls autoplay style="width:100%;height:100%"  v-if="videoUrl[(index - 1)*4 + 3]"></video>
                    </div>
                    <div class="video-item-16">
                      <video class="video-js" :id="'video-'+ ((index - 1) * 4 + 4) "  controls autoplay style="width:100%;height:100%"  v-if="videoUrl[(index - 1)*4 + 4]"></video>
                    </div>
                    <div class="video-item-16">
                      <video class="video-js" :id="'video-'+ ((index - 1) * 4 + 5) "  controls autoplay style="width:100%;height:100%"  v-if="videoUrl[(index - 1)*4 + 5]"></video>
                    </div>
                    <div class="video-item-16">
                      <video class="video-js" :id="'video-'+ ((index - 1) * 4 + 6) "  controls autoplay style="width:100%;height:100%"  v-if="videoUrl[(index - 1)*4 + 6]"></video>
                    </div>
                    <div class="video-item-16">
                      <video class="video-js" :id="'video-'+ ((index - 1) * 4 + 7) "  controls autoplay style="width:100%;height:100%"  v-if="videoUrl[(index - 1)*4 + 7]"></video>
                    </div>
                    <div class="video-item-16">
                      <video class="video-js" :id="'video-'+ ((index - 1) * 4 + 8) "  controls autoplay style="width:100%;height:100%"  v-if="videoUrl[(index - 1)*4 + 8]"></video>
                    </div>
                     <div class="video-item-16">
                      <video class="video-js" :id="'video-'+ ((index - 1) * 4 + 9) "  controls autoplay style="width:100%;height:100%"  v-if="videoUrl[(index - 1)*4 + 9]"></video>
                    </div>
                    <div class="video-item-16">
                      <video class="video-js" :id="'video-'+ ((index - 1) * 4 + 10) "  controls autoplay style="width:100%;height:100%"  v-if="videoUrl[(index - 1)*4 + 10]"></video>
                    </div>
                    <div class="video-item-16">
                      <video class="video-js" :id="'video-'+ ((index - 1) * 4 + 11) "  controls autoplay style="width:100%;height:100%"  v-if="videoUrl[(index - 1)*4 + 11]"></video>
                    </div>
                    <div class="video-item-16">
                      <video class="video-js" :id="'video-'+ ((index - 1) * 4 + 12) "  controls autoplay style="width:100%;height:100%"  v-if="videoUrl[(index - 1)*4 + 12]"></video>
                    </div>
                    <div class="video-item-16">
                      <video class="video-js" :id="'video-'+ ((index - 1) * 4 + 13) "  controls autoplay style="width:100%;height:100%"  v-if="videoUrl[(index - 1)*4 + 13]"></video>
                    </div>
                    <div class="video-item-16">
                      <video class="video-js" :id="'video-'+ ((index - 1) * 4 + 14) "  controls autoplay style="width:100%;height:100%"  v-if="videoUrl[(index - 1)*4 + 14]"></video>
                    </div>
                    <div class="video-item-16">
                      <video class="video-js" :id="'video-'+ ((index - 1) * 4 + 15) "  controls autoplay style="width:100%;height:100%"  v-if="videoUrl[(index - 1)*4 + 15]"></video>
                    </div>
                  </div>
                  
                </el-carousel-item>
              </template>
              <template v-else>
                <el-carousel-item style="width:100%;height:100%">
                  <div class="video-list">
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
                  </div>
                </el-carousel-item>
              </template>
            </el-carousel>
            
          </template>

        </div>
        <div class="btn-wrap">
          <div class="btn" @click="handleVideoTypeChange(item.value)" :class="{active: item.value == videoType}" v-for="(item, index) in videoTypeList" :key="index">{{item.text}}</div>
         
        </div>
    </div>
  </div>
</template>
<script>

import { getRoadRelation,getRealTimeUrl,getPlayBackVideo } from "@/api/video";

export default {
  dicts: ['sys_road'],
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
      id:'',
      videoUrl:[]
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
        } else {
            if (isCheck) {
              this.getPlayBackVideo(data.id)
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
                  label:this.selectDictLabel(this.dict.type.sys_road, item.road),
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
        if (res.code == 200) {
          if (res.data) {
            this.videoUrl.push(res.data)

            this.$nextTick(() => {
              let player =  videojs(`video-${this.videoUrl.length -1}`, {

              })

              player.src([{
                type:'application/x-mpegURL',
                src:res.data
              }]);

              player.play()
            })
          }
        }
      })
    },
    getPlayBackVideo(id){
      getPlayBackVideo({id}).then(res => {

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

  .video-list{
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

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
      justify-content: center;

      .video-item-1{
        width: 100%;
        height: 100%;
        background-color: #d8d8d8;
      }

      .video-item-4{
        width: 50%;
        height: 48%;
        box-sizing: border-box;

        &:nth-child(1),
        &:nth-child(2){
          margin-bottom: 24px;
        }

        &:nth-child(even){
          padding-left: 12px;

        }

        &:nth-child(odd){
          padding-right: 12px;

        }
      }

      .video-item-9{
        width: 31%;
        height: 32%;
        box-sizing: border-box;
        margin-right: 16px;

        &:nth-child(3n){
          margin-right: 0;
        }
      }

      .video-item-16{
        width: 25%;
        height: 23%;
        box-sizing: border-box;
        padding-right: 16px;
        margin-bottom: 16px;
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
