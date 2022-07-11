<template>
  <div>
      <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :show='scene==0'></CategorySelect>
    </el-card>
    <el-card>
      <!-- 第一种状态 默认展示spu列表 -->
      <div v-show="scene==0">
        <el-button type="primary" icon="el-icon-plus" :disabled='!cForm.category3Id' @click="addSpu">添加SPU</el-button>
        <el-table :data="list" style="width: 100%" border>
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="width"></el-table-column>
          <el-table-column prop="description" label="spu描述" width="width"></el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row}">
              <HintButthon type="success" icon="el-icon-plus" size="mini" title="添加sku" @click="addSku(row,cForm)"></HintButthon>
              <HintButthon type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click="changeSpu(row)"></HintButthon>
              <HintButthon type="info" icon="el-icon-info" size="mini" title="查看当前的spu全部sku列表" @click="showSkuList(row)"></HintButthon>
              <el-dialog :title="`${spuName}的sku列表`"  :visible.sync="dialogTableVisible" :before-close="closeDialog">
                <el-table :data='skuList' v-loading="loading">
                  <el-table-column property="skuName" label="名称" ></el-table-column>
                  <el-table-column property="price" label="价格" width="100"></el-table-column>
                  <el-table-column property="weight" label="重量" width="100"></el-table-column>
                  <el-table-column  label="默认图片" width="150">
                    <template slot-scope="{row}">
                      <img :src="row.skuDefaultImg" style="width:100px;height:100px">
                    </template>
                  </el-table-column>
                </el-table>
              </el-dialog>
              <el-popconfirm :title="`确定删除${row.spuName}吗？`" @onConfirm="deleteSpu(row)">
              <HintButthon slot="reference" type="danger" icon="el-icon-delete" size="mini" title="删除spu"></HintButthon>
              </el-popconfirm>
              
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="margin-top: 20px; textAlign: center"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          :page-count="7"
          layout=" prev, pager, next, jumper,->,sizes,total"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        ></el-pagination>
      </div>
      
      <!-- 添加或修改spu -->
      <!-- 添加sku结构 -->
      <spuForm ref='spuForm' v-show="scene==1" @changeScene='changeScene'></spuForm>
      <skuForm ref='skuForm' v-show="scene==2" @changeScene='changeScene'></skuForm>
    </el-card>
  </div>
</template>

<script>
import spuForm from './spuForm'
import skuForm from './skuForm'
export default {
   name:'Spu',
   components:{spuForm,skuForm},
   data() {
     return {
      loading:true,
      dialogTableVisible: false,
      isShow:true,
      list: [], // Spu当前页列表的数据
      cForm: {},
      // 分页器
      page:1,
      limit:3,
      total:0,
      scene:0,  // 表示三种状态，默认为0
      spuName:'',
      skuList:[]
     }
   }, 
   methods: {
    getCategoryId(cForm) {
      this.cForm = cForm
      this.getSpuList()
    },
    async getSpuList(){
        let result = await this.$API.spu.reqSpuList(
        this.page,
        this.limit,
        this.cForm.category3Id
      )
      if (result.code == 200) {
        this.total = result.data.total
        this.list = result.data.records
      } 
    },
        // 修改当前页
    handleCurrentChange(page) {
      this.page = page;
      this.getSpuList()
    },
    // 修改每页展示数据
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList()
    },
    // 添加Sku
    addSku(row,cForm){
      this.scene=2
      this.$refs.skuForm.initSkuData(row,cForm)
    },
    // 添加Spu
    addSpu(){
      this.scene = 1
      this.$refs.spuForm.initSpuData(this.category3Id)
    },
    // 修改Spu
    changeSpu(row){
      this.scene = 1
      // 父组件通过refs拿到子组件
      this.$refs.spuForm.initSpuInfo(row)
    },
    // 删除Spu
    async deleteSpu(row){
      let result =await this.$API.spu.reqDeleteSpu(row.id)
      if(result.code==200){
        this.$message({type:"success",message:"删除成功"})
        if(this.page>1){
        this.page=this.list.length>1?this.page:this.page-1
        }
        this.getSpuList()
      }
    },
    // spu自定义事件回调
    changeScene(scene,flag='修改'){
      this.scene = scene
      if(flag=='添加'){
        this.page=1
      }
      this.getSpuList()
    },
   async showSkuList(row){
      this.spuName=row.spuName
      this.dialogTableVisible = true
      let result =await this.$API.spu.reqSkuList(row.id)
      if(result.code==200){
        this.loading=false
        this.skuList=result.data
      }
    },
    closeDialog(done){
      this.loading=true
      this.skuList=[]
      done()
    }, 
   },
}
</script>

<style>

</style>