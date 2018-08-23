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
                    <input type="text" id="ks" readonly="readonly" @click="chwldm" :data-code='checkWldm.toString()' :data-mc='checkWlmc.toString()' v-model="checkWlmc.toString()" placeholder="请选择店铺">
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
        <div id="coverBackt" class="pf none covert" @click="closezt"></div>
        <div id="multi_box" class="jqex_selectBox y100 thd ts200">
            <div class="os jqex_multi_box" style="height: 300px">
                <div class="item" v-for="(data,key) in wldm" :data-code='data.xtwldm' :data-dmmc='data.xtwlmc' @click="checkitem(key,data.xtwldm,data.xtwlmc)">{{data.xtwlmc}}</div>
            </div>
            <div style="height: 50px"></div>
            <ul class="jqex_btn thd ts200">
                <li @click="all">全选</li>
                <li @click="allclear">全清</li>
                <li @click="sure">确认</li>
                <li @click="cancle">取消</li>
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
            wldm:JSON.parse(localStorage.wllist),
            checkWldm:[],//已经选中的往来代码
            checkWlmc:[],//已经选中的往来名称
        }
    },
    mounted() {
        // console.log(this.$store)
        // console.log(this.$store.state.olyStore.stocklist[0])
        console.log(this.wldm[0]);
    },
    methods:{
        showzt(){
            $('#coverBackt').removeClass('none');
            $('#multi_box').removeClass('y100');
            },
        closezt(){
            $('#coverBackt').addClass('none');
            $('#multi_box').addClass('y100')
        },
        //点击选择店铺
        chwldm(){
            this.showzt();
        },
        //弹出店铺点击效果
        checkitem(index,code,mc){
            if($('.jqex_multi_box .item').eq(index).hasClass('bule01AAEF')){
                $('.jqex_multi_box .item').eq(index).removeClass('bule01AAEF');
                this.checkWldm.remove(code);
                this.checkWlmc.remove(mc);
            } else{
                $('.jqex_multi_box .item').eq(index).addClass('bule01AAEF');
                this.checkWldm.push(code);
                this.checkWlmc.push(mc);
            }
            console.error(this.checkWldm);
            console.error(this.checkWlmc);
        },
        all(){
            $('.jqex_multi_box .item').each(function(){
                $(this).addClass('bule01AAEF');
                this.checkWldm.push($(this).attr('data-code'));
                this.checkWlmc.push($(this).attr('data-dmmc'));
            })
        },
        allclear(){
            $('.jqex_multi_box .item').removeClass('bule01AAEF');
            this.checkWldm = [];
            this.checkWlmc = [];
        },
        sure(){
            this.closezt();
        },
        cancle(){
            this.closezt();
        },
        dtlsearch(){
            const _this = this;
            var vBiz = new FYBusiness("biz.sale.emp.qry");
            var vOpr1 = vBiz.addCreateService("svc.sale.emp.qry", false);
            var vOpr1Data = vOpr1.addCreateData();
            vOpr1Data.setValue("AS_USERID", this.userid);
            vOpr1Data.setValue("AS_WLDM",this.wldm);
            vOpr1Data.setValue("AS_FUNC", "svc.sale.emp.qry");
            vOpr1Data.setValue("AS_QSRQ", "");
            vOpr1Data.setValue("AS_JZRQ", "");
            vOpr1Data.setValue("AS_XTWLDM", "");
            vOpr1Data.setValue("AS_TYPE", "");
            vOpr1Data.setValue("AN_PSIZE", "");
            vOpr1Data.setValue("AN_PINDEX", "");
            var ip = new InvokeProc();
            ip.addBusiness(vBiz);
            ip.invoke(function(d){
                if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
                    // todo...
                } else {
                    // todo...[d.errorMessage]
                }
            }) ;
        }
    }
}
</script>
