<template>
<div class="yd-flexview">
    <div class="g-scrollview">
        <addHeader @onFirstGet = 'firstGet_color'></addHeader>
        <addSearch  @onFirstGetSort ='firstGet_sort' @onFirstGetSearch = 'firstGet_search' @onFirstGet= 'firstGet_size' :idx='2'></addSearch>
        <!-- 页签 -->
        <ul class="m-tab" style="top:88px">
            <li>主订单号</li>
            <li>总定量</li>
            <li>百分比</li>
            <li style="line-height:14px"><span style="    display: block;
        padding-top: 4px;">第一次实际<br>生产时间</span></li>
            <li style="line-height:14px"><span style="    display: block;
        padding-top: 4px;">最后实际<br>生产时间</span></li>
        </ul>
        <!-- 列表显示区域 -->
        <div class="m-main os" style="height: calc(100% - 176px);height: -webkit-calc(100% - 176px);top:125px">
            <yd-pullrefresh :callback="loadList" ref="pullrefreshDemo">
                <yd-infinitescroll :callback="loadLists" ref="infinitescrollDemo">
                <yd-list theme="4" v-for="(item, key) in list" :key="key"  slot="list">
                    <ul v-if="hasRes" class="m-tab-dtl" @click="goDetail(item.id,item.orderno,item.dycsjscsj,item.jcsj,item.percentage,item.zhsjscsj)" :data-id='item.id'
                    :data-orderno='item.orderno' :data-dycsjscsj='item.dycsjscsj' :data-jcsj='item.jcsj'
                    :data-percentage='item.percentage' :data-zhsjscsj='item.zhsjscsj'>
                        <li class="selflex adda">{{item.orderno}}</li>
                        <li class="selflex adda" style="color:#3297fd"><u>{{item.num_sumqry}}</u></li>
                        <li class="selflex adda">{{item.percentage}}</li>
                        <li class="selflex adda">{{item.dycsjscsj}}</li>
                        <li class="selflex adda">{{item.zhsjscsj}}</li>
                    </ul>
                </yd-list>
                </yd-infinitescroll>
        </yd-pullrefresh>
            <pageError v-if="!hasRes" :msg='pageError'></pageError>   
        </div>
    </div>
   <addFooter :idx='1'></addFooter>
</div>   
</template>
<script>
export default {
  data(){
        return{
            hasRes:true,//是否有查询数据
            pageError:'暂无查询数据~',
            list: [],//数据列表
            searchKey:'',
            searchSort:'desc',
            colorStatus:'',//颜色状态  
            size:'', //尺寸 
            pageno:1,
        }
  },
  mounted(){
    
        this.size = this.$store.state.addStore.size.id;//获取不到
        console.error($('.add_size').html());//da打出来的竟然是 ---请选择尺码 看界面 已经获取到数据了~~~~所以此次遇到一个问题
        console.error($('.add_size').attr('data-id'));//结果为空。单看界面 已经有了
        
        // setTimeout(() => {
        //     this.size = this.$store.state.addStore.size.id;
        //     this.getList();
        //     //延迟执行 能获取到
        // }, 5000);      
        //问题描述：父子组件 各通过过程获取一个数据。其中 父组件的过程需要一个子组件 过程返回的参数。上述的代码 竟然 获取不到子组件中参数！！！！
        //涉及到 异步数据获取！！！vue的解决方式还不清楚~~~~
        //通过另外的方式 执行一下：子组件 获取数据后，回调中 执行调用 父组件的事件， 事件中执行获取数据
        // 哇： 同时也实现了 改变 颜色状态 就获取数据了~~
  },
  methods:{
        // 子组件 颜色 点击 变化 引起父组件 事件执行 并修改了data中的属性
        firstGet_color:function(params){
            let _this = this;
            _this.colorStatus = params;
            _this.pageno = 1;
            _this.list = [];
            _this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.reInit');
            _this.getList()
        },
        // 子组件 尺寸 点击 变化 引起父组件 事件执行 并修改了data中的属性
        firstGet_size: function (params) {
            let _this = this;
            _this.size = params;
            _this.pageno = 1;
            _this.list = [];
            _this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.reInit');
            _this.getList()
            console.log(params)
        },
       //搜索
        firstGet_search:function(params){
            let _this = this;
            _this.searchKey = params;
            _this.pageno = 1;
            _this.list = [];
            _this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.reInit');
            _this.getList()
        },
       //排序
        firstGet_sort:function(params){
            let _this = this;
            _this.searchSort = params;
            _this.pageno = 1;
            _this.list = [];
            _this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.reInit');
            _this.getList()
        },
        getList:function(){//AS_USER_ID,AS_DEPT_ID,AS_FUNC_NAME,AS_CONDITION,AS_STATUS,AS_SIZEGROUP,AS_SORT,AS_OPRFLAG
            var _this = this; 
            console.log(_this.$store.state.addStore.size.id)
            var vBiz = new D.FYBusiness("PRODUCTIONSUMMARYLISTQRY");
            var vOpr1 = vBiz.addCreateService("PRODUCTIONSUMMARYLISTQRY", false);
            var vOpr1Data = vOpr1.addCreateData();
            vOpr1Data.setValue("AS_USER_ID", localStorage.loginname);
            vOpr1Data.setValue("AS_DEPT_ID", '');
            vOpr1Data.setValue("AS_FUNC_NAME", "PRODUCTIONSUMMARYLISTQRY");
            vOpr1Data.setValue("AS_CONDITION",_this.searchKey);//input的搜索 供应商等
            vOpr1Data.setValue("AS_STATUS",_this.colorStatus );//顶部 数据状态
            vOpr1Data.setValue("AS_SIZEGROUP",_this.size );//尺码组
            vOpr1Data.setValue("AS_SORT",_this.searchSort );//升 asc 降 desc
            vOpr1Data.setValue("AS_OPRFLAG",'2' );//1 2  底部标签 1-头批，2-追单
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
                
                    if(AC_HEAD.length == 0 && _this.pageno == 1) _this.hasRes = false;
                    else _this.hasRes = true;

                    _this.list = _this.list.concat(AC_HEAD);
                    // 更新数据和状态
                    _this.$store.commit('upList','page2',AC_HEAD);
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
            this.getList();
             setTimeout(() => {
                 this.$refs.pullrefreshDemo.$emit('ydui.pullrefresh.finishLoad'); 
             }, 1000);
        },
        loadLists(){
            console.log('滚动加载了')
            this.pageno ++;
            this.getList()
        },
        //去详情
        goDetail:function(id,orderno,dycsjscsj,jcsj,percentage,zhsjscsj){
            this.$router.push({
                path:'/addDtl',
                query:{ id:id,
                        footId:'1',
                        orderno:orderno,
                        dycsjscsj:dycsjscsj || '',
                        jcsj:jcsj || '',
                        percentage:percentage || '0',
                        zhsjscsj:zhsjscsj || '',
                        footId:1
                    }
            })//this.$route.path
        },
    }
}
</script>

