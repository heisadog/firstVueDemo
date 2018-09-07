<template>
    <div>
        <lefttab></lefttab>
        <heads></heads>
        <ul class="oly_tab_li">
            <li v-for="(data,index) in tap" :class='[{ oly_check : index === tapindex }]' @click="oly_check(index)">{{data}}</li>
       </ul>
        <ul class="oly_dtl_title">
            <li v-for="item in table">{{item}}</li>
        </ul>
       <div class="view_box_list os"  style="top:118px;bottom:0px;height:calc(100% - 118px);height:-webkit-calc(100% - 118px)">
            <div id="list"></div>
            <div class="scrollload none" id="scrollload">
                <div class="scrollload_img"></div>
                <span>正在加载更多内容</span>
            </div>
        </div>
       
       <!-- 下拉选择框 -->
        <div id="cover" class="pf cover none" style="z-index: 80"></div>
        <div id="search" class="selectTopBox thd y_100 ts200 os">
            <div style="width: 100%;height: 50px"></div>
            <ul class="topSearchBox">
                <li>
                    <span>店铺</span>
                    <input type="text" id="jq_wldm" unselectable="on" onfocus="this.blur()" readonly="readonly" @click="chwldm" :data-code='checkWldm.toString()' :data-mc='checkWlmc.toString()' v-model="checkWlmc.toString()" placeholder="请选择店铺">
                    <div class="delethis" @click="deletewl"></div>
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
                    <span @click="inputAllClaer">清 除</span>
                    <span @click="clickdtlsearch">查 询</span>
                </div>
            </ul>
        </div>
        <!--  -->
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
import { fun } from './fun.js';
export default {
    data(){
        return{
            tap:['店员业绩','店铺业绩','商品详情','热销时段'],
            tapindex:0,
            table:[],//承载表头！
            table0:['店铺','店员','数量','业绩'],
            table1:['店铺','数量','业绩','贡献率'],
            table2:['商品编码','数量','业绩'],
            table3:['时间','数量','业绩'],
            wldm:JSON.parse(localStorage.wllist),
            checkWldm:[],//已经选中的往来代码
            checkWlmc:[],//已经选中的往来名称
            total_num:0,//查询结果总金额和数量
            total_je:0,
            page:1,
            pageSize:30,
        }
    },
    mounted() {
        // console.log(this.$store)
        // console.log(this.$store.state.olyStore.stocklist[0])
        //默认表头 选择 第一个 数据 table1
        this.table = this.table0;
        this.$nextTick(() => { /* code */
            this.ready();
            $('#start').val(fun.getMonthStartDate())
            $('#end').val(fun.format('yyyy-MM-dd',new Date()))
            this.dtlsearch();
            
        })
    },
    methods:{
        ready(){
            var loading = false;  //状态标记
            const _this = this;
            $('.view_box_list').scroll(function(){
                //console.log($("#list").Scroll());
                if ($("#list").Scroll() < 0 && $("#list").Scroll() >-50) {
                    if(!$("#scrollload").hasClass("none")){
                        loading = true;
                    }
                    setTimeout(function () {
                        if(loading ){
                            _this.page ++;
                            _this.dtlsearch();
                            loading = false;
                        }
                    },10);
                }
            })
        },
        showzt(){
            $('#coverBackt').removeClass('none');
            $('#multi_box').removeClass('y100');
            },
        closezt(){
            $('#coverBackt').addClass('none');
            $('#multi_box').addClass('y100')
        },
        //点击切换标签
        oly_check(index){
            if (this.tapindex == index) return;
            this.tapindex = index;
            //更换表头
            let tables = 'table'+index;
            this.table = this[tables];
            //重置内容
            $('#list').html('');
            $("#scrollload").addClass("none");
            $("#scrollload span").html("正在加载");
            this.page = 1;
            //查询
            this.dtlsearch()
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
        },
        all(){
            const _this = this;
            $('.jqex_multi_box .item').each(function(){
                $(this).addClass('bule01AAEF');
                _this.checkWldm.push($(this).attr('data-code'));
                _this.checkWlmc.push($(this).attr('data-dmmc'));
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
        //单独删除 店铺
        deletewl(){
            $('.delethis').click(function(){
                $(this).prev().val('');
            })
            this.checkWldm = [];
            this.checkWlmc = [];
            $('.jqex_multi_box .item').removeClass('bule01AAEF');
        },
        //全清理
        inputAllClaer(){
            $('.topSearchBox').find('input').val('');
            this.checkWldm = [];
            this.checkWlmc = [];
            $('.jqex_multi_box .item').removeClass('bule01AAEF');
        },
        clickdtlsearch(){
            $('#list').html('');
            $("#scrollload").addClass("none");
            $("#scrollload span").html("正在加载");
            this.page = 1;
            this.dtlsearch();
        },
        //搜索
        dtlsearch(){
            const _this = this;
            if($('#start').val() && $('#end').val()){
                if($('#start').val()>$('#end').val()){
                    _this.ydui.alert({
                        'mes':'开始时间不能晚于结束时间'
                    })
                    return;
                }
            }
            fun.csear();
            _this.ydui.loading.open('数据加载...')
            var vBiz = new D.FYBusiness("biz.sale.emp.qry");
            var vOpr1 = vBiz.addCreateService("svc.sale.emp.qry", false);
            var vOpr1Data = vOpr1.addCreateData();
            vOpr1Data.setValue("AS_USERID", localStorage.userid);
            vOpr1Data.setValue("AS_WLDM",localStorage.wldm);
            vOpr1Data.setValue("AS_FUNC", "svc.sale.emp.qry");
            vOpr1Data.setValue("AS_QSRQ", $('#start').val() || '');
            vOpr1Data.setValue("AS_JZRQ", $('#end').val() || '');
            vOpr1Data.setValue("AS_XTWLDM",$('#jq_wldm').attr('data-code'));
            vOpr1Data.setValue("AS_TYPE", (_this.tapindex+1));
            vOpr1Data.setValue("AN_PSIZE", _this.pageSize);
            vOpr1Data.setValue("AN_PINDEX", _this.page);
            var ip = new D.InvokeProc();
            ip.addBusiness(vBiz);
            _this.isShowConsolelog ? console.log(JSON.stringify(ip)) :'';
            ip.invoke(function(d){
                if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
                    // todo...
                    let list = vOpr1.getResult(d, "AC_RESULT1").rows;
                    _this.total_num = vOpr1.getOutputPermeterMapValue(d, "AN_SL");
                    _this.total_je = vOpr1.getOutputPermeterMapValue(d, "AN_JE");
                    _this.isShowConsolelog ? console.log(list) :'';
                    setTimeout(() => {
                        _this.ydui.loading.close();
                    }, 1500);
                    _this.showdatadtl(list);
                } else {
                    // todo...[d.errorMessage]
                    _this.isShowConsolelog ? console.log(d.errorMessage) :'';
                    // _this.ydui.alert({
                    //     'mes':'登录失败，获取门店失败'
                    // })
                }
            }) ;
        },
        //处理结果集
        showdatadtl(result){
            var html ="";
            const _this = this;
            if( result.length ==0 && _this.page ==1){
                html = fun.zero();
            }
            switch (_this.tapindex) {
                case 0:
                    for (let i = 0; i < result.length; i++) {
                        html +='<ul class="stock_head_sell">'+
                            '<li>'+result[i].xtwlmc+'</li>'+
                            '<li>'+result[i].xtyhxm+'</li>'+
                            '<li>'+result[i].kcczsl+'</li>'+
                            '<li>' + fun.setTwoNum(result[i].kcssje) + '</li>'+
                            '</ul>';
                    }
                    break;
                case 1:
                    for (let i = 0; i < result.length; i++) {
                        let bl = Math.round(result[i].kcssje / _this.total_je * 10000) / 100.00;
                        html +='<ul class="stock_head_sell">'+
                            '<li>'+result[i].xtwlmc+'</li>'+
                            '<li>'+result[i].kcczsl+'</li>'+
                            '<li>'+fun.setTwoNum(result[i].kcssje)+'</li>'+
                            '<li>' + bl + '%</li>'+
                            '</ul>';
                    }
                    break;
                case 2:
                    for (let i = 0; i < result.length; i++) {
                        html +='<ul class="stock_head_sell" style="border-bottom:none">'+
                            '<li>'+result[i].xtwpdm+'</li>'+
                            '<li>'+result[i].kcczsl+'</li>'+
                            '<li>'+fun.setTwoNum(result[i].kcssje)+'</li>'+
                            '</ul>'+
                            '<div class="wfyitem_line">'+
                            '<span style="margin-left: 0;">'+(result[i].xtwpmc)+'</span>'+
                            '</div>';
                    }
                    break;
                case 3:
                    for (let i = 0; i < result.length; i++) {
                        html +='<ul class="stock_head_sell">'+
                            '<li>'+result[i].kcczrq+'</li>'+
                            '<li>'+result[i].kcczsl+'</li>'+
                            '<li>'+fun.setTwoNum(result[i].kcssje)+'</li>'+
                            '</ul>';
                    }
                    break;        
                default:
                    break;
            }
            $('#list').append(html);
            if(result.length == _this.pageSize){
                $("#scrollload").removeClass("none");
            }
            if( _this.page > 1 && result.length ==0){
                $("#scrollload span").html("没有更多了...");
                setTimeout(function () {
                    $("#scrollload").addClass("none");
                    $("#scrollload span").html("正在加载");
                },1000);
            }
        },
    }
}
</script>