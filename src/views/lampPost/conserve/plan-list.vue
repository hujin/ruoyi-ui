<template>
    <div class="app-container conserve-plan-list" style="background:#eee;height:calc(100vh - 50px)">
        <div class="h104">
            <el-form :model="queryParams" size="small" :inline="true">
                <el-form-item label="状态" prop="status">
                    <el-select v-model="queryParams.status" placeholder="请选择状态">
                        
                    </el-select>
                </el-form-item>
                <el-form-item label="时间" prop="time">
                    <el-date-picker v-model="queryParams.time" 
                                    type="daterange"
                                    placeholder="请选择安装时间"
                                    style="width:100%"
                                    value-format="yyyy-MM-dd" ></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="c-container">
            <div class="c-content">
                <div class="tool-row">
                    <el-button
                        type="primary"
                        icon="el-icon-plus"
                        size="mini"
                        @click="handleAdd"
                    >上报</el-button>
                    <el-button
                        type="primary"
                        plain
                        size="mini"
                        @click="handleMultDelete"
                    >批量删除</el-button>
                    <el-button
                        type="primary"
                        plain
                        size="mini"
                        @click="handleExport"
                    >导出</el-button>
                </div>
                <div class="grid-wrap">
                    <el-table ref="tables" style="width:100%;height:100%" v-loading="loading" :data="list" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="50" align="center" />
                        <el-table-column label="计划名称" align="center"  prop="name"  />
                        <el-table-column label="巡查时间" align="center"  prop="name"  />
                        <el-table-column label="内容描述" align="center"  prop="name"  />
                        <el-table-column label="巡查单位" align="center"  prop="name"  />
                        <el-table-column label="巡查人" align="center"  prop="name"  />
                        <el-table-column label="巡查地点" align="center"  prop="name"  />
                        <el-table-column label="巡查类别" align="center"  prop="name"  />
                        <el-table-column label="关联灯杆" align="center"  prop="name"  />
                        <el-table-column label="生成时间" align="center"  prop="name"  />
                        <el-table-column label="操作" align="center" >
                            <template slot-scope="scope">
                                
                               
                                <el-button
                                    size="mini"
                                    type="text"
                                    @click="handleDelete(scope.row)"
                                >删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <pagination
                    v-show="total>0"
                    :total="total"
                    :page.sync="queryParams.pageNum"
                    :limit.sync="queryParams.pageSize"
                    @pagination="getList"
                />
            </div>
        </div>
        <el-dialog title="巡查上报" width="512px" :visible.sync="dialogState">
            <div style="height:600px;overflow-y:scroll">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="计划名称:">
                    <el-select v-model="form.depart" style="width:100%"></el-select>
                </el-form-item>
                <el-form-item label="巡查时间">
                    <el-date-picker
                        v-model="form.date"
                        type="daterange"
                         style="width:100%"
                        placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="巡查内容">
                    <el-input type="textarea"  style="width:100%" v-model="form.remark"></el-input>
                </el-form-item>
                 <el-form-item label="">
                    <el-upload
                        :action="uploadFileUrl"></el-upload>
                </el-form-item>
                <el-form-item label="巡查方式">
                    <el-select v-model="form.patrol_type"  style="width:100%" multiple></el-select>
                </el-form-item>
                <el-form-item label="巡查次数">
                    <el-input-number v-model="form.patrol_count"  style="width:100%" :min="1"></el-input-number>
                </el-form-item>
                <!-- <el-form-item label="巡查类别:">
                    <el-select v-model="form.type"  style="width:100%"></el-select>
                </el-form-item> -->
                <el-form-item label="巡查道路">
                    <el-select v-model="form.road"  style="width:100%"></el-select>
                </el-form-item>
                <el-form-item label="详细地址">
                    <el-input v-model="form.address"  style="width:100%"></el-input>
                </el-form-item>
                
                <el-form-item label="关联灯杆">
                    <el-select v-model="form.device_id"  style="width:100%"></el-select>
                </el-form-item>
                <el-form-item label="巡查单位:">
                    <el-select v-model="form.depart"  style="width:100%"></el-select>
                </el-form-item>
                <el-form-item label="巡查人:">
                    <el-select v-model="form.person"  style="width:100%"></el-select>
                </el-form-item>
               
            </el-form>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { getToken } from "@/utils/auth";

export default {
    data(){
        return {
            loading: false,
            total:0,
            queryParams:{
                pageNum:1,
                pageSize:20,
                status:'',
                time:[]
            },
            ids:[],
            list:[],
            dialogState:false,
            form:{
                name:'',
                depart:'',
                person:'',
                type:'',
                plan_name:'',
                remark:'',
                img_list:[],
                road:'',
                address:'',
                date: [],
                device_id:'',
                patrol_type: [],
                patrol_count:0,
            },
            uploadList: [],
            uploadFileUrl: process.env.VUE_APP_BASE_API + "/file/upload", // 上传文件服务器地址
            headers: {
                Authorization: "Bearer " + getToken(),
            },
            fileList: [],
        }
    },
    methods:{
        handleQuery(){

        },
        resetQuery(){

        },
        handleExport(){

        },
        handleMultDelete(){

        },
        handleAdd(){
            this.dialogState = true
        },
        handleDelete(){

        },
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id);
        },
        getList(){

        }
    }
}
</script>
<style lang="scss">
.conserve-plan-list{
    display: flex;
    flex-direction: column;

     .h104{
        height: 104px;
        width: 100%;
        background-color: #fff;
        border-radius: 4px;
        margin-bottom: 24px;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding: 0 24px;

        .el-form{
            width: 100%;

            .el-form-item--small.el-form-item{
                margin-bottom: 0;
            }
        }
    }

    .c-container{
        flex: 1;
        height: 0;
        width: 100%;
        display: flex;
        flex-direction: column;

        .c-content{
            flex: 1;
            height: 0;
            width: 100%;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            padding: 32px 24px;
            background-color: #fff;

            .tool-row{
                margin-bottom: 16px;
            }

            .grid-wrap{
                flex: 1;
                height: 0;
                width: 100%;
            }
        }
    }

}
</style>