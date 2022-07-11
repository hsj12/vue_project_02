<template>
<div>
  <div class="card-header" >
    <span>{{title}}</span>
    <i class="el-icon-info"></i></div>
  <div class="card-content">{{count}}</div>
  <div class="card-chart">
    <slot name="chart"></slot>
  </div>
  <div class="card-footer">
    <slot name="footer"></slot>
  </div>
</div>
</template>

<script>
export default {
 name:'Detail',
 props:['title','count']
}
</script>

<style scoped>
 .card-header{
    display:flex;
    justify-content: space-between;
    color: grey;
 }
 .card-content{
    font-size: 30px;
    padding: 10px 0;
 }
 .card-chart{
    height: 50px;
 }
</style>