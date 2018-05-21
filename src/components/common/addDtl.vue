<template>
  <div>
    <div class="m-dtl posipart">
        <div class="m-dtl-head" v-for='data in items'>
            <img class="m-dtl-head-img" :src="data.mainpicurl" @error="errimg" :onerror="defaultImg" ref="reference">
            <ul class="m-dtl-headmess">
                <li><span>主订单号：</span><span>{{data.orderno}}</span></li>
                <li><span>品名：</span><span>{{data.productname}}</span></li>
                <li><span>供应商：</span><span>{{data.supplier}}</span></li>
                <li><span>色号：</span><span>{{data.colorcode}}</span></li>
                <li><span>颜色名称：</span><span>{{data.colorname}}</span></li>
            </ul>
        </div>
        <p class="shownum" v-for='data in items'>总定量：<span>{{data.orderqty}}</span></p>
        <div class="showtable showfirst">
            <span v-for="data in table">{{data.style}}</span>
        </div>
        <div class="showtable showsecond">
            <span v-for="data in table">{{data.num}}</span>
        </div>
    </div>
  </div>
</template>
<script>
export default {
    data(){
      return{
         defaultImg: 'this.src="' + require('../../assets/img/w.png') + '"'
         //defaultImg:""
      }
    },
    mounted(){
    },
    props:['items','table'],
    methods:{
        errimg:function () {
            // var r = '../../assets/img/w.png';
            // var s = '../static/w.png'
            // $('.m-dtl-head-img').attr('src',s)
        }
    }
}
</script>

