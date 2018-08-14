<template>
    <div>
        <lefttab></lefttab>
        <heads></heads>
        <ul class="oly_tab_li">
            <li class="oly_check">新增会员统计</li>
            <li>店铺会员统计</li>
            <li>会员消费统计</li>
        </ul>
        <ul class="oly_dtl_title">
            <li v-for="item in table2">{{item}}</li>
        </ul>
     
    
       <div class="os" style="height: calc(100% - 280px);height: -webkit-calc(100% - 280px);">
           <ul class="m-tab-cover m-tab-dtl">
                <li class="selflex" >{ordercode}</li>
                <li class="selflex">.supplier}}</li>
                <li class="selflex" style="color:#3297fd"><u>.orderqty}}</u></li>
                <li class="selflex">.fabricarrivedate}}</li>
            </ul>
       </div>

       <!-- 下拉选择框 -->
        <div id="cover" class="pf cover none" style="z-index: 80"></div>
        <div id="search" class="selectTopBox thd ts200 y_100 os">
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
            table1:['店铺','办卡店员','数量'],
            table2:['店铺','数量','新增会员'],
            table3:['会员消费数','会员消费额','非会员消费数','非会员消费额'],
        }
    },
    mounted() {
        
    },
    methods:{}
}
</script>

