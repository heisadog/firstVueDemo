<template>
<div class="yd-flexview">
    <div class="g-scrollview">
      <search @ongetdata ='getsort' @onsearch = 'searchfn'  :idx='1'></search>
      <!-- 页签 -->
      <ul class="m-tab m-tab-cover">
            <li>图片</li>
            <li>追单编号</li>
            <li>供应商</li>
            <li>订货量</li>
            <li>面料卡位时间</li>
       </ul>
       <!-- 列表显示区域 -->
       <div class="m-main os" style="height: calc(100% - 280px);height: -webkit-calc(100% - 280px);">
            <yd-pullrefresh :callback="loadList" ref="pullrefreshDemo">
                <yd-infinitescroll :callback="loadLists" ref="infinitescrollDemo">
                <yd-list theme="4" v-for="(item, key) in list" :key="key"  slot="list">
                    <ul v-if="hasRes" class="m-tab-cover m-tab-dtl" :data-id='item.id' 
                    :data-mainid='item.mainid' :data-orderid='item.orderid'>
                        <li><img slot="img" :src="item.mainpicurl" :onerror='defaultImg' @click="showimg(item.mainpicurl)"></li>
                        <li class="selflex" @click="changeActive(key)">{{item.ordercode}}</li>
                        <li class="selflex" @click="changeActive(key)">{{item.supplier}}</li>
                        <li class="selflex" style="color:#3297fd"  @click="goDetail(item.id,item.mainid,item.orderid)"><u>{{item.orderqty}}</u></li>
                        <li class="selflex" @click="changeActive(key)">{{item.fabricarrivedate}}</li>
                    </ul>
                </yd-list>
                </yd-infinitescroll> 
            </yd-pullrefresh>
            <pageError v-if="!hasRes" :msg='pageError'></pageError>  
       </div>
    </div>
    <!-- 弹出大图 -->
        <div class="yd-lightbox" v-if="isshowbigimg" @click="closebigimg">
            <img :src="showbigimg" :onerror='defaultImg' alt="" @click="closebigimg">
        </div>   
    <ul class="m-time">
        <!-- <li><yd-datetime v-model="datetime6" :yearFormat="yearFormat" :month-format="monthFormat" :day-format="dayFormat" type="date"></yd-datetime></li> -->
        <li><span>面料实际到位时间</span><input type="text" id="start" readonly = 'readonly' unselectable="on" onfocus="this.blur()" class='yd-datetime-input' placeholder=""></input></yd-datetime></li>
        <li><span>辅料实际到位时间</span><input type="text" id="end" readonly = 'readonly' unselectable="on" onfocus="this.blur()" class='yd-datetime-input' placeholder=""></input></li>
    </ul>
    <div class="m-button">
        <span class="m-but-master" @click="submit">提交</span>
    </div>
    <foot :idx ='0'></foot>
