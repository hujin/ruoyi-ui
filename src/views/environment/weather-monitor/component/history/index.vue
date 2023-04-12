<template>
    <div class="history">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
            
            <el-form-item label="环境因子" prop="status">
                <el-select v-model="queryParams.status" placeholder="菜单状态" clearable>
                    <!-- <el-option
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                    /> -->
                </el-select>
            </el-form-item>
            <el-form-item label="时间" prop="menuName">
                <el-input
                    v-model="queryParams.menuName"
                    placeholder="请输入菜单名称"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>
        <el-table ref="tables" v-loading="loading" :data="list" @selection-change="handleSelectionChange" @sort-change="handleSortChange">
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
    </div>
</template>
<script>
export default {
    data(){
        return {
            queryParams: {
                menuName: undefined,
                visible: undefined
            },
            list:[],

            showSearch: true,
            loading: false,

        }
    },
    methods:{
         handleQuery(){

        },
        resetQuery(){

        },
    }
}
</script>
<style lang="scss" scoped>
.history{
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    padding: 24px 19px;
}
</style>