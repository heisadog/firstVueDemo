const fun = {};
var now = new Date(); //当前日期
var time = {
    now: now, //当前日期
    nowDay: now.getDate(), //当前日
    nowDayOfWeek: now.getDay(), //
    nowMonth: now.getMonth(), //
    nowYear: now.getFullYear(), //
}
fun.allclear = function() {
    $('.topSearchBox').find('input').val('');
}
fun.sear = function() {
    $('#cover').removeClass('none');
    $('#search').removeClass('y_100');
}
fun.csear = function() {
    $('#cover').addClass('none');
    $('#search').addClass('y_100');
}
fun.zero = function(res) {
    return '<div style="line-height:100px;text-align: center;">暂无查询数据！</div>'
}
fun.empty = function(cont) {
    return cont == 'null' || cont == null || typeof(cont) == "undefined" || cont == "undefined" || cont == "" ? true : false; //区分于之前的empty ，并修改逻辑思维
}
fun.setTwoNum = function(price, n) {
    // if(price<0){ price = 0 };
    return isNaN(price) ? 0 : (fun.empty(n) ? new Number(price).toFixed(2) : new Number(price).toFixed(n));
}
fun.removeObjWithArr = function(_arr, _obj) {
    var length = _arr.length;
    for (var i = 0; i < length; i++) {
        if (_arr[i] == _obj) {
            if (i == 0) {
                _arr.shift(); //删除并返回数组的第一个元素
                return;
            } else if (i == length - 1) {
                _arr.pop(); //删除并返回数组的最后一个元素
                return;
            } else {
                _arr.splice(i, 1); //删除下标为i的元素
                return;
            }
        }
    }
}
fun.format = function(fmt, date) {
    fmt = (fmt || '') + '';
    date = new Date(date || new Date());
    var map = {};
    map['M+'] = date.getMonth() + 1;
    map['d+'] = date.getDate();
    map['h+'] = date.getHours();
    map['m+'] = date.getMinutes();
    map['s+'] = date.getSeconds();
    map['q+'] = Math.floor((date.getMonth() + 3) / 3);
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    if (/(W+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, ['日', '一', '二', '三', '四', '五', '六'][date.getDay()]);
    if (/(S+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, date.getMilliseconds() + '');
    for (var key in map)
        if (new RegExp('(' + key + ')').test(fmt))
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? map[key] : ('00' + map[key]).substr(('' + map[key]).length));
    return fmt;
    //wfy.format('yyyy-MM-dd hh-mm-ss',new Date())
}
fun.getMonthStartDate = function() {
    var monthStartDate = new Date(time.nowYear, time.nowMonth, 1);
    return this.formatDate(monthStartDate, '-');
}
fun.formatDate = function(date, symbol) {
    //symbol 链接符号 默认 不写为空 20180831格式~~~
    var myyear = date.getFullYear();
    var mymonth = date.getMonth() + 1;
    var myweekday = date.getDate();
    if (mymonth < 10) {
        mymonth = "0" + mymonth;
    }
    if (myweekday < 10) {
        myweekday = "0" + myweekday;
    }
    if (!symbol) symbol = '';
    return (myyear + symbol + mymonth + symbol + myweekday); //----------
}
export { fun }