<template>
  <div>

      <el-row :gutter="10">
        <el-col :span="6">
          <el-card>
           <Detail title="总销售额" count="￥126560">
              <template slot="chart">
                 <span>周同比 56.67%</span><i class="el-icon-caret-top"></i>
                 <span>日同比19.16%</span><i class="el-icon-caret-bottom"></i>
              </template>
              <template slot="footer">
                <span>日销售额￥12345</span>
              </template>
            </Detail>  
         </el-card>
        </el-col>
        <el-col :span="6">
          <el-card>
           <Detail title="访问量" count="88460">
              <template slot="chart">
                  <lineChart></lineChart>
              </template>
             <template slot="footer">
                <span>日访问量1234</span>
              </template>
            </Detail>  
         </el-card>
        </el-col>
        <el-col :span="6">
          <el-card>
           <Detail title="支付笔数" count="66465">
              <template slot="chart">
                  <barChart></barChart>
              </template>
             <template slot="footer">
                <span>转化率65%</span>
              </template>
           </Detail>       
         </el-card>
        </el-col>
         <el-col :span="6">
          <el-card>
           <Detail title="运营活动效果" count="78%">
             <template slot="chart">
                  <progressChart></progressChart>
              </template>
             <template slot="footer">
                 <span>周同比 56.67%</span><i class="el-icon-caret-top"></i>
                 <span>日同比19.16%</span><i class="el-icon-caret-bottom"></i>
              </template>
            </Detail>  
         </el-card>
        </el-col>
      </el-row>
  </div>
</template>

<script>
import Detail from './Detail'
import lineChart from './lineChart'
import barChart from './barChart'
import progressChart from './progressChart'
export default {
 name:'Card',
 components:{
    Detail,lineChart,barChart,progressChart
 }
}
</script>

<style scoped>
 .el-icon-caret-top{
    color: red;
 }
  .el-icon-caret-bottom{
    color: green;
 }
 span{
  font-size: 12px;
 }
</style>