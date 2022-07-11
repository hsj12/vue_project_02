<template>
  <div>
    <!-- 按钮组件 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0px"
      @click="saveTradeMark"
      >添加</el-button
    >
    <!-- 表格组件 data:展示数据，为数组类型  prop每列数据 label每列标题-->
    <!-- 当el-table元素中注入data对象数组后，在el-table-column中用prop属性来对应对象中的键名即可填入数据，用label属性来定义表格的列名。可以使用width属性来定义列宽。 -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column
        type="index"
        prop="prop"
        label="序号"
        width="80"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="tmName"
        label="品牌名称"
        width="width"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="logoUrl"
        label="品牌Logo"
        width="width"
        align="center"
      >
        <template slot-scope="{ row }">
          <img :src="row.logoUrl" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width" align="center">
        <template slot-scope="{ row }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button type="danger" 
          icon="el-icon-delete" 
          size="mini"
          @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
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
    >
    </el-pagination>

    <!-- Form -->

    <el-dialog :title="tmForm.id?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
      <!-- model属性,收集表单数据 -->
      <!-- Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可。 -->
      <el-form style="width:80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌Logo" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <!-- <img v-if="imageUrl" :src="imageUrl" class="avatar" /> -->
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addorUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TradeMark",
  data() {
    // 自定义校验规则
        var validatetmName = (rule,value,callback) => {
          if(value.length<2||value.length>10){
            callback(new Error('品牌名称2-10位'))
          }else{
            callback()
          }
    }
    return {
      //  代表分页器第几页
      page: 1,
      //  每页展示数据条数
      limit: 3,
      //  总共数据条数
      total: 0,
      //  列表展示的数据
      list: [],
      // 对话框是否显示
      dialogFormVisible: false,
      // imageUrl: '',
      tmForm:{
        tmName:'',
        logoUrl:''
      },
      rules: {
          tmName: [
            { required: true, message: '请输入品牌名称', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
            // 自定义校验规则
            //  { validator: validatetmName, trigger: 'change' }

          ],
          logoUrl: [
            { required: true, message: '请选择品牌Logo'}
          ],
        }
    };
  },
  methods: {
    // 获取展示数据
    async getPageList() {
      let result = await this.$API.trademark.reqTradeMarkList(
        this.page,
        this.limit
      );
      if (result.code == 200) {
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    deleteTradeMark(row){
        this.$confirm(`此操作将删除品牌${row.tmName}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          let result =await this.$API.trademark.reqDeleteTradeMark(row.id)
          if(result.code==200){
            this.$message({
            type: 'success',
            message: '删除成功!'
            })
            // 删除完再次获取品牌列表数据
            this.page = this.list.length>1?this.page:this.page-1
            this.getPageList()
          }
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });          
        });
      },
    // 修改当前页
    handleCurrentChange(page) {
      this.page = page;
      this.getPageList();
    },
    // 修改每页展示数据
    handleSizeChange(limit) {
      this.limit = limit;
      this.getPageList();
    },
    // 添加弹出框
    saveTradeMark() {
      this.dialogFormVisible = true;
      // 清楚上次残留数据
      this.tmForm={tmName:'',logoUrl:''}
    },
    // 修改弹出框
    updateTradeMark(row) {  
      this.dialogFormVisible = true;
      // 浅拷贝，将当前品牌信息进行展示
      this.tmForm = {...row}
    },
    // 添加或修改品牌信息
    addorUpdateTradeMark(){
      // 当全部验证字段通过，再去书写业务逻辑，validate方法回调函数返回表单验证的结果，ture/false
      this.$refs.ruleForm.validate(async (success)=>{
        if(success){
           this.dialogFormVisible = false;
          let result = await this.$API.trademark.reqAddorUpdateTradeMark(this.tmForm);
          console.log(result)
          if(result.code==200){
            this.$message.success(this.tmForm.id?'修改品牌成功':'添加品牌成功')
            this.getPageList()
          }
        }else{
            console.log('error submit!!');
            return false;
        }
      })
     
    },
    // 图片上传成功
    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw);
      this.tmForm.logoUrl = res.data
    },

    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    }
  },
  mounted() {
    this.getPageList();
  },
};
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>