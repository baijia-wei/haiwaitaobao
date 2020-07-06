// compoments/tabs/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabsData: {
      type: Array,
      value: [],
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    activeIndex: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeIndexChild(e) {
      const { index } = e.currentTarget.dataset;
      this.setData({ activeIndex: index });
      // 如何实现 组件子传父
      //    1. 触发组件的 自定义事件
      //    2. 传递参数
      this.triggerEvent("getTabsIndex", { index });
    },
  },
});
