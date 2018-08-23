<template>
  <div class="loginbox" id="context">
      <div class="logo">
        <img src="../../assets/logo2.png">
      </div>
      <div class="login_list" style="margin-top: 33px">
        <span>账号</span>
        <input type="text" id="uid" placeholder="请输入账号信息" v-model="name">
        <div class="logdel none">&#xe646</div>
      </div>
      <div class="login_list" style="margin-top: 15px">
        <span>密码</span>
        <input type="password" id="pwd" placeholder="请输入登录密码" v-model="password">
        <div class="logdel none">&#xe646</div>
      </div>
      <div class="login_list" style="margin-top: 15px">
        <span>帐套</span>
        <input type="" id="zt" placeholder="请选择帐套" readonly="readonly" @click="getZT">
        <div class="logdel none">&#xe646</div>
      </div>
      <div class="denglu" id="login" @click="login()">登 录</div>
      <div id="coverBackt" class="pf none covert" @click="closezt"></div>
      <div id="appAddrBox" class="selectBoxt thd ts200 os y100" style="z-index:100">
        <div class="item" style='text-align: center;' @click="checkzt(data.XTZTDM,data.XTDBMC)" v-for="data in zt" :data-xtdbmc='data.XTDBMC' :data-code='data.APPDZ' :data-xtztdm='data.XTZTDM'>{{data.XTDBMC}}</div>
      </div>
    </div>
    
