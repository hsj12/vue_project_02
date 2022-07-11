<template>
<div>
 <el-table
  style="width: 100%" border :data="skuList">
  <el-table-column
    type="index"
    label="序号"
    width="80">
  </el-table-column>
  <el-table-column
    prop="skuName"
    label="名称"
    width="width">
  </el-table-column>
  <el-table-column
    prop="skuDesc"
    label="描述"
    width="width">
  </el-table-column>
    <el-table-column
    prop="prop"
    label="默认图片"
    width="width">
    <template slot-scope="{row}">
       <img :src="row.skuDefaultImg" style="width:100px;height:100px">
    </template>
  </el-table-column>
    <el-table-column
    prop="weight"
    label="重量(KG)"
    width="80">
  </el-table-column>
    <el-table-column
    prop="price"
    label="价格"
    width="80">
  </el-table-column>
   <el-table-column
    prop="prop"
    label="操作"
    width="240">
    <template slot-scope="{row}">
      <div @click="handleSale(row)" style="display:inline;margin-right:8px">
       <el-button type="success" size='mini' icon='el-icon-bottom' v-show="row.isSale==1"></el-button>
       <el-button type="success" size='mini' icon='el-icon-top' v-show="row.isSale==0"></el-button>
      </div>
       <el-button type="primary" size='mini' icon='el-icon-edit' @click="edit"></el-button>
       <el-button type="info" size='mini' icon='el-icon-info' @click="getSku(row)"></el-button>
       <el-button type="danger" size='mini' icon='el-icon-delete'></el-button>
    </template>
  </el-table-column>
</el-table>
<el-pagination
  @size-change="handleSizeChange"
  @current-change="handleCurrentChange"
  :current-page="pageNum"
  :page-sizes="[3,5,10]"
  :page-size="pageSize"
  layout="prev, pager, next, jumper,->,sizes,total"
  :total="totalCount">
</el-pagination>
<el-drawer
  :visible.sync="drawer"
  :direction="direction"
  :show-close='false'
  size="50%"
  >
<el-row>
  <el-col :span="5">名称</el-col>
  <el-col :span="16">{{skuInfo.skuName}}</el-col>
</el-row>
<el-row>
  <el-col :span="5">描述</el-col>
  <el-col :span="16">{{skuInfo.skuDesc}}</el-col>
</el-row>
<el-row>
  <el-col :span="5">价格</el-col>
  <el-col :span="16">{{skuInfo.price}}</el-col>
</el-row>
<el-row>
  <el-col :span="5">平台属性</el-col>
  <el-col :span="16">
   <el-tag type="success" v-for="(attr) in skuInfo.skuAttrValueList" :key="attr.id" style="margin:0 10px 10px 0  ">{{attr.attrId}}-{{attr.valueId}}</el-tag>
  </el-col>
</el-row>
<el-row>
  <el-col :span="5">商品图片</el-col>
  <el-col :span="16">
    <el-carousel height="150px">
      <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
        <img :src="item.imgUrl">
      </el-carousel-item>
    </el-carousel>
  </el-col>
</el-row>
</el-drawer>

</div>
</template>

<script>
export default {
   name:'Sku',
   data() {
     return {
        drawer: false,
        direction: 'rtl',
        pageNum:1,
        pageSize:10,
        totalCount:20,
        skuList:[],
        skuInfo:{}
     }
   },
   methods:{
   async getSkuList(){
      let result = await this.$API.sku.reqSkuList(this.pageNum,this.pageSize)
      if(result.code==200){
        this.skuList=result.data.records
        this.totalCount=result.data.total
      }
    },
   handleSizeChange(limit){
    this.pageSize=limit
    this.getSkuList()
   },
   handleCurrentChange(page){
    this.pageNum=page
    this.getSkuList()
   },
   async handleSale(row){
      let result
      if(row.isSale==1){
        result = await this.$API.sku.reqCancelSale(row.id)
      }else{
        result = await this.$API.sku.reqOnSale(row.id)
      }
      if(result.code==200){
         if(row.isSale==1){
          this.$message('下架成功')
         }else{
          this.$message('上架成功')
         }
      }
      this.getSkuList()
   },
   edit(){
    this.$message('正在开发中')
   },
   async getSku(row){
    let result = await this.$API.sku.reqSkuById(row.id)
    if(result.code==200){
      this.drawer=true
      console.log(result)
      this.skuInfo = result.data
    }
   }
   },
   mounted() {
    this.getSkuList()
   },
}

</script>

<style scoped>
  .el-row .el-col-5{
    font-size: 18px;
    text-align: right;
  }
  .el-col{
    margin: 10px;
  }
</style>

<style>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }
  .el-carousel__button{
    width: 20px;
    height: 20px;
    background-color: pink;
    border-radius: 50%;
  }
</style>