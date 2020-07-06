// import 语句的路径只支持相对路径
import axios from "../../request/myAxios";

Page({
  // 自定义数据 - 不直接用于展示，仅用于存放所有分类数据
  cateAll: [],
  // 页面数据 - 和页面渲染相关的数据
  data: {
    // 左侧的列表数据
    cateDataLeft: [],
    // 右侧的列表数据
    cateDataRight: [],
    // 选中的索引值
    activeIndex: 0,
    // 滚动的时候
    rightScrollTop: 0,
  },
  // 点击切换 tab 栏的事件
  changeTabIndex(e) {
    // 获取当前绑定点击事件元素的自定义索引
    const { index } = e.currentTarget.dataset;
    // 把自定义索引数据更新到页面
    this.setData({
      // 改变左侧选中状态
      activeIndex: index,
      // 根据索引值,从总数据中,获取到对应分类的孩子
      cateDataRight: this.cateAll[index].children,
      // 点击右边的时候出现回到顶部
      rightScrollTop: 0,
    });
  },
  // 请求封装
  request(cateAll) {
    this.cateAll = cateAll;
    // 从总数据中，映射成一个用于左侧列表绑定的数据
    const cateDataLeft = this.cateAll.map((item) => ({
      cat_id: item.cat_id,
      cat_name: item.cat_name,
    }));
    const cateDataRight = this.cateAll[0].children;
    // 要更新视图，必须调用 setData 方法
    this.setData({ cateDataLeft, cateDataRight });
  },
  // ---------------------------------------
  getCateData() {
    axios({ url: "/categories" }).then((res) => {
      this.request(res);
      // res 是整个分类的总数据，如果总数据直接绑定到 data 中，性能不够好
      // this.cateAll = res;
      // // console.log(this.cateAll);
      // // 从总数据中，映射成一个用于左侧列表绑定的数据
      // const cateDataLeft = this.cateAll.map((item) => {
      //   return {
      //     cat_id: item.cat_id,
      //     cat_name: item.cat_name,
      //   };
      // });
      // // 从总数据中，拿到索引值为 0 右侧分类
      // const cateDataRight = this.cateAll[0].children;
      // // 要更新视图，必须调用 setData 方法
      // this.setData({ cateDataLeft, cateDataRight });
      // // 数据缓存：数据获取后，把数据保存到本地存储中
      // // 因为本地存储是属于永久存储，保存的时候添加一个时间戳
      // // 时间戳用于对比下次打开当前页面的时间，如果超过某个时间范围，那么就重新请求（数据时效性）
      // Date 是 ECMAScript 的内置对象
      wx.setStorageSync("cateAll", {
        data: this.cateAll,
        // 时间戳属性
        time: Date.now(),
      });
    });
  },
  // 分类页第一次加载的时候执行
  onLoad() {
    // 获取本地存储的分类数据
    const cateAll = wx.getStorageSync("cateAll");
    // 1. 判断 cateAll 是否有值，如果没有值，重新发起请求
    if (!cateAll) {
      this.getCateData();
      // 如果当前的时间过了5分钟那么重新发起请求
    } else if (Date.now() - cateAll.time > 1000 * 60 * 1) {
      console.log("上次请求到现在超过了 5 封装，需要重新发起请求");
      // 获取分类页数据的封装
      this.getCateData();
    } else {
      this.request(cateAll.data);
      // 3.否则直接使用本地存储的数据
      // this.cateAll = cateAll.data;
      // // 从总数据中，映射成一个用于左侧列表绑定的数据
      // const cateDataLeft = this.cateAll.map((item) => ({
      //   cat_id: item.cat_id,
      //   cat_name: item.cat_name,
      // }));
      // const cateDataRight = this.cateAll[0].children;
      // // 要更新视图，必须调用 setData 方法
      // this.setData({ cateDataLeft, cateDataRight });
    }
  },
});
