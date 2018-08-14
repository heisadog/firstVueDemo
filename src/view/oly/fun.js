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
export { fun }