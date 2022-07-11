<template>
  <div>
    <el-form ref="form" :model="spu" label-width="80px">
      <el-form-item label="SPU名称">
        <el-input v-model="spu.spuName" placeholder="SPU名称"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spu.tmId" placeholder="请输入品牌">
          <el-option
            :label="trademark.tmName"
            :value="trademark.id"
            v-for="(trademark, index) in trademarkList"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          v-model="spu.description"
          rows="4"
          placeholder="描述"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 上传图片，action：图片上传地址 file-list上传的文件列表-->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleAvatarSuccess"
          :file-list="spuImageList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <!-- 照片墙预览展示的对话框 -->
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select v-model="selectAttr" :placeholder="`还有${unSelectAttr.length}项未选择`">
          <el-option
            :label="baseSaleAttr.name"
            :value="`${baseSaleAttr.id}:${baseSaleAttr.name}`"
            v-for="baseSaleAttr in unSelectAttr"
            :key="baseSaleAttr.id"
          ></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" @click="addAttr" :disabled='!selectAttr'>添加销售属性</el-button>
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column
            prop="prop"
            label="序号"
            type="index"
            width="width"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{row,$index}">
              <el-tag
                :key="index"
                v-for="(tag,index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index,1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                :ref="$index"
                size="small"
                @keyup.enter.native="$event.target.blur"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(row,$index)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{$index}">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index,1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      selectAttr:'',
      spu: {
        category3Id: 0,
        description: "",
        // id: 0,
        spuName: "",
        spuImageList: [
          {
            id: 0,
            imgName: "",
            imgUrl: "",
            spuId: 0,
            tmId: 0,
          },
        ],
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "",
          //       saleAttrName: "",
          //       saleAttrValueName: "",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
      },
      spuImageList: [],
      trademarkList: [],
      baseSaleAttrList: [],
    };
  },
  computed:{
    // 计算还未选择的属性
    unSelectAttr(){
      return this.baseSaleAttrList.filter(item=>{
        return this.spu.spuSaleAttrList.every(item1=>{
          return item.name!=item1.saleAttrName
        })
      })
    }
  },
  methods: {
    // 删除图片的回调
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.spuImageList = fileList
    },
    // 照片墙图片预览的回调
    handlePictureCardPreview(file) {
      // 赋值图片地址
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 图片上传成功的回调
    handleAvatarSuccess(response, file, fileList){
      this.spuImageList = fileList
    },
    // 添加的初始信息
    async initSpuData(category3Id) {
      this.spu.category3Id = category3Id
      // 发送一系列请求，请求初始信息
      let trademarkListResult = await this.$API.spu.reqTrademarkList();
      if (trademarkListResult.code == 200) {
        this.trademarkList = trademarkListResult.data;
      }
      let baseSaleAttrListResult = await this.$API.spu.reqBaseSaleAttrList();
      if (baseSaleAttrListResult.code == 200) {
        this.baseSaleAttrList = baseSaleAttrListResult.data;
      }
    },
    async initSpuInfo(row) {
      // 发送一系列请求，请求初始信息
      let spuResult = await this.$API.spu.reqSpu(row.id);
      if (spuResult.code == 200) {
        this.spu = spuResult.data;
      }
      let spuImageListResult = await this.$API.spu.reqSpuImageList(row.id);
      if (spuImageListResult.code == 200) {
        // 整理upload所需格式
        let listArr = spuImageListResult.data;
        listArr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = listArr;
      }
      let trademarkListResult = await this.$API.spu.reqTrademarkList();
      if (trademarkListResult.code == 200) {
        this.trademarkList = trademarkListResult.data;
      }
      let baseSaleAttrListResult = await this.$API.spu.reqBaseSaleAttrList();
      if (baseSaleAttrListResult.code == 200) {
        this.baseSaleAttrList = baseSaleAttrListResult.data;
      }
    },
    // 添加销售属性的回调
    addAttr(){
      // 整理参数
      const[baseSaleAttr,saleAttrName] = this.selectAttr.split(':')
      this.spu.spuSaleAttrList.push({baseSaleAttr,saleAttrName,spuSaleAttrValueList:[]})
      this.selectAttr=''
    },
    async save(){
      // 整理参数
      this.spu.spuImageList = this.spuImageList.map((item)=>{
        return{
          imgName:item.name,
          imgUrl:item.imgUrl?item.imgUrl:item.response.data
        }
      })
      let result = await this.$API.spu.saveOrUpdateSpuInfo(this.spu)
      if(result.code==200){
        if(this.spu.id){
          this.$message({type:"success",message:"修改成功"})
          this.$emit('changeScene',0)
        }else{
          this.$message({type:"success",message:"添加成功"})
          this.$emit('changeScene',0,'添加')
        }       
        //  清除数据
       Object.assign(this._data,this.$options.data())
      }
    },
    
    cancel(){
       this.$emit('changeScene', 0)
      //  清除数据
       Object.assign(this._data,this.$options.data())
    },
      // handleClose(tag,row) {
      //   row.spuSaleAttrValueList.forEach((item,index,arr)=>{
      //     if(item.saleAttrValueName==tag.saleAttrValueName){
      //       arr.splice(index,1)
      //     }
      //   })
      //   // this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      // },

      showInput(row,index) {
        this.$set(row,'inputVisible',true)
        this.$set(row,'inputValue','')
        row.inputVisible = true;
        this.$nextTick(()=>{
          this.$refs[index].focus()
        })
        // this.$nextTick(_ => {
        //   this.$refs.saveTagInput.$refs.input.focus();
        // });
      },
    //  失去焦点事件
      handleInputConfirm(row) {
        // let inputValue = this.inputValue;
        // if (inputValue) {
        //   this.dynamicTags.push(inputValue);
        // }  
        const{baseSaleAttrId,inputValue} = row
        if(inputValue.trim()==''){
          this.$message('输入不能为空')
          row.inputVisible = false;
          return
        }
        if(row.spuSaleAttrValueList.length>0){
           let result=row.spuSaleAttrValueList.some(item=>item.saleAttrValueName==inputValue)
           if(result){
             this.$message('该属性已存在，请重新输入')
             row.inputVisible = false;
            return
           }
        }      
        row.spuSaleAttrValueList.push({baseSaleAttrId,saleAttrValueName:inputValue})
        row.inputVisible = false;
        row.inputValue = '';
      },
  }
};
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>