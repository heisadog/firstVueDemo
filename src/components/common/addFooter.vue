<template>
<div>
   <ul class="footer">
       <li v-for="data, index in item" :class="[data.class, { on: index === idx}]" @click="$router.push(data.push)">{{data.cont}}</li>
   </ul>
</div>   
</template>
<script>
export default {
  data(){
      return{
          item:[
              {
                  cont:'头批',
                  push:'/addArder',
                  class:''
              },
              {
                  cont:'追单',
                  push:'/addOrder',
                  class:''
              }
          ]
      }
  },
  props:['idx']
}
</script>

