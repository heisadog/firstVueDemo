<template>
  <div class="loginbox" id="context">
      <div class="logo" style="margin-top:100px">
        <img src="../../assets/logo3.jpg">
      </div>
      <div class="login_list" style="margin-top: 63px">
        <span>账号</span>
        <input type="text" id="uid" placeholder="请输入账号信息" @keyup="useinfocheck" v-model="name">
        <div class="logdel none">&#xe646</div>
      </div>
      <div class="login_list" style="margin-top: 15px">
        <span>密码</span>
        <input type="password" id="pwd" placeholder="请输入登录密码" v-model="password">
        <div class='logdel none' id="jizhu" @click="jizhu"><span>&#xe71e</span>记住密码</div>
      </div>
      <div class="login_list" style="margin-top: 15px">
        <span>帐套</span>
        <input type="" id="zt" placeholder="请选择帐套" unselectable="on" onfocus="this.blur()" readonly="readonly" @click="getZT">
        <div class="logdel none">&#xe646</div>
      </div>
      <div class="denglu" id="login" @click="login()">登 录</div>
      <div id="coverBackt" class="pf none covert" @click="closezt"></div>
      <div id="appAddrBox" class="selectBoxt thd ts200 os y100" style="z-index:100">
        <div class="item" style='text-align: center;font-weight: 900;
    color: #1a1a1a;' @click="checkzt(data.APPDZ,data.XTZTDM,data.XTDBMC)" v-for="data in zt" :data-xtdbmc='data.XTDBMC' :data-code='data.APPDZ' :data-xtztdm='data.XTZTDM'>{{data.XTDBMC}}</div>
      </div>
    </div>
    
</template>
<style>
#context{
  position: fixed
}
</style>
<script>
import { fun } from './fun.js';
export default {
  data() {
      return {
        name: '',///system
        password: '',//666666
        authtype:'',
        zt:[],
        mimaarr:[],
        oly_check:'',//是否有记住密码的标注
      }
    },
  name: 'App',
  mounted(){
        this.$nextTick(function() {
          //从本地存数去取是否有记住密码的标识
          if(localStorage.ishascheck){
            this.oly_check = localStorage.ishascheck
          }else{
            this.oly_check = false;
          }
          if(localStorage.user){
            this.mimaarr = JSON.parse(localStorage.user)
          }
          console.log(this.oly_check);
          if(this.oly_check){
            $('#jizhu').addClass('oly_check');
          }else{
            $('#jizhu').removeClass('oly_check');
          }
        })
     },
  methods:{
    //检测输入的帐号是否存在于 记录中
    useinfocheck(){
      let uid = this.name;
      let useinfo = [];
      if(localStorage.user){
          useinfo = JSON.parse(localStorage.user)
      }else{
        useinfo = [{'uid':'周星驰','pwd':'9527'}]
      }
      for(let i = 0; i<useinfo.length;i++){
        if(uid == useinfo[i].uid){
          this.password = useinfo[i].pwd;
        }
      }
    },
    jizhu(){
      if($('#jizhu').hasClass('oly_check')){
        $('#jizhu').removeClass('oly_check');
        this.oly_check = false;
      }else{
        $('#jizhu').addClass('oly_check');
        this.oly_check = true;
      }
      console.log(this.oly_check);
    },
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
              if(res.authServiceUrl.length == 1){
                $('#zt').val(res.authServiceUrl[0].XTDBMC).attr('data-xtdbmc',res.authServiceUrl[0].XTDBMC).attr('data-code',res.authServiceUrl[0].APPDZ).attr('data-xtztdm',res.authServiceUrl[0].XTZTDM).attr('data-account_id',res.authServiceUrl[0].XTZTDM)
                localStorage.APPSVR = $('#zt').attr('data-code')+'/WFY_UNI_SERVICE.json?method=callProcService'
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
      $('#appAddrBox').addClass('y100')
    },
    checkzt(url,dm,mc){
      console.log(dm,mc)
      $('#zt').val(mc).attr('data-account_id',dm);
      $('#zt').attr('data-url',url);
      localStorage.APPSVR = $('#zt').attr('data-url')+'/WFY_UNI_SERVICE.json?method=callProcService'
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


// 记住密码的操作 
                  /*
                如果 有  记住密码的标识 就 判断 改帐号密码是否已经存在 mimaarr 中，不存在就添加
                如果 没有 记住密码的标识 就 判断 改帐号密码是否已经存在 mimaarr 中，存在 就 删除
                  */ 
                  // var obj = {'uid':_this.name,'pwd':_this.password};
                  // localStorage.ishascheck = _this.oly_check;
                  // if(_this.oly_check){
                  //   if(JSON.stringify(_this.mimaarr).indexOf(JSON.stringify(obj)) === -1){
                  //     //bu cun zai 不存在
                  //     console.log('相等');
                  //     _this.mimaarr.push(obj)
                  //     localStorage.user = JSON.stringify(_this.mimaarr)//更新本地存储的 帐号信息
                  //   }
                  // }else{
                  //   if(JSON.stringify(_this.mimaarr).indexOf(JSON.stringify(obj)) != -1){
                  //     //cun zai 存在
                  //     console.log('不相等');
                  //     fun.removeObjWithArr(_this.mimaarr,obj)
                  //     localStorage.user = JSON.stringify(_this.mimaarr)//更新本地存储的 帐号信息
                  //   }else{
                  //     console.log('不记住密码，不存在');
                  //   }
                  // }
                  var obj = {'uid':_this.name,'pwd':_this.password};
                  if(JSON.stringify(_this.mimaarr).indexOf(JSON.stringify(obj)) === -1){
                      //bu cun zai 不存在
                      console.log('相等');
                      _this.mimaarr.push(obj)
                      localStorage.user = JSON.stringify(_this.mimaarr)//更新本地存储的 帐号信息
                    }
                  console.log(_this.mimaarr);
                  console.log(_this.oly_check);


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
