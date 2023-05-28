<template>
    <div class="app-container environment-setting">
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
</template>
<script>
import { getOfflineTime,
         setOfflineTime } from "@/api/video";
export default {
    data(){
        return {
            time:''
        }
    },
    methods:{
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
    width: 500px;
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