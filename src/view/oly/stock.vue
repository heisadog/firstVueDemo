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
        
        <div class="view_box_list os"  style="top:118px;bottom:0px;height:calc(100% - 101px);height:-webkit-calc(100% - 101px)">
            <div id="list"></div>
            <div class="scrollload none" id="scrollload">
                <div class="scrollload_img"></div>
                <span>正在加载更多内容</span>
            </div>
        </div>

        <!-- 下拉选择框 -->
        <div id="cover" class="pf cover none" style="z-index: 80"></div>
        <div id="search" class="selectTopBox y_100 thd ts200 os">
            <div style="width: 100%;height: 50px"></div>
            <ul class="topSearchBox">
                <li>
                    <span>仓库</span>
                    <input type="text" id="jq_wldm" unselectable="on" onfocus="this.blur()" readonly="readonly" @click="chwldm" :data-code='checkCKdm.toString()' :data-mc='checkCKmc.toString()' v-model="checkCKmc.toString()" placeholder="请选择仓库">
                    <div class="delethis" @click="deletewl"></div>
                </li>
                <li class="nobor">
                    <span>商品编码</span>
                    <input type="text" placeholder="请输入商品编码" v-model="sear_wpdm">
                    <div class="delethis"></div>
                </li>
                <div class="topSearchBtn">
                    <span @click="inputAllClaer">清 除</span>
                    <span @click="clickdtlsearch">查 询</span>
                </div>
            </ul>
        </div>
        <div id="coverBackt" class="pf none covert" @click="closezt"></div>
        <div id="multi_box" class="jqex_selectBox y100 thd ts200">
            <div class="os jqex_multi_box" style="height: 300px">
                <div class="item" v-for="(data,key) in ckdm" :data-code='data.kcckdm' :data-dmmc='data.kcckmc' @click="checkitem(key,data.kcckdm,data.kcckmc)">{{data.kcckmc}}</div>
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
import {fun} from   './fun.js'
export default {
    data(){
        return{
            tap:['分仓库','汇总'],
            tapindex:0,
            table:[],//承载表头！
            table0:['商品编码','仓库','数量','金额'],
            table1:['商品编码','单价','数量','金额'],
            sear_wpdm:'',//查询所需物品代码
            ckdm:JSON.parse(localStorage.cklist),
            checkCKdm:[],//已经选中的往来代码
            checkCKmc:[],//已经选中的往来名称
            page:1,
            pageSize:30,
        }
    },
    mounted() {
       //默认表头 选择 第一个 数据 table1
        this.table = this.table0;
        this.$nextTick(() => { /* code */
            this.dtlsearch();
            this.ready();
        })
        
    },
    methods:{
        ready(){
            var loading = false;  //状态标记
            const _this = this;
            $('.view_box_list').scroll(function(){
                //console.log($("#list").Scroll());
                if ($("#list").Scroll() < 0) {
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
        //点击选择店铺
        chwldm(){
            this.showzt();
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
            this.dtlsearch();
        },
        //弹出店铺点击效果
        checkitem(index,code,mc){
            if($('.jqex_multi_box .item').eq(index).hasClass('bule01AAEF')){
                $('.jqex_multi_box .item').eq(index).removeClass('bule01AAEF');
                this.checkCKdm.remove(code);
                this.checkCKmc.remove(mc);
            } else{
                $('.jqex_multi_box .item').eq(index).addClass('bule01AAEF');
                this.checkCKdm.push(code);
                this.checkCKmc.push(mc);
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
            this.checkCKdm = [];
            this.checkCKmc = [];
        },
        sure(){
            this.closezt();
        },
        cancle(){
            this.closezt();
        },
        //单独删除 仓库
        deletewl(){
            $('.delethis').click(function(){
                $(this).prev().val('');
            })
            this.checkCKdm = [];
            this.checkCKmc = [];
            $('.jqex_multi_box .item').removeClass('bule01AAEF');
        },
        //全清理
        inputAllClaer(){
            $('.topSearchBox').find('input').val('');
            this.checkCKdm = [];
            this.checkCKmc = [];
            $('.jqex_multi_box .item').removeClass('bule01AAEF');
        },
        clickdtlsearch(){
            $('#list').html('');
            $("#scrollload").addClass("none");
            $("#scrollload span").html("正在加载");
            this.page = 1;
            this.dtlsearch();
        },
        dtlsearch(){
            const _this = this;
            fun.csear();
            _this.ydui.loading.open('数据加载...')
            var vBiz = new D.FYBusiness("biz.inv.pda.qry");
            var vOpr1 = vBiz.addCreateService("svc.inv.pda.qry", false);
            var vOpr1Data = vOpr1.addCreateData();
            vOpr1Data.setValue("AS_USERID", localStorage.userid);
            vOpr1Data.setValue("AS_WLDM", localStorage.wldm);
            vOpr1Data.setValue("AS_FUNC", "svc.inv.pda.qry");
            vOpr1Data.setValue("AS_WPDM", _this.sear_wpdm);
            vOpr1Data.setValue("AN_PSIZE", _this.pageSize);
            vOpr1Data.setValue("AN_PINDEX", _this.page);
            vOpr1Data.setValue("AS_KCCKDM", $('#jq_wldm').attr('data-code'));
            vOpr1Data.setValue("AS_CXFS", _this.tapindex== 0 ? 'CK' : 'HZ');
            var ip = new D.InvokeProc();
            ip.addBusiness(vBiz);
            _this.isShowConsolelog ? console.log(JSON.stringify(ip)) :'';
            ip.invoke(function(d){
                if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
                    let list = vOpr1.getResult(d, "AC_KC").rows;
                    _this.isShowConsolelog ? console.log(list) :'';
                    _this.showdatadtl(list);
                    setTimeout(() => {
                        _this.ydui.loading.close();
                    }, 1500);
                    // todo...
                } else {
                    // todo...[d.errorMessage]
                    _this.isShowConsolelog ? console.log(d.errorMessage) :'';
                }
            }) ;
        },
        //处理结果集
        showdatadtl(result){
            var html ="";
            const _this = this;
            if( result.length ==0 && _this.page ==1 ){
                html = fun.zero();
            }
            switch (_this.tapindex) {
                case 0:
                    for (let i = 0; i < result.length; i++) {
                        html +='<ul class="stock_head_sell" style="border-bottom:none">'+
                            '<li>'+result[i].xtwpdm+'</li>'+
                            '<li>'+result[i].kcckmc+'</li>'+
                            '<li>'+result[i].kczksl+'</li>'+
                            '<li>'+fun.setTwoNum(result[i].wpxsjg*result[i].kczksl)+'</li>'+
                            '</ul>'+
                            '<div class="wfyitem_line">'+
                            '<span style="margin-left: 0;">'+(result[i].xtwpmc)+'</span>'+
                            '</div>';
                    }
                    break;
                case 1:
                    for (let i = 0; i < result.length; i++) {
                        html +='<ul class="stock_head_sell" style="border-bottom:none">'+
                            '<li>'+result[i].xtwpdm+'</li>'+
                            '<li>'+fun.setTwoNum(result[i].wpxsjg)+'</li>'+
                            '<li>'+result[i].kczksl+'</li>'+
                            '<li>'+fun.setTwoNum(result[i].wpxsjg*result[i].kczksl)+'</li>'+
                            '</ul>'+
                            '<div class="wfyitem_line">'+
                            '<span style="margin-left: 0;">'+(result[i].xtwpmc)+'</span>'+
                            '</div>';
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
