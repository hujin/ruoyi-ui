<template>
    <div class="select-map-wrap">
        <el-dialog :visible.sync="dialogVisible" width="600px" append-to-body @close="close">
            <div class="map-wrap-c" id="s-map"></div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submit">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import AMapLoader from '@amap/amap-jsapi-loader'
window._AMapSecurityConfig = {
    securityJsCode: 'a90b574d2e36a2deb900b322fb891b5f',
}
export default {
    props:{
        visible:{
            type:Boolean,
            default:false
        },
        lng:{
            type:String,
            default:'120.252635'
        },
        lat:{
            type:String,
            default:'30.236056'
        }
    },
    watch:{
        visible:{
            handler(val){
                this.dialogVisible = val
            },
            immediate:true
        }
    },
    data() {
        return {
            dialogVisible:false,
            AMap:null,
            map:null,
            marker:{
                lat:'',
                lng:''
            }
        }
    },
    methods:{
        initMap() {
            AMapLoader.load({
                "key": "df32d1c57071a49dc07d45dbaad7cdbd", 
                "version": "1.4.15",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
                "plugins": ['AMap.Icon','AMap.Marker'],           // 需要使用的的插件列表，如比例尺'AMap.Scale'等
            }).then((AMap)=>{
                // 初始化地图
                this.AMap = AMap;
                this.map = new AMap.Map('s-map',{
                    viewMode : "2D",  //  是否为3D地图模式
                    zoom : 12,   // 初始化地图级别
                    center : [this.lng || '120.252635', this.lat || '30.236056'], //中心点坐标  
                    resizeEnable: true
                });

                this.map.on('click', (e) => {
                    let lng = e.lnglat.getLng()
                    let lat = e.lnglat.getLat()
                    this.marker.lat = lat
                    this.marker.lng = lng

                    this.map.clearMap();
                    new this.AMap.Marker({
                                position:[lng, lat],
                                map:this.map
                            })
                })

            }).catch(e => {
                console.log(e);
            });
        },
        submit(){
            if (!this.marker.lat) {
                this.$modal.msgError("请选择marker定位");
                return;
            }

            this.$emit('add', this.marker)
        },
        cancel(){
            this.$emit('close')
        },
        close(){
            this.$emit('close')
            
        }
    },
    mounted(){
        this.initMap()
    }
}
</script>
<style lang="scss" scoped>
.select-map-wrap{

}
</style>