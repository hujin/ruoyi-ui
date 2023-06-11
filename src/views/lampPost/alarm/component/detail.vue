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
                        <div class="val">{{detail.deviceName}}</div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="row">
                        <div class="label">报警次数:</div>
                        <div class="val">{{detail.historyWarningCount}}</div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="row">
                        <div class="label">设备类型:</div>
                        <div class="val">xxxx</div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="row">
                        <div class="label">报警类型:</div>
                        <div class="val">{{detail.warningTypeStr}}</div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="row">
                        <div class="label">报警来源:</div>
                        <div class="val">{{detail.warningSourceStr}}</div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="row">
                        <div class="label">设备型号:</div>
                        <div class="val">{{detail.deviceMode}}</div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="row">
                        <div class="label">设备UID:</div>
                        <div class="val">{{detail.poleUid}}</div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="row">
                        <div class="label">报警时间:</div>
                        <div class="val">{{detail.createTime}}</div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="row">
                        <div class="label">所属道路:</div>
                        <div class="val">{{detail.roadStr}}</div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="row">
                        <div class="label">设备状态:</div>
                        <div class="val">{{getEnableName(detail.enable)}}</div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="row">
                        <div class="label">道路侧向:</div>
                        <div class="val">{{roadSideFormat(detail.roadSide)}}</div>
                    </div>
                </el-col>
                <el-col :span="24">
                    <div class="row">
                        <div class="label">报警描述:</div>
                        <div class="val">{{detail.warningRemark}}</div>
                    </div>
                </el-col>
                <el-col :span="24">
                    <div class="row">
                        <div class="label">详细地址:</div>
                        <div class="val">
                            <div style="display:flex;align-items:center">
                                    <div style="white-space:nowrap">{{detail.address}}</div>
                                    <i @click="openMap(detail)" style="font-size:16px;cursor: pointer;color:#1890ff" class="el-icon-location-information"></i>
                                </div>
                        </div>
                    </div>
                </el-col>
                
            </el-row>
            <div class="bg" v-if="detail.handleType == 'WORK_ORDER'">
                <div class="workflow-detail">
                    <div class="workflow-detail-info">
                        <el-row>
                            <el-col :span="24">
                                <div class="row">
                                    <div class="label">工作状态</div>
                                    <div class="val">
                                        <el-tag size="medium">{{detail.workOrderHandleDetailVo.statusCodeDesc}}</el-tag>
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div class="row">
                                    <div class="label">工单编号</div>
                                    <div class="val">{{detail.workOrderHandleDetailVo.workOrderNo}}</div>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div class="row">
                                    <div class="label">处理期限</div>
                                    <div class="val" v-if="detail.workOrderHandleDetailVo.expectedFinishTime">{{new Date(detail.expectedFinishTime).Format('yyyy-MM-dd hh:mm:ss')}}</div>
                                </div>
                            </el-col>
                            <el-col :span="24">
                                <div class="row">
                                    <div class="label">处理结果</div>
                                    <div class="val">
                                        <div style="margin-bottom:16px">
                                            <el-link type="success" :underline="false">{{detail.workOrderHandleDetailVo.workOrderHandleResult.handleResultTypeDesc}}</el-link>
                                        </div>
                                        <div style="margin-bottom:16px" v-if="detail.workOrderHandleDetailVo.workOrderHandleResult.handleResultContent">
                                            <div class="remark">{{detail.workOrderHandleDetailVo.workOrderHandleResult.handleResultContent}}</div>
                                        </div>
                                       
                                    </div>
                                </div>
                            </el-col>
                          
                            <el-col :span="24" v-if="detail.workOrderHandleDetailVo.workOrderCheckResult">
                                <div class="row">
                                    <div class="label">复核结果</div>
                                    <div class="val">
                                        <div style="margin-bottom:16px">
                                            <el-link type="success" :underline="false">{{detail.workOrderHandleDetailVo.workOrderCheckResult.handleResultTypeDesc}}</el-link>
                                        </div>
                                        <div style="margin-bottom:16px">
                                            <div class="remark">{{detail.workOrderHandleDetailVo.workOrderCheckResult.handleResultContent}}</div>
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
                                <el-step v-for="(item,index) in detail.workOrderHandleDetailVo.progressVoList" :title="item.stepName" :key="index">
                                    <template slot="description">
                                        <div style="margin:8px 0" v-if="index != detail.workOrderHandleDetailVo.progressVoList.length - 1">
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
            <div class="bg" v-else>
                <div class="workflow-detail">
                    <div class="workflow-detail-info" style="padding:24px">
                        <el-row>
                            <el-col :span="24">
                                <div style="font-weight: bolder;font-size:18px;margin-bottom:30px">处理</div>
                            </el-col>
                            <el-col :span="12">
                                <div class="row">
                                    <div class="label">警报处理</div>
                                    <div class="val">
                                        {{detail.handleResultStatusStr}}
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div class="row">
                                    <div class="label">处理单位</div>
                                    <div class="val">
                                        {{detail.handleUserDept}}
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div class="row">
                                    <div class="label">警报处理描述</div>
                                    <div class="val">
                                        {{detail.handleDescription || '暂无描述'}}
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div class="row">
                                    <div class="label">处理人</div>
                                    <div class="val">
                                        {{detail.handleUserName}}
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </div>
        </div>
        <show-map v-if="showMapState" :visible="showMapState" :lng="showMapLongitude" :lat="showMapLatitude" @close="showMapState = false"></show-map>

        <div slot="footer" class="dialog-footer">
            <el-button @click="close">返回</el-button>
        </div>
    </el-dialog>
