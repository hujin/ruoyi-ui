<template>
  <div class="container">
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
        <el-form-item label="预警类型" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="预警类型"
            clearable
          >
            <!-- <el-option
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                    /> -->
          </el-select>
        </el-form-item>
        <el-form-item label="预警等级" prop="menuName">
          <el-input
            v-model="queryParams.menuName"
            placeholder="请输入菜单名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="时间" prop="time">
          <el-date-picker
            v-model="queryParams.time"
            value-format="yyyy-MM-dd"
            type="date"
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
                    @click="handleAdd"
                >导出</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="primary"
                    plain
                    size="mini"
                    @click="handleAdd"
                >批量删除</el-button>
            </el-col>
            
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
         <el-table ref="tables" v-loading="loading" :data="list" @selection-change="handleSelectionChange" @sort-change="handleSortChange">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column label="序号" align="center" prop="operId" />
            <el-table-column label="预警名称" align="center" prop="operId" />
            <el-table-column label="预警类型" align="center" prop="operId" />
            <el-table-column label="预警等级" align="center" prop="operId" />
            <el-table-column label="预警状态" align="center" prop="operId" />
            <el-table-column label="创建时间" align="center" prop="operId" />
            <el-table-column label="创建用户" align="center" prop="operId" />
            <el-table-column label="操作" align="center" ></el-table-column>
            
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
        menuName: undefined,
        visible: undefined,
        time: "",
      },
      list: [],
      total: 0,
    };
  },
  methods: {
    handleTabItemClick(val) {
      if (val == this.active) {
        return;
      }

      this.active = val;
    },
    handleAdd() {
      this.open = true;
      this.title = "添加设备";
    },
    handleQuery() {},
    resetQuery() {},
    handleSelectionChange(){

        },
        handleSortChange(){

        },
        getList(){

        }
  },
};
</script>
<style lang="scss">
.container {
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
</style>
