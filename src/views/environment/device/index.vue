<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
            
            <el-form-item label="状态" prop="status">
                <el-select v-model="queryParams.status" placeholder="菜单状态" clearable>
                    <!-- <el-option
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                    /> -->
                </el-select>
            </el-form-item>
            <el-form-item label="道路" prop="menuName">
                <el-input
                    v-model="queryParams.menuName"
                    placeholder="请输入菜单名称"
                    clearable
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
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
                >批量导入</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="primary"
                    plain
                    size="mini"
                    @click="handleAdd"
                >导入模版下载</el-button>
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
            <el-col :span="1.5">
                <el-button
                    type="info"
                    plain
                    icon="el-icon-sort"
                    size="mini"
                    @click="toggleExpandAll"
                >展开/折叠</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <el-table ref="tables" v-loading="loading" :data="list" @selection-change="handleSelectionChange" @sort-change="handleSortChange">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column label="设备名称" align="center" prop="operId" />
            <el-table-column label="设备型号" align="center" prop="operId" />
            <el-table-column label="设备UID" align="center" prop="operId" />
            <el-table-column label="设备状态" align="center" prop="operId" />
            <el-table-column label="安装时间" align="center" prop="operId" />
            <el-table-column label="所在街道" align="center" prop="operId" />
            <el-table-column label="详细地址" align="center" prop="operId" />
            <el-table-column label="GPS坐标" align="center" prop="operId" />
            <el-table-column label="道路侧向" align="center" prop="operId" />
            <el-table-column label="操作" align="center" ></el-table-column>
            
        </el-table>
        <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
        />
        <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="140px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="设备名称">
                            <el-input></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所在道路">
                            <el-input></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="设备型号">
                            <el-input></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="详细地址">
                            <el-input></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="设备编号UID">
                            <el-input></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="道路侧向">
                            <el-input></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="状态">
                            <el-input></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="经度">
                            <el-input></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="是否启用">
                            <el-select style="width:100%"></el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="维度">
                            <el-input></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="安装时间">
                            <el-input></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="移除时间">
                            <el-input></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-divider content-position="left">安装情况</el-divider>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="安装部门">
                            <el-input></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系人及联系方式">
                            <div class="flex">
                                <el-input></el-input>
                                <el-input></el-input>

                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="养护部门">
                            <el-input></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系人及联系方式">
                            <div class="flex">
                                <el-input></el-input>
                                <el-input></el-input>

                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="产权部门">
                            <el-input></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系人及联系方式">
                            <div class="flex">
                                <el-input></el-input>
                                <el-input></el-input>

                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="备注:">
                            <el-input></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { getDeviceList } from "@/api/environment";

export default {
    data(){
        return {
            // 遮罩层
            loading: false,
            // 显示搜索条件
            showSearch: true,
            title:'',
            // 是否显示弹出层
            open: false,
            // 是否展开，默认全部折叠
            isExpandAll: false,
            // 重新渲染表格状态
            refreshTable: true,
            // 查询参数
            queryParams: {
                menuName: undefined,
                visible: undefined
            },
            list:[],
            total:0,
            // 表单参数
            form: {

            },
            rules:{

            }
        }
    },
    methods:{
        handleAdd(){
            this.open = true;
            this.title = "添加设备";
        },
        handleQuery(){

        },
        resetQuery(){

        },
        /** 展开/折叠操作 */
        toggleExpandAll() {
            this.refreshTable = false;
            this.isExpandAll = !this.isExpandAll;
            this.$nextTick(() => {
                this.refreshTable = true;
            });
        },
        handleSelectionChange(){

        },
        handleSortChange(){

        },
        getList(){
            getDeviceList().then(res => {

            })
        },
        submitForm(){
            
        }
    },
    created(){
        this.getList();
    }
}
</script>