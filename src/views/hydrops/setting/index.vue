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
                <el-button type="primary" plain @click="handleConfigMultDelete">批量删除</el-button>
                <el-button type="primary" @click="handleConfigAdd">新增等级</el-button>

            </div>
            <el-table ref="tables" :data="configList" @selection-change="handleConfigSelectionChange">
                <el-table-column type="selection" width="50" align="center" />
                <el-table-column type="index" label="序号" width="50" align="center" />
                <el-table-column label="报警类型" align="center"  prop="warningTypeStr"  >
                    <template slot-scope="scope">
                        <div>{{warningTypeFormat(scope.row)}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="报警等级" align="center"  prop="warningLevel"  />
                <el-table-column label="报警描述" align="center"  prop="remark"  />
                <el-table-column label="操作" align="center"  prop="name" width="200px" >
                    <template slot-scope="scope">
                     <el-button
                        size="mini"
                        type="text"
                        @click="handleConfigUpdate(scope.row)"
                    >编辑</el-button>
                   
                    <el-button
                        size="mini"
                        type="text"
                        
                        @click="handleConfigDelete(scope.row)"
                    >删除</el-button>
                </template>
                </el-table-column>

            </el-table>
        </div>

        <div class="section">
            <div class="title">各设备液位预警设置</div>
            <div style="margin:24px 0">
                <el-button type="primary" plain  @click="handleRuleMultDelete">批量删除</el-button>
                <el-button type="primary" @click="handleRuleAdd">新增设置</el-button>

            </div>
            <el-table ref="tables" :data="ruleList" @selection-change="handleRuleSelectionChange">
                <el-table-column type="selection" width="50" align="center" />
                <el-table-column type="index" label="序号" width="50" align="center" />
                <el-table-column label="报警" align="center">
                    <template slot-scope="scope">
                        <div>{{getWarningText(scope.row)}}</div>
                    </template>
                </el-table-column>
                
                <el-table-column label="操作" align="center"  prop="name"  width="200px" >
                    <template slot-scope="scope">
                     <el-button
                        size="mini"
                        type="text"
                        @click="handleRuleUpdate(scope.row)"
                    >编辑</el-button>
                   
                    <el-button
                        size="mini"
                        type="text"
                        @click="handleRuleDelete(scope.row)"
                    >删除</el-button>
                </template>
                </el-table-column>

            </el-table>
        </div>
        <el-dialog :title="(configForm.id ? '编辑' : '新增' ) + '分类'" :visible.sync="configDialog" width="512px" append-to-body>
            <el-form ref="configForm" :model="configForm"  label-width="100px">
                <el-form-item label="报警类型:" prop="warningType">
                    <el-select v-model="configForm.warningType" style="width:100%">
                        <el-option
                            v-for="dict in dict.type.sys_hydrops_warning_type"
                            :key="dict.value"
                            :label="dict.label"
                            :value="parseInt(dict.value)"/>
                    </el-select>

                </el-form-item>
                <el-form-item label="报警等级:" prop="warningLevel">
                    <el-input v-model="configForm.warningLevel"></el-input>

                </el-form-item>
                <el-form-item label="内容描述:" prop="remark">
                    <el-input v-model="configForm.remark" type="textarea"></el-input>

                </el-form-item>
                
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitConfigForm">确 定</el-button>
                <el-button @click="configCancel">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog :title="'液位预警' + (configForm.id ? '编辑' : '新增' )" :visible.sync="ruleDialog" width="512px" append-to-body>
            <el-form ref="ruleForm" :model="ruleForm" label-width="100px">
                <div v-for="(item, index) in ruleForm.slpPondingMonitorWarningRuleList" :key="index">
                    <el-form-item label="报警等级">
                        <span>{{item.warningLevel}}</span>
                    </el-form-item>
                    <el-form-item label="报警阈值">
                        <div style="display:flex;align-items:center">
                            <el-input v-model="item.startPoint"></el-input>
                            <span style="margin:0 10px">至</span>
                            <el-input v-model="item.endPoint"></el-input>
                        </div>
                    </el-form-item>
                    <el-form-item label="报警描述">
                        <span>{{item.warningLevel}}</span>
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitRuleForm">确 定</el-button>
                <el-button @click="ruleCancel">取 消</el-button>
            </div>
        </el-dialog>
    </div> 
</template>
<script>
import { getOfflineTime,
         setOfflineTime,
         getRuleList,
         getRuleDetail,
         editRule,
         saveRule,
         deleteRule,
         getWarningLevelList,
         getWarningLevelDetail,
         editWarningLevel,
         saveWarningLevel,
         deleteWarningLevel } from "@/api/hydrops";
export default {
    dicts: ['sys_hydrops_warning_type'],

    data(){
        return {
            time:'',
            ruleList:[],
            ruleParams:{
                pageNum: 1,
                pageSize: 100,
            },
            ruleForm:{
                pondingId:'',
                pondingName:'',
                slpPondingMonitorWarningRuleList:[]
            },
            ruleDialog:false,

            configList:[],
            configParams:{
                pageNum: 1,
                pageSize: 100,
            },
            configIds:[],
            configDialog:false,
            configForm:{
                createBy: '',
                createTime: '',
                id: '',
                isDeleted: false,
                remark: '',
                updateBy: '',
                updateTime: '',
                warningLevel: '',
                warningType: '',
                warningTypeStr: ''
            },
        }
    },
    methods:{
        warningTypeFormat(row) {
            return this.selectDictLabel(this.dict.type.sys_hydrops_warning_type, row.warningType);
        },
        getWarningLevelList(){
            getWarningLevelList(this.configParams).then(res => {
                if (res.code == 200) {
                    if (res.rows) {
                        this.configList = res.rows
                    }
                }
            })
        },
        handleConfigAdd(){
            this.$set(this,'configForm', {
                createBy: '',
                createTime: '',
                id: '',
                isDeleted: false,
                remark: '',
                updateBy: '',
                updateTime: '',
                warningLevel: '',
                warningType: undefined,
                warningTypeStr: ''
            })

            this.$nextTick(() => {
                this.configDialog = true
            })
        },
        handleConfigUpdate(row){
            getWarningLevelDetail(row.id).then(res => {
                if (res.code == 200) {
                    if (res.data) {
                        console.log(res.data)
                        this.$set(this, 'configForm', res.data)
                        this.configDialog = true
                    }
                }
            })
        },
        handleConfigDelete(row){
            this.$modal.confirm('是否确认删除该数据吗？').then(function() {
                return deleteWarningLevel(row.id);
            }).then(() => {
                this.getWarningLevelList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {});
        },
        handleConfigMultDelete(){
            if (this.configIds.length == 0) {
                this.$modal.msgError("请选择需要删除的数据");
                return
            }

            this.$modal.confirm('是否确认删除该数据吗？').then(() => {
                return deleteWarningLevel(this.configIds.join(','));
            }).then(() => {
                this.getWarningLevelList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {});
        },
        handleConfigSelectionChange(selection) {
            this.configIds = selection.map(item => item.id);
        },
        submitConfigForm(){
            this.$refs["configForm"].validate(valid => {
                if (valid) {
                    if (this.configForm.id) {
                        editWarningLevel(this.configForm).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.configDialog = false;
                            this.getWarningLevelList();
                        });
                    } else {
                        saveWarningLevel(this.configForm).then(response => {
                            this.$modal.msgSuccess("新增成功");
                            this.configDialog = false;
                            this.getWarningLevelList();
                        });
                    }
                }
            });
        },
        configCancel(){
            this.configDialog = false
        },
        handleRuleAdd(){
            let list = []

            this.configList.forEach(item => {
                list.push({
                    ...item,
                    startPoint:'',
                    endPoint:''
                })
            })

            this.$set(this,'ruleForm', {
                pondingId:'',
                pondingName:'',
                slpPondingMonitorWarningRuleList:list
            })

            this.$nextTick(() => {
                this.ruleDialog = true
            })
        },
        handleRuleUpdate(row){
            getRuleDetail(row.pondingId).then(res => {
                if (res.code == 200) {
                    if (res.data) {
                        console.log(res.data)
                        this.$set(this, 'ruleForm', res.data)
                        this.ruleDialog = true
                    }
                }
            })
        },
        handleRuleDelete(row){
            this.$modal.confirm('是否确认删除该数据吗？').then(function() {
                return deleteRule(row.pondingId);
            }).then(() => {
                this.getRuleList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {});
        },
        handleRuleMultDelete(){
            if (this.ruleIds.length == 0) {
                this.$modal.msgError("请选择需要删除的数据");
                return
            }

            this.$modal.confirm('是否确认删除该数据吗？').then(() => {
                return deleteRule(this.ruleIds.join(','));
            }).then(() => {
                this.getRuleList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {});
        },
        handleRuleSelectionChange(selection) {
            this.ruleIds = selection.map(item => item.pondingId);
        },
        submitRuleForm(){
            this.$refs["ruleForm"].validate(valid => {
                if (valid) {
                    if (this.ruleForm.slpPondingMonitorWarningRuleList[0].id) {
                        editRule(this.ruleForm).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.ruleDialog = false;
                            this.getRuleList();
                        });
                    } else {
                        saveRule(this.ruleForm).then(response => {
                            this.$modal.msgSuccess("新增成功");
                            this.ruleDialog = false;
                            this.getRuleList();
                        });
                    }
                }
            });
        },
        ruleCancel(){
            this.ruleDialog = false
        },
        getWarningText(row){
            let result = ''
            let list = row.slpPondingMonitorWarningRuleList
            list.forEach(item => {
                result += `${item.warningLevel}:${item.startPoint || 0}${item.pointUnit}-${item.endPoint || 0}${item.pointUnit};`
            })
            return result
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
        },
        getRuleList(){
            getRuleList(this.ruleParams).then(res => {
                if (res.code == 200) {
                    if (res.rows) {
                        this.ruleList = res.rows
                    }
                }
            })
        },
    },
    created(){
        this.getWarningLevelList()
        this.getOfflineTime()
        this.getRuleList()
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
    overflow-y: scroll;

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