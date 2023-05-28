<template>
    <el-dialog title="详情" :visible.sync="open" width="1200px" append-to-body>
        <div class="alarm-detail">
            <el-row :gutter="10">
                <el-col :span="8">
                    <div class="row">
                        <div class="label">序  号:</div>
                        <div class="val">9</div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="row">
                        <div class="label">设备名称:</div>
                        <div class="val">xxx道路-水位-监控点01</div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="row">
                        <div class="label">报警次数:</div>
                        <div class="val">152</div>
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
                        <div class="val">水位报警</div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="row">
                        <div class="label">报警来源:</div>
                        <div class="val">后台人工</div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="row">
                        <div class="label">设备型号:</div>
                        <div class="val">xxxxx</div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="row">
                        <div class="label">设备UID:</div>
                        <div class="val">xxxx</div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="row">
                        <div class="label">报警时间:</div>
                        <div class="val">2023-01-01 12:00:00</div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="row">
                        <div class="label">所属道路:</div>
                        <div class="val">xxx道路</div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="row">
                        <div class="label">设备状态:</div>
                        <div class="val">正常</div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="row">
                        <div class="label">道路侧向:</div>
                        <div class="val">东</div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="row">
                        <div class="label">报警描述:</div>
                        <div class="val">当前积水65cm,请尽快处理</div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="row">
                        <div class="label">所属区:</div>
                        <div class="val">萧山区</div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="row">
                        <div class="label">详细地址:</div>
                        <div class="val">盈丰路xxx</div>
                    </div>
                </el-col>
            </el-row>
            <div class="bg">
                <div class="workflow-detail" v-if="has_done">
                    <div class="workflow-detail-info">
                        <el-row>
                            <el-col :span="24">
                                <div class="row">
                                    <div class="label">工作状态</div>
                                    <div class="val">
                                        <el-tag size="medium">标签一</el-tag>
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div class="row">
                                    <div class="label">工单编号</div>
                                    <div class="val">1245718297920180208</div>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div class="row">
                                    <div class="label">处理期限</div>
                                    <div class="val">2023-01-14</div>
                                </div>
                            </el-col>
                            <el-col :span="24">
                                <div class="row">
                                    <div class="label">处理结果</div>
                                    <div class="val">
                                        <div style="margin-bottom:16px">
                                            <el-link type="success" :underline="false">已修复</el-link>
                                        </div>
                                        <div style="margin-bottom:16px">
                                            <div class="remark">处理结果处理结果处理结果处理结果处理结果处理结果处理结果处理结果处理结果处理结理结果处理结果处理结果处理结果处理结果</div>
                                        </div>
                                        <div class="img-list">
                                            <div class="img-item" v-for="(item,index) in form.img_list" :key="index"></div>
                                        </div>
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="24">
                                <div class="row">
                                    <div class="label">复核结果</div>
                                    <div class="val">
                                        <div style="margin-bottom:16px">
                                            <el-link type="success" :underline="false">符合</el-link>
                                        </div>
                                        <div style="margin-bottom:16px">
                                            <div class="remark">处理结果处理结果处理结果处理结果处理结果处理结果处理结果处理结果处理结果处理结理结果处理结果处理结果处理结果处理结果</div>
                                        </div>
                                        <div class="img-list">
                                            <div class="img-item" v-for="(item,index) in form.img_list" :key="index"></div>
                                        </div>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="workflow-detail-steps">
                        <div>
                            <el-button>查看详情</el-button>
                        </div>
                        <div class="steps-wrap">
                            <el-steps direction="vertical" :active="stepActive">
                                <el-step v-for="(item,index) in steps" :title="item.name" :key="index">
                                    <template slot="description">
                                        <div>
                                            <div class="desc">{{item.desc}}</div>
                                            <div class="date">{{item.date}}</div>
                                        </div>
                                    </template>
                                </el-step>
                            </el-steps>
                        </div>
                    </div>
                </div>
                <div class="workflow" v-else>
                    <el-form :model="form" label-width="120px">
                        <template v-if="form.is_dispose">
                            <div>
                                <el-form-item label="警报处理:">
                                    <el-select v-model="form.dispose" placeholder="请选择" style="width:100%"></el-select>
                                </el-form-item>
                                <el-form-item label="警报处理描述:">
                                    <el-input type="textarea" :rows="2" v-model="form.dispose_remark" placeholder="请输入"></el-input>
                                </el-form-item>
                            </div>
                        </template>
                        <template v-if="form.is_assign">
                            <el-row :gutter="10">
                                <el-col :span="12">
                                    <el-form-item label="派单单位:" >
                                        <el-select v-model="form.assign_depart" style="width:100%"></el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="派单人员:" >
                                        <el-select v-model="form.assign_person" style="width:100%"></el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="处理期限:" >
                                        <el-date-picker
                                            v-model="form.assign_time"
                                            type="date"
                                            style="width:100%"
                                            placeholder="选择日期">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="是否复核:" >
                                        <el-select v-model="form.is_re_check" style="width:100%"></el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="复核单位:" >
                                        <el-select v-model="form.re_check_depart" style="width:100%"></el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="复核人员:" >
                                        <el-select v-model="form.re_check_person" style="width:100%"></el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </template>
                    </el-form>
                </div>
            </div>
        </div>
    </el-dialog>
</template>
<script>
export default {
    props:{
       
        dialogShow:{
            type:Boolean,
            default:false
        },
        id:{
            type:String,
            default:''
        }
    },
    data(){
        return {
            open:false,
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
            steps:[{
                name:'创建申请',
                desc:'',
                date:'2023-02-28 12:00:00'
            },{
                name:'提交',
                desc:'xxx xxx 159****1101',
                date:'2023-03-01 12:00:00'
            },{
                name:'审核通过',
                desc:'xxx xxx 159****1102',
                date:'2023-03-02 12:00:00'
            },{
                name:'派发工单',
                desc:'xxx xxx 159****1103',
                date:'2023-03-03 12:00:00'
            },{
                name:'工单处理',
                desc:'xxx xxx 159****1104',
                date:'2023-03-04 12:00:00'
            },{
                name:'提交处理结果',
                desc:'xxx xxx 159****1105',
                date:'2023-03-05 12:00:00'
            },{
                name:'复核工单',
                desc:'xxx xxx 159****1106',
                date:'2023-03-06 12:00:00'
            }],
            stepActive:1,
            has_done:true
        }
    },
    methods:{
        getDetail(){

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