<template>
    <div>
        <header id="top" class="main_bgcolor">
            <div @click="showleft" class="back">&#xe8f1</div>
            <span>{{name}}</span>
            <div class="search" @click="showSearch">查询</div>
        </header>
    </div>
</template>
<script>
import {fun} from '../fun.js'
export default {
    data(){
        return{
            name:'获取标题失败'
        }
    },
    mounted(){
        this.$nextTick(() => { /* code */
            this.init_datetimePicker();
            this.name  = this.$route.query.title;
            $('.delethis').click(function(){
                $(this).prev().val('');
            })
            $('#clear').click(function(){
                $('.topSearchBox').find('input').val('');
            })
            $('#cover').click(function(){
                fun.csear()
            })
        })
        
    },
    methods:{
        showleft:function () {
            var left = document.getElementById('left');
            left.classList.remove('x_100');
        },
        showSearch:function(){
            fun.sear()
        },
        //初始化 时间插件
        init_datetimePicker:function () {
            let _this = this;
            // var mydate = new Date();
            // var year = mydate.getFullYear();
            // var month = mydate.getMonth() + 1;
            // var day = mydate.getDate();
            // var DateTime = year + '-' + month + '-' + day;
            //_this.datetime6  = DateTime;
            $("#start").datetimePicker({
                    title: '请选择时间',
                    times:function(){
                        var  year=[];
                        return year;
                    },
                    parse: function(date) {
                        return date.split(/\D/).filter(function(t) {
                            return !!date
                        });
                    },
                    onOpen:function (values) {
                        $("#start").val(values.value[0]+'-'+values.value[1]+'-'+values.value[2])
                    },
                    onChange:function(){
                        console.log(_this.datetime0)
                    }
                });
                $("#end").datetimePicker({
                    title: '请选择时间',
                    times:function(){
                        var  year=[];
                        return year;
                    },
                    parse: function(date) {
                        return date.split(/\D/).filter(function(t) {
                            return !!date
                        });
                    },
                    onOpen:function (values) {
                        $("#end").val(values.value[0]+'-'+values.value[1]+'-'+values.value[2])
                    }
                });
        },
    }
}
</script>
