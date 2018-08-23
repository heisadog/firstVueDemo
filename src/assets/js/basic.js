+(function($) {
    var Scroll = function(el) {
        this.container = $(el);
    }
    Scroll.prototype.isScrollLoad = function() {
        var container = this.container;
        var scrollHeight = container[0].scrollHeight; //内容高度
        var height = $(window).height() - 176; //窗口的高度
        var offsettop = container.offset().top; //滚动高度
        //var offsettop = container.offset().top ;
        console.log(scrollHeight)
        console.log(height)
        console.log(offsettop)
        return scrollHeight - (height + offsettop);
    }
    $.fn.Scroll = function() {
        var ss = new Scroll(this);
        return ss.isScrollLoad();
    }
})(jQuery)