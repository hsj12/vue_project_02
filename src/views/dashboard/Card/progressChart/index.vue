<template>
  <div class="charts" ref="charts"></div>
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
        min:0,
        max:100
      },
      yAxis: { 
        show: false,
        type: "category",

         },
      series: [
        {
          type: "bar",
          data: [80],
          color:'blue',
          barWidth:10,
          showBackground:true,
          backgroundStyle:{
            color:'grey'
          },
          label:{
            show:true,
            formatter:'|',
            position:'right'
          }
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
  height: 100%;
}
</style>