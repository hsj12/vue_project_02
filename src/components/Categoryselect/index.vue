<template>
  <div>
    <el-form :inline="true"  class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <el-select  placeholder="请选择" v-model="cForm.category1Id"  @change="getCategory2List" :disabled="!show">
          <el-option v-for="(c1,index) in category1List" :key="index" :label="c1.name" :value="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select  placeholder="请选择" v-model="cForm.category2Id"  @change="getCategory3List" :disabled="!show">
          <el-option v-for="(c2,index) in category2List" :key="index" :label="c2.name" :value="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select  placeholder="请选择" v-model="cForm.category3Id" @change="sendCategoryId" :disabled="!show">
          <el-option v-for="(c3,index) in category3List" :key="index" :label="c3.name" :value="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  props:['show'],
  data() {
      return {
          cForm:{
              category1Id:'',
              category2Id:'',
              category3Id:''
          },
          category1List:[],
          category2List:[],
          category3List:[]
      }
  },
  methods: {
     async getCategory1List(){
        let result = await this.$API.attr.reqCategory1List()
        if(result.code==200){
          this.category1List=result.data
        }
      },
    async getCategory2List(){
        // 清除数据
        this.cForm.category2Id = ''
        this.cForm.category3Id = ''
        this.category2List=[]
        this.category3List=[]
        let result = await this.$API.attr.reqCategory2List(this.cForm.category1Id)
        if(result.code==200){
          this.category2List=result.data
        }
      },
    async getCategory3List(){
        // 清除数据
        this.cForm.category3Id = ''
        this.category3List=[]
        let result = await this.$API.attr.reqCategory3List(this.cForm.category2Id)
        if(result.code==200){
          this.category3List=result.data
        }
      },
    sendCategoryId(){
        this.$emit('getCategoryId',this.cForm)
      }
  },
  mounted() {
      this.getCategory1List()
  },
};
</script>

<style>
</style>