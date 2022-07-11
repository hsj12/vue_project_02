<template>
  <el-card>
    <div slot="header">
      <div class="header">
        <span>销售额类别占比</span>
        <el-radio-group v-model="radio">
          <el-radio-button label="全部渠道"></el-radio-button>
          <el-radio-button label="线上"></el-radio-button>
          <el-radio-button label="门店"></el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div>
      <div class="chart" ref="chart"></div>
    </div>
  </el-card>
</template>

<script>
import echarts from "echarts";
export default {
  data() {
    return {
      radio: "全部渠道",
    };
  },
  mounted() {
    let myChart = echarts.init(this.$refs.chart);

    myChart.setOption({
      title:{
         text:'Search Engine',
         subtext:'1048',
         left:'center',
         top:'center'
      },
      tooltip: {
        trigger: "item",
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: true,
            position: 'outside',
          },
         //  emphasis: {
         //    label: {
         //      show: true,
         //      fontSize: "40",
         //      fontWeight: "bold",
         //    },
         //  },
          labelLine: {
            show: true,
          },
          data: [
            { value: 1048, name: "Search Engine" },
            { value: 735, name: "Direct" },
            { value: 580, name: "Email" },
            { value: 484, name: "Union Ads" },
            { value: 300, name: "Video Ads" },
          ],
        },
      ],
    });
    myChart.on('mouseover',(params)=>{
      console.log(params);
      const{name,value} = params.data
      myChart.setOption({
         title:{
            text:name,
            subtext:value
         }
      })
    });
  },
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.chart {
  width: 100%;
  height: 300px;
}
</style>