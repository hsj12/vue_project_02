<template>
  <el-form  label-width="80px" :model="sku">
    <el-form-item label="SPU名称">
      {{ spuName }}
    </el-form-item>
    <el-form-item label="SKU名称" >
      <el-input placeholder="SKU名称" v-model="sku.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input placeholder="价格(元)" type="number" v-model="sku.price"></el-input>
    </el-form-item>
    <el-form-item label="重量(千克)" >
      <el-input placeholder="重量(千克)" v-model="sku.weight"></el-input>
    </el-form-item>
    <el-form-item label="规格描述">
      <el-input placeholder="规格描述" type="textarea" rows="4" v-model="sku.skuDesc"></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true"  label-width="80px">
        <el-form-item
          :label="spuAttrInfo.attrName"
          v-for="(spuAttrInfo) in spuAttrInfoList"
          :key="spuAttrInfo.id" 
        >
          <el-select placeholder="请选择" v-model="spuAttrInfo.attrIdAndvalueId">
            <el-option
              :label="attrValue.valueName"
              :value="`${spuAttrInfo.id}:${attrValue.id}`"
              v-for="(attrValue) in spuAttrInfo.attrValueList"
              :key="attrValue.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true"  :model="sku" label-width="80px">
        <el-form-item
          :label="spuSaleAttr.saleAttrName"
          v-for="(spuSaleAttr) in spuSaleAttrList"
          :key="spuSaleAttr.id"
        >
          <el-select  placeholder="请选择"  v-model="spuSaleAttr.saleAttrIdAndsaleAttrValueId">
            <el-option
              :label="spuSaleAttrValue.saleAttrValueName"
              :value="`${spuSaleAttr.id}:${spuSaleAttrValue.id}`"
              v-for="(spuSaleAttrValue) in spuSaleAttr.spuSaleAttrValueList"
              :key="spuSaleAttrValue.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片列表">
      <el-table :data="spuImageList" style="width: 100%" border @selection-change="addImage">
        <el-table-column prop="prop" type="selection" width="80">
        </el-table-column>
        <el-table-column prop="prop" label="图片" width="width">
         <template slot-scope="{row}">
            <img :src="row.imgUrl" style="width:100px;height:100px">
         </template>
        </el-table-column>
        <el-table-column prop="imgName" label="名称" width="width">
        </el-table-column>
        <el-table-column prop="prop" label="操作" width="width">
          <template slot-scope="{row}">
            <el-button v-show="row.isDefault==0" type="primary"  @click="addDefault(row)" size="mini">设为默认</el-button>
            <el-button v-show="row.isDefault==1" size="mini">默认</el-button>
         </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="saveSku">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "skuForm",
  data() {
    return {
      spuName: "",
      spuImageList: [],
      spuSaleAttrList: [],
      spuAttrInfoList: [],
      ImageList: [],
      sku: {
        // 父组件获取
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        skuName: "",
        price: 0,
        weight: "",
        skuDesc: "",
        // 默认图片
        skuDefaultImg: "",
        // 平台属性
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0,
          // },
        ],
        // 选择图片
        skuImageList: [
          // {
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   spuImgId: 0,
          // },
        ],   
        //  销售属性  
        skuSaleAttrValueList: [
          // {
          //    saleAttrId: 0,
          //   saleAttrValueId: 0,
          // },
        ],      
      },
    };
  },
  methods: {
    //  获取spuName展示
    async initSkuData(row, cForm) {
      this.spuName = row.spuName;
      this.sku.category3Id = row.category3Id;
      this.sku.spuId = row.id;
      this.sku.tmId = row.tmId;
      const { category1Id, category2Id, category3Id } = cForm;
      let spuImageListResult = await this.$API.spu.reqSpuImageList(row.id)
      if (spuImageListResult.code == 200) {
        let result = spuImageListResult.data
        // 添加默认
        result.forEach((item)=>{
          item.isDefault=0
        })
        this.spuImageList = result
      }
      let spuSaleAttrListResult = await this.$API.spu.reqSpuSaleAttrList(
        row.id
      );
      if (spuSaleAttrListResult.code == 200) {
        this.spuSaleAttrList = spuSaleAttrListResult.data;
      }
      let spuAttrInfoListResult = await this.$API.spu.reqAttrInfoList(
        category1Id,
        category2Id,
        category3Id
      );
      if (spuAttrInfoListResult.code == 200) {
        this.spuAttrInfoList = spuAttrInfoListResult.data;
        this.loading=false
      }
    },
    // table表格复选框
    addImage(params){
       this.ImageList = params
    },
    addDefault(row){
      this.spuImageList.forEach((item)=>{
        item.isDefault = 0
      })
      row.isDefault = 1
      this.sku.skuDefaultImg = row.imgUrl
    },
    async saveSku(){
      // 整理参数
      // 平台属性
      this.spuAttrInfoList.forEach((item)=>{
        if(item.attrIdAndvalueId){
          const[attrId,valueId]= item.attrIdAndvalueId.split(':')
          this.sku.skuAttrValueList.push({attrId,valueId})
        }
      })
      // 销售属性
       this.spuSaleAttrList.forEach((item)=>{
         if(item.saleAttrIdAndsaleAttrValueId){
          const[saleAttrId,saleAttrValueId]= item.saleAttrIdAndsaleAttrValueId.split(':')
          this.sku.skuSaleAttrValueList.push({saleAttrId,saleAttrValueId})
         }
      })
      // 图片
      this.sku.skuImageList=this.ImageList.map((item)=>{
        return{
               imgName: item.imgName,
               imgUrl: item.imgUrl,
               isDefault: item.isDefault,
               spuImgId: item.id,

        }
      })
      console.log(this.sku)
      let result = await this.$API.spu.reqSaveAttrInfo(this.sku)
      if(result.code==200){
        this.$message({type:'success',message:'添加成功'})
      }
       //  清除数据
       Object.assign(this._data,this.$options.data())
       this.$emit("changeScene", 0)
    },
    cancel() {
      this.$emit("changeScene", 0)
       //  清除数据
       Object.assign(this._data,this.$options.data())
    },
  },
};
</script>

<style>
</style>