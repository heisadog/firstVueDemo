<template>
<div class="yd-flexview">
    <div class="g-scrollview">
        <!-- 固定部分 -->
        <dtl :items="dtl,table,senddtl"></dtl>
        
        <!-- 滚动部分 -->
        <div class="scolpart" :class='["fisdtl", {on:idx === 1} ]'>
            <ul class="dtlshtime" v-for="data in dtl" :key="dtl.id">
                <li><span>合同时间：</span><span>{{data.contractdate}}</span></li>
                <li><span>照片样时间：</span><span>{{data.photodate}}</span></li>
                <li><span>大货样时间：</span><span>{{data.largecargodate}}</span></li>
                <li><span>预估面料到位时间：</span><span>{{data.estfabricarrivedate}}</span></li>
                <li><span>面料卡位时间：</span><span>{{data.fabricarrivedate}}</span></li>
                <div class="glin"></div>
                <!-- 此处模块一 是需要选择输入的  -->
                <li v-if="idx != '0'" style="margin-top:10px;color:#1a1a1a"><span>面料实际到位时间：</span><span>{{data.fabricactualarrivedate}}</span></li>
                <li v-if="idx != '0'" style="color:#1a1a1a"><span>辅料实际到位时间：</span><span>{{data.accessoryactualarrivedate}}</span></li>
            </ul>
            <!-- 下面的 发货箱数 是第五个 模块 独有的 -->
            <div v-if="isSend">
                <div class="glin"></div>
                <div v-if="isSendDtl" class="shownumxs"  v-for='data in dtl'>已发货数量：<span>{{data.sendqty}}</span> <span style="float:right">已发货箱数：{{data.sendbox}}</span></div>
                <div v-if="isSendDtl" class="showtable showfirst">
                    <span>发货箱数</span>
                    <span>发货数量</span>
                    <span>发货时间</span>
                    <span>装箱单</span>
                    <span>操作</span>
                </div>
                <yd-lightbox :num="senddtl.length" class="showtable showsecond" v-for="(data,index) in senddtl" :key="senddtl.id" style="border-top:none">
                    <span>{{data.sendbox}}</span>
                    <span>{{data.sendqty}}</span>
                    <span>{{data.oprdatetime}}</span>
                    <span>
                        <!-- <yd-lightbox-img class="wcnmlgb" slot="img" :src="data.packingpic" :onerror='defaultImg'></yd-lightbox-img> -->
                        <img class="wcnmlgb" slot="img" :src="data.packingpic" :onerror='defaultImg' @click="showbitimg(data.packingpic)">
                    </span>
                    <span :data-footId='4' :data-dtlid='data.dtlid' :data-mainid='data.mainid' 
                    :data-id='data.id' :data-imgurl='data.packingpic' :data-packingpic2='data.packingpic2' :data-sendbox='data.sendbox' :data-sendqty='data.sendqty' data-type="update"
                    @click="gotoEdit(index)" style="color:#3297fd" class="edit"><u>编辑</u></span>
                </yd-lightbox>
                <!-- <div class="showtable showsecond" v-for="data,index in senddtl" style="border-top:none">
                    <span>{{data.sendbox}}</span>
                    <span>{{data.sendqty}}</span>
                    <span>{{data.oprdatetime}}</span>
                    <span>查看</span>
                    <span class="edit" :data-footId='4' :data-dtlid='data.dtlid' :data-mainid='data.mainid' 
                    :data-id='data.id' :data-imgurl='data.packingpic' :data-sendbox='data.sendbox' :data-sendqty='data.sendqty' data-type="update" @click="gotoEdit(index)">编辑</span>
                </div> -->
            </div>
        </div>

        <!-- 弹出大图 -->
        <div class="yd-lightbox" v-if="isshowbigimg" @click="closebigimg">
            <img :src="showbigimg" :onerror='defaultImg' alt="" @click="closebigimg">
        </div>

    </div>


     <ul class="m-time" v-if="idx === '0'">
        <li><span>面料实际到位时间</span><input id="start" class='yd-datetime-input' v-model="datetime0"></input></li>
        <li><span>辅料实际到位时间</span><input id='end' class='yd-datetime-input'  v-model="datetime1"></input></li>
    </ul>
    <!-- 按钮  按钮是 根据页签 id 来判断的-->
    <div class="m-button" v-if="idx === '0'" >
            <span class="m-but-master" @click="submit">提交</span>
    </div>
    <div class="m-button" v-else-if="idx === '1'" >
            <span class="m-but-master" @click="submit">开裁</span>
    </div>
    <div class="m-button" v-else-if="idx === '2'" >
            <span class="m-but-master" @click="submit">上线</span>
    </div>
    <div class="m-button" v-else-if="idx === '3'" >
        <span class="m-but-master" @click="submit">后整</span>
    </div>
    <div class="m-button" v-else="idx === '4'">
        <!-- <span class="m-but-master" @click="gotoEdit">编辑</span>  编辑 -->
        <span class="m-but-master" @click="addEdit">发货</span> <!--新增编辑-->
        <span class="m-but-master" @click="submit" style="background-color:#1664b3">发货完全</span>
    </div>
    <foot :idx ='0'></foot>
  </div>
