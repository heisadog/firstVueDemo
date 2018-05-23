<template>
<div class="yd-flexview">
    <div class="g-scrollview">
        <search @ongetdata ='getsort' @onsearch = 'searchfn' :idx='2'></search>
        <!-- 页签 -->
        <ul class="m-tab m-tab-cover">
                <li>图片</li>
                <li>追单编号</li>
                <li>供应商</li>
                <li>订货量</li>
                <li>合同时间</li>
        </ul>
        <!-- 列表显示区域 -->
        <div class="m-main os" style="height: calc(100% - 200px);height: -webkit-calc(100% - 200px);">
                <yd-pullrefresh :callback="loadList" ref="pullrefreshDemo">
                    <yd-infinitescroll :callback="loadLists" ref="infinitescrollDemo">
                    <yd-list theme="4" v-for="(item, key) in list" :key="key" slot="list">
                        <ul v-if="hasRes" class="m-tab-cover m-tab-dtl" @click="changeActive(key)" :data-id='item.id' 
                        :data-mainid='item.mainid' :data-orderid='item.orderid'>
                            <li><img slot="img" :src="item.mainpicurl" :onerror='defaultImg'></li>
                            <li class="selflex">{{item.ordercode}}</li>
                            <li class="selflex">{{item.supplier}}</li>
                            <li class="selflex" style="color:#3297fd"  @click="goDetail(item.id,item.mainid,item.orderid)">{{item.orderqty}}</li>
                            <li class="selflex">{{item.contractdate}}</li>
                        </ul>
                    </yd-list>
                    </yd-infinitescroll>
                </yd-pullrefresh>
                <pageError v-if="!hasRes" :msg='pageError'></pageError>   
       </div>
    </div>
    <div class="m-button">
        <span class="m-but-master" @click="submit">开裁</span>
    </div>
    <foot :idx ='1'></foot>
</div>
</template>
<script>
export default {
    data() {
      return {
        //数据
        hasRes:true,//是否有查询数据
        pageError:'暂无查询数据~',
        list: [],//数据列表
        searchKey:'',
        searchSort:'desc',
        defaultImg: 'this.src="' + require('../assets/img/w.png') + '"',
        pageno:1,
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
        // 此处 加上数据为空为空也重新获取数据，主要由于store的 更新数据和状态合在一个方法了，应该 分开执行！！！
        // if(!this.$store.state.status.step2sta || this.$store.state.step2json.length == 0 || this.$store.state.backReload || this.$store.state.status.stepallsta) this.getdata()
        // else this.list = (this.$store.state.step2json)
        this.getdata()
    },
    methods:{
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
            vOpr1Data.setValue("AS_OPRFLAG",'2' );//1 2 3 4 5 底部标签
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
                    _this.$store.commit('ipdatestep2',AC_HEAD); 
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
            this.$router.push({path:'/stepdtl',query:{id:id,footId:'1',mainid:mainid,orderid:orderid}})//this.$route.path
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
                obj.AS_FABRICACTUALARRIVEDATE = '';
                obj.AS_ACCESSORYACTUALARRIVEDATE = '';
                obj.AS_OPRFLAG = '2';
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
                    mes:'开裁成功',
                    });
                     $('.m-main .m-tab-dtl').removeClass('check');
                      _this.$store.commit('upstate','')
                    _this.pageno = 1;
                    _this.list = [];
                    _this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.reInit');  
                    _this.getdata();//成功后更新了数据 页面会由vue实现重新展示剩余数据~~~
                } else {
                    // todo...[d.errorMessage]//AS_LOGINNAME,AS_LOGINPWD PHONEUSERLOGINQRY
                    _this.ydui.alert({
                    mes:d.errorMessage
                    });
                }
            })
        }
    }
    
}
</script>

