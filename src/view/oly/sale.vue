<template>
    <div>
        <lefttab></lefttab>
        <heads></heads>
        <ul class="oly_tab_li">
            <li class="oly_check">店员业绩</li>
            <li>店铺业绩</li>
            <li>商品详情</li>
            <li>热销时段</li>
       </ul>
        <ul class="oly_dtl_title">
            <li v-for="item in table2">{{item}}</li>
        </ul>
       <div class="">
            
       </div>
       
       <!-- 下拉选择框 -->
        <div id="cover" class="pf cover none" style="z-index: 80"></div>
        <div id="search" class="selectTopBox thd y_100 ts200 os">
            <div style="width: 100%;height: 50px"></div>
            <ul class="topSearchBox">
                <li>
                    <span>店铺</span>
                    <input type="text" id="ks" readonly="readonly" placeholder="请选择店铺">
                    <div class="delethis"></div>
                </li>
                <li>
                    <span>开始日期</span>
                    <input type="text" id="start" readonly="readonly" placeholder="请选择开始日期">
                    <div class="delethis"></div>
                </li>
                <li class="nobor">
                    <span>截止日期</span>
                    <input type="text" id="end" readonly="readonly" placeholder="请选择截止日期">
                    <div class="delethis"></div>
                </li>
                <div class="topSearchBtn">
                    <span id="clear">清 除</span>
                    <span id="searbtn">查 询</span>
                </div>
            </ul>
        </div>
    </div>
</template>
<script>
import './fun.js'
export default {
    data(){
        return{
            table:[],
            table1:['店铺','店员','数量','业绩'],
            table2:['店铺','数量','业绩','贡献率'],
            table3:['商品编码','数量','业绩'],
            table4:['时间','数量','业绩'],
        }
    },
    mounted() {
        
    },
    methods:{}
}
</script>
