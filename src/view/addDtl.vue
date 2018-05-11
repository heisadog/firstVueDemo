<template>
  <div></div>
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
          zhsjscsj:''      
        }
  },
  mounted(){
      this.data = this.$route.query;
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
            vOpr1Data.setValue("AS_OPRFLAG",_this.data.footId );//1 2  底部标签 1-头批，2-追单
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

