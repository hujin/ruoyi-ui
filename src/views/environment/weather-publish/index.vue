<template>
  <div class="weather-publish container">
    <div class="tab-header">
      <div
        class="tab-header-item"
        @click="handleTabItemClick(item.value)"
        :class="{ active: item.value == active }"
        v-for="(item, index) in tabHeaderList"
        :key="index"
      >
        {{ item.text }}
      </div>
    </div>
    <div class="content-page">
      <el-form
        :model="queryParams"
        ref="queryForm"
        size="small"
        :inline="true"
        v-show="showSearch"
      >
        <el-form-item label="预警类型" prop="warningType">
          <el-select
            v-model="queryParams.warningType"
            placeholder="预警类型"
            clearable
          >
            <el-option label="台风预警" value="台风预警"></el-option>
            <el-option label="暴雨预警" value="暴雨预警"></el-option>
            <el-option label="暴雪预警" value="暴雪预警"></el-option>
            <el-option label="寒潮预警" value="寒潮预警"></el-option>
            <el-option label="大风预警" value="大风预警"></el-option>
            <el-option label="沙尘暴预警" value="沙尘暴预警"></el-option>
            <el-option label="高温预警" value="高温预警"></el-option>
            <el-option label="干旱预警" value="干旱预警"></el-option>
            <el-option label="雷电预警" value="雷电预警"></el-option>
            <el-option label="冰雹预警" value="冰雹预警"></el-option>
            <el-option label="霜冻预警" value="霜冻预警"></el-option>
            <el-option label="大雾预警" value="大雾预警"></el-option>
            <el-option label="道路结冰预警" value="道路结冰预警"></el-option>

          </el-select>
        </el-form-item>
        <el-form-item label="预警等级" prop="warningLevel">
          <el-select
            v-model="queryParams.warningLevel"
            placeholder="预警等级"
            clearable
          >
            <el-option label="蓝色" value="蓝色"></el-option>
            <el-option label="黄色" value="黄色"></el-option>
            <el-option label="橙色" value="橙色"></el-option>
            <el-option label="红色" value="红色"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间" prop="time">
          <el-date-picker
            v-model="queryParams.time"
            value-format="yyyy-MM-dd"
            type="datetimerange"
            placeholder="时间"
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
      <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button
                    type="primary"
                    plain
                    icon="el-icon-plus"
                    size="mini"
                    @click="handleAdd"
                >新增</el-button>
            </el-col>
           
            <el-col :span="1.5">
                <el-button
                    type="primary"
                    plain
                    size="mini"
                    @click="handleExport"
                >导出</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="primary"
                    plain
                    size="mini"
                    @click="handleMultDelete"
                >批量删除</el-button>
            </el-col>
            
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
         <el-table ref="tables" v-loading="loading" :data="list" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column label="序号" align="center" type="index" />
            <el-table-column label="预警名称" align="center" prop="warningName" />
            <el-table-column label="预警类型" align="center" prop="warningType" />
            <el-table-column label="预警等级" align="center" prop="warningLevel" />
            <el-table-column label="预警状态" align="center" prop="statusCode" >
              <template slot-scope="scope">
                <div>{{scope.row.statusCode == 'OFF' ? '未发布' : '已发布'}}</div>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" />
            <el-table-column label="创建用户" align="center" prop="createUser" />
            <el-table-column label="操作" align="center" >
              <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        v-if="active == 1"
                        @click="handleUpdate(scope.row)"
                    >编辑</el-button>
                    <el-button
                        size="mini"
                        type="text"
                        v-if="active == 1"
                        @click="handlePreview(scope.row)"
                    >预览</el-button>
                    <el-button
                        size="mini"
                        type="text"
                        v-if="active == 1"
                        @click="handleDelete(scope.row)"
                    >删除</el-button>
                    <el-button
                        size="mini"
                        type="text"
                        v-if="active == 2"
                        @click="handlePreview(scope.row)"
                    >查看</el-button>
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
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
        <el-form ref="form" :model="form" label-width="80px">
          <el-row>
            <el-col :span="8">
              <el-form-item prop="warningName" label="预警名称:">
                  <el-input v-model="form.warningName" placeholder="请输入预警名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="warningType" label="预警类型:">
                <el-select v-model="form.warningType" placeholder="预警类型" clearable>
                  <el-option label="台风预警" value="台风预警"></el-option>
                  <el-option label="暴雨预警" value="暴雨预警"></el-option>
                  <el-option label="暴雪预警" value="暴雪预警"></el-option>
                  <el-option label="寒潮预警" value="寒潮预警"></el-option>
                  <el-option label="大风预警" value="大风预警"></el-option>
                  <el-option label="沙尘暴预警" value="沙尘暴预警"></el-option>
                  <el-option label="高温预警" value="高温预警"></el-option>
                  <el-option label="干旱预警" value="干旱预警"></el-option>
                  <el-option label="雷电预警" value="雷电预警"></el-option>
                  <el-option label="冰雹预警" value="冰雹预警"></el-option>
                  <el-option label="霜冻预警" value="霜冻预警"></el-option>
                  <el-option label="大雾预警" value="大雾预警"></el-option>
                  <el-option label="道路结冰预警" value="道路结冰预警"></el-option>

                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="warningLevel" label="预警等级:">
                <el-select v-model="form.warningLevel" placeholder="预警等级" clearable>
                  <el-option label="蓝色" value="蓝色"></el-option>
                  <el-option label="黄色" value="黄色"></el-option>
                  <el-option label="橙色" value="橙色"></el-option>
                  <el-option label="红色" value="红色"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="warningContent" label-width="0">
                <editor v-model="form.warningContent" :min-height="192"/>

              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
        </div>
    </el-dialog>
    <el-dialog title="预警预览" :visible.sync="preview" width="800px" append-to-body>
      <div class="preview-wrap">
        <div class="base-info">
          <el-row>
            <el-col :span="12">
              <div class="label">预警名称:</div>
              <div class="val">{{form.warningName}}</div>
            </el-col>
            <el-col :span="12">
              <div class="label">预警类型:</div>
              <div class="val">{{form.warningType}}</div>
            </el-col>
            <el-col :span="12">
              <div class="label">发布状态:</div>
              <div class="val">{{form.statusCode == 'OFF' ? '未发布' :'发布'}}</div>
            </el-col>
            <el-col :span="12">
              <div class="label">创建用户:</div>
              <div class="val">{{form.createUser}}</div>
            </el-col>
            <el-col :span="12">
              <div class="label">预警等级:</div>
              <div class="val">{{form.warningType}}</div>
            </el-col>
            <el-col :span="12">
              <div class="label">创建时间:</div>
              <div class="val">{{form.createTimestamp}}</div>
            </el-col>

          </el-row>
        </div>
        <div class="html-wrap" v-html="form.warningContent"></div>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align:center">
            <el-button >导 出</el-button>
            <el-button type="primary" @click="handlePublish">发 布</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getReleaseList,
         addRelease,
         editRelease,
         getRelease,
         deleteRelease,
         exportRelease } from "@/api/environment";

