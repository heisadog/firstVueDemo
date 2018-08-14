<template>
    <div>
        <lefttab></lefttab>
        <heads></heads>
        <ul class="oly_tab_li">
            <li class="oly_check">分仓库</li>
            <li>汇总</li>
        </ul>
        <ul class="oly_dtl_title">
            <li v-for="item in table2">{{item}}</li>
        </ul>

        <!-- 下拉选择框 -->
        <div id="cover" class="pf cover none" style="z-index: 80"></div>
        <div id="search" class="selectTopBox y_100 thd ts200 os">
            <div style="width: 100%;height: 50px"></div>
            <ul class="topSearchBox">
                <li>
                    <span>仓库</span>
                    <input type="text" id="ks" readonly="readonly" placeholder="请选择仓库">
                    <div class="delethis"></div>
                </li>
                <li class="nobor">
                    <span>商品编码</span>
                    <input type="text" id="mc" placeholder="请输入商品编码">
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
import {fun} from   './fun.js'
export default {
    data(){
        return{
            table:[],
            table1:['商品编码','仓库','数量','金额'],
            table2:['商品编码','单价','数量','金额'],
        }
    },
    mounted() {
       
    },
    methods:{
        
    }
}
</script>
