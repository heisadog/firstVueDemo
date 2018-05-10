<template>
  <div class="loginbox" id="context">
      <div class="logo">
        <img src="../assets/logo.png" style="width:100px">
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
      <div class="denglu" id="login" @click="login">登 录</div>
    </div>
</template>
<script>
export default {
  data() {
      return {
        name: 'wfy',
        password: 'wfyerp',
      }
    },
  name: 'App',
  mounted(){
    
     },
  methods:{
    login(){
      var name = this.name;//由于 ajax中 thisthis指向不同啊 通过中间变量的方式 用
      basicUrl.AS_USERID = this.name;//由于 ajax中 this指向不同 可以将变量name 以同样的方式保存在 window对象 ！！刷新就不保存了
      var _this = this; //或者 变量保存this
      console.log(this.name);
      console.log(this.password);
      var pwd = this.password;
      if(name =='' || pwd ==''){
        this.ydui.alert({
          'mes':'请输入帐号和密码'
        })
        return;
      }
      $.ajax({
        type:'POST',
        url:basicUrl._wfy_url+'/FY_MOBILE_SVR/getEncryptPwd.json?pwd='+this.password+'&lname='+this.name,
        data: '',
        success:function(msg){
          console.log(msg)
          var vBiz = new D.FYBusiness("PHONEUSERLOGINQRY");
          var vOpr1 = vBiz.addCreateService("PHONEUSERLOGINQRY", false);
          var vOpr1Data = vOpr1.addCreateData();
          vOpr1Data.setValue("AS_USERID", '');
          vOpr1Data.setValue("AS_WLDM", '');
          vOpr1Data.setValue("AS_FUNC", "PHONEUSERLOGINQRY");
          vOpr1Data.setValue("AS_LOGINNAME", name);
          vOpr1Data.setValue("AS_LOGINPWD", msg.msg);
          var ip = new D.InvokeProc();
          ip.addBusiness(vBiz);
          console.log(JSON.stringify(ip))
          ip.invoke(function(d){
              if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
                  // todo...
                  var AC_HEAD = vOpr1.getResult(d, "AC_RESULT").rows;
                  console.log(AC_HEAD);
                  localStorage.loginname =  AC_HEAD[0].loginname
                  //_this.$router.push('/step1')
                  _this.$router.push('/addArder')
              } else {
                  // todo...[d.errorMessage]//AS_LOGINNAME,AS_LOGINPWD PHONEUSERLOGINQRY
                  console.log(d.errorMessage);
                  _this.ydui.alert({
                    'mes':d.errorMessage
                  });
              }
          }) ;
        }
      })
    },

  }
}
</script>

