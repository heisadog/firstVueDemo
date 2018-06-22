// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './vuex/store'

// import YDUI from 'vue-ydui'
// import 'vue-ydui/dist/ydui.px.css'
// Vue.use(YDUI);
import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.rem/dialog';
//官网上说的需要引入base.css ，删掉即可，因为自己重置了css样式 ，不需要他的重置样式！！
Vue.prototype.ydui = {
    confirm: Confirm,
    alert: Alert,
    toast: Toast,
    notify: Notify,
    loading: Loading,
};

import { DateTime } from 'vue-ydui/dist/lib.rem/datetime';
Vue.component(DateTime.name, DateTime);
import { PullRefresh } from 'vue-ydui/dist/lib.rem/pullrefresh';
Vue.component(PullRefresh.name, PullRefresh);

import { ListTheme, ListItem, ListOther } from 'vue-ydui/dist/lib.rem/list';
Vue.component(ListTheme.name, ListTheme);
Vue.component(ListItem.name, ListItem);
Vue.component(ListOther.name, ListOther);

import { LightBox, LightBoxImg, LightBoxTxt } from 'vue-ydui/dist/lib.rem/lightbox';
Vue.component(LightBox.name, LightBox);
Vue.component(LightBoxImg.name, LightBoxImg);
Vue.component(LightBoxTxt.name, LightBoxTxt);

import { ActionSheet } from 'vue-ydui/dist/lib.rem/actionsheet';
Vue.component(ActionSheet.name, ActionSheet);

import { InfiniteScroll } from 'vue-ydui/dist/lib.rem/infinitescroll';
Vue.component(InfiniteScroll.name, InfiniteScroll);


//add by zyz
import { Popup } from 'vue-ydui/dist/lib.rem/popup';
Vue.component(Popup.name, Popup);

import { CellGroup, CellItem } from 'vue-ydui/dist/lib.rem/cell';
Vue.component(CellGroup.name, CellGroup);
Vue.component(CellItem.name, CellItem);

import { TextArea } from 'vue-ydui/dist/lib.rem/textarea';
Vue.component(TextArea.name, TextArea);
//add end

import './assets/css/reset.css'
import './assets/css/public.css'
import './assets/font/iconfont.css'
import './assets/css/style.css'
import './assets/css/weui.min.css'

import './assets/js/const.js' //定义全局变量
import './assets/js/basic';

Vue.prototype.LoginName = '';
Vue.prototype.DepartmentCode = '';


// import 'jquery-weui/dist/js/jquery-weui.min'
// import 'jquery-weui/dist/css/jquery-weui.min.css'
import './assets/css/jquery-weui.min.css'
import './assets/js/jquery-weui.min.js'

import D from './assets/js/daos' //三层调用
//方法挂靠全局
/*
方法一：挂在vue的 原型上 
        import D from './assets/js/daos'
        Vue.prototype.D = D;
        使用方法：this.D.方法
*/
/** 
 * 方法二 如下
 *     使用方法 this.方法
 * 
 */
Object.keys(D).forEach((key) => {
    Vue.prototype[key] = D[key];
});




Vue.config.productionTip = false


//通过components下的index.js文件导入组件
import components from './components/index'
//对导入的组件进行全局组件注册
Object.keys(components).forEach((key) => {
    Vue.component(key, components[key])
});
Vue.prototype.appName = '生产跟进';
router.beforeEach((to, form, next) => {
    window.document.title = to.meta.title !== undefined ? to.meta.title : Vue.prototype.appName;
    next()
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    components: { App },
    template: '<App/>'
})

/**
 * 引入vuex的时候 出现的问题：
 * 第一：忘记重新 执行 npm run dev。
 * 第二：main里只要 import store from './vuex/store' 
 * 第三 没有将 store 赋给 vue实例。导致 store 报错未定义！！！-----应在实例中引用 store 如上 new vue中！
 */