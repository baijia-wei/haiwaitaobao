import axios from "../../request/myAxios";
Page({
  // 轮播图数据
  getRotationchart() {
    axios({ url: "/home/swiperdata", method: "GET" }).then((res) => {
      this.setData({
        swiperData: res,
      });
    });
  },
  // 导航的数据
  getNavigation() {
    axios({ url: "/home/catitems", method: "GET" }).then((res) => {
      res.forEach((item) => {
        if (item.navigator_url) {
          // 遍历的时候，把内部的路径修改了
          item.navigator_url = item.navigator_url.replace("/main", "/index");
        }
      });

      this.setData({
        navData: res,
      });
    });
  },
  // 楼层的数据
  getfloor() {
    wx.request({
      url: "https://api-hmugo-web.itheima.net/api/public/v1/home/floordata",
      method: "GET",
      success: (res) => {
        // console.log(res);
        const floorData = res.data.message;
        floorData.forEach((item, index) => {
          item.id = index;
        });

        this.setData({
          floorData,
        });
      },
    });
  },
  // 页面数据
  data: {
    // 轮播图数据
    swiperData: [],
    // 导航数据
    navigation: [],
    // 楼层的数据
    floor: [],
  },
  // 页面加载的生命周期函数

  onLoad() {
    this.getRotationchart();
    this.getNavigation();
    this.getfloor();
  },

  // 小程序事件同级书写
  goToPage(e) {
    // console.log(e);

    const { open_type, navigator_url } = e.currentTarget.dataset.item;

    // 判断一下打开方式
    if (open_type === "switchTab") {
      // switchTab 方式就用 wx.switchTab() 打开
      wx.switchTab({
        url: navigator_url,
      });
    }
  },
});
