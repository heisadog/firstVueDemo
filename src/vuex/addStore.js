// 第二个项目的 仓库 存放（某个模块的仓库）

const state = {
    //顶部 颜色状态
    colorStatus: {
        id: '', //默认 01 01-白色，02-黄色，03-蓝色，04-桔色  默认全部
    },
    //尺码 
    size: {
        id: '' //默认选择第一个
    },
    //获取的 列表数据
    list: {
        page1: [],
        page2: []
    },
    //排序
    sort: {
        page1: 'asc',
        page2: 'asc'
    },
    //是否执行 获取列表数据
    isGet: false
}

const mutations = {
    //更新颜色 状态 
    upColorStatus: function(state, mes) {
        state.colorStatus.id = mes;
        state.isGet = true;
    },
    //更新 尺码
    upSize: function(state, mes) {
        state.size.id = mes;
        state.isGet = true;
    },
    //更新 列表数据
    upList: function(state, idx, mes) {
        // if (idx == 'page1') {
        //     state.list.page1 = mes;
        // }
        // if (idx == 'page2') {
        //     state.list.page2 = mes;
        // }
        let page = idx;
        state.list[page] = mes;
        state.isGet = false;
    },
    //更新 排序状态
    upSort: function(state, idx, mes) {
        let page = idx;
        state.sort[page] = mes;
    }
}

// 对于单独模块的 状态 获取 this.$store.state.addStore.colorStatus.id   多了 addStore 他是放在 store.js modules 中 ，打印出this.$store即可明白~~
//  更新的方式 还是一样！！
/*
 相比 第一个 仓库，
  用法趋于 模块化 
  更新数据的函数更加简洁
*/

export default {
    state,
    mutations
}