<template>
    <div class="m-dtl posipart">
        <div class="m-dtl-head" v-for='data in items'>
            <img class="m-dtl-head-img" :src="data.mainpicurl" :onerror='defaultImg'>
            <ul class="m-dtl-headmess">
                <li><span>货号：</span><span>{{data.productcode}}</span></li>
                <li><span>追单编号：</span><span>{{data.ordercode}}</span></li>
                <li><span>品名：</span><span>{{data.productname}}</span></li>
                <li><span>供应商：</span><span>{{data.supplier}}</span></li>
                <li><span>下单波次：</span><span>{{data.wavename}}</span></li>
            </ul>
        </div>
        <div class="glin"></div>
        <p class="shownum" v-for='data in items'>实际订货量：<span>{{data.orderqty}}</span></p>
        <div class="showtable showfirst">
            <span v-for="data in table">{{data.style}}</span>
        </div>
        <div class="showtable showsecond">
            <span v-for="data in table">{{data.num}}</span>
        </div>
    </div>
</template>
<script>
export default {
    data(){
      return{
         defaultImg: 'this.src="' + require('../../assets/img/w.png') + '"'
      }
    },
    props:['items','table'],
    methods:{
    }
}
</script>

