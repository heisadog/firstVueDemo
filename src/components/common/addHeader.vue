<template>
  <div>
      <ul class="madd-tab">
          <li v-for="data,index in list" :class='data.class'  @click="check(index)">{{data.name}}</li>
      </ul>
  </div>
</template>
<script>
export default {
    data(){
        return{
            list:[
                {name:'全部',class:'f1'},
                {name:'白色',class:''},
                {name:'蓝色',class:''},
                {name:'黄色',class:''},
                {name:'桔色',class:''},
            ],
            colorID:'',//选择的颜色的id 
            
       }
    },
    mounted(){
        //默认 第一个 全部
    },
    methods:{
        check:function(index){
            console.log(this.$store.state.addStore.colorStatus.id)
            $('.madd-tab li').removeClass();
            switch (index) {
                case 0:
                    $('.madd-tab li').eq(0).addClass('f1');
                    this.colorID = '';
                    break;
                case 1:
                    $('.madd-tab li').eq(1).addClass('f2');
                    this.colorID = '01';
                    break;
                case 2:
                    $('.madd-tab li').eq(2).addClass('f3');
                    this.colorID = '02';
                    break;
                case 3:
                    $('.madd-tab li').eq(3).addClass('f4');
                    this.colorID = '03';
                    break;
                case 4:
                    $('.madd-tab li').eq(4).addClass('f5');
                    this.colorID = '04';
                    break;                
                default:
                    break;
            }
            this.$store.commit('upColorStatus',this.colorID);
            this.$emit('onFirstGet',this.colorID)
            setTimeout(() => {
                console.log(this.$store.state.addStore.colorStatus.id)
            }, 2000);
        }
    }
}
</script>