</div>
</template>
<script>
export default {
    data() {
      return {
        //数据
        hasRes:true,//是否有查询数据
        pageError:'暂无查询数据~~',
        list: [],//数据列表
        searchKey:'',
        searchSort:'desc',
        defaultImg: 'this.src="' + require('../assets/img/w.png') + '"',
        pageno:1,
        showbigimg:'',
        isshowbigimg:false,
      }
    },
    computed:{
        author(){
            return this.$store.state.author
        },
    },
    mounted(){
        //this.getdata();
        //页面初始 数据状态是 false 标识未获取！或者过更新了状态但是 数据为空 ！此时执行获取 否则从 store中获取数据！！！
        // if(!this.$store.state.status.step1sta || this.$store.state.step1json.length == 0 || this.$store.state.backReload || this.$store.state.status.stepallsta) this.getdata()
        // else this.list = (this.$store.state.step1json)
        this.getdata()
        this.$nextTick(() => { /* code */
            this.init_datetimePicker()
        })
    },
    methods:{
        //初始化 时间插件
        init_datetimePicker:function () {
            let _this = this;
            // var mydate = new Date();
            // var year = mydate.getFullYear();
            // var month = mydate.getMonth() + 1;
            // var day = mydate.getDate();
            // var DateTime = year + '-' + month + '-' + day;
            //_this.datetime6  = DateTime;
            $("#start").datetimePicker({
                    title: '请选择时间',
                    times:function(){
                        var  year=[];
                        return year;
                    },
                    parse: function(date) {
                        return date.split(/\D/).filter(function(t) {
                            return !!date
                        });
                    },
                    onOpen:function (values) {
                        $("#start").val(values.value[0]+'-'+values.value[1]+'-'+values.value[2])
                    },
                    onChange:function(){
                        console.log(_this.datetime0)
                    }
                });
                $("#end").datetimePicker({
                    title: '请选择时间',
                    times:function(){
                        var  year=[];
                        return year;
                    },
                    parse: function(date) {
                        return date.split(/\D/).filter(function(t) {
                            return !!date
                        });
                    },
                    onOpen:function (values) {
                        $("#end").val(values.value[0]+'-'+values.value[1]+'-'+values.value[2])
                    }
                });
        }, 
        //x修改选中 vue的方式没搞明白怎么实现 先用jq 实现！！！从引入jq 到现在还没用过一次呢
        changeActive:function(index){
            if($('.m-tab-dtl').eq(index).hasClass('check')) $('.m-tab-dtl').eq(index).removeClass('check')
            else $('.m-tab-dtl').eq(index).addClass('check')
        },
         //搜索
        searchfn:function(key,asc){
            this.searchKey = key;
            this.searchSort = asc;
            this.pageno = 1;
            this.list = [];
            this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.reInit');
            this.getdata()
        },
        //排序
        getsort:function(key,asc){
            this.searchKey = key;
            this.searchSort = asc;
            this.pageno = 1;
            this.list = [];
            this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.reInit');
            this.getdata()
        },
        //获取数据
        getdata:function(){
            var _this = this;
            var vBiz = new D.FYBusiness("DOCUMENTARYTRACKINGLISTQRY");
            var vOpr1 = vBiz.addCreateService("DOCUMENTARYTRACKINGLISTQRY", false);
            var vOpr1Data = vOpr1.addCreateData();
            vOpr1Data.setValue("AS_USER_ID", localStorage.loginname);
            vOpr1Data.setValue("AS_DEPT_ID", '');
            vOpr1Data.setValue("AS_FUNC_NAME", "DOCUMENTARYTRACKINGLISTQRY");
            vOpr1Data.setValue("AS_CONDITION",_this.searchKey);//input的搜索 供应商等
            vOpr1Data.setValue("AS_SORT",_this.searchSort );//升 asc 降 desc
            vOpr1Data.setValue("AS_OPRFLAG",'1' );//1 2 3 4 5 底部标签
            vOpr1Data.setValue("AN_PAGESIZE",'20' );
            vOpr1Data.setValue("AN_PAGENO",_this.pageno );
            var ip = new D.InvokeProc();
            ip.addBusiness(vBiz);
            console.log(JSON.stringify(ip))
            ip.invoke(function(d){
                if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
                    // todo...
                    var AC_HEAD = vOpr1.getResult(d, "AC_RESULT").rows;
                    console.log(AC_HEAD)
                
                    if(AC_HEAD.length == 0  && _this.pageno == 1) _this.hasRes = false;
                    else _this.hasRes = true;

                    _this.list = _this.list.concat(AC_HEAD);
                    //更新数据和状态
                    _this.$store.commit('ipdatestep1',AC_HEAD); 
                     //单次数据请求结束
                    _this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.finishLoad');
                    //所有的 数据结束
                    if(AC_HEAD.length<20 && _this.pageno > 1){
                        _this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.loadedDone');
                    }
                } else {
                    // todo...[d.errorMessage]//AS_LOGINNAME,AS_LOGINPWD PHONEUSERLOGINQRY
                    console.log(d.errorMessage);
                    _this.ydui.alert({
                    mes:d.errorMessage
                    });
                }
            })
        },
        //下拉刷新 获取最新的数据 此时执行一次 getdata
        loadList:function(){
            console.error('执行了下拉刷新获取数据');
            this.pageno = 1;
            this.list = [];
            this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.reInit');
            this.getdata();
            setTimeout(() => {
                 this.$refs.pullrefreshDemo.$emit('ydui.pullrefresh.finishLoad'); 
            }, 1000);
        },
        loadLists(){
            console.log('滚动加载了')
            this.pageno ++;
            this.getdata()
        },
        //去详情
        goDetail:function(id,mainid,orderid){
            console.log(id);
            this.$router.push({path:'/stepdtl',query:{id:id,footId:'0',mainid:mainid,orderid:orderid}})//this.$route.path
        },
        // 提交
        submit:function(){
            //获取 要提交的数据 ----foreach 尚不能正确使用~~先用jq
            let _this = this;
            let [id,mainid,orderid] = [[],[],[]];
            $('.m-main .m-tab-dtl').each(function(){
                if($(this).hasClass('check')){
                    id.push($(this).attr('data-id'));
                    mainid.push($(this).attr('data-mainid'));
                    orderid.push($(this).attr('data-orderid'));
                }
            })
            //简单验证~~~
            if(id.length == 0){
                this.ydui.alert({
                    mes:'请先选择商品'
                });
                return false;
            }
            //,,,AS_DTLID,,,,AS_ACCESSORYACTUALARRIVEDATE,AS_OPRFLAG
            var vBiz = new D.FYBusiness("DOCUMENTARYTRACKINGSAVE");
            var vOpr1 = vBiz.addCreateService("DOCUMENTARYTRACKINGSAVE", false);
            var vOpr1Data = [];
            for (let i = 0; i < id.length; i++) {
                let obj = {};
                obj.AS_USER_ID = localStorage.loginname;
                obj.AS_DEPT_ID = '';
                obj.AS_FUNC_NAME = 'DOCUMENTARYTRACKINGSAVE';
                obj.AS_DTLID = id[i];
                obj.AS_MAINID = mainid[i];
                obj.AS_ORDERID = orderid[i];
                obj.AS_FABRICACTUALARRIVEDATE = $('#start').val();
                obj.AS_ACCESSORYACTUALARRIVEDATE = $('#end').val();
                obj.AS_OPRFLAG = '1';
                vOpr1Data.push(obj);
            }
            vOpr1.addDataArray(vOpr1Data)
            var ip = new D.InvokeProc();
            ip.addBusiness(vBiz);
            console.log(JSON.stringify(ip))
            ip.invoke(function(d){
                if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
                    // todo...
                    _this.ydui.alert({
                    mes:'提交成功',
                    });
                    _this.$store.commit('upstate','')
                    console.log(_this.$store.state.status.stepallsta)
                    $('.m-main .m-tab-dtl').removeClass('check');
                    $('#start,#end').val('')
                     _this.pageno = 1;
                    _this.list = [];
                    _this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.reInit'); 
                    _this.getdata();//成功后更新了数据 页面会由vue实现重新展示剩余数据~~~
                    //还要 触发其他页面的状态 使其他页面数据也刷新
                    
                } else {
                    // todo...[d.errorMessage]//AS_LOGINNAME,AS_LOGINPWD PHONEUSERLOGINQRY
                    _this.ydui.alert({
                    mes:d.errorMessage
                    });
                }
            })
        },
        showimg:function(src){
            this.showbigimg = src;
            this.isshowbigimg = true;
        },
        closebigimg(){
            this.isshowbigimg = false;
        }
    },

    
}
</script>

