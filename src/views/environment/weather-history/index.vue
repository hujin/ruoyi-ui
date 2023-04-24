<template>
  <div class="weather-history container">

    <div class="content-page">
      <el-form
        :model="queryParams"
        ref="queryForm"
        size="small"
        :inline="true"
        v-show="showSearch"
      >
        <el-form-item label="日期" prop="time">
          <el-date-picker
              v-model="queryParams.time"
              value-format="yyyy-MM-dd"
              type="datetimerange"
              placeholder="时间"
              @change="dateChange"
          ></el-date-picker>
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
     <div class="date-wrap">
        <div class="date" :class="{active: item.date == dateSelected}" v-for="(item,index) in dateList" :key="index" @click="selectDate(item)">{{item.date}}</div>
     </div>
     <div class="hour-wrap">
      <div class="hour-list">
        <div class="hour" :class="{active: item.value == hourSelected}" v-for="(item,index) in hourList" :key="index" @click="selectHour(item)">{{item.text}}</div>

      </div>

     </div>
     <el-table ref="tables" style="width:100%" v-loading="loading" :data="list">
                    <el-table-column type="index" width="50" align="center" />
                        <el-table-column label="时间" width="220" align="center" >
                            <template slot-scope="scope">
                                <div>{{new Date(scope.row.monitorTime).Format('yyyy-MM-dd hh:mm:ss')}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="温度°C" width="120" prop="temp" align="center" >
                            <template slot-scope="scope">
                                <div>{{scope.row.temp + '°C'}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="相对湿度%" width="120" prop="relativeHumidity" align="center" >
                            <template slot-scope="scope">
                                <div>{{scope.row.relativeHumidity + '%'}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="气压hpa" width="120" prop="airPressure" align="center" >
                            <template slot-scope="scope">
                                <div>{{scope.row.airPressure + 'hpa'}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="降雨量mm" width="120" prop="rainfall" align="center" >
                            <template slot-scope="scope">
                                <div>{{scope.row.rainfall + 'mm'}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="辐射μT" width="120" prop="radiation" align="center" >
                            <template slot-scope="scope">
                                <div>{{scope.row.radiation + 'μT'}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="紫外线W/㎡" width="120" prop="uv" align="center" >
                            <template slot-scope="scope">
                                <div>{{scope.row.uv + 'W/㎡'}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="PM2.5ug/㎡" width="120" prop="pm" align="center" >
                            <template slot-scope="scope">
                                <div>{{scope.row.pm + 'ug/㎡'}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="PM10ug/㎡" width="120" prop="pmTen" align="center" >
                            <template slot-scope="scope">
                                <div>{{scope.row.pmTen + 'ug/㎡'}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="风向" width="120" prop="windDirection" align="center" >
                            <template slot-scope="scope">
                                <div>{{scope.row.windDirection}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="风速m/s" width="120" prop="windSpeed" align="center" >
                            <template slot-scope="scope">
                                <div>{{scope.row.windSpeed + '%' + ' ' + scope.row.windSpeedStr}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="海拔高度m"  align="center" >
                            <template slot-scope="scope">
                                <div>{{scope.row.altitude }}</div>
                            </template>
                        </el-table-column>

            
        </el-table>
        <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
        />
    </div>
  </div>
</template>
<script>
import { getMonitorList } from "@/api/environment";

export default {
  data() {
    return {
      tabHeaderList: [
        {
          text: "未发布",
          value: 1,
        },
        {
          text: "已发布",
          value: 2,
        },
      ],
      active: 1,
      // 遮罩层
      loading: false,
      // 显示搜索条件
      showSearch: true,
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部折叠
      isExpandAll: false,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        time: ['', ''],
        monitorTimeStart:'',
        monitorTimeEnd:'',
        pageNum: 1,
        pageSize: 10,
      },
      list: [],
      total: 0,
      hourList:[],
      hourSelected:'',
      dateList:[],
      dateSelected:''
    };
  },
  
  methods: {
    selectDate(item){
      this.dateSelected = item.date
    },
    selectHour(item){
      if (this.hourSelected == item.value) {
        return
      }
      this.hourSelected = item.value
      let begin = new Date(this.dateSelected + ' ' + this.hourSelected + ':00:00').getTime();
      let end = new Date(this.dateSelected + ' ' + this.hourSelected + ':59:59').getTime();
      this.queryParams.monitorTimeStart = begin;
      this.queryParams.monitorTimeEnd = end;
      this.queryParams.pageNum = 1;
      this.getList();
    },
    dateChange(e){
      console.log(e)
      if (!e) {
        return;
      }
      this.$nextTick(() => {
        this.computedDateList()

      })
    },
    handleTabItemClick(val) {
      if (val == this.active) {
        return;
      }

      this.active = val;
    },
    
    handleQuery(){
            this.queryParams.pageNum = 1;
            this.getList();
    },
    resetQuery(){
            this.queryParams.time = [];
            this.queryParams.monitorTimeStart = '';
            this.queryParams.monitorTimeEnd = ''
            this.queryParams.pageNum = 1;
            this.resetForm("queryForm");
            this.handleQuery();
    },
    handleSelectionChange(){

    },
    handleSortChange(){

    },
    getList(){
      let parmas = {
            pageNum:this.queryParams.pageNum,
            pageSize:this.queryParams.pageSize,
            monitorTimeStart:'',
            monitorTimeEnd:''
      }

      if (this.queryParams.time[0]) {
          parmas.monitorTimeStart = new Date(this.queryParams.time[0]).getTime()
          parmas.monitorTimeEnd = new Date(this.queryParams.time[1]).getTime()
      }
      
      getMonitorList(parmas).then(res => {
          if (res.code == 200) {
              this.$set(this, 'list', res.data.rows);
              this.total  = res.data.total
          }
      })
    },
    computedDateList(){
      console.log(this.queryParams)
      let date0 = new Date(this.queryParams.time[0]).getTime();
      let date1 = new Date(this.queryParams.time[1]).getTime();

      let count = (date1 - date0) / (1000 * 60 * 60 * 24)
      let dateList = [];

      for (let i = 0; i <= count; i++) {
        let date = new Date(JSON.parse(JSON.stringify(this.queryParams)).time[0]);

        dateList.push({
          date: new Date(date.setDate(date.getDate() + i)).Format('yyyy-MM-dd')
        })
      }
      this.$set(this, 'dateList', dateList)
    }
  },
  created(){
    let date = new Date();
    let date0 = new Date(date.setDate(date.getDate() - 3))
    let date1 = new Date()
    this.queryParams.time[0] = date0
    this.queryParams.time[1] = date1

    this.computedDateList()
    let hourList = []
    for (let i =1; i <= 24; i++) {
      hourList.push({
        text:i + '时',
        value:i
      })
    }
    this.$set(this, 'hourList', hourList)
  }
};
</script>
<style lang="scss">
.weather-history {
  background-color: #eee;
  flex-direction: column;

  .tab-header {
    height: 40px;
    width: 100%;
    display: flex;

    .tab-header-item {
      width: 112px;
      height: 40px;
      background-color: rgba(255, 255, 255, 0.7);
      margin-right: 8px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 3px 3px 0 0;
      font-size: 16px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.4);
      cursor: pointer;

      &.active {
        background-color: #536de6;
        color: rgba(255, 255, 255, 0.9);
      }
    }
  }

  .date-wrap{
    display: flex;
    align-items: center;
    height: 56px;
    width: 100%;
    box-sizing: border-box;
    padding: 0 32px;
    border:1px solid #E8E8E8;

    .date{
      margin-right: 32px;
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      height: 100%;
      display: flex;
      align-items: center;
      cursor: pointer;

      &.active{
          color: #409EFE;
      }
    }
  }

  .hour-wrap{

    height: 66px;
    width: 100%;
    overflow-x: scroll;
    box-sizing: border-box;
    padding: 9px 16px;
    display: flex;
    align-items: center;
    border-left: 1px solid #E8E8E8;
    border-right: 1px solid #E8E8E8;
    border-bottom: 1px solid #E8E8E8;

    .hour-list{
      display: flex;
      width: max-content;

      .hour{
        width: 52px;
        height: 32px;
        border-radius: 16px;
        background-color: #eeeff1;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 14px;
        color: #333333;
        font-size: 14px;
        cursor: pointer;

        &.active{
          background-color: #409EFE;
          color: #fff;
        }
      }
    }
  }

  .content-page {
    flex: 1;
    height: 0;
    width: 100%;
    background-color: #fff;
    box-sizing: border-box;
    padding: 24px 19px;
  }
}
</style>
