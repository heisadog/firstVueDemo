/*
 *基于jquery 格式的 插件封装
 * 2017.8.23
 * 分为必须要有的 插件 和 按需添加的插件
 * */
+(function($) {
    /*
     * 重新封装 tap事件，形式趋向于jquery，习惯使用！
     * */
    $.fn.tap = function(call) {
        return this.each(function() {
            $(this).on("touchstart", function(e) {
                var touches = e.touches;
                startTx = e.originalEvent.targetTouches[0].pageX;
                startTy = e.originalEvent.targetTouches[0].pageY;
            })
            $(this).on("touchend", function(e) {
                var touches = e.changedTouches,
                    endTx = e.originalEvent.changedTouches[0].pageX,
                    endTy = e.originalEvent.changedTouches[0].pageY;
                if (Math.abs(startTx - endTx) < 6 && Math.abs(startTy - endTy) < 6) { //Math.abs 返回 绝对值
                    call(this);
                }
            })
        })
    }
    $.fn.longPress = function(fn) {
        return this.each(function() {
            var timeout;
            var _this = this;
            $(this).on("touchstart", function(e) {
                timeout = setTimeout(function() {
                    fn(_this)
                }, 800); //长按时间超过800ms，则执行传入的方法
            })
            $(this).on("touchend", function(e) {
                clearTimeout(timeout);
            })
        })
    }
})(jQuery)


/*----------------------------按需加载的 各个效果插件----------------*/