</template>
<style>
#context{
  position: fixed
}
</style>
<script>
export default {
  data() {
      return {
        name: 'system',///wfyerp
        password: '666666',//wfyerp
        authtype:'',
        zt:[],
      }
    },
  name: 'App',
  mounted(){
    
     },
  methods:{
    getZT(){
        const _this = this;
        let params = {
          userName: _this.name || "",
          password: _this.password || ""
        };
        if(_this.name =='' || _this.password ==''){
          this.ydui.alert({
            'mes':'请输入帐号和密码'
          })
          return;
        }
        console.log(params);
        $.ajax({
          type: 'POST',
          url: basicUrl.oly_wfy_login_url+'?data=' + JSON.stringify(params),
          data: '',
          success:function(res){
            console.log(res)
            if(res && res.success){
              _this.authtype = res.authtype;
              localStorage.userid = res.userInfo[0].XTYHDM;
              localStorage.wldm = res.userInfo[0].XTWLDM; 
              if(res.authServiceUrl.length == 0){
                $('#zt').val(res.authServiceUrl[0].XTDBMC).attr('data-xtdbmc',res.authServiceUrl[0].XTDBMC).attr('data-code',res.authServiceUrl[0].APPDZ).attr('data-xtztdm',res.authServiceUrl[0].XTZTDM)
              }else{
                  let domAddr = "";
                  _this.zt =  res.authServiceUrl;
                  _this.showzt();
              }
            }else{
              _this.ydui.alert({
                'mes':res.errorMessage
              });
            }
          },
          error: function (info) {
            _this.ydui.alert({
              'mes':"连接失败！\n" + "网络错误，请稍后再试。"
            });
          }
        })
    },
    login(){
      const _this = this;
      if($('#zt').val() ==''){
        this.ydui.alert({
          'mes':'请先选择帐套'
        })
        return;
      }
      let params = {
          user_id:  _this.name || "",
          mac_address:'',
          pwd: _this.password || "",
          type: _this.authtype,
          account_id: $('#zt').attr("data-account_id"),
          comment: "",
          xtxtlx: "Z",
          xtxtdm: "sa",
          force_same_user_conn_close:false
        };
        console.log(params);
        _this.ydui.loading.open('正在登录...')
        $.ajax({
            type: 'POST',
            url: basicUrl.oly_wfy_login_check_url+'?data=' + JSON.stringify(params),
            data: '',
            success: function (msg) {
                console.log(msg);
                if(msg.success == false){
                    if(msg.errorMessage == "-8"){
                      _this.ydui.alert({
                        'mes':"登录失败，不允许重复用户登录！"
                      });
                      return;
                    }
                    if(msg.errorMessage == "-2"){
                      _this.ydui.alert({
                        'mes':"登录失败，超出最大用户数据！"
                      });
                      return;
                    }
                    if(msg.errorMessage == "-1"){
                       _this.ydui.alert({
                        'mes':"登录失败，没有获取到对应的操作权限！"
                      });
                      return;
                    }
                    if(msg.errorMessage == "-4"){
                       _this.ydui.alert({
                        'mes':"登录失败，超过最大用户数！"
                      });
                      return;
                    }
                    if(msg.errorMessage == "-5"){
                       _this.ydui.alert({
                        'mes':"登录失败，授权已过期！"
                      });
                      return;
                    }
                }else{
                  //成功的操作
                  _this.getWllist();
                }
            },
            error: function (info) {
                console.log(info.errorMessage);
                _this.ydui.alert({
                  'mes':"登录失败！\n" + "网络错误，请稍后再试。"
                });
            }
        });
    },
    showzt(){
      $('#coverBackt').removeClass('none');
      $('#appAddrBox').removeClass('y100');
    },
    closezt(){
      $('#coverBackt').addClass('none');
      $('#appAddrBox').addClass('y100').html('');
    },
    checkzt(dm,mc){
      console.log(dm,mc)
      $('#zt').val(mc).attr('data-account_id',dm);
      this.closezt();
    },
    getWllist(){
      // $(this).singleSelect({
      //       dom: '<div class="item tc">ss</div>',
      //   });
      const _this = this;
      let vBiz = new D.FYBusiness("biz.xtwl.qry.list");
      let vOpr1 = vBiz.addCreateService("svc.xtwl.qry.list", false);
      let vOpr1Data = vOpr1.addCreateData();
      vOpr1Data.setValue("AS_USERID", localStorage.userid);
      vOpr1Data.setValue("AS_WLDM", localStorage.wldm);
      vOpr1Data.setValue("AS_FUNC", "svc.xtwl.qry.list");
      let ip = new D.InvokeProc();
      ip.addBusiness(vBiz);
      _this.isShowConsolelog ? console.log(JSON.stringify(ip)) :'';
      ip.invoke(function(d){
          if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
              // todo...
              let wllist = vOpr1.getResult(d, "AC_WLLIST").rows;
              _this.$store.commit('upWldmList',wllist); 
              localStorage.wllist = JSON.stringify(wllist);
              _this.isShowConsolelog ? console.log(wllist) :'';
              _this.getCKlist();
          } else {
              // todo...[d.errorMessage]
              _this.isShowConsolelog ? console.log(d.errorMessage) :'';
              _this.ydui.alert({
                'mes':'登录失败，获取门店失败'
              })
          }
      }) ;
    },
    getCKlist(){
      const _this = this;
      var vBiz = new D.FYBusiness("biz.xtck.qry.list");
      var vOpr1 = vBiz.addCreateService("svc.xtck.qry.list", false);
      var vOpr1Data = vOpr1.addCreateData();
      vOpr1Data.setValue("AS_USERID", localStorage.userid);
      vOpr1Data.setValue("AS_WLDM", localStorage.wldm);
      vOpr1Data.setValue("AS_FUNC", "svc.xtck.qry.list");
      var ip = new D.InvokeProc();
      ip.addBusiness(vBiz);
      _this.isShowConsolelog ? console.log(JSON.stringify(ip)) :'';
      ip.invoke(function(d){
          if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
              // todo...
              let cklist = vOpr1.getResult(d, "AC_CKLIST").rows;
              _this.$store.commit('upStockList',cklist); 
              localStorage.cklist = JSON.stringify(cklist);
              _this.isShowConsolelog ? console.log(cklist) :'';
              _this.ydui.loading.close();
              _this.$router.push({path:'./sale',query:{'title':'销售业绩查询'}})
          } else {
              // todo...[d.errorMessage]
              _this.isShowConsolelog ? console.log(d.errorMessage) :'';
              _this.ydui.alert({
                'mes':'登录失败，获取仓库失败'
              })
          }
      }) ;
    }
  }
}
</script>
