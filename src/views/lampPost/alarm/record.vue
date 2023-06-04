<template>
    <div class="app-container alarm-record" style="background:#eee;height:calc(100vh - 50px)">
        <div class="record-title">UID 0124578 设备历史报警记录</div>
        <div class="h104">
            <el-form :model="queryParams" size="small" :inline="true">
                <el-form-item label="设备类型:">
                    <span class="blod">网关</span>
                </el-form-item>
                <el-form-item label="当前设备状态:">
                    <span class="blod">报警</span>
                </el-form-item>
                <el-form-item label="UID:">
                    <span class="blod">12358996</span>
                </el-form-item>
                <el-form-item label="设备型号:">
                    <span class="blod">1245LTEE</span>
                </el-form-item>
                <el-form-item label="所属道路:">
                    <span class="blod">盈丰路</span>
                </el-form-item>
                <el-form-item label="所属区:">
                    <span class="blod">萧山区</span>
                </el-form-item>
                <el-form-item label="道路侧向:">
                    <span class="blod">东</span>
                </el-form-item>
            </el-form>
        </div>
        <div class="c-container">
            <div class="c-content">
                <div class="tool-row">
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
                        <el-table-column label="报警时间" align="center"  prop="name"  />
                        <el-table-column label="报警类型" align="center"  prop="name"  />
                        <el-table-column label="报警描述" align="center"  prop="name"  />
                        <el-table-column label="报警来源" align="center"  prop="name"  />
                        <el-table-column label="处理结果" align="center"  prop="name"  />
                        <el-table-column label="操作" align="center" >
                            <template slot-scope="scope">
                                
                                <el-button
                                    size="mini"
                                    type="text"
                                    @click="handleUpdate(scope.row)"
                                >详情</el-button>
                                <el-button
                                    size="mini"
                                    type="text"
                                    @click="handleUpdate(scope.row)"
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
    </div>
</template>
<script>

export default {
   
    data(){
        return {
            loading: false,
            active:1,
            tabHeaderList:[{
                text:'未处理',
                value:1
            },{
                text:'已派单',
                value:2
            },{
                text:'处理中',
                value:3
            },{
                text:'已处理',
                value:4
            }],
            total:0,
            queryParams:{
                pageNum:1,
                pageSize:20
            },
            ids:[],
            list:[],
        }
    },
    methods:{
        handleTabItemClick(val){
            if (val == this.active) {
                return;
            }

            this.active = val;
        },
        handleAdd(){
            
        },
        handleMultDelete(){

        },
        handleExport(){

        },
        getList(){

        },
        handleSelectionChange(){
            
        },
        handleUpdate(){

        }
    }
}
</script>
<style lang="scss">
.alarm-record{
    display: flex;
    flex-direction: column;

    .record-title{
        font-size: 32px;
        font-weight: 500;
        color: #000000;
        line-height: 32px;
        margin-bottom: 32px;
    }

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
                margin-right: 40px;

                .blod{
                    font-size: 20px;
                    font-weight: 400;
                    color: rgba(0,0,0,0.9);
                }
            }
        }
    }

    .c-container{
        flex: 1;
        height: 0;
        width: 100%;
        display: flex;
        flex-direction: column;

        .tab-header {
            height: 40px;
            width: 100%;
            display: flex;

            .tab-header-item {
                padding: 0 24px;
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

                &.active {
                    background-color: #fff;
                    color: #409EFE;
                }
            }
        }

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