<template>
<div>
  <div  style="top:38px" class="m-navbar">
    <div class="add_size" :data-id='defaultSizeId' @click="tapSize">{{defaultSizeName}}</div>  
    <div class="flex-search">
        <form action="#">
            <input type="search" v-model="key" @keypress="search" results="5" class="search_input" placeholder="请输入质号或供应商">
        </form>
    </div>
    <div class="paixu" @click="change()" :data-sort='asc' :idx = idx>排序</div>
  </div>
  <!--下拉菜单-->
  <!--下拉菜单 尚未 做成 适应本情况的插件-->
  <!-- 插件要 传入需要的字段作 参数   -->
  <div>
      <div class="yd-mask" style="z-index: 1500; background-color: rgb(0, 0, 0);"></div>
      <div class="yd-actionsheet">
          <span class="yd-actionsheet-item" style="height:45px;line-height:45px"  v-for="data in size" @click="checkSize(data.kindid,data.kindname)" :data-id='data.kindid'>{{data.kindname}}</span>
       </div>
  </div>
</div>
</template>
<script>
    export default{
        data(){
            return{
                key:'',
                asc:'',
                size:[],
                defaultSizeName:'请选择尺码',
                defaultSizeId:'',
            }
        },
        mounted(){
            //根据传来的 idx 获取 仓库中的排序记录
            let sort = 'page'+$('.paixu').attr('idx');
            this.asc = this.$store.state.addStore.sort[sort];
            this.getSize()
            
        },
        methods:{
            //点击尺码
            tapSize:function () {
                $('.yd-actionsheet').addClass('yd-actionsheet-active');
                $('.yd-mask').addClass('show_yd_mask');
            },
            //选择尺码
            checkSize:function(id,name){
                this.defaultSizeName = name;
                this.defaultSizeId = id;
                $('.yd-actionsheet').removeClass('yd-actionsheet-active');
                $('.yd-mask').removeClass('show_yd_mask');

                this.$store.commit('upSize',this.defaultSizeId);
                //子 组件 传递参数 并使得 父组件 重新获取数据！！
                this.$emit('onFirstGet',this.defaultSizeId)
            },
            search:function (e) {
                var keycode = e.keyCode;
                if(keycode == '13'){
                    e.preventDefault();
                    //子 组件 传递参数 并使得 父组件 重新获取数据！！
                    this.$emit('onFirstGetSearch',this.key)
                }
            },
            //排序   子组件调用父组件的事件
            change:function(){
                let [value,page,idx] = [$('.paixu').attr('data-sort'),'',$('.paixu').attr('idx')]
                console.log(value)
                //this.$store.state.author = this.key;
                if(this.asc =='asc') this.asc = 'desc';
                else this.asc = 'asc';
                if(idx = '1') page = 'page1';
                else page = 'page2';
                //子 组件 传递参数 并使得 父组件 重新获取数据！！
                this.$emit('onFirstGetSort',this.asc)
                this.$store.commit('upSort',page,this.asc);
            },
            //获取 尺码
            getSize:function(){
                var _this = this;
                var vBiz = new D.FYBusiness("PRODUCTIONSUMMARYSIZEGROUPQRY");
                var vOpr1 = vBiz.addCreateService("PRODUCTIONSUMMARYSIZEGROUPQRY", false);
                var vOpr1Data = vOpr1.addCreateData();
                vOpr1Data.setValue("AS_USER_ID", localStorage.loginname);
                vOpr1Data.setValue("AS_DEPT_ID", '');
                vOpr1Data.setValue("AS_FUNC_NAME", "PRODUCTIONSUMMARYSIZEGROUPQRY");
                vOpr1Data.setValue("AS_PARAMS","");//预留参数  传 空
                var ip = new D.InvokeProc();
                ip.addBusiness(vBiz);
                //console.log(JSON.stringify(ip))
                ip.invoke(function(d){
                    if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
                        // todo...
                        var AC_HEAD = vOpr1.getResult(d, "AC_RESULT").rows;
                        //console.log(AC_HEAD)
                        if(AC_HEAD.length != 0){
                            _this.defaultSizeName = AC_HEAD[0].kindname;
                            _this.defaultSizeId = AC_HEAD[0].kindid;  
                            _this.$store.commit('upSize',AC_HEAD[0].kindid) 
                        } 
                        _this.size = AC_HEAD;
                        _this.$emit('onFirstGet',AC_HEAD[0].kindid)
                    } else {
                        // todo...[d.errorMessage]//AS_LOGINNAME,AS_LOGINPWD PHONEUSERLOGINQRY
                        console.log(d.errorMessage);
                        _this.ydui.alert({
                        mes:d.errorMessage
                        });
                    }
                })
            }
        },
        props:['idx']
    }
</script>
