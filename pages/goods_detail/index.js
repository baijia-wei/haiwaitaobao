// pages/goods_detail/index.js
import axios from "../../request/myAxios";
Page({
  /**
   * 页面的初始数据
   */
  goodsObj: {},
  data: {
    pics: [],
    goods_id: 0,
    goods_name: "",
    goods_price: "",

    goods_introduce: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this.options.goods_id);

    this.getGoodsDetai();
  },
  getGoodsDetai() {
    const goods_id = this.options.goods_id;
    axios({
      url: "/goods/detail",
      data: {
        goods_id,
      },
    }).then((res) => {
      // console.log(res);
      const { goods_id, goods_name, goods_price, pics, goods_introduce } = res;

      // goods_introduce = goods_introduce.replace(/<img/g, '<img class="my_img"');
      this.setData({
        goods_id,
        goods_name,
        goods_price,
        pics,
        goods_introduce,
      });
      this.goodsObj = {
        goods_id,
        goods_name,
        goods_price,
        goods_small_logo: res.goods_small_logo,
      };
    });
  },
  showBigImage(e) {
    const rulc = this.data.pics.map((v) => {
      return v.pics_big;
    });
    const { current } = e.currentTarget.dataset;
    wx.previewImage({
      urls: rulc,
      current,
    });
  },

  addToCart() {
    // console.log(this.goodsObj);
    // 先判断本地有没有购物车的数据
    const cart = wx.getStorageSync("cart") || [];

    const index = cart.findIndex(
      (item) => item.goods_id === this.goodsObj.goods_id
    );
    if (index === -1) {
      // 商品的选中状态
      this.goodsObj.isSelect = true;
      this.goodsObj.count = 1;
      cart.unshift(this.goodsObj);
    } else {
      cart[index].count += 1;
      console.log("商品已经存在");
    }
    wx.setStorageSync("cart", cart);
    wx.showToast({
      title: "加入购物车",
      icon: "none",
      duration: 2000,
      mask: true,
    });
  },
  goToPageCart() {
    wx.switchTab({ url: "/pages/cart/index" });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
