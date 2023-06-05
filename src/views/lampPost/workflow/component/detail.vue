<template>
    <el-dialog title="详情" :visible.sync="open" @close="close" width="1200px" append-to-body>
        <div class="alarm-detail">
            <el-row :gutter="10">
                <el-col :span="8">
                    <div class="row">
                        <div class="label">序  号:</div>
                        <div class="val">{{detail.id}}</div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="row">
                        <div class="label">设备名称:</div>
                        <div class="val">{{roadFormat(detail.deviceRoad)}}-{{detail.applyDeviceDesc}}-{{detail.deviceName}}</div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="row">
                        <div class="label">申请类型:</div>
                        <div class="val">{{detail.applyTypeDesc}}</div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="row">
                        <div class="label">关联灯杆:</div>
                        <div class="val">{{detail.deviceName}}</div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="row">
                        <div class="label">申请设备:</div>
                        <div class="val">{{detail.applyDeviceDesc}}</div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="row">
                        <div class="label">使用期限:</div>
                        <div class="val">{{detail.serviceLifeTimeStr}}</div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="row">
                        <div class="label">内容描述:</div>
                        <div class="val">{{detail.applyContent}}</div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="row">
                        <div class="label">所属道路:</div>
                        <div class="val">{{roadFormat(detail.deviceRoad)}}</div>
                    </div>
                </el-col>
                <el-col :span="8" v-if="detail.expectedFinishTime">
                    <div class="row">
                        <div class="label">完成期限:</div>
                        <div class="val">{{new Date(detail.expectedFinishTime).Format('yyyy-MM-dd hh:mm:ss')}}</div>
                    </div>
                </el-col>
                
            </el-row>
            <div class="bg">
                <div class="workflow-detail">
                    <div class="workflow-detail-info">
                        <el-row>
                            <el-col :span="24">
                                <div class="row">
                                    <div class="label">工作状态</div>
                                    <div class="val">
                                        <el-tag size="medium">{{detail.statusCodeDesc}}</el-tag>
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div class="row">
                                    <div class="label">工单编号</div>
                                    <div class="val">{{detail.workOrderNo}}</div>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div class="row">
                                    <div class="label">处理期限</div>
                                    <div class="val" v-if="detail.expectedFinishTime">{{new Date(detail.expectedFinishTime).Format('yyyy-MM-dd hh:mm:ss')}}</div>
                                </div>
                            </el-col>
                            <el-col :span="24">
                                <div class="row">
                                    <div class="label">一审结果</div>
                                    <div class="val">
                                        <div style="margin-bottom:16px">
                                            <el-link type="success" :underline="false">{{detail.auditVo.auditStatus}}</el-link>
                                        </div>
                                        <div style="margin-bottom:16px" v-if="detail.auditVo.content">
                                            <div class="remark">{{detail.auditVo.content}}</div>
                                        </div>
                                        <div class="img-list" v-if="detail.auditVo.fileUrlList">
                                            <div class="img-item" v-for="(url,index) in detail.auditVo.fileUrlList" :key="index"></div>
                                        </div>
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="24" v-if="detail.secondAudit">
                                <div class="row">
                                    <div class="label">二审结果</div>
                                    <div class="val">
                                        <div style="margin-bottom:16px">
                                            <el-link type="success" :underline="false">{{detail.secondAuditVo.auditStatus}}</el-link>
                                        </div>
                                        <div style="margin-bottom:16px" v-if="detail.secondAuditVo.content">
                                            <div class="remark">{{detail.secondAuditVo.content}}</div>
                                        </div>
                                        <div class="img-list" v-if="detail.auditVo.fileUrlList">
                                            <div class="img-item" v-for="(url,index) in detail.secondAuditVo.fileUrlList" :key="index"></div>
                                        </div>
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="24" v-if="detail.needCheckWorkOrder">
                                <div class="row">
                                    <div class="label">复核结果</div>
                                    <div class="val">
                                        <div style="margin-bottom:16px">
                                            <el-link type="success" :underline="false">{{detail.workOrderCheckResult.handleResultTypeDesc}}</el-link>
                                        </div>
                                        <div style="margin-bottom:16px">
                                            <div class="remark">{{detail.workOrderCheckResult.handleResultContent}}</div>
                                        </div>
                                        <div class="img-list">
                                            <div class="img-item" v-for="(item,index) in detail.workOrderCheckResult.handleResultFile" :key="index"></div>
                                        </div>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="workflow-detail-steps">
                        <div>
                            <el-button @click="is_show = !is_show">查看详情</el-button>
                        </div>
                        <div class="steps-wrap" v-if="is_show">
                            <el-steps direction="vertical" :active="stepActive">
                                <el-step v-for="(item,index) in detail.progressVoList" :title="item.stepName" :key="index">
                                    <template slot="description">
                                        <div style="margin:8px 0" v-if="index != detail.progressVoList.length - 1">
                                            <div class="desc" v-if="item.check">{{item.deptName}} {{item.userNickName}}</div>
                                            <div class="desc" v-else> {{item.userNickName}} -</div>
                                            <div class="date" v-if="item.stepTime">{{new Date(item.stepTime).Format('yyyy-MM-dd hh:mm:ss')}}</div>
                                        </div>
                                    </template>
                                </el-step>
                            </el-steps>
                        </div>
                    </div>
                </div>
               
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close">返回</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { getApplyDetail } from "@/api/lampPost";

