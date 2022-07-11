<template>
  <el-card style="margin: 10px 0">
    <div slot="header" class="clearfix">
      <el-tabs class="tabs" v-model="activeName">
        <el-tab-pane label="销售额" name="market"></el-tab-pane>
        <el-tab-pane label="访问量" name="visit"></el-tab-pane>
      </el-tabs>
      <div class="right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <el-date-picker
          class="date"
          size="mini"
          value-format="yyyy-MM-dd"
          v-model="date"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="16">
          <div ref="charts" class="charts"></div>
        </el-col>
        <el-col :span="8">
          <h3>门店{{ title }}排名</h3>
          <ul>
            <li>
              <span class="circleHighlight">1</span>
              <span>肯德基</span>
              <span class="spanRight">27878</span>
            </li>
            <li>
              <span class="circleHighlight">2</span>
              <span>肯德基</span>
              <span class="spanRight">27878</span>
            </li>
            <li>
              <span class="circleHighlight">3</span>
              <span>肯德基</span>
              <span class="spanRight">27878</span>
            </li>
            <li>
              <span>4</span>
              <span>肯德基</span>
              <span class="spanRight">27878</span>
            </li>
            <li>
              <span>5</span>
              <span>肯德基</span>
              <span class="spanRight">27878</span>
            </li>
            <li>
              <span>6</span>
              <span>肯德基</span>
              <span class="spanRight">27878</span>
            </li>
            <li>
              <span>7</span>
              <span>肯德基</span>
              <span class="spanRight">27878</span>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import echarts from "echarts";
import dayjs from 'dayjs';
export default {
  name: "Sale",
  data() {
    return {
      activeName: "market",
      myChart: null,
      date:[]
    };
  },
  computed: {
    title() {
      return this.activeName == "market" ? "销售额" : "访问量";
    },
  },
  watch: {
    title() {
      this.myChart.setOption({
        title: {
          text: this.title + "趋势",
        },
      });
    },
  },
  methods:{
    setDay(){
      const day = dayjs().format('YYYY-MM-DD')
      this.date = [day,day]
    },

    setWeek(){
      const start = dayjs().day(1).format('YYYY-MM-DD')
      const end = dayjs().day(7).format('YYYY-MM-DD')
      this.date = [start,end]
    },
      setMonth(){
      const start = dayjs().startOf('month').format('YYYY-MM-DD')
      const end = dayjs().endOf('month').format('YYYY-MM-DD')
      this.date = [start,end]
    },
    setYear(){
      const start = dayjs().startOf('year').format('YYYY-MM-DD')
      const end = dayjs().endOf('year').format('YYYY-MM-DD')
      this.date = [start,end]
    }
  },
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    this.myChart = echarts.init(this.$refs.charts);
    // 绘制图表
    this.myChart.setOption({
      title: {
        text: this.title + "趋势",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: [
            "一月",
            "二月",
            "三月",
            "四月",
            "五月",
            "六月",
            "七月",
            "八月",
            "九月",
            "十月",
            "十一月",
            "十二月",
          ],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: [10, 52, 200, 334, 390, 330, 67, 65, 78, 76, 45, 34],
          color: "skyblue",
        },
      ],
    });
  },
};
</script>

<style scoped>
.clearfix {
  display: flex;
  justify-content: space-between;
  position: relative;
}
.right {
  position: absolute;
  right: 0;
}
.tabs {
  width: 100%;
}
.date {
  margin: 0 10px;
}
.right span {
  margin: 0 10px;
}
ul {
  list-style: none;
  width: 100%;
  padding: 0;
  height: 300px;
}
ul li {
  height: 8%;
}
.circleHighlight {
  height: 15px;
  width: 15px;
  background-color: black;
  border-radius: 50%;
  color: white;
  float: left;
  text-align: center;
}
ul li span {
  margin: 0 10px;
}
.spanRight {
  float: right;
}
.charts {
  height: 300px;
  width: 100%;
}
>>>.el-card__header{
   border-bottom: none;
 }
</style>