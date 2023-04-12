<template>
  <div class="container">
    <div class="left">
      <el-input placeholder="请输入内容"></el-input>
      <div class="tree-wrap">
        <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </div>
    </div>
    <div class="right">
        <div class="info-wrap">
            <img src="../../../assets/images/environ/icon-location.png" alt="" class="icon">
            <div class="name">长河道路-气象-直控点02</div>
            <div class="time">上报时间：2023-02-28 16:00:00</div>
            <div class="status-circle"></div>
            <div class="status-text">设备在线-正常</div>
        </div>
        <div class="tab-header">
            <div class="tab-header-item" @click="handleTabItemClick(item.value)" :class="{active: item.value == active}" v-for="(item,index) in tabHeaderList" :key="index">{{item.text}}</div>
        </div>
        <div class="content">
            <i-history v-if="active == 2"></i-history>
            <i-now v-else></i-now>
        </div>
    </div>
  </div>
</template>
<script>
import iHistory from './component/history'
import iNow from './component/now'

export default {
  components:{
    iHistory,
    iNow
  },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "label",
      },
      treeData: [
        {
          label: "长河道路",
          children: [
            {
              label: "长河道路-气象-直控点01",
              
            },
            {
              label: "长河道路-气象-直控点02",
              
            },
          ],
        },
        {
          label: "一级 2",
          children: [
            {
              label: "二级 2-1",
              children: [
                {
                  label: "三级 2-1-1",
                },
              ],
            },
            {
              label: "二级 2-2",
              children: [
                {
                  label: "三级 2-2-1",
                },
              ],
            },
          ],
        },
        {
          label: "一级 3",
          children: [
            {
              label: "二级 3-1",
              children: [
                {
                  label: "三级 3-1-1",
                },
              ],
            },
            {
              label: "二级 3-2",
              children: [
                {
                  label: "三级 3-2-1",
                },
              ],
            },
          ],
        },
      ],
      tabHeaderList:[{
        text:'实时数据',
        value:1
      },{
        text:'历史数据',
        value:2
      }],
      active:1
    };
  },
  methods:{
    handleNodeClick(e){
        console.log(e)
    },
    handleTabItemClick(val){
        if (val == this.active) {
            return;
        }

        this.active = val;
    }
  }
};
</script>
<style lang="scss">
.container {
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
        height: 72px;
        width: 100%;
        box-sizing: border-box;
        background: rgba(5,167,94,0.11);
        border-radius: 4px;
        border: 1px solid #05A75E;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        padding: 0 24px;

        .icon{
            width: 32px;
            height: 32px;
            margin-right: 8px;
        }

        .name{
            font-size: 20px;
            font-weight: 400;
            color: #536DE6;
            line-height: 28px;
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
            background-color:  rgba(255,255,255,0.7);;
            margin-right: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 3px 3px 0 0;
            font-size: 16px;
            font-weight: 400;
            color: rgba(0,0,0,0.4);
            cursor: pointer;

            &.active{
                background-color: #536DE6;
                color: rgba(255,255,255,0.9);
            }
        }
    }

    .content{
        flex: 1;
        height: 0;
        width: 100%;
        background-color: #fff;
        border-radius: 0px 4px 4px 4px;
    }
  }
}
</style>
