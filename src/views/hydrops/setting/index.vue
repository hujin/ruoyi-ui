<template>
    <div class="app-container environment-setting">
        <div class="section">
            <div class="title">离线设置</div>
            <div>
                <el-form label-width="120px" label-position="right" style="width:100%">
                    <el-form-item label="离线状态名称:">
                        <span>离线</span>
                    </el-form-item>
                    <el-form-item label="阈值:">
                        <div style="width:100%">
                            <el-input v-model="time" style="width:300px">
                                <template slot="prepend">>=</template>
                                <template slot="append">单位:h</template>

                            </el-input>
                        </div>
                    </el-form-item>
                    <div class="tips">描述：超过{{time}}小时未收到设备数据反馈，即显示设备离线</div>
                    <el-button @click="save" type="primary" style="margin-top:20px;margin-left:120px">保存</el-button>
                </el-form>
            </div>
        </div>
        <div class="section">
            <div class="title">报警类型设备</div>
            <div style="margin:24px 0">
                <el-button type="primary" plain>批量删除</el-button>
            </div>
            <el-table ref="tables" :data="list" >
                <el-table-column type="selection" width="50" align="center" />
                <el-table-column type="index" label="序号" width="50" align="center" />
                <el-table-column label="报警类型" align="center"  prop="name"  />
                <el-table-column label="报警等级" align="center"  prop="name"  />
                <el-table-column label="报警描述" align="center"  prop="name"  />
                <el-table-column label="操作" align="center"  prop="name"  >
                    <template slot-scope="scope">
                     <el-button
                        size="mini"
                        type="text"
                        @click="handleUpdate(scope.row)"
                    >编辑</el-button>
                   
                    <el-button
                        size="mini"
                        type="text"
                        @click="handleDelete(scope.row)"
                    >删除</el-button>
                </template>
                </el-table-column>

            </el-table>
        </div>

        <div class="section">
            <div class="title">各设备液位预警设置</div>
            <div style="margin:24px 0">
                <el-button type="primary" plain>批量删除</el-button>
            </div>
            <el-table ref="tables" :data="list" >
                <el-table-column type="selection" width="50" align="center" />
                <el-table-column type="index" label="序号" width="50" align="center" />
                <el-table-column label="一级报警" align="center"  prop="name"  />
                <el-table-column label="二级报警" align="center"  prop="name"  />
                <el-table-column label="三级报警" align="center"  prop="name"  />
                <el-table-column label="操作" align="center"  prop="name"  >
                    <template slot-scope="scope">
                     <el-button
                        size="mini"
                        type="text"
                        @click="handleUpdate(scope.row)"
                    >编辑</el-button>
                   
                    <el-button
                        size="mini"
                        type="text"
                        @click="handleDelete(scope.row)"
                    >删除</el-button>
                </template>
                </el-table-column>

            </el-table>
        </div>
        
    </div>
</template>
<script>
import { getOfflineTime,
         setOfflineTime } from "@/api/video";
export default {
    data(){
        return {
            time:'',
            list:[]
        }
    },
    methods:{
        handleUpdate(){

        },
        handleDelete(){

        },
        getOfflineTime(){
            getOfflineTime().then(res => {
                if (res.code == 200) {
                    this.time = res.data
                }
            })
        },
        save(){
            if (this.time === '') {
                return;
            }

            setOfflineTime({
                offlineTime:this.time
            }).then(res => {
                if (res.code == 200) {
                    this.$modal.msgSuccess("保存成功");

                }
            })
        }
    },
    created(){
        this.getOfflineTime()
    }
}
</script>
<style lang="scss">
.environment-setting{
    width: 100%;
    height: calc(100vh - 50px);
    background-color: #eee;
    box-sizing: border-box;
    padding: 24px;

    .section{
        padding: 24px;
        background-color: #fff;
        border-radius: 4px;
        margin-bottom: 24px;
    }

    .title{
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 20px;
    }

    .tips{
        font-size: 12px;
        color:gray ;
    }
}
</style>