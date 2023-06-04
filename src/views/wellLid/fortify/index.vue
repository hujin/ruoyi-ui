<template>
    <div class="app-container fortify">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
            <el-form-item label="布防" prop="defencesStatus">
                <el-select v-model="queryParams.defencesStatus" placeholder="请选择" clearable>
                    <!-- <el-option
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                    /> -->
                    <el-option label="设防" value="ON"></el-option>
                    <el-option label="撤防" value="OFF"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="道路" prop="road">
                 <el-select v-model="queryParams.road" placeholder="请选择道路">
                    <el-option
                        v-for="dict in dict.type.sys_road"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="queryParams.status" placeholder="请选择" clearable>
                    <!-- <el-option
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                    /> -->
                     <el-option label="异常" :value="0"></el-option>
                    <el-option label="正常" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button
                    type="primary"
                    size="mini"
                    @click="handleOn"
                >设防</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="primary"
                    plain
                    size="mini"
                    @click="handleOff"
                >撤防</el-button>
            </el-col>
            <div class="state">
                <div class="state-item">
                    <span>设防设备</span>
                    <span>{{defencesOnCount}}个</span>
                </div>
                <div class="state-item">
                    <span>撤防设备</span>
                    <span>{{defencesOffCount}}个</span>
                </div>
            </div>
        </el-row>
        <el-table ref="tables" v-loading="loading" :data="list" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column label="时间" align="center"  prop="installTime"  />

            <el-table-column label="设备名称" align="center"  prop="name"  />
            <el-table-column label="设备型号" align="center" prop="type" />
            
            <el-table-column label="所在道路" align="center" prop="road" >
                <template slot-scope="scope">
                    <div>{{roadFormat(scope.row)}}</div>
                </template>
            </el-table-column>
            <el-table-column label="地点" align="center" prop="address" />
             <el-table-column label="布防状态" align="center" >
                <template slot-scope="scope">
                    <div>{{scope.row.defencesStatus == 'ON' ? '设防' : '撤防'}}</div>
                </template>
            </el-table-column>
            <el-table-column label="状态" align="center"  >
                <template slot-scope="scope">
                    <div>{{scope.row.status == 1 ? '正常' : '异常'}}</div>
                </template>
            </el-table-column>
           
            <el-table-column label="操作" align="left" >
                <template slot-scope="scope">
                    
                    <el-button
                        size="mini"
                        type="text"
                        style="float:left"
                        @click="handleView(scope.row)"
                    >详情</el-button>
                    <div class="btn-m" style="float:left">
                        <el-switch size="mini" 
                                   style="margin-left:16px" 
                                   v-model="scope.row.defencesStatus"
                                   inactive-value="OFF"
                                   active-value="ON"></el-switch>
                        <div class="m"  @click.prevent="handleSetDefences(scope.row, scope.$index)"></div>

                    </div>
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
      
    </div>
</template>
<script>
import { getDeviceList, 
         editDevice,
         addDevice,
         deleteDevice, 
         setCoverDefences,
         getDefences} from "@/api/wellLid";

export default {
    dicts: ['sys_road'],

    data(){
        return {
            // 遮罩层
            loading: false,
            // 显示搜索条件
            showSearch: true,
            title:'',
           
            // 是否展开，默认全部折叠
            isExpandAll: false,
            // 重新渲染表格状态
            refreshTable: true,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                defencesStatus:'',
                road: '',
                status: ''
            },
            ids:[],
            list:[],
            total:0,
            
            defencesOffCount:0,
            defencesOnCount:0
        }
    },
    methods:{
        roadFormat(row) {
            return this.selectDictLabel(this.dict.type.sys_road, row.road);
        },
       
        handleExport(){
            this.download('/slp/slp/manhole/cover/export', {
                status:this.queryParams.status,
                road:this.queryParams.road,
            }, `device_${new Date().getTime()}.xlsx`) 
        },
        handleSetDefences(row, index){
            console.log(index)
            setCoverDefences({
                ids:row.id,
                statusCode:row.defencesStatus == 'OFF' ? 'ON' : 'OFF'
            }).then(res => {
                if (res.code == 200) {
                    this.getDefences();
                    this.$modal.msgSuccess("设置成功成功");
                    this.list[index].defencesStatus = row.defencesStatus == 'OFF' ? 'ON' : 'OFF'
                }
            })
        },
        handleView(row){
             this.$router.push({
                path:'/wellLid/fortify-history',
                query:{
                    id:row.id
                }
            })
           
        },
       
        handleDelete(row){
            this.$modal.confirm('是否确认删除该数据吗？').then(function() {
                return deleteDevice(row.id);
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
        handleOn(){
            if (this.ids.length == 0) {
                this.$modal.msgError("请选择需要操作的数据");
                return
            }

            setCoverDefences({
                ids:this.ids.join(','),
                statusCode:'ON'
            }).then(res => {
                if (res.code == 200) {
                    this.getDefences();
                    this.getList()
                    this.$modal.msgSuccess("设置成功成功");
                }
            })

        },
        handleOff(){
            if (this.ids.length == 0) {
                this.$modal.msgError("请选择需要操作的数据");
                return
            }

             setCoverDefences({
                ids:this.ids.join(','),
                statusCode:'OFF'
            }).then(res => {
                if (res.code == 200) {
                    this.getDefences();
                    this.getList()
                    this.$modal.msgSuccess("设置成功成功");
                }
            })

            
        },
        getList(){
            getDeviceList(this.queryParams).then(res => {
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
                        editDevice(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addDevice(this.form).then(response => {
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
                name:'',
                road:'',
                type:'',
                address:'',
                typeName:'',
                roadSide:'',
                uid:'',
                longitude:'',
                latitude:'',
                status:'',
                enable:'',
                installTime:'',
                removeTime:'',
                installDepartment:'',
                installDepartmentName:'',
                installDepartmentPhone:'',
                maintainDepartment:'',
                maintainDepartmentName:'',
                maintainDepartmentPhone:'',
                propertyRightDepartment:'',
                propertyRightDepartmentName:'',
                propertyRightDepartmentPhone:'',
                isDeleted:false
            };
            this.resetForm("form");

        },
        getDefences(){
            getDefences().then(res => {
                if (res.code === 200) {
                    this.defencesOnCount = res.data.defencesOnCount
                    this.defencesOffCount = res.data.defencesOffCount
                }
            })
        }
    },
    created(){
        this.getDefences()
        this.getList();
    }
}
</script>
<style lang="scss">
.fortify{
    .btn-m{
        position: relative;

        .m{
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
        }
    }

    .state{
        position: absolute;
        right: 0;
        bottom: 10px;
        display: flex;

        .state-item{
            width: 149px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            box-sizing: border-box;
            padding: 0 20px;
            border-radius: 4px;

            &:first-child{
                background: rgba(64,158,254,0.2);;
                color: #409EFE;
            }

            &:last-child{
                background: rgba(5,167,94,0.1);
                color: #05A75E;
            }
        }

        .state-item + .state-item{
            margin-left: 16px;    
        }
    }
}
</style>