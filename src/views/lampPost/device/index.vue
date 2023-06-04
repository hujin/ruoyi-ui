<template>
    <div class="app-container lamp-post-device">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
            <el-form-item label="状态" prop="status">
                <el-select v-model="queryParams.status" placeholder="菜单状态" clearable>
                    <!-- <el-option
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                    /> -->
                    <el-option label="异常" :value="0"></el-option>
                    <el-option label="正常" :value="1"></el-option>
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
            <el-form-item label="挂载设备" prop="type">
                <el-select v-model="queryParams.type" placeholder="请选择挂载设备">
                    <el-option
                        v-for="dict in dict.type.sys_device_type"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                    />
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
                    icon="el-icon-plus"
                    size="mini"
                    @click="handleAdd"
                >新增</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="primary"
                    plain
                    size="mini"
                >批量导入</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="primary"
                    plain
                    size="mini"
                    @click="handleDownload"
                >导入模版下载</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="primary"
                    plain
                    size="mini"
                    @click="handleExport"
                >导出</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="primary"
                    plain
                    size="mini"
                    @click="handleMultDelete"
                >批量删除</el-button>
            </el-col>

        </el-row>
        <el-table ref="tables" v-loading="loading" :data="list" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column type="index" label="序号" width="50" align="center" />

            <el-table-column label="设备名称" align="center"  prop="name"  />
            <el-table-column label="设备型号" align="center" prop="deviceModel" />
            <el-table-column label="灯杆编号" align="center" prop="uid" />
            <el-table-column label="挂载设备数" align="center" prop="subCount" >
                <template slot-scope="scope">
                    <div>{{scope.row.subCount || 0}}</div>
                </template>
            </el-table-column>
            <el-table-column label="挂载设备类型" align="center">
                <template slot-scope="scope">
                    <div>{{scope.row.deviceNameSet ? scope.row.deviceNameSet.join(',') : ''}}</div>
                </template>
            </el-table-column>
            <el-table-column label="挂载率%" align="center" prop="uid" >
                <template slot-scope="scope">
                    <div>{{(scope.row.percent || 0) + '%'}}</div>
                </template>
            </el-table-column>
            <el-table-column label="倾斜角度" align="center" prop="tiltAngle" >
                <template slot-scope="scope">
                    <div>{{(scope.row.tiltAngle || 0) + '°'}}</div>
                </template>
            </el-table-column>
            <el-table-column label="是否启用" align="center" >
                <template slot-scope="scope">
                    <div>{{getEnableName(scope.row.enable)}}</div>
                </template>
            </el-table-column>
            <el-table-column label="状态" align="center"  >
                <template slot-scope="scope">
                    <div>{{scope.row.status == 1 ? '正常' : '异常'}}</div>
                </template>
            </el-table-column>
            <el-table-column label="安装时间" align="center" prop="installTime" />
            <el-table-column label="所在道路" align="center" prop="road" >
                 <template slot-scope="scope">
                    <div>{{roadFormat(scope.row)}}</div>
                </template>
            </el-table-column>
            
            <el-table-column label="道路侧向" align="center" prop="roadSide" >
                <template slot-scope="scope">
                    <div>{{roadSideFormat(scope.row)}}</div>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" >
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        @click="handleUpdate(scope.row)"
                    >编辑</el-button>
                    <el-button
                        size="mini"
                        type="text"
                        @click="handleView(scope.row)"
                    >详情</el-button>
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
        <el-dialog :title="title" :visible.sync="open" width="1200px">
            <div style="width:100%;height:600px;overflow-y:scroll">
            <el-form ref="form" :model="form" :rules="rules" label-width="140px">
                <div class="section">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item prop="name" label="设备名称">
                                <el-input placeholder="请输入设备名称" v-model="form.name" :disabled="state == 'view'"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="deviceModel" label="设备型号">
                                <el-input placeholder="请输入设备型号" v-model="form.deviceModel" :disabled="state == 'view'"></el-input>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="8">
                            <el-form-item prop="deviceNumber" label="设备编号">
                                <el-input placeholder="请输入设备型号" v-model="form.deviceNumber"></el-input>
                            </el-form-item>
                        </el-col> -->
                        <el-col :span="8">
                            <el-form-item prop="uid" label="设备UID">
                                <el-input placeholder="请输入设备UID" v-model="form.uid" :disabled="state == 'view'"></el-input>
                            </el-form-item>
                        </el-col>
                        
                    </el-row>
                </div>
                <div class="section">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item prop="road" label="所在道路">
                                <el-select v-model="form.road"  :disabled="state == 'view'" style="width:100%">
                                    <el-option
                                        v-for="dict in dict.type.sys_road"
                                        :key="dict.value"
                                        :label="dict.label"
                                        :value="dict.value"
                                    />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="address" label="地理地址">
                                <el-input placeholder="请输入地理地址" v-model="form.address" :disabled="state == 'view'">
                                    <div slot="append" @click.stop="mapDialog = true">
                                        <div style="width:100%;height:100%">
                                            <i class="el-icon-location"></i>

                                        </div>
                                    </div>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="roadSide" label="道路侧向">
                                <el-select placeholder="请选择道路侧向" v-model="form.roadSide" style="width:100%" :disabled="state == 'view'">
                                     <el-option
                                        v-for="dict in dict.type.sys_roadside"
                                        :key="dict.value"
                                        :label="dict.label"
                                        :value="dict.value"
                                    />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="longitude" label="经度">
                                <el-input placeholder="请输入经度" v-model="form.longitude" :disabled="state == 'view'"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="latitude" label="纬度">
                                <el-input placeholder="请输入纬度" v-model="form.latitude" :disabled="state == 'view'"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <div class="section">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item prop="poleHeight" label="灯杆高度(m)" :disabled="true">
                                <el-input v-model="form.poleHeight" style="width:100%" :disabled="state == 'view'"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="voltage" label="电压(V)" :disabled="true">
                                <el-input v-model="form.voltage" style="width:100%" :disabled="state == 'view'"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="electricCurrent" label="电流(A)" :disabled="true">
                                <el-input v-model="form.electricCurrent" style="width:100%" :disabled="state == 'view'"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="power" label="功率" :disabled="true">
                                <el-input v-model="form.power" style="width:100%" :disabled="state == 'view'"></el-input>
                            </el-form-item>
                        </el-col>
                        
                    </el-row>
                </div>
                <div class="section">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item prop="combinedPole" label="是否合杆:" :disabled="true">
                                <el-select v-model="form.combinedPole" style="width:100%" :disabled="state == 'view'">
                                    <el-option label="是" :value="1"></el-option>
                                    <el-option label="否" :value="0"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="deviceMountingMax" label="最大挂载率:" :disabled="true">
                                 <el-input-number v-model="form.deviceMountingMax" :min="0" :max="6" :disabled="state == 'view'"></el-input-number>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <div class="section">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item prop="status" label="状态" :disabled="true">
                                <el-select v-model="form.status" style="width:100%" :disabled="state == 'view'">
                                    <el-option label="异常" :value="0"></el-option>
                                    <el-option label="正常" :value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="enable" label="是否启用">
                                <el-select v-model="form.enable" style="width:100%"  :disabled="state == 'view'">
                                    <el-option label="非启用" :value="0"></el-option>
                                    <el-option label="启用" :value="1"></el-option>
                                    <el-option label="移除" :value="2"></el-option>

                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="installTime" label="安装时间">
                                <el-date-picker v-model="form.installTime" 
                                            type="datetime"
                                            placeholder="请选择安装时间"
                                            style="width:100%"
                                            :disabled="state == 'view'"
                                            value-format="yyyy-MM-dd hh:mm:ss" ></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" v-if="form.enable === 2">
                            <el-form-item prop="removeTime" label="移除时间">
                                <el-date-picker v-model="form.removeTime" 
                                            type="date"
                                            style="width:100%"
                                            :disabled="state == 'view'"
                                            value-format="yyyy-MM-dd" ></el-date-picker>
                                </el-form-item>
                        </el-col>
                    </el-row>
                </div>
                
                <el-divider content-position="left">安装情况</el-divider>
                <div class="section">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="安装部门" prop="installDepartment">
                                <treeselect 
                                    @select="resetDepartment({
                                        clearList:['installDepartmentName', 'installDepartmentPhone']
                                    })" 
                                    v-model="form.installDepartment" 
                                    :options="deptOptions" 
                                    :normalizer="normalizer" 
                                    placeholder="请选择安装部门" 
                                    :disabled="state == 'view'"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="养护部门" prop="maintainDepartment">
                                <treeselect 
                                    @select="resetDepartment({
                                        clearList:['maintainDepartmentName', 'maintainDepartmentPhone']
                                    })" 
                                    v-model="form.maintainDepartment" 
                                    :options="deptOptions" 
                                    :normalizer="normalizer" 
                                    placeholder="请选择养护部门" 
                                    :disabled="state == 'view'"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="产权部门" prop="propertyRightDepartment">
                                <treeselect 
                                    @select="resetDepartment({
                                        clearList:['propertyRightDepartmentName', 'propertyRightDepartmentPhone']
                                    })" 
                                    v-model="form.propertyRightDepartment" 
                                    :options="deptOptions" 
                                    :normalizer="normalizer" 
                                    placeholder="请选择产权部门" 
                                    :disabled="state == 'view'"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="联系人及联系方式" prop="installDepartmentName">
                                <el-select :disabled="state == 'view'" @change="(val)=>contactsChange(val, installDepartmentNameList, 'installDepartmentPhone')" v-model="form.installDepartmentName" placeholder="请选择联系人" style="width:100%">
                                    <el-option
                                        v-for="dict in installDepartmentNameList"
                                        :key="dict.userId"
                                        :label="dict.nickName"
                                        :value="dict.userId + ''"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="联系人及联系方式" prop="maintainDepartmentName">
                                <el-select :disabled="state == 'view'" @change="(val)=>contactsChange(val, maintainDepartmentNameList, 'maintainDepartmentPhone')" v-model="form.maintainDepartmentName" placeholder="请选择联系人" style="width:100%">
                                    <el-option
                                        v-for="dict in maintainDepartmentNameList"
                                        :key="dict.userId"
                                        :label="dict.nickName"
                                        :value="dict.userId  + ''"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="联系人及联系方式" prop="propertyRightDepartmentName">
                                <el-select :disabled="state == 'view'" @change="(val)=>contactsChange(val, propertyRightDepartmentNameList, 'propertyRightDepartmentPhone')" v-model="form.propertyRightDepartmentName" placeholder="请选择联系人" style="width:100%">
                                    <el-option
                                        v-for="dict in propertyRightDepartmentNameList"
                                        :key="dict.userId"
                                        :label="dict.nickName"
                                        :value="dict.userId  + ''"/>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="" prop="installDepartmentPhone">
                                <el-input placeholder="请输入联系方式" v-model="form.installDepartmentPhone" :disabled="state == 'view'"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="" prop="maintainDepartmentPhone">
                                <el-input placeholder="请输入联系方式" v-model="form.maintainDepartmentPhone" :disabled="state == 'view'"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="" prop="propertyRightDepartmentPhone">
                                <el-input  placeholder="请输入联系方式" v-model="form.propertyRightDepartmentPhone" :disabled="state == 'view'"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="备注" prop="remark">
                                <el-input placeholder="请输入备注" type="textarea" v-model="form.remark" :disabled="state == 'view'"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <div class="btn-group" style="text-align:center" v-if="state != 'view'">
                    <el-button @click="cancel">取 消</el-button>
                    <el-button type="primary" @click="submitForm">确 定</el-button>
                </div>
                <el-divider content-position="left">挂载设备信息</el-divider>
                <div class="sub-wrap" v-if="form.slpOtherDeviceInfoList.length <=0">
                    <el-button type="primary" icon="el-icon-plus" @click="addDeviceState = true">添加挂载设备</el-button>
                </div>
                <div class="sub-container" v-else>
                    <div class="sub-tab-header">
                        <div class="sub-tab-item" :class="{active: index === subActive}" @click="handleChangeSubActive(index)" v-for="(item, index) in form.slpOtherDeviceInfoList" :key="index">
                            <span>{{typeFormat({type:item.type})}}</span>
                        </div>
                        <div class="sub-tab-item add"  @click="addDeviceState = true">
                            <i class="el-icon-plus"></i>
                            <span>添加挂载设备</span>
                        </div>
                    </div>
                    <div class="sub-body">
                        <div class="sub-body-tab" v-show="index === subActive" v-for="(item, index) in form.slpOtherDeviceInfoList" :key="index">
                            <div class="section">
                                <el-row>
                                    <el-col :span="8">
                                        <el-form-item label="设备类型">
                                            <span>{{typeFormat({type:item.type})}}</span>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="设备型号">
                                            <el-input v-model="item.deviceModel" placeholder="请输入设备型号" :disabled="state == 'view'"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="设备名称">
                                            <el-input v-model="item.name" placeholder="请输入设备名称" :disabled="state == 'view'"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="设备UID">
                                            <el-input v-model="item.uid" placeholder="请输入设备UID" :disabled="state == 'view'"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </div>
                            <div class="section">
                                <el-row>
                                    <el-col :span="8">
                                        <el-form-item label="安装时间">
                                            <el-date-picker v-model="item.installTime" 
                                                type="datetime"
                                                placeholder="请选择安装时间"
                                                style="width:100%"
                                                :disabled="state == 'view'"
                                                value-format="yyyy-MM-dd hh:mm:ss" ></el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="是否启用">
                                            <el-select v-model="item.enable" style="width:100%"  :disabled="state == 'view'">
                                                <el-option label="非启用" :value="0"></el-option>
                                                <el-option label="启用" :value="1"></el-option>
                                                <el-option label="移除" :value="2"></el-option>

                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                   
                                    <el-col :span="8" >
                                        <el-form-item label="长度">
                                            <el-input v-model="item.deviceLength" :disabled="state == 'view'"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="宽度">
                                            <el-input v-model="item.deviceWidth" :disabled="state == 'view'"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>        
                            </div>
                            <div class="section">
                                <el-row>
                                    <el-col :span="8">
                                        <el-form-item label="安装部门">
                                            <treeselect 
                                                @select="resetDepartment({
                                                    clearList:['installDepartmentName', 'installDepartmentPhone'], 
                                                    form:item, 
                                                    listKey:'itemInstallDepartmentNameList',
                                                    vmodel:'installDepartment',
                                                    info: item
                                                })" 
                                                v-model="item.installDepartment" 
                                                :options="deptOptions" 
                                                :normalizer="normalizer" 
                                                placeholder="请选择安装部门" 
                                                :disabled="state == 'view'"
                                            />
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="养护部门">
                                            <treeselect 
                                                @select="resetDepartment({
                                                    clearList:['maintainDepartmentName', 'maintainDepartmentPhone'], 
                                                    form:item, 
                                                    listKey:'itemMaintainDepartmentNameList',
                                                    vmodel:'maintainDepartment',
                                                    info: item
                                                })" 
                                                v-model="item.maintainDepartment" 
                                                :options="deptOptions" 
                                                :normalizer="normalizer" 
                                                placeholder="请选择养护部门" 
                                                :disabled="state == 'view'"
                                            />
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="产权部门">
                                            <treeselect 
                                                @select="resetDepartment({
                                                    clearList:['propertyRightDepartmentName', 'propertyRightDepartmentPhone'], 
                                                    form:item, 
                                                    listKey:'itemPropertyRightDepartmentNameList',
                                                    vmodel:'propertyRightDepartment',
                                                    info: item
                                                })" 
                                                v-model="item.propertyRightDepartment" 
                                                :options="deptOptions" 
                                                :normalizer="normalizer" 
                                                placeholder="请选择产权部门" 
                                                :disabled="state == 'view'"
                                            />
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="8">
                                        <el-form-item label="联系人及联系方式">
                                            <el-select :disabled="state == 'view'" @change="(val)=>contactsChange(val, itemInstallDepartmentNameList, 'installDepartmentPhone', item)" v-model="item.installDepartmentName" placeholder="请选择联系人" style="width:100%">
                                                <el-option
                                                    v-for="dict in itemInstallDepartmentNameList"
                                                    :key="dict.userId"
                                                    :label="dict.nickName"
                                                    :value="dict.userId + ''"/>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="联系人及联系方式">
                                            <el-select :disabled="state == 'view'" @change="(val)=>contactsChange(val, itemMaintainDepartmentNameList, 'maintainDepartmentPhone', item)" v-model="item.maintainDepartmentName" placeholder="请选择联系人" style="width:100%">
                                                <el-option
                                                    v-for="dict in itemMaintainDepartmentNameList"
                                                    :key="dict.userId"
                                                    :label="dict.nickName"
                                                    :value="dict.userId  + ''"/>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="联系人及联系方式">
                                            <el-select :disabled="state == 'view'" @change="(val)=>contactsChange(val, itemPropertyRightDepartmentNameList, 'propertyRightDepartmentPhone', item)" v-model="item.propertyRightDepartmentName" placeholder="请选择联系人" style="width:100%">
                                                <el-option
                                                    v-for="dict in itemPropertyRightDepartmentNameList"
                                                    :key="dict.userId"
                                                    :label="dict.nickName"
                                                    :value="dict.userId  + ''"/>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="">
                                            <el-input placeholder="请输入联系方式" v-model="item.installDepartmentPhone" :disabled="state == 'view'"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="">
                                            <el-input placeholder="请输入联系方式" v-model="item.maintainDepartmentPhone" :disabled="state == 'view'"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="">
                                            <el-input  placeholder="请输入联系方式" v-model="item.propertyRightDepartmentPhone" :disabled="state == 'view'"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </div>
                </div>
            </el-form>
            </div>
        </el-dialog>

        <el-dialog title="添加挂载设备" :visible.sync="addDeviceState" width="512px">
            <el-form :model="addDeviceForm">
                <el-form-item label="设备类型:">
                    <el-select v-model="addDeviceForm.type" >
                        <el-option
                            v-for="dict in dict.type.sys_device_type"
                            :key="dict.value"
                            :label="dict.label"
                            :value="dict.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="选择绑定设备:" v-if="addDeviceForm.type == 2 || addDeviceForm.type == 3">
                    <div @click="openDevice">{{addDeviceForm.device_form.id || '请选择'}}</div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addDeviceItem">确 定</el-button>
                <el-button @click="cancelDeviceItem">取 消</el-button>
            </div>
        </el-dialog>

        <el-dialog title="请选择需要绑定的设备" :visible.sync="deviceState" width="800px">
            <div class="device-wrap" style="height:500px">
                <el-form :model="deviceQuery" ref="deviceQuery" size="small" :inline="true" >
                     <el-form-item label="道路" prop="road">
                        <el-select v-model="deviceQuery.road" placeholder="请选择道路">
                            <el-option
                                v-for="dict in dict.type.sys_road"
                                :key="dict.value"
                                :label="dict.label"
                                :value="dict.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="">
                        <el-input v-model="deviceQuery.name" suffix-icon="el-icon-search" placeholder="请输入设备名称"></el-input>
                    </el-form-item>
                </el-form>
                <div class="grid">
                    <el-table :data="deviceList" 
                              style="width:100%" 
                              height="400"
                              highlight-current-row
                              @current-change="handleCurrentChange">
                        <el-table-column label="序号" type="index" align="center" />
                        <el-table-column label="设备名称" align="center"  prop="name" width="120px" />
                        <el-table-column label="设备型号" align="center"  prop="type" width="100px"  />
                        <el-table-column label="设备UID" align="center"  prop="uid"  width="100px" />
                        <el-table-column label="所在道路" align="center" prop="road" width="120px" >
                            <template slot-scope="scope">
                                <div>{{roadFormat(scope.row)}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="详细地址" align="center" prop="address" width="200px">
                            <template slot-scope="scope">
                                <div style="display:flex;align-items:center">
                                    <div style="white-space:nowrap">{{scope.row.address}}</div>
                                    <i @click="openMap(scope.row)" style="font-size:16px;cursor: pointer;color:#1890ff" class="el-icon-location-information"></i>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="GPS坐标" align="center" width="200px" >
                            <template slot-scope="scope">
                                <div>
                                    <span>经度:{{scope.row.longitude}}</span>
                                    <br/>
                                    <span>纬度:{{scope.row.latitude}}</span></div>
                            </template>
                        </el-table-column>


                    </el-table>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="selectDevice">确 定</el-button>
                <el-button @click="cancelSelectDevice">取 消</el-button>
            </div>
        </el-dialog>
        <select-map v-if="mapDialog" :visible="mapDialog" :lng="form.longitude" :lat="form.latitude" @close="mapDialog = false" @add="addMarker"></select-map>
        <show-map v-if="showMapState" :visible="showMapState" :lng="showMapLongitude" :lat="showMapLatitude" @close="showMapState = false"></show-map>
    

    </div>
</template>
<script>
import { getDeviceList,
         getDeviceDetail,
         editDevice,
         addDevice,
         deleteDevice} from "@/api/lampPost";

import { getVideoDeviceList } from '@/api/video'

import { getEnvironmentDeviceList } from '@/api/environment'

import selectMap from '@/components/select-map/index.vue'
import showMap from '@/components/show-map/index.vue'

import Treeselect from "@riophae/vue-treeselect";
import { listUser } from "@/api/system/user";
import { listDept } from "@/api/system/dept";

export default {
    dicts: ['sys_road','sys_roadside','sys_device_type'],
    components:{
        selectMap,
        showMap,
        Treeselect
    },
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
                status: undefined,
                type:''
            },
            ids:[],
            list:[],
            total:0,
            // 表单参数
            form: {
                address: "",
                combinedPole: 1,
                createBy: null,
                createTime: "",
                deviceCount: 0,
                deviceModel: "",
                deviceMountingMax: 0,
                deviceNameSet: [],
                electricCurrent: "",
                enable: 1,
                id: '',
                installDepartment: "",
                installDepartmentName: "",
                installDepartmentPhone: "",
                installTime: "",
                isDeleted: false,
                latitude: "",
                longitude: "",
                maintainDepartment: "",
                maintainDepartmentName: "",
                maintainDepartmentPhone: "",
                name: "",
                percent: 0,
                poleHeight: 0,
                power: "",
                projectName: "",
                propertyRightDepartment: "",
                propertyRightDepartmentName: "",
                propertyRightDepartmentPhone: "",
                remark: "",
                removeTime: "",
                road: "",
                roadId: '',
                roadSide: "",
                slpOtherDeviceInfoList: [],
                status: null,
                subCount: '',
                tiltAngle: "",
                type: "",
                uid: '',
                updateBy: '',
                updateTime: "",
                voltage: ""
            },
            subActive:0,
            rules:{

            },
            state:'',
            subState:false,
            subForm:{

            },
            mapDialog:false,
            showMapState:false,
            showMapLongitude:'',
            showMapLatitude:'',
            addDeviceState:false,
            addDeviceForm:{
                type:'',
                device_id:'',
                device_form:{
                    id:''
                },
                device_name:''
            },
            deviceState:false,
            deviceList:[],
            deviceQuery:{
                pageNum: 1,
                pageSize: 9999,
                road: '',
                name:''
            },
            selectModel:{},

            deptOptions:[],
            installDepartmentNameList:[],
            maintainDepartmentNameList:[],
            propertyRightDepartmentNameList:[],

            itemInstallDepartmentNameList:[],
            itemMaintainDepartmentNameList:[],
            itemPropertyRightDepartmentNameList:[],
        }
    },
    watch:{
        'form.installDepartment'(val){
            if (val) {
                this.getListUser(val,'installDepartmentNameList')
            }
        },
        'form.maintainDepartment'(val){
            if (val) {
                this.getListUser(val,'maintainDepartmentNameList')
            }
        },
        'form.propertyRightDepartment'(val){
            if (val) {
                this.getListUser(val,'propertyRightDepartmentNameList')
            }
        },
    },
    methods:{
        handleChangeSubActive(index){
            this.subActive = index
            const start = this.form.slpOtherDeviceInfoList[index]
            console.log(start)
            this.getListUser(start.installDepartment,'itemInstallDepartmentNameList')
            this.getListUser(start.maintainDepartment,'itemMaintainDepartmentNameList')
            this.getListUser(start.propertyRightDepartment,'itemPropertyRightDepartmentNameList')
        },
        getListUser(val,key){
            listUser({
                deptId:val,
                pageNum:1,
                pageSize:9999
            }).then(res => {
                if (res.code == 200) {
                    this.$set(this, key, res.rows || [])
                }
            })
        },
        resetDepartment({clearList, form, listKey, vmodel, info}){
            if(!form){
                form = this.form
            }else{
                this.$nextTick(()=>{
                    this.getListUser(info[vmodel], listKey)
                })
            }
            clearList.forEach(item => {
                form[item] = ''
            })
        },
        contactsChange(val, list, key, form = this.form){
            const info = list.find(item => item.userId == val )
            if(info){
                form[key] = info.phonenumber
            }
        },
        /** 转换部门数据结构 */
        normalizer(node) {
            if (node.children && !node.children.length) {
                delete node.children;
            }
            return {
                id: node.deptId,
                label: node.deptName,
                children: node.children
            };
        },
        cancelDeviceItem(){
            this.$set(this, 'addDeviceForm', {
                type:'',
                device_id:'',
                device_form:{
                    id:''
                },
                device_name:''
            })

            this.addDeviceState = false
        },
        addDeviceItem(){
            if (!this.addDeviceForm.type) {
                this.$modal.msgError("请先选择需要绑定的设备");
                return
            }

            if (this.addDeviceForm.type == 2 || this.addDeviceForm.type == 3) {
                if (!this.addDeviceForm.device_name) {
                    this.$modal.msgError("请先选择需要绑定的设备");
                    return
                }
            }
            if (this.addDeviceForm.type == 2 || this.addDeviceForm.type == 3) {
                this.form.slpOtherDeviceInfoList.push(this.addDeviceForm.device_form)
                const start = this.addDeviceForm.device_form
                this.getListUser(start.installDepartment,'itemInstallDepartmentNameList')
                this.getListUser(start.maintainDepartment,'itemMaintainDepartmentNameList')
                this.getListUser(start.propertyRightDepartment,'itemPropertyRightDepartmentNameList')
            } else {
                this.form.slpOtherDeviceInfoList.push({
                    type: this.addDeviceForm.type,
                    deviceModel:'',
                    name:'',
                    uid:'',
                    deviceLength:'',
                    deviceWidth:'',
                    enable:'',
                    status:'',
                    installDepartment:'',
                    installDepartmentName:'',
                    installDepartmentPhone:'',
                    maintainDepartment:'',
                    maintainDepartmentName:'',
                    maintainDepartmentPhone:'',
                    propertyRightDepartment:'',
                    propertyRightDepartmentName:'',
                    propertyRightDepartmentPhone:'',
                })

            } 
            this.addDeviceState = false

        },
        selectDevice(){
            if (!this.selectModel.id) {
                this.$modal.msgError("请先选择需要绑定的设备");
                return
            }

            let obj = JSON.parse(JSON.stringify(this.selectModel))
            obj['isAdd'] = true
            obj['type'] = this.addDeviceForm.type

            this.$set(this.addDeviceForm, 'device_form', obj)

            this.addDeviceForm.device_name = obj.name

            this.$nextTick(() => {
                this.deviceState = false
            })
        },
        cancelSelectDevice(){
            this.$set(this, 'selectModel', {})

            this.deviceState = false
        },
        handleCurrentChange(val){
            this.$set(this, 'selectModel', val)
            console.log(val)
        },
        openDevice(){
            if (this.addDeviceForm.type == 2) {
                getEnvironmentDeviceList(this.deviceQuery).then(res => {
                    if (res.code == 200) {
                        this.$set(this, 'deviceList', res.rows || [])

                        this.$nextTick(() => {
                            this.deviceState = true
                        })
                    }
                })
            } else if (this.addDeviceForm.type == 3){
                getVideoDeviceList(this.deviceQuery).then(res => {
                    if (res.code == 200) {
                        this.$set(this, 'deviceList', res.rows || [])

                        this.$nextTick(() => {
                            this.deviceState = true
                        })
                    }
                })
            }
        },
        addMarker(e){
            console.log(e)
            this.form.latitude = e.lat;
            this.form.longitude =  e.lng;
            this.mapDialog = false
        },
        openMap(row){
            this.showMapLatitude = row.latitude
            this.showMapLongitude = row.longitude

            this.showMapState = true
        },
        roadSideFormat(row) {
            return this.selectDictLabel(this.dict.type.sys_roadside, row.roadSide);
        },
        roadFormat(row) {
            return this.selectDictLabel(this.dict.type.sys_road, row.road);
        },
        typeFormat(row){
            return this.selectDictLabel(this.dict.type.sys_device_type, row.type);

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
        handleDownload(){

        },
        handleExport(){
            this.download('/slp/slp/pole/export', {
                status:this.queryParams.status,
                road:this.queryParams.road,
            }, `device_${new Date().getTime()}.xlsx`) 
        },
        handleView(row){
            getDeviceDetail(row.id).then(res => {
                this.$set(this, 'form', res.data);
                this.state = 'view'
                this.open = true
            })
        },
        handleUpdate(row){
            getDeviceDetail(row.id).then(res => {
                if (res.code == 200) {
                    if (res.data) {
                        this.$set(this, 'form', res.data);
                        if(res.data.slpOtherDeviceInfoList && res.data.slpOtherDeviceInfoList.length > 0){
                            const start = res.data.slpOtherDeviceInfoList[0]
                            this.getListUser(start.installDepartment,'itemInstallDepartmentNameList')
                            this.getListUser(start.maintainDepartment,'itemMaintainDepartmentNameList')
                            this.getListUser(start.propertyRightDepartment,'itemPropertyRightDepartmentNameList')
                        }
                        if (res.data.slpOtherDeviceInfoList) {
                            this.subActive = 0
                        }
                        this.state = 'update'
                        this.open = true
                    }
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
            this.reset()
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

            this.$modal.confirm('是否确认删除该数据吗？').then(() => {
                return deleteDevice(this.ids.join(','));
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {});
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
                isDeleted:false,
                slpOtherDeviceInfoList: [],
            };
            this.resetForm("form");
        },
        initDept(){
            listDept().then(response => {
                this.deptOptions = this.handleTree(response.data, "deptId");
            });
        },
    },
    created(){
        this.initDept();
        this.getList();
    }
}
</script>

<style lang="scss">
.section{
    box-sizing: border-box;
    background: #F8F8F8;
    padding-top: 24px;
    padding-left: 10px;
    padding-right: 24px;
    margin-bottom: 16px;
}

.lamp-post-device{
    .device-wrap{
        height: 500px;
        width: 100%;
        display: flex;
        flex-direction: column;

        .grid{
            flex: 1;
            height: 0;
            width: 100%;
        }
    }

    .sub-wrap{
        height: 88px;
        width: 100%;
        background-color: #F8F8F8;
        display: flex;
        align-items: center;
        justify-content: center;
    }


    .sub-container{
        .sub-tab-header{
            display: flex;
            align-items: center;
            width: 100%;
            height: 56px;

            .sub-tab-item{
                padding: 0 40px;
                cursor: pointer;

                &.active{
                    color: #1890ff;
                }

                &.add{
                    color: #1890ff;

                }
            }
        }
    }
}
</style>