import Vue from 'vue'
import Vuex from 'vuex'

//引入 第二个模块的 状态
import addStore from './addStore'

Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        author: '刘光祥',
        status: {
            step1sta: false,
            step2sta: false,
            step3sta: false,
            step4sta: false,
            step5sta: false,
            stepallsta: false, //由于页面 提交过 到了下页 需要执行刷新！！！这是个 总的状态 ，只要提交了~~~
        },
        step1json: [{ "id": "695182916D0935FBE0534414A8C04980", "mainid": "LD18040802739944", "productcode": "B1BF73430", "orderno": "B1BF734308901", "mainpicurl": "http://img.pb89.com/kuaifan/PB/basic/CSB1BF73430_t.jpg", "ordercode": "B1BF7343089-04", "supplier": "花荟11", "orderqty": 18, "sendqty": null, "contractdate": "2018-04-05", "fabricarrivedate": "2018-04-10" }, { "id": "689D8AB799695434E0534414A8C0608E", "mainid": "LD18033002739769", "productcode": "CWEE73724", "orderno": "CWEE737248601", "mainpicurl": "http://img.pb89.com/kuaifan/PC/basic/CSCWEE73724_t.jpg", "ordercode": "CWEE7372486-01", "supplier": "1", "orderqty": 130, "sendqty": null, "contractdate": "2018-03-15", "fabricarrivedate": "2018-04-09" }, { "id": "689D8AB799755434E0534414A8C0608E", "mainid": "LD18033002739769", "productcode": "CWEE73724", "orderno": "CWEE737248601", "mainpicurl": "http://img.pb89.com/kuaifan/PC/basic/CSCWEE73724_t.jpg", "ordercode": "CWEE7372486-02", "supplier": "1", "orderqty": 110, "sendqty": null, "contractdate": "2018-03-15", "fabricarrivedate": "2018-04-09" }],
        step2json: [],
        step3json: [],
        step4json: [],
        step5json: [],
        //详情中实现保存 返回 上一页 需要重新 加载一次数据
        backReload: false,
        // 排序
        isSort: false,
        sort: {
            sort1: 'desc', //默认升序
            sort2: 'desc', //默认升序
            sort3: 'desc', //默认升序
            sort4: 'desc', //默认升序
            sort5: 'desc', //默认升序
        }
    },
    mutations: {
        ipdatestep1(state, msg) {
            state.step1json = msg;
            state.status.step1sta = true;
        },
        ipdatestep2(state, msg) {
            state.step2json = msg;
            state.status.step2sta = true;
        },
        ipdatestep3(state, msg) {
            state.step3json = msg;
            state.status.step3sta = true;
        },
        ipdatestep4(state, msg) {
            state.step4json = msg;
            state.status.step4sta = true;
        },
        ipdatestep5(state, msg) {
            state.step5json = msg;
            state.status.step5sta = true;
        },
        backReload(state, msg) {
            state.backReload = msg;
        },
        upSort(state, msg) {
            state.isSort = msg;
        },
        upstate(state, msg) {
            state.status.stepallsta = true;
        }
    },
    //将其他模块的 .....
    modules: {
        addStore
    }
})