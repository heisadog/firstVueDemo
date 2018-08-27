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
};
export { fun }