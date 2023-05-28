<template>
    <div class="app-container hydrops-setting">
        
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button
                    type="primary"
                    size="mini"
                    @click="handleAdd"
                >新增</el-button>
            </el-col>
        </el-row>
        <el-table ref="tables" v-loading="loading" :data="list" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column type="index" label="序号" width="50" align="center" />

            <el-table-column label="告警类型" align="center"  >
                <template slot-scope="scope">
                    <div>{{getWarningTypeName(scope.row.warningType)}}</div>
                </template>
            </el-table-column>
            <el-table-column label="告警描述" align="center" prop="remark" />
            <el-table-column label="告警阈值" align="center" prop="criticalPoint" />
            <el-table-column label="操作" align="center" >
                <template slot-scope="scope">
                    
                    <el-button
                        size="mini"
                        type="text"
                        @click="handleView(scope.row)"
                    >编辑</el-button>
                    <el-button
                        size="mini"
                        type="text"
                        @click="handleDelete(scope.row)"
                    >删除</el-button>
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
        <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="140px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item prop="warningType" label="告警类型">
                            <el-select v-model="form.warningType" @change="selectChange">
                                <el-option label="溢满告警" value="OVERFLOW"></el-option>
                                <el-option label="打开告警" value="OPEN"></el-option>
                                <el-option label="离线告警" value="OFFLINE"></el-option>
                                <el-option label="丢失告警" value="LOSE"></el-option>
                                <el-option label="偏移告警" value="LEAN"></el-option>

                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item prop="criticalPoint" label="告警阈值">
                            <el-input v-model="form.criticalPoint" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item prop="criticalPointUnit" label="告警阈值单位">
                            <el-input v-model="form.criticalPointUnit"  :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item prop="remark" label="内容描述">
                            <el-input v-model="form.remark"></el-input>
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
import { getRuleList,
         getRuleDetail,
         editRule,
         removeRule,
         addRule } from '@/api/wellLid'

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
                pageNum: 1,
                pageSize: 10,
                road: undefined,
                status: undefined
            },
            ids:[],
            list:[],
            total:0,
            // 表单参数
            form: {
                id:'',
                warningType:'',
                criticalPoint:'',
                criticalPointUnit:'',
                remark:'',
            },
            rules:{

            },
            state:''
        }
    },
    methods:{
        selectChange(val){
            if (val == 'OVERFLOW') {
                this.form.criticalPointUnit = 'cm'
            }

            if (val == 'OPEN') {
                this.form.criticalPointUnit = 'min'
            }

            if (val == 'OFFLINE') {
                this.form.criticalPointUnit = 's'
            }

            if (val == 'LOSE') {
                this.form.criticalPointUnit = 'min'
            }

            if (val == 'LEAN') {
                this.form.criticalPointUnit = '°'
            }
        },
        getWarningTypeName(val){
            let result = ''
            if (val == 'OVERFLOW') {
                result = '满溢告警'
            }

            if (val == 'OPEN') {
                result = '打开告警'
            }

            if (val == 'OFFLINE') {
                result = '离线告警'
            }

            if (val == 'LOSE') {
                result = '丢失告警'
            }

            if (val == 'LEAN') {
                result = '偏移告警'
            }

            return result
        },
        handleExport(){
            this.download('/slp/slp/management/export', {
                status:this.queryParams.status,
                road:this.queryParams.road,
            }, `device_${new Date().getTime()}.xlsx`) 
        },
        handleView(row){
            getRuleDetail(row.id).then(res => {
                this.$set(this, 'form', res.data);
                this.state = 'view'
                this.open = true
            })
        },
        handleUpdate(row){
            getRuleDetail(row.id).then(res => {
                this.$set(this, 'form', res.data);
                this.state = 'update'
                this.open = true
            })
        },
        handleDelete(row){
            this.$modal.confirm('是否确认删除该数据吗？').then(function() {
                return removeRule(row.id);
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {});
        },
        handleAdd(){
            this.open = true;
            this.state = 'add'
            this.title = "添加设备";
        },
        handleQuery(){
            this.queryParams.pageNum = 1;
            this.getList();
        },
        resetQuery(){
            this.resetForm("queryForm");
            this.handleQuery();
        },
        /** 展开/折叠操作 */
        toggleExpandAll() {
            this.refreshTable = false;
            this.isExpandAll = !this.isExpandAll;
            this.$nextTick(() => {
                this.refreshTable = true;
            });
        },
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id);
        },
        handleMultDelete(){
            if (this.ids.length == 0) {
                this.$modal.msgError("请选择需要删除的数据");
                return
            }

            this.$modal.confirm('是否确认删除该数据吗？').then(function() {
                return removeRule(this.ids.join(','));
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {});
        },
        getList(){
            getRuleList().then(res => {
                if (res.code == 200) {
                    this.list = res.rows;
                    this.total = res.total
                }
            })
        },
        submitForm(){
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.id) {
                        editRule(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addRule(this.form).then(response => {
                            this.$modal.msgSuccess("新增成功");
                            this.open = false;
                            this.getList();
                        });
                    }
                }
            });
        },
        cancel(){
            this.reset();
            this.open = false
        },
        reset(){
            this.form = {
                id:'',
                warningType:'',
                criticalPoint:'',
                criticalPointUnit:'',
                note:''
            };
            this.resetForm("form");

        }
    },
    created(){
        this.getList();
    }
}
</script>
<style lang="scss">

</style>