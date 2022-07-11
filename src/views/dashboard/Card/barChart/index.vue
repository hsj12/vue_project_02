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
        type:'category'
      },
      yAxis: { 
        show: false,
         },
      tooltip:{},
      series: [
        {
          type: "bar",
          data: [10, 4, 20,5,6,7,9],
          color:'pink'
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