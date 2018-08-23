import Vue from 'vue';

function replaceAll(str) {
    if (str != null) {
        str = str.replace(/%/g, "％");
        str = str.replace(/&/g, "＆");
        str = str.replace(/>/g, "＞");
        str = str.replace(/</g, "＜");
        str = str.replace(/\"/g, "“");
        str = str.replace(/\'/g, "‘");
        str = str.replace(/\</g, "〈");
        str = str.replace(/\>/g, "〉");
        str = str.replace(/\%/g, "％");
        str = str.replace(/\#/g, "＃");
        str = str.replace(/\	/g, "，");
        str = str.replace(/(^\s*)|(\s*$)/g, ''); //去两端的空格
    }
    return str;
}
/**
 * 取有效字符串
 * @param str
 * @returns
 */
function getValidStr(str) {
    str += "";
    if (str == "undefined" || str == "null" || str.toUpperCase() == "NULL")
        return "";
    else
        return replaceAll(str);
}

var D = {

    InvokeProc: function(notSync, type) {
        // 这里是Business的调用
        // 调用的数据，是多个Business的数组
        this.business = [];
        this.ServerUrl = "";
        this.timeout = 30000;
        this.datatype = 'json';
        this.methodtype = 'POST';
        this.async = getValidStr(notSync) ? true : false;
        this.servicename = '';
        this.senddata = '';
        this.svc = "P";
        this.results = [];
        this.resultType = type;

        this.getBizCount = function() {
            return this.business.length;
        };
        this.addBusiness = function(business) {
            this.business.push(business);
        };

        this.invoke = function(funcCallback, params) {
            var _this = this;
            switch (this.resultType) {
                // case "proc":
                //     this.ServerUrl = _wfy_uni_proc_url;
                //     break;
                // case "treegrid":
                //     this.ServerUrl = _wfy_uni_treegrid_url;
                //     break;
                // case "expxls":
                //     this.ServerUrl = _wfy_uni_export_url;
                //     break;
                // case "openid":
                //     this.ServerUrl = _wfy_openid_url;
                //     break;
                default: this.ServerUrl = basicUrl._wfy_uni_proc_url;
                break;
            }
            $.ajax({
                type: "POST", //this.MethodType,
                url: this.ServerUrl,
                timeout: this.timeout,
                dataType: this.datatype,
                async: true,
                data: "&data=" + JSON.stringify(this.business), //this.SendData,
                beforeSend: function() {
                    //
                },
                complete: function(data) {
                    $('.datagrid-mask-msg').remove();
                    $('.datagrid-mask').remove();
                },
                success: function(msg) {
                    //console.info(msg);
                    funcCallback(msg, params);
                },
                error: function(info, b, c) {
                    if (info.readyState == 0 && info.status == 0) {
                        return false;
                    } else {
                        console.error(JSON.stringify(info), _this);
                    }
                },
                complete: function(XMLHttpRequest, status) {
                    //util.alert("连接超时" + _this.servicename);
                }
            });
        };
        return;
    },
    FYBusiness: function(businessNo) {
        this.businessno = businessNo;
        this.exptype = "";
        this.body = {};

        this.setExptype = function(exptype) {
            this.exptype = exptype;
        };
        this.addService = function(svc) {
            svc.setBusinessNo(this.businessno);
            this.body[svc.getServiceName()] = svc;
        };
        this.addCreateService = function(svcName, isInit) {
            var svc = new D.FYService(svcName, isInit);
            svc.setBusinessNo(this.businessno);
            this.addService(svc);
            return svc;
        };
        this.isNull = function() {
            var i = 0;

            for (var p in this.body) {
                i += this.body[p].getDataCount();
            }

            return (0 == i);
        };
    },
    FYService: function(svcName, isInit) {
        var ServiceName = svcName; //.toUpperCase();
        var BusinessNo = "";
        this.TemplateType = "";
        this.TemplateKind = "";

        // 数据对象
        this.data = [];
        this.init = (isInit) ? true : false;
        this.getDataCount = function() {
            try {
                return this.data.length;
            } catch (e) {
                return 0;
            }
        };
        this.setExpTemplate = function(templatetype, templatekind) {
            this.TemplateType = templatetype;
            this.TemplateKind = templatekind;
        };
        this.getServiceName = function() { return ServiceName; };
        this.setBusinessNo = function(businessNo) { BusinessNo = businessNo; };
        this.getBusinessNo = function() { return BusinessNo; };

        // 仅对单Business执行有效
        this.getResult = function(d, retName) {
            return this.getResults(d)[retName];
        };
        // 仅对单Business执行有效
        this.getResults = function(d) {
            return d["procExecResults"][this.getServiceName()]["resultList"];
        };
        // 仅对单Business执行有效
        this.getOutputPermeterMap = function(d) {
            return d["procExecResults"][this.getServiceName()]["outputMap"];
        };
        // 仅对单Business执行有效
        this.getOutputPermeterMapValue = function(d, f) {
            return getValidStr(this.getOutputPermeterMap(d)[f]);
        };

        // 仅对多Business执行有效
        this.getMultiBusinessResults = function(d) {
            var businessIndex = -1;
            var businessList = d.requestNo.split(";");
            for (var i = 0; i < businessList.length; i++) {
                var busi = businessList[i].split(":");
                if (busi[1] == this.getBusinessNo()) {
                    businessIndex = busi[0];
                    break;
                }
            }
            if (businessIndex < 0) {
                return null;
            }

            try {
                return d.bussOutList[businessIndex].procExecResults[this.getServiceName()].resultList;
            } catch (e) {
                console.error(e);
                return null;
            }
        };
        // 仅对多Business执行有效
        this.getMultiBusinessResult = function(d, retName) {
            var results = this.getMultiBusinessResults(d);
            if (results) {
                return (results[retName]);
            } else {
                return null;
            }
        };
        // 仅对多Business执行有效
        this.getMultiBusinessOutputPermeterMap = function(d) {
            var bn = this.getBusinessNo();
            var businessIndex = -1;
            var businessList = d.requestNo.split(";");
            for (var i = 0; i < businessList.length; i++) {
                var busi = businessList[i].split(":");
                if (busi[1] == this.getBusinessNo()) {
                    businessIndex = busi[0];
                    break;
                }
            }
            if (businessIndex < 0) {
                return null;
            }

            try {
                return d.bussOutList[businessIndex].procExecResults[this.getServiceName()].outputMap;
            } catch (e) {
                console.error(e);
                return null;
            }
        };
        // 仅对多Business执行有效
        this.getMultiBusinessOutputPermeterMapValue = function(d, f) {
            return getValidStr(this.getMultiBusinessOutputPermeterMap(d)[f]);
        };


        this.addData = function(dataObject, fieldsRel) {
            var obj = new Object();

            if (fieldsRel) {
                var fieldsRelArray = fieldsRel.split(";");
                for (var i = 0; i < fieldsRelArray.length; i++) {
                    var fieldRelArray = fieldsRelArray[i].split("=");
                    eval("obj." + (fieldRelArray[0]).toUpperCase() + " = dataObject." + fieldRelArray[fieldRelArray.length - 1]);
                }
            } else {
                for (var property in dataObject) {
                    eval("obj." + (property).toUpperCase() + " = dataObject." + property);
                }
            }

            if (this.init) {
                if (!obj.hasOwnProperty(_wfy_proc_default_param_user)) { obj[_wfy_proc_default_param_user] = getValidStr(LoginName); }
                if (!obj.hasOwnProperty(_wfy_proc_default_param_dept)) { obj[_wfy_proc_default_param_dept] = getValidStr(DepartmentCode); }
                if (!obj.hasOwnProperty(_wfy_proc_default_param_func)) { obj[_wfy_proc_default_param_func] = this.getServiceName(); }
            }


            this.data.push(obj);
        };

        this.addDataArray = function(dataObjectArray, fieldsRel) {
            for (var i = 0; i < dataObjectArray.length; i++) {
                this.addData(dataObjectArray[i], fieldsRel);
            }
        };

        this.addCreateData = function() {
            var dataObj = new D.FYData(this.init, this.getServiceName());
            this.data.push(dataObj);
            return dataObj;
        };

        this.appendData = function(fyData) {
            if (!fyData instanceof FYData) {
                alert("参数不正确！");
                return;
            }
            this.data.push(fyData);
        }
    },
    FYData: function(isInit, svcName) {
        this.setValue = function(f, v) {
            this[f] = v;
        };
        this.getValue = function(f) {
            return this[f];
        };
        if (isInit) {
            this.setValue(basicUrl._wfy_proc_default_param_user, getValidStr(Vue.prototype.LoginName));
            this.setValue(basicUrl._wfy_proc_default_param_dept, getValidStr(Vue.prototype.DepartmentCode));
            this.setValue(basicUrl._wfy_proc_default_param_func, (svcName) ? svcName : "");
        };
    },
    CallService: function(requestName, vurl) {
        this.callurl = "";
        if (getValidStr(vurl) == "") {
            this.callurl = _wfy_uni_url + "?method=" + requestName;
        } else {
            this.callurl = vurl + "?method=" + requestName;;
        }
        this.invoke = function(postJson, successCallFunc, errorCallFunc, isAsync) {
            var callIsAsync;
            if (getValidStr(isAsync) == "") {
                callIsAsync = false;
            } else {

                if (isAsync == true) {
                    callIsAsync = true;
                } else {
                    callIsAsync = false;
                }
            }
            //console.error(postJson);
            $.ajax({
                url: this.callurl,
                type: 'post',
                async: callIsAsync,
                datatype: "json",
                data: JSON.stringify(postJson),
                success: function(data) {
                    successCallFunc(data);
                },
                error: function(data) {
                    errorCallFunc(data);
                }
            });
        }
    },
    testdom: function() {
        console.log('dao.js')
    }
}
window.D = D
export default D;