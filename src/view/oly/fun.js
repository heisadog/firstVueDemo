const fun = {};
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
};
export { fun }