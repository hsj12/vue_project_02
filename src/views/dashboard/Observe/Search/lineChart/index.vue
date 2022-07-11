<template>
<div> 
  <div class="header">
    <span>搜索用户数</span>
    <i class="el-icon-info"></i>
  </div>
  <div>
    <span>12321</span>
    <span>17.1</span>
    <i class="el-icon-caret-top" :style="{color:'red'}"></i>
    <i class="el-icon-caret-bottom" :style="{color:'green'}"></i>
  </div>
  <div class="charts" ref="charts"></div>
</div>

</template>

<script>
import echarts from "echarts";
export default {
  mounted() {
    // 初始化echarts实例
    let lineChart = echarts.init(this.$refs.charts);
    lineChart.setOption({
      xAxis: {
        show: false,
        type: "category",
      },
      yAxis: { show: false },
      series: [
        {
          type: "line",
          data: [10, 4, 20, 6, 30, 8,6],
          smooth:true,
          // 拐点
          itemStyle: {
            opacity: 0,
          },
          lineStyle: {
            color: "purple",
          },
          // 填充颜色
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "blue", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "white", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
      ],
    //   布局
      grid: {
        left: 0,
        right: 0,
        top: 5,
        bottom: 0,
      },
    });
  },
};
</script>

<style scoped>
.charts {
  width: 100%;
  height: 50px;
}
.header{
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
span{
  margin: 5px;
}
</style>