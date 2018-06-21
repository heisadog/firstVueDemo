<template>
<div class="yd-flexview">
    <div class="g-scrollview">
      <addDtl :items="dtl,table"></addDtl>
      <div class="w98 addscolpart os">
          <div class="glin"></div>
           <div v-if="ordershow">
               <p class="shownum" v-for='data in dtl'>进仓时间:<span>{{data.jcsj}}</span></p>
                <div class="showtable" style='background-color: #f5f5f5;'>
                    <span v-for="data in lan1">{{data.style}}</span>
                </div>
                <div class="showtable" style="border-top:none">
                    <span v-for="data in lan1">{{data.num}}</span>
                </div>
                <div class="showtable" style="border-top:none;background-color: #f5f5f5;">
                    <span v-for="data in lan2">{{data.style}}</span>
                </div>
                <div class="showtable" style="border-top:none">
                    <span v-for="data in lan2">{{data.num}}</span>
                </div>
                <div class="showtable" style="border-top:none;background-color: #f5f5f5;">
                    <span v-for="data in lan3">{{data.style}}</span>
                </div>
                <div class="showtable" style="border-top:none;">
                    <span v-for="data in lan3">{{data.num}}</span>
                </div>
                <div v-if="ordershow" class="glin"></div>
           </div>

           <ul class="dtlshtime" v-for="data in dtl">
              <li><span>百分比：</span><span>{{data.percentage}}%</span></li>
              <div v-if="!ordershow" class="glin" style="margin-bottom:12px"></div>
              <li><span>工厂生产进度：</span><span>{{data.prodprogress}}</span></li>
              <div v-if="!ordershow" class="glin" style="margin-bottom:12px"></div>
              <li><span>接单时间：</span><span>{{data.takeorderdate}}</span></li>
              <li><span>同意延迟最终时间：</span><span>{{data.enddatetime}}</span></li>
              <li v-if="!ordershow"><span>第一次实际生产时间：</span><span>{{data.dycsjscsj}}</span></li>
              <li v-if="!ordershow"><span>最后实际生产时间：</span><span>{{data.zhsjscsj}}</span></li>
              <div class="glin"></div>
              <li style="padding-top:15px"><span>理单负责人：</span><span>{{data.arrangeuser}}</span></li>
              <li><span>跟单负责人：</span><span>{{data.trackuser}}</span></li>
              
          </ul>
      </div>
      </div>
      <addFooter :idx='idx'></addFooter>
  </div>
</template>
<script>
export default {
  data(){
      return{
          data:{},
          id:'',
          orderno:'',
          dycsjscsj:'',
          jcsj:'',
          percentage:'',
          zhsjscsj:'' ,
          dtl:[],// 详情的表头信息
          table:[], //详情的 表格数据  
          lan1:[],lan2:[],lan3:[],
          idx:'', 
          ordershow:false,
        }
  },
  mounted(){
      this.data = this.$route.query;
      this.idx = this.$route.query.footId;
      if(this.idx == 0) this.ordershow = true;
      this.getDtl();
  },
  methods:{
      getDtl:function(){

          //AS_USER_ID,AS_DEPT_ID,AS_FUNC_NAME,,,,,,,
            var _this = this; 
            var vBiz = new D.FYBusiness("PRODUCTIONSUMMARYDETAILQRY");
            var vOpr1 = vBiz.addCreateService("PRODUCTIONSUMMARYDETAILQRY", false);
            var vOpr1Data = vOpr1.addCreateData();
            vOpr1Data.setValue("AS_USER_ID", localStorage.loginname);
            vOpr1Data.setValue("AS_DEPT_ID", '');
            vOpr1Data.setValue("AS_FUNC_NAME", "PRODUCTIONSUMMARYDETAILQRY");
            vOpr1Data.setValue("AS_ID",_this.data.id);//主表ID
            vOpr1Data.setValue("AS_ORDERNO",_this.data.orderno );//主订单号
            vOpr1Data.setValue("AS_JCSJ",_this.data.jcsj );//进仓时间
            vOpr1Data.setValue("AS_PERCENTAGE",_this.data.percentage );//百分比
            vOpr1Data.setValue("AS_DYCSJSCSJ",_this.data.dycsjscsj );//1 2 第一次实际生产时间
            vOpr1Data.setValue("AS_ZHSJSCSJ",_this.data.zhsjscsj );//1 2  最后实际生产时间
            vOpr1Data.setValue("AS_OPRFLAG",Number(_this.data.footId)+1 );//1 2  底部标签 1-头批，2-追单
            var ip = new D.InvokeProc();
            ip.addBusiness(vBiz);
            console.log(JSON.stringify(ip))
            ip.invoke(function(d){
                if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
                    // todo...
                    let[re1,re2,re3,re4,re5] = [vOpr1.getResult(d, "AC_RESULT1").rows,vOpr1.getResult(d, "AC_RESULT2").rows,vOpr1.getResult(d, "AC_RESULT3").rows,vOpr1.getResult(d, "AC_RESULT4").rows,vOpr1.getResult(d, "AC_RESULT5").rows]
                    console.log(re1)
                    console.log(re2)
                    console.log(re3)
                    console.log(re4)
                    console.log(re5)
                    const table = [];
                    for(let i = 0; i < re2.length;i++){
                        const obj = {'style':'','num':''};
                        const style = re2[i].field;
                        obj.num = re3[0][style]; 
                        obj.style = re2[i].title;
                        table.push(obj);
                    }
                    _this.table = table;
                    _this.dtl = re1;
                    const lan1 = [];
                    for (let i = 0; i < 3; i++) {
                        const obj = {'style':'','num':''};
                        const style = re4[i].field;
                        obj.num = re5[0][style]; 
                        obj.style = re4[i].title;
                        lan1.push(obj);
                    }
                    const lan2 = [];
                    for (let i = 3; i < 6; i++) {
                        const obj = {'style':'','num':''};
                        const style = re4[i].field;
                        obj.num = re5[0][style]; 
                        obj.style = re4[i].title;
                        lan2.push(obj);
                    }
                    const lan3 = [];
                    for (let i = 6; i < 9; i++) {
                        const obj = {'style':'','num':''};
                        const style = re4[i].field;
                        obj.num = re5[0][style]; 
                        obj.style = re4[i].title;
                        lan3.push(obj);
                    }
                    _this.lan1 = lan1;
                    _this.lan2 = lan2;
                    _this.lan3 = lan3;
                } else {
                    // todo...[d.errorMessage]//AS_LOGINNAME,AS_LOGINPWD PHONEUSERLOGINQRY
                    console.log(d.errorMessage);
                    _this.ydui.alert({
                    mes:d.errorMessage
                    });
                }
            })
      }
  }
}
</script>

