//vuex的内容 刷新后 就消失了！！还是回到本地存储~~~
const state = {
    //权限下 店铺的往来
    wldmlist: [],
    //仓库代码
    stocklist: []
}
const mutations = {
    //更新往来代码
    upWldmList: function(state, mes) {
        state.wldmlist = mes;
    },
    //更新仓库代码
    upStockList: function(state, mes) {
        state.stocklist = mes;
    }

}
export default {
    state,
    mutations
}