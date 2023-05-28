<template>
    <div class="app-container conserve-plan-history" style="background:#eee;height:calc(100vh - 50px)">
        <div class="c-container">
            <div class="c-content">
                
                <div class="grid-wrap">
                    <el-table ref="tables" style="width:100%;height:100%" v-loading="loading" :data="list" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="50" align="center" />
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
                pageSize:20
            },
            ids:[],
            list:[],
            
        }
    },
    methods:{
        handleExport(){

        },
        handleMultDelete(){

        },
        handleAdd(){

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
.conserve-plan-history{
    display: flex;
    flex-direction: column;

     .h104{
        height: 104px;
        width: 100%;
        background-color: #fff;
        border-radius: 4px;
        margin-bottom: 24px;
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