<template>
  <div class="m-navbar">
    <div class="flex-search">
        <form action="#">
            <input type="search" v-model="key" @keypress="search" results="5" class="search_input" placeholder="请输入质号或供应商">
        </form>
    </div>
    <div class="paixu" @click="change()" :data-sort='asc' :idx = idx>排序</div>
</div>
</template>
<script>
    export default{
        data(){
            return{
                key:'',
                asc:''
            }
        },
        mounted(){
            //根据传来的 idx 获取 仓库中的排序记录
            let sort = 'sort'+$('.paixu').attr('idx');
            this.asc = this.$store.state.sort[sort];
        },
        methods:{
            search:function (e) {
                var keycode = e.keyCode;
                if(keycode == '13'){
                    e.preventDefault();
                    this.$emit('onsearch',this.key,this.asc)
                }
            },
            //排序   子组件调用父组件的事件
            change:function(){
                let value = $(this).attr('data-sort');
                console.log(value)
                //this.$store.state.author = this.key;
                if(this.asc =='asc') this.asc = 'desc';
                else this.asc = 'asc';
                this.$emit('ongetdata',this.key,this.asc)
                //this.$store.commit('upSort',true)
            }
        },
        props:['idx']
    }
</script>
