<template>
    <div class="oly_left_side thd x_100 ts200" id="left">
        <div class="oly_left_side_cont">
            <p>导航菜单
                <span @click="closeleft">x</span>
            </p>
            <ul class="oly_left_list" v-for="item in list">
                <li :data-url='item.url' @click="goto(item.url,item.name)">{{item.name}}</li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            list:[{'name':'销售业绩','url':'sale'},
            {'name':'库存','url':'stock'},
            {'name':'会员及消费','url':'member'},
            {'name':'成本利润','url':'cost'}]
        }
    },
    methods:{
        goto:function (url,name) {
            var left = document.getElementById('left');
            left.classList.add('x_100');
            this.$router.push({path:url,query:{'title':name}});
        },
        closeleft:function(){
            var left = document.getElementById('left');
            left.classList.add('x_100');
        }
    }
}
</script>