export default {
    dicts: ['sys_road', 'sys_audit_status'],

    props:{
       
        dialogShow:{
            type:Boolean,
            default:false
        },
        id:{
            type:String | Number,
            default:''
        }
    },
    data(){
        return {
            open:false,
            detail:{
                auditVo:{},
                secondAuditVo:{},
                workOrderCheckResult:{},
                progressVoList:[]
            },
            form:{
                is_dispose:false,
                dispose:'',
                dispose_remark:'',
                is_assign:true,
                assign_time:'',
                assign_depart:'',
                assign_person:'',
                is_re_check:false,
                re_check_depart:'',
                re_check_person:'',
                img_list:['','','','','','','','']
            },
           
            stepActive:1,
            is_show:false
        }
    },
    methods:{
        roadFormat(road) {
            return this.selectDictLabel(this.dict.type.sys_road, road);
        },
        getDetail(){
            getApplyDetail({
                id:this.id
            }).then(res => {
                if (res.code == 200) {
                    this.$set(this, 'detail', res.data)
                    let active = 0;
                    if (res.data.progressVoList) {
                        res.data.progressVoList.forEach((item,index) => {
                            if (item.check) {
                                active = index
                            }
                        })

                        this.stepActive = active
                    }
                    
                }
            })
        },
        close(){
            this.$emit('close')
        }
    },
    watch:{
        dialogShow:{
            handler(val){
                this.open = val
            },
            immediate:true
        },
        id:{
            handler(val){
                if (val) {
                    this.getDetail()
                }
            },
            immediate:true
        }
    }
}
</script>
<style lang="scss">
.alarm-detail{
    height: 816px;
    overflow-y: scroll;

    .row{
        display: flex;
        align-items: center;
        font-size: 16px;
        font-weight: 400;
        line-height: 24px;
        margin-bottom: 24px;

        .label{
            color: rgba(0,0,0,0.6);
            width: 80px;
            text-align: right;
            margin-right: 10px;
        }

        .val{
            color: rgba(0,0,0,0.9);
        }
    }

    .bg{
        margin-top: 8px;
        background-color: #F8F8F8;
        border-radius: 4px;

        .workflow{
            padding: 24px 24px 8px 24px;
        }

        .workflow-detail{
            width: 100%;
            display: flex;

            .workflow-detail-info{
                flex: 1;
                width: 0;
                height: 100%;
                box-sizing: border-box;
                padding: 32px 0;
                padding-right: 70px;

                .row{
                    display: flex;
                    align-items: flex-start;

                    .label{
                        margin-right: 8px;
                        font-size: 16px;
                        font-weight: 400;
                        color: rgba(0,0,0,0.6);
                        line-height: 24px;
                    }

                    .val{
                        flex: 1;
                        width: 0;
                        font-size: 16px;
                        font-weight: 400;
                        color: #333333;
                        line-height: 24px;

                        .img-list{
                            display: flex;
                            flex-wrap: wrap;

                            .img-item{
                                width: 100px;
                                height: 100px;
                                background-color: #fff;
                                margin-right: 16px;
                                margin-bottom: 16px;

                                &:nth-child(5n){
                                    margin-right: 0;
                                }
                            }
                        }
                    }
                }
            }

            .workflow-detail-steps{
                width: 418px;
                box-sizing: border-box;
                padding: 32px 24px 32px 70px;
                border-left: 1px solid #eee;
                display: flex;
                flex-direction: column;

                .steps-wrap{
                    flex: 1;
                    height: 0;
                    width: 100%;
                    margin-top: 24px;

                }
            }
        }
    }
}
</style>