export default {
  data() {
    return {
      preview:false,
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
      ids:[],
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
        warningType: '',
        warningLevel: '',
        time:[],
        startTime: '',
        endTime:'',
        statusCode:'',
        pageNum: 1,
        pageSize: 10,
      },
      list: [],
      total: 0,
      form:{
        id:'',
        warningName:'',
        warningType:'',
        warningContent:'',
        warningLevel:'',
        statusCode:'',
        releaseTime:'',
        releaseUser:'',
        createTimestamp:'',
        createUser:'',
      },
      state:''
    };
  },
  methods: {
    handleExport(){
      this.download('/slp/slp/release/export', {
                warningType:this.queryParams.warningType,
                warningLevel:this.queryParams.warningLevel,
                startTime: this.queryParams.startTime,
                endTime: this.queryParams.endTime,
                statusCode: this.active == 1 ? 'OFF' : 'ON',

      }, `release_${new Date().getTime()}.xlsx`) 
    },
    handlePublish(){
      editRelease({
        id:this.form.id,
        statusCode:'ON'
      }).then(res => {
          this.$modal.msgSuccess("发布成功");
          this.preview = false;
          this.getList();
      })
    },
    handleMultDelete(){
            if (this.ids.length == 0) {
                this.$modal.msgError("请选择需要删除的数据");
                return
            }

            this.$modal.confirm('是否确认删除该数据吗？').then(function() {
                return deleteDevice(this.ids.join(','));
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {});
    },
    handleUpdate(row){
      getRelease(row.id).then(res => {
          this.state = 'edit'
          this.$set(this, 'form', res);
          this.open = true
      })
    },
    handlePreview(row){
      getRelease(row.id).then(res => {
          if (res.code == 200) {
            this.$set(this, 'form', res.data);
            this.state = 'preivew'
            this.preview = true
          }
         
      })
    },
    handleDelete(row){
      this.$modal.confirm('是否确认删除该数据吗？').then(function() {
          return deleteRelease(row.id);
      }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    handleTabItemClick(val) {
      if (val == this.active) {
        return;
      }
      this.queryParams.pageNum = 1
      this.active = val;
      this.getList()
    },
    handleAdd() {
      this.open = true;
      this.form = {
        id:'',
        warningName:'',
        warningType:'',
        warningContent:'',
        warningLevel:'',
        statusCode:'',
        releaseTime:'',
        releaseUser:'',
        createTimestamp:'',
        createUser:'',
      }
      this.state = 'add'
      this.title = "新增预警发布";
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
    },
   
    getList(){
      let params = {
        startTime: this.queryParams.time[0],
        endTime: this.queryParams.time[1],
        statusCode: this.active == 1 ? 'OFF' : 'ON',
        warningLevel: this.queryParams.warningLevel,
        warningType: this.queryParams.warningType,
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize,
      }

      getReleaseList(params).then(res => {
        console.log(res)
        if (res.code == 200) {
          this.list = res.data.rows;
          this.total = res.data.total
        }
      })
    },
    cancel(){
      this.reset();
      this.open = false
    },
    submitForm(){
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id) {
            editRelease(this.form).then(res => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            })
          } else {
            addRelease(this.form).then(res => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            })
          }
        }
      });
    },
  },
  created(){
    this.getList();
  }
};
</script>
<style lang="scss">
.weather-publish {
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

  .content-page {
    flex: 1;
    height: 0;
    width: 100%;
    background-color: #fff;
    box-sizing: border-box;
    padding: 24px 19px;
  }

 
}

.preview-wrap{
  .base-info{
    background: #F8F8F8;
    border-radius: 4px;
    box-sizing: border-box;
    padding: 24px;
    padding-bottom: 0;
    margin-bottom: 24px;

    .el-col{
      margin-bottom: 24px;
      font-size: 16px;
      display: flex;

      .label{
        color: rgba(0,0,0,0.6);
      }

      .val{
        color: rgba(0,0,0,0.9);
      }
    }
  }

  .html-wrap{
    box-sizing: border-box;
    padding: 24px;
    background: #F8F8F8;
    border-radius: 4px;
    border: 1px solid #DCDCDC;
  }
}
</style>