</template>
<script>
import {getAlarmDetail,} from "@/api/lampPost";
import showMap from '@/components/show-map/index.vue'

export default {
    dicts: ['sys_road','sys_roadside', 'sys_hydrops_warning_type', 'sys_hydrops_warning_handle'],
    components:{
        showMap,
    },
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
                pondingMonitor:{},
                auditVo:{},
                secondAuditVo:{},
                workOrderCheckResult:{},
                progressVoList:[],
                workOrderHandleDetailVo:{
                    workOrderHandleResult:{}
                },
                handleType:''
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
            is_show:false,
            showMapState:false,
            showMapLongitude:'',
            showMapLatitude:'',
        }
    },
    methods:{
        openMap(row){
            this.showMapLatitude = row.latitude
            this.showMapLongitude = row.longitude

            this.showMapState = true
        },
        getEnableName(val){
            let result = ''

            if (val == '0') {
                result = '非启用'
            } else if (val == 1) {
                result = '启用'

            } else if (val == 2) {
                result = '移除'

            } 

            return result
        },
        warningHandleFormat(handleResult){
            return this.selectDictLabel(this.dict.type.sys_hydrops_warning_handle, handleResult);

        },
        roadSideFormat(roadSide) {
            return this.selectDictLabel(this.dict.type.sys_roadside, roadSide);
        },
       
        warningTypeFormat(warningType) {
            return this.selectDictLabel(this.dict.type.sys_hydrops_warning_type, warningType);
        },
        roadFormat(road) {
            return this.selectDictLabel(this.dict.type.sys_road, road);
        },
        getDetail(){
            getAlarmDetail(
                this.id
            ).then(res => {
                if (res.code == 200) {
                    this.$set(this, 'detail', res.data)
                    let active = 0;
                    if (res.data.workOrderHandleDetailVo) {
                        if (res.data.workOrderHandleDetailVo.progressVoList) {
                            res.data.workOrderHandleDetailVo.progressVoList.forEach((item,index) => {
                                if (item.check) {
                                    active = index + 1
                                }
                            })

                            this.stepActive = active
                        }
                        
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
            width: 100px;
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