<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :show='isShow'></CategorySelect>
    </el-card>
    <el-card>
      <!-- 当数据未传进来时按钮禁用 -->
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="!cForm.category3Id"
        style="margin:10px 0"
        @click="addAttr"
        >添加属性</el-button
      >
      <div v-show="isShow">
        <el-table :data="attrInfoList" border style="width: 100%">
          <el-table-column
            type="index"
            prop="prop"
            label="序号"
            width="80"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="attrName"
            label="属性名称"
            width="150"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="prop"
            label="属性值列表"
            width="width"
            align="center"
          >
            <template slot-scope="{ row }">
              <el-tag
                type="success"
                v-for="(attr, index) in row.attrValueList"
                :key="index"
                style="margin: 0 5px"
                >{{ attr.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150" align="center">
            <template slot-scope="{ row }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="changeAttr(row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteAttr(row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShow">
        <el-form :inline="true"  class="demo-form-inline" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input  placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <!-- 没有属性值时添加按钮不可用 -->
        <el-button type="primary" icon="el-icon-plus" :disabled='!attrInfo.attrName' @click="addAttrValue">添加属性值</el-button>
        <el-button>取消</el-button>
        <el-table :data="attrInfo.attrValueList" border style="width: 100%;margin:20px 0">
          <el-table-column
            type="index"
            prop="prop"
            label="序号"
            width="80"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="prop"
            label="属性值名称"
            width="width"
            align="center"
          >
          <template slot-scope="{row,$index}">
          <el-input :ref="$index" v-model="row.valueName" placeholder="请输入属性值名称" size="mini" v-if="row.isEdit" @blur="changeLook(row)" @keyup.native.enter="changeLook(row)"></el-input>
           <span v-else @click="changeEdit(row,$index)" style="display:block">{{row.valueName}}</span>
          </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150" align="center">
          <template slot-scope="{row,$index}">
          <el-popconfirm :title="`确定删除${row.valueName}吗？`" @onConfirm='deleteAttr($index)'>
            <el-button type="danger" icon="el-icon-delete" slot="reference" ></el-button>
         </el-popconfirm>
          </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="saveAttr" :disabled='attrInfo.attrValueList.length<1'>保存</el-button>
        <el-button @click="isShow = true">取消</el-button>

      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入lodash当中的深拷贝
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: "Attr",
  data() {
    return {
      isShow: true,
      isEdit:true,
      attrInfoList: [],
      cForm: {},
      attrInfo:{
        "attrName": "",
        "attrValueList": [],
        "categoryId": 0,
        "categoryLevel": 3,
      }
    };
  },
  methods: {
    async getCategoryId(cForm) {
      let { category1Id, category2Id, category3Id } = cForm;
      this.cForm = cForm;
      let result = await this.$API.attr.reqAttrInfoList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrInfoList = result.data;
      }
    },
    // 添加属性的回调
    addAttr(){
      this.isShow = false
      // 清除上次残留数据并收集三级Id
      this.attrInfo={
        "attrName": "",
        "attrValueList": [],
        "categoryId": this.cForm.category3Id,
        "categoryLevel": 3,
      }  
    },
    // 
    changeAttr(row){
      this.isShow = false
      this.attrInfo = cloneDeep(row)
      this.attrInfo.attrValueList.forEach(item=>{
        this.$set(item,'isEdit',false)
      })
    },
    addAttrValue(){
      this.attrInfo.attrValueList.push({
        // 增加已有属性的属性值时，将原有id进行合并，添加之前不存在的属性时，为undefined
           attrId:this.attrInfo.id,
           "valueName": "",
           isEdit:true
      })
        this.$nextTick(()=>{
        let index = this.attrInfo.attrValueList.length-1
        this.$refs[index].focus()
        })
    },
    changeLook(row){
      // 输入不能为空
      if(row.valueName.trim() == ''){
        this.$message("输入不能为空")
        return
      }
      let isRepeat = this.attrInfo.attrValueList.some(item=>{
        if(row!=item){
          return row.valueName == item.valueName
        }
      })
      if(isRepeat){
        this.$message("该属性已存在，请重新输入")
        return
      }
      row.isEdit=false
    },
    changeEdit(row,index){
      row.isEdit = true
      this.$nextTick(()=>{
        this.$refs[index].focus()
      })
    },
    deleteAttr(index){
      this.attrInfo.attrValueList.splice(index,1)
    },
    // 添加或修改属性后提交保存请求
    async saveAttr(){
      // 整理参数不能提交空 并且删除flag属性
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item=>{
        if(item.valueName!=''){
          delete item.isEdit
          return true
        }
      })
      try{
       await this.$API.attr.reqSaveAttrInfo(this.attrInfo)
        this.isShow = true
        this.$message({type:'success',message:'保存成功'})
        this.getCategoryId(this.cForm)
      }catch(error){
         this.$message('保存失败')
      }  
    }
  },
};
</script>

<style>
</style>