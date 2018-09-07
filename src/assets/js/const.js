const _wfy_url = 'http://kf.pb89.com:8087'; //192.168.20.102:8083 //202.98.38.50:18088
const oly_wfy_url = 'http://203.2.112.22:18080';
//const _wfy_uni_url = _wfy_url + "/FY_APP_SVR/WFY_UNI_SERVICE.json"; //三层地址
const _wfy_uni_url = oly_wfy_url + "/FY_APP_SVR/WFY_UNI_SERVICE.json"; //三层地址----欧莱雅
const basicUrl = {
    '_wfy_url': _wfy_url,
    '_wfy_uni_proc_url': _wfy_uni_url + "?method=callProcService", // 中间供调用过程的服务 
    '_wfy_mobile_api_upload_url': _wfy_url + '/FY_APP_SVR/servlet/Base64FtpUploadPic', //图片上传
    '_wfy_load_url': _wfy_url + '/FY_APP_SVR/getEncryptPwd.json', //登录
    //欧莱雅 用到的链接
    'oly_wfy_login_url': oly_wfy_url + "/FY_APP_SVR/loginCheckFordrp.json", //登录获取门店信息等
    'oly_wfy_login_check_url': oly_wfy_url + "/FY_APP_SVR/reg.json", //登录验证
}

//设置给全局
window.basicUrl = basicUrl;
const htmlHeight = document.body.clientHeight;
document.getElementsByTagName('html')[0].style.height = (htmlHeight - 0) + 'px';
//2018-8-23 为欧莱雅添加 未单独处理
//you 选择帐套的 操作所以 用本地存数 并改了 dao.js的相应内容
//localStorage.APPSVR = basicUrl._wfy_uni_proc_url;
Array.prototype.getindex = function(val) {
        for (var i = 0; i < this.length; i++) {

            if (this[i] == val) {
                return i;
            }
        }
    }
    //删除 数组中的 某个 值
Array.prototype.remove = function(val) {
    var index = this.getindex(val);
    this.splice(index, 1); //splice是数组自带的函数,会改变 原数组！
}