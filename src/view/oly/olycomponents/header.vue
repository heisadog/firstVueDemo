<template>
    <div>
        <header id="top" class="main_bgcolor">
            <div @click="showleft" class="back" style="font-size:20px">&#xe650</div>
            <span>{{name}}</span>
            <div class="search" @click="showSearch">&#xe620</div>
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
            $('#cover').click(function(){
                fun.csear()
            })
            //删除时间(后续补充)
            $('.delethis').click(function() {
                var id = $(this).prev().attr('id');
                if(id == 'start' || id == 'end'){
                    $(this).prev().val('')
                }
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
