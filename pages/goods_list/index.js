// pages/goods_list/index.js
import axios from "../../request/myAxios";
Page({
  // 商品对象购物车业务是视频数据
  
  params: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10,
  },
  // 总跳数数据
  totalCount: 0,

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex: 0,
    thien: [
      {
        id: 1,
        item: "综合",
      },
      {
        id: 2,
        item: "销量",
      },
      {
        id: 3,
        item: "价格",
      },
    ],
    //商品；列表
    goodsList: [],
  },
  // tab切换
  changeTabIndex(e) {
    const { index } = e.currentTarget.dataset;
    this.setData({
      activeIndex: index,
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    // 如果没有数据就会是unddefined
    this.params.cid = options.cid || "";
    this.params.query = options.query || "";
    // 调用获取列表
    // console.log(this.params.query);

    this.getGoodslist();
  },
  // 请求封装
  getGoodslist() {
    return axios({
      url: "/goods/search",
      data: this.params,
    }).then((res) => {
      console.log(res);
      // 用于分页
      this.totalCount = res.total;
      this.setData({
        goodsList: [...this.data.goodsList, ...res.goods],
      });

     
    });
  },
  // 上拉加载
  onReachBottom() {
    if (
      Math.ceil(this.totalCount / this.params.pagesize) > this.params.pagenum
    ) {
      this.params.pagenum++;
      this.getGoodslist();
    } else {
      wx.showToast({ title: "没有跟多了", icon: "none" });
    }
  },
  // 下拉刷新
  async onPullDownRefresh() {
    console.log("你下拉了");
    this.setData({ goodsList: [] });
    // 页码数
    this.params.pagenum = 1;
    await this.getGoodslist();
    wx.stopPullDownRefresh();
  },
});