/*-------------------插件化的 顶部   和  插件化的页脚------------------*/
+
(function($) {
    $.fn.header = function(options) {
        var defaults = {
            title: "主题展示",
        }
        var opt = $.extend({}, defaults, options);
        return this.each(function() {
            var but1 = '<div id="back" class="head_back">&#xe607</div>';
            var title = '<span id="headtitle">' + opt.title + '</span>';
            var but2 = '<div id="more" class="head_more">&#xe602</div>';
            var html = but1 + title + but2;
            $(this).append(html);
        })
    }
    $.fn.footer = function(options) {
        var defaults = {
            butName: ["首页", '物流', '库存', '销售', '我的'],
            butIcon: ['&#xe778', '&#xe883', '&#xe778', '&#xe778', '&#xe8c8'],
            butUrl: ['', '', '', '', ''],
            butCheck: 0,
            butCss: {
                color: "#666",
                backgroundColor: "#FFF",
            },
            callback: ''
        };
        var opt = $.extend({}, defaults, options);
        // var callback = opt.callback;
        return this.each(function() {
            var forhtml = '';
            for (var i = 0; i < opt.butName.length; i++) {
                forhtml += '<div data-url="' + opt.butUrl[i] + '" class="footer_div"><div class="footer_icon_div"><i>' + opt.butIcon[i] + '</i><p>' + opt.butName[i] + '</p></div></div>';
            }
            var html = '<footer class="">' + forhtml + '</footer>';
            $(this).append(html);
            $(this).find("footer").css('background-color', opt.butCss.backgroundColor).css('color', opt.butCss.color);
            $(this).find("footer div.footer_div").eq(opt.butCheck).addClass("main_color");
            $(this).find("footer div.footer_div").css('width', 100 / opt.butName.length + "%");
            $(this).find("footer div.footer_div").on('click', function() {
                //wfy.showload("页面加载中...")
                if (typeof opt.callback === 'function') {
                    opt.callback(this);
                }
            })
        })
    }
    $.fn.taber = function(cfg) {
        this.tabcfg = {
            cont: cfg.cont || [],
            data: cfg.data || [],
            para1: cfg.para1 || [], //需求特地加的参数~~
            callback: cfg && cfg.callback ? cfg.callback : null,
        }
        var $this = $(this);
        var chileLen = this.tabcfg.cont.length;
        var cont = this.tabcfg.cont;
        var data = this.tabcfg.data;
        var para1 = this.tabcfg.para1;
        var callback = this.tabcfg.callback;
        var chileDom = '';
        for (var i = 0; i < chileLen; i++) {
            chileDom += '<div class="gx_taber" data-type = "' + data[i] + '" data-para1="' + para1[i] + '">' + cont[i] + '</div>';
        }
        $this.html('');
        $this.html(chileDom);
        $this.find('div.gx_taber').eq(0).addClass('gx_taberbox_check');
        $this.find('div.gx_taber').css('width', 100 / chileLen + "%");
        $this.find('div.gx_taber').on('click', function() {
            $this.find('div.gx_taber').removeClass('gx_taberbox_check');
            $(this).addClass('gx_taberbox_check');
            console.log(0);
            if (typeof callback === 'function') {
                callback(this);
            }
        })
    }
})(jQuery) +
(function($) {
    var Scroll = function(el) {
        this.container = $(el);
    }
    Scroll.prototype.isScrollLoad = function() {
        var container = this.container;
        var scrollHeight = container[0].scrollHeight;
        var height = $(window).height();
        var offsettop = container.offset().top > 0 ? container.offset().top : container.offset().top * (-1);
        //var offsettop = container.offset().top ;
        return scrollHeight - (height + offsettop);
    }
    $.fn.Scroll = function() {
        var ss = new Scroll(this);
        return ss.isScrollLoad();
    }
})(jQuery) +
(function($) {
    //实现对滑动控件属性的设置、事件的监听、以及设置回调函数
    $.fn.RangeSlider = function(cfg) {
        this.sliderCfg = {
            min: cfg && !isNaN(parseFloat(cfg.min)) ? Number(cfg.min) : null,
            max: cfg && !isNaN(parseFloat(cfg.max)) ? Number(cfg.max) : null,
            step: cfg && Number(cfg.step) ? cfg.step : 1,
            callback: cfg && cfg.callback ? cfg.callback : null
        };

        var $input = $(this);
        var min = this.sliderCfg.min;
        var max = this.sliderCfg.max;
        var step = this.sliderCfg.step;
        var callback = this.sliderCfg.callback;

        $input.attr('min', min)
            .attr('max', max)
            .attr('step', step);

        $input.on("input", function(e) {
            $input.attr('value', this.value);
            //$input.css( 'background', 'linear-gradient(to right, #059CFA, white ' + (this.value/255) + '%, white)' );
            //Math.round(result[i].kcssje / je * 10000) / 100.00
            $input.css('background-size', (Math.round(this.value / max * 10000) / 100.00) + '% 100%');

            if (typeof callback === 'function') {
                callback(this);
            }
        });
        //用法：$(this).RangeSlider({ min: 0,   max: 255,  step: 1,  callback: change});
        // var change = function(input){...}  change作为 回调 ，input参数即整个节点。
    };
})(jQuery)
//换肤 出现一个问题：起初border 设置的时候带有 1px solid 这是多余的。直接设置bordercolor
+
(function($) {
    var Theme = function(ele, opt) {
        this.$elem = ele,
            this.defaults = {
                'color': '',
                'bgcolor': '',
                'borcolor': '',
                'borbot': ''
            },
            this.options = $.extend({}, this.defaults, opt)
    };
    Theme.prototype.setCss = function() {
        var cssste = { 'color': this.options.color, 'backgroundColor': this.options.bgcolor, 'borderColor': '' + this.options.borcolor + '', 'borderBottomColor': '' + this.options.borbot + '' };
        this.$elem.css(cssste);
    }
    $.fn.theme = function(options) {
        var t = new Theme(this, options);
        return t.setCss()
    }
    $.fn.themeinit = function(str) {
            return this.each(function() {
                $(this).find('.themeTextColor').theme({ "color": str });
                $(this).find('.themeBgColor').theme({ "bgcolor": str });
                $(this).find('.themeBorderColor').theme({ "borcolor": str, "borbot": str }); //边框 需要带底边
                $(this).find('.themeBorderBotColor').theme({ "borbot": str }); //
            })
        }
        /*
         * 使用方法：
         * 1.defaults设值都是空，保证了theme()函数没有参数不会起作用。并且实现传入哪个参数，相对应的参数起作用！
         * 2.themeinit()函数 对应的 四个类名。在html中添加即可 （一一对应）
         * 3.themeinit()函数设置后，可以用theme()函数单独再次设置
         * 4.theme()参数为对象格式 如$("#tab").theme({"color":"#f00"});
         * 5.themeinit() 参数为 字符串（颜色值） 如 $("body").themeinit("#000"); 全局换肤给body添加事件，亦可单独页面换肤
         * */
})(jQuery) +
(function($) {
    var Select = function(ele, opt) {
        this.$elem = ele,
            this.defaults = {
                'show': true, // 遮罩层 是否显示黑色 背景
                'dom': '', //传进来的 dom结构  字符串的形式
                'maxheight': 70, // 显示内容的高度  默认70%
                'mul': true, //默认是单选的
                'call': ''
            },
            this.options = $.extend({}, this.defaults, opt)
    }
    Select.prototype.coverdom = function() {
        return '<div id="coverBack" class="jqex_cover none ' + (this.options.show ? "jqex_cover_black" : " ") + '"></div>';
    }
    Select.prototype.selectdom = function() {
        return '<div id="multi_box" class="jqex_selectBox y100 thd ts200 os" style="max-height:' + this.options.maxheight + '%">' + this.options.dom + '</div>';
    }
    Select.prototype.selectdom_s = function() {
        return '<div id="multi_box" class="jqex_selectBox y100 thd ts200" style="max-height:' + this.options.maxheight + '%">' +
            '<div class="os jqex_multi_box" style="height: 400px">' + this.options.dom + '</div>' +
            '<div style="height: 50px"></div>' +
            '<ul class="jqex_btn thd ts200">' +
            '<li id="jqex_all">全选</li>' +
            '<li id="jqex_allclose">全清</li>' +
            '<li id="jqex_sure">确定</li>' +
            '<li id="jqex_close">取消</li>' +
            '</ul>' +
            '</div>';
        // jqex_multi_box 的高度 用 calc 不好使？ ！
    }

    Select.prototype.init = function() {
        //第一次执行的时候 加载 dom结构， 之后 只需要控制 是否显示
        if ($('#coverBack').length == 0) {
            $('body').append(this.coverdom());
            // if(this.options.mul){
            //     $('body').append(this.selectdom());
            // }else {
            //     $('body').append(this.selectdom_s());
            // }
        }
    }
    Select.prototype.showSelect = function() {
        this.init();
        setTimeout(function() {
            $('#coverBack').removeClass('none');
            $('#multi_box').removeClass('y100');
        }, 50)
    }
    Select.prototype.closeSelect = function() {
        $('#coverBack').addClass('none');
        $('#multi_box').addClass('y100');
        $('#multi_box').remove();
    }
    $.fn.closeSelect = function(options) {
            var select = new Select(this, options);
            return select.closeSelect();
        }
        // 单选 比如选个仓库 选完后自动关闭弹窗（）
    $.fn.singleSelect = function(options) {
        var select = new Select(this, options);
        select.init();
        if ($('#multi_box').length != 0) return;
        $('body').append(select.selectdom());
        select.showSelect();
        var self = this;
        $('#coverBack').on('click', function() {
            select.closeSelect();
        })
        $('#multi_box .item').on('click', function() {
            var dataname = $(this).html();
            var datacode = $(this).attr('data-code');
            $(self).val(dataname).attr('data-code', datacode);
            select.closeSelect();
        })
    }
    $.fn.mulSelect = function(options) {
        var select = new Select(this, options);
        select.init();
        if ($('#multi_box').length != 0) return;
        $('body').append(select.selectdom_s());
        select.showSelect();
        $('#coverBack').on('click', function() {
            select.closeSelect();
        })
        var self = this;
        $('#multi_box .item').not('.bggray').on('click', function() {
                if ($(this).hasClass('itemsactive')) {
                    $(this).removeClass('itemsactive');
                } else {
                    $(this).addClass('itemsactive');
                }
            })
            //四个按钮
            //全选
        $('#jqex_all').on('click', function() {
                $('#multi_box .item').not('.bggray').addClass('itemsactive');
            })
            //全清
        $('#jqex_allclose').on('click', function() {
                $('#multi_box .item').not('.bggray').removeClass('itemsactive');
            })
            //确定

        //取消
        $('#jqex_close').on('click', function() {
            $('#multi_box .item').not('.bggray').removeClass('itemsactive');
            select.closeSelect();
        })

    }
})(jQuery) +
(function($) {
    var Scroll = function(el) {
        this.container = $(el);
    }
    Scroll.prototype.isScrollLoad = function() {
        var container = this.container;
        var scrollHeight = container[0].scrollHeight;
        var height = $(window).height();
        var offsettop = container.offset().top > 0 ? container.offset().top : container.offset().top * (-1);
        //var offsettop = container.offset().top ;
        return scrollHeight - (height + offsettop);
    }
    $.fn.Scroll = function() {
        var ss = new Scroll(this);
        return ss.isScrollLoad();
    }
})(jQuery)