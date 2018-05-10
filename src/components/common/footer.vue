<template>
  <div>
    <ul class="footer">
      <li v-for='(item,index) of items' :class='[ item.cls , {on:index === idx} ]' @click="$router.push(item.push)">
        <!-- <span>{{item.icon}}</span> -->
        {{item.name}}
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        items: [
          {
          cls: "step1",
          name: "定时间",
          icon:'&#xe650',//此种方式 不会正确解析图标 用伪类吧~~
          push: "/step1"
          },
          {
            cls: "step1",
            name: "待开裁",
            icon:'&#xe650',
            push: "/step2"
          },
          {
            cls: "step1",
            name: "待上线",
            icon:'&#xe650',
            push: "/step3"
          },
          {
            cls:'step1',
            name:'待后整',
            icon:'&#xe650',
            push:'/step4'
          },
          {
            cls:'step1',
            name:'待发货',
            icon:'&#xe650',
            push:'/step5'
          }
        ]
      }
    },
    props: ['idx']
  }
</script>