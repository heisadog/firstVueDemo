const _wfy_url = 'http://192.168.20.102:8083'; //192.168.20.102:8083 //202.98.38.50:18088
const _wfy_uni_url = _wfy_url + "/FY_APP_SVR/WFY_UNI_SERVICE.json"; //三层地址
const basicUrl = {
    '_wfy_url': _wfy_url,
    '_wfy_uni_proc_url': _wfy_uni_url + "?method=callProcService", // 中间供调用过程的服务 
    '_wfy_mobile_api_upload_url': _wfy_url + '/FY_APP_SVR/servlet/Base64FtpUploadPic', //图片上传
}

//设置给全局
window.basicUrl = basicUrl;