</template>
<script>

export default {
    data() {
      return {
        //数据
        idx:'',// footId
        dtl:[],// 详情的表头信息
        table:[], //详情的 表格数据
        senddtl:[],//第五个模块的发货数量
        isSend:true,// 是否显示第五个模块的 发或数量
        isSendDtl:true,// 当 第五个模块的 发货数量为0 的时候 。隐藏表头
        datetime0: '',// (new Date()).getFullYear()+'-'+((new Date()).getMonth()+1)+'-'+(new Date()).getDate(), 即便是这样还是报错！！
        datetime1: '',
        defaultImg: 'this.src="' + require('../assets/img/w.png') + '"',
        showbigimg:'',
        isshowbigimg:false,
      }
    },
    created(){
        this.init_datetimePicker()
    },
    mounted(){
      //页面地址中的参数
      console.log(this.$route.query)
      let id = this.$route.query.id;
      let idx = this.$route.query.footId;
      this.idx = idx;
      //获取 详情数据
      this.getDtl(id)
      // 第五个模块的 详情显示 发货箱数
      if(idx == '4') this.isSend = true;
      else this.isSend = false;
      if(idx == '1') $('.scolpart').addClass('fisdtl');
      //能力有限，还不知道 如何 动态的用变化的foot 所以 jq 设置高亮
      $('.footer li').removeClass('on');
      $('.footer li').eq(idx).addClass('on');
      
      this.$nextTick(() => { /* code */
          this.init_datetimePicker()
      })
    },
    methods:{
            //初始化 时间插件
        init_datetimePicker:function () {
            $("#start").datetimePicker({
                    title: '请选择时间',
                    min: "1990-12-12",
                    max: "2222-12-12 12:12",
                    monthNames:"",
                    times:function(){
                    },
                    parse: function(date) {
                        return date.split(/\D/).filter(function(t) {
                            return !!date
                        });
                    },
                    onOpen:function (values) {
                        $("#state").val(values.value[0]+'-'+values.value[1]+'-'+values.value[2])
                    }
                });
                $("#end").datetimePicker({
                    title: '请选择时间',
                    min: "1990-12-12",
                    max: "2222-12-12 12:12",
                    monthNames:"",
                    times:function(){
                    },
                    parse: function(date) {
                        return date.split(/\D/).filter(function(t) {
                            return !!date
                        });
                    },
                    onOpen:function (values) {
                        $("#state").val(values.value[0]+'-'+values.value[1]+'-'+values.value[2])
                    }
                });
        }, 
      submit:function(){
        console.log(this.idx)
        let _this = this;
        var vBiz = new D.FYBusiness("DOCUMENTARYTRACKINGSAVE");
        var vOpr1 = vBiz.addCreateService("DOCUMENTARYTRACKINGSAVE", false);
        var vOpr1Data = [];
        for (let i = 0; i < 1; i++) {
            let obj = {};
            obj.AS_USER_ID = localStorage.loginname;
            obj.AS_DEPT_ID = '';
            obj.AS_FUNC_NAME = 'DOCUMENTARYTRACKINGSAVE';
            obj.AS_DTLID = _this.dtl[0].id;
            obj.AS_MAINID = _this.dtl[0].mainid;
            obj.AS_ORDERID = _this.dtl[0].orderid;
            obj.AS_FABRICACTUALARRIVEDATE = $('#start').val();;//只有第一步需要 其他为空
            obj.AS_ACCESSORYACTUALARRIVEDATE = $('#end').val();;
            obj.AS_OPRFLAG = Number(_this.idx)+1;
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
                  mes:'操作成功',
                  callback:()=>{
                    _this.$router.go(-1);
                    _this.$store.commit('backReload',true);
                    _this.$store.commit('upstate','')
                  }
                });
            } else {
                // todo...[d.errorMessage]//AS_LOGINNAME,AS_LOGINPWD PHONEUSERLOGINQRY
                _this.ydui.alert({
                    mes:d.errorMessage
                });
            }
        })
      },
      //修改发货
      gotoEdit:function(index){
        let [type,mainid,sendbox,sendqty,imgurl] = ['update',this.dtl[0].mainid,$('.edit').eq(index).attr('data-sendbox'),$('.edit').eq(index).attr('data-sendqty'),($('.edit').eq(index).attr('data-imgurl') || "")]; 
        let dtlid = $('.edit').eq(index).attr('data-dtlid');
        let id = $('.edit').eq(index).attr('data-id');
        let orderno = this.dtl[0].orderno;
        let packingpic2 = $('.edit').eq(index).attr('data-packingpic2');
        this.$router.push({path:'/edit',query:{footId:'4',type:type,id:id,mainid:mainid,sendqty:sendqty,sendbox:sendbox,imgurl:imgurl,dtlid:dtlid,orderno:orderno,packingpic2:packingpic2}})
      },
      //新增 发货
      addEdit:function(){
        //首先需要 获取 详情页面中的 各个参数 
        let [type,id,mainid,orderno] = ['add',this.dtl[0].id,this.dtl[0].mainid,this.dtl[0].orderno]; 
        this.$router.push({path:'/edit',query:{footId:'4',type:type,id:id,mainid:mainid,orderno:orderno}})
      },
      //获取详情
      getDtl:function(id){
          var _this = this;//,AS_DTLID,AS_OPRFLAG
          var vBiz = new D.FYBusiness("DOCUMENTARYTRACKINGDETAILQRY");
          var vOpr1 = vBiz.addCreateService("DOCUMENTARYTRACKINGDETAILQRY", false);
          var vOpr1Data = vOpr1.addCreateData();
          vOpr1Data.setValue("AS_USER_ID", localStorage.loginname);
          vOpr1Data.setValue("AS_DEPT_ID", '');
          vOpr1Data.setValue("AS_FUNC_NAME", "DOCUMENTARYTRACKINGDETAILQRY");
          vOpr1Data.setValue("AS_DTLID", id);//input的搜索 供应商等
          vOpr1Data.setValue("AS_OPRFLAG",(Number(_this.idx)+1) );//1 2 3 4 5 底部标签
          var ip = new D.InvokeProc();
          ip.addBusiness(vBiz);
          console.log(JSON.stringify(ip))
          ip.invoke(function(d){
              if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
                  // todo...
                  //AC_RESULT1,AC_RESULT2,AC_RESULT3,AC_RESULT4
                  var AC_HEAD1 = vOpr1.getResult(d, "AC_RESULT1").rows;//表头信息
                  var AC_HEAD2 = vOpr1.getResult(d, "AC_RESULT2").rows;//动态表格标题
                  var AC_HEAD3 = vOpr1.getResult(d, "AC_RESULT3").rows;//动态表格数据
                  var AC_HEAD4 = vOpr1.getResult(d, "AC_RESULT4").rows;//已发货信息
                  console.error(AC_HEAD1)
                  console.error(AC_HEAD2)
                  console.error(AC_HEAD3)
                  // 2 he 3 结果集共同组成表格！有效字段  名称数量 ----》 重新处理下结果！！
                  console.error(AC_HEAD4)
                  const table = [];
                  for(let i = 0; i < AC_HEAD2.length;i++){
                    const obj = {'style':'','num':''};
                    const style = AC_HEAD2[i].field;
                    obj.num = AC_HEAD3[0][style]; 
                    obj.style = AC_HEAD2[i].title;
                    table.push(obj);
                  }
                  if(AC_HEAD4.length == 0){
                    _this.isSendDtl = false;
                  }

                  _this.dtl = AC_HEAD1;
                  _this.table = table;
                  _this.senddtl = AC_HEAD4;
                  if(AC_HEAD1[0].fabricactualarrivedate){
                       _this.datetime0 = AC_HEAD1[0].fabricactualarrivedate;
                  }
                  if(AC_HEAD1[0].accessoryactualarrivedate){
                        _this.datetime1 = AC_HEAD1[0].accessoryactualarrivedate;
                  }  
              } else {
                  // todo...[d.errorMessage]//AS_LOGINNAME,AS_LOGINPWD PHONEUSERLOGINQRY
                  console.log(d.errorMessage);
                  _this.ydui.alert({
                  'mes':d.errorMessage
                  });
              }
          })
        },
        showbitimg:function(src){
            this.showbigimg = src;
            this.isshowbigimg = true;
        },
        closebigimg(){
            this.isshowbigimg = false;
        }
    }
    
}
</script>
