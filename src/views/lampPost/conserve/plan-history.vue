<template>
    <div class="app-container conserve-plan-history" style="background:#eee;height:calc(100vh - 50px)">
        <div class="c-container">
            <div class="c-content">
                
                <div class="grid-wrap">
                    <el-table ref="tables" style="width:100%;height:100%" v-loading="loading" :data="list" >
                        <el-table-column label="序号" align="center"  prop="id" width="50" />
                        <el-table-column label="巡检时间" align="center"  prop="inspectionTime"  />
                        <el-table-column label="内容描述" align="center"  prop="remark"  />
                        <el-table-column label="巡检单位" align="center"  prop="inspectionDepartment"  />
                        <el-table-column label="巡检人" align="center"  prop="inspectionDepartmentName"  />
                        <el-table-column label="巡检地点" align="center"  prop="inspectionAddress"  >
                            <template slot-scope="scope">
                                <div style="display:flex;align-items:center">
                                    <div style="white-space:nowrap">{{scope.row.inspectionAddress}}</div>
                                    <i @click="openMap(scope.row)" style="font-size:16px;cursor: pointer;color:#1890ff" class="el-icon-location-information"></i>
                                </div>
                        </template>
                        </el-table-column>
                        <el-table-column label="巡检类别" align="center"  prop="inspectionTypeStr"  />
                        <el-table-column label="关联灯杆" align="center"  prop="poleInfo"  />
                        <el-table-column label="生成时间" align="center"  prop="createTime"  />
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
        <show-map v-if="showMapState" :visible="showMapState" :lng="showMapLongitude" :lat="showMapLatitude" @close="showMapState = false"></show-map>

        </div>
       
    </div>
</template>
<script>
import { getToken } from "@/utils/auth";

import showMap from '@/components/show-map/index.vue'


import { getConserveApplyList } from "@/api/lampPost";

import Treeselect from "@riophae/vue-treeselect";
import { listUser } from "@/api/system/user";
import { listDept } from "@/api/system/dept";

export default {
    dicts: ['sys_road','sys_roadside','sys_device_type', 'sys_lamp_post_inspect_type'],
    components:{
        showMap,
        Treeselect
    },
    data(){
        return {
            loading: false,
            total:0,
            queryParams:{
                pageNum:1,
                pageSize:20
            },
            list:[],
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
        getList(){
            getConserveApplyList({id:this.$route.query.id}).then(res => {
                if (res.code == 200) {
                    this.list =res.rows
                }
            })
        }
    },
    created(){
        this.getList()
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