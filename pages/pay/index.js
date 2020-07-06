// pages/pay/index.js
import axios from "../../request/myAxios";
Page({
  // 获取用户收货地址的函数
  getaddress() {
    // 获取用户授权设置
    wx.getSetting({
      // 从返回值中解构 authSetting 对象
      success: ({ authSetting }) => {
        // 获取通讯地址的授权情况
        const scopeAddress = authSetting["scope.address"];
        // scopeAddress 有三种结果：
        //   1. undefined 重来<没有调用过>获取通讯地址的 API
        //   2. true   调用过获取通讯地址的 API，并且用户<允许>授权
        //   3. false  调用过获取通讯地址的 API，但是用户<拒绝>授权
        // 实现思路：
        //   1. undefined 和 true 的情况，就直接调用通讯地址 API
        //   2. false 被拒绝过无法调用API，打开设置界面，引导用户开启授权
        if (scopeAddress === undefined || scopeAddress === true) {
          // 调用通讯地址 API
          wx.chooseAddress({
            success: (result) => {
              const {
                userName,
                telNumber,
                provinceName,
                cityName,
                countyName,
                detailInfo,
              } = result;

              const address = {
                userName,
                telNumber,
                addressDetail:
                  provinceName + cityName + countyName + detailInfo,
              };
              this.setData({ address });
              wx.setStorageSync("address", address);
              // console.log("用户收货地址信息", result);
            },
          });
        } else {
          // 打开当前小程序的设置界面 - 需要嵌套在 wx.getSetting() 中使用。
          wx.openSetting();
        }
      },
    });
  },
  data: {
    cart: [],
    // 物品对象

    // 选中的商品个数
    selectCount: 0,
    // 商品总金额
    totalPrice: 0,
    address: {},
    // 创建订单
  },
  onLoad() {
    const cart = wx.getStorageSync("cart") || [];
    this.setData({ cart });
    this.computedCart(cart);
  },
  computedCart(cart) {
    let selectCount = 0,
      totalPrice = 0;
    cart.forEach((item) => {
      // 选中的商品
      // 选中个数累加
      if (item.isSelect) {
        selectCount++;
        // 选中商品价格累加   +=  商品单价 * 商品数量
        totalPrice += item.goods_price * item.count * 1000;
      }
    });
    this.setData({ cart, selectCount, totalPrice });
    console.log(selectCount, totalPrice);
    wx.setStorageSync("cart", cart);
  },
  async paycurren() {
    const { address } = this.data;
    if (!address.userName) {
      wx.showToast({
        title: "请选择收货地址",
        icon: "none",
      });
      // 如果没有选择收货地址，就无需往后再运行了
      return;
    }
    // 判断用户有没有登录
    const token = wx.getStorageSync("token") || "";
    if (!token) {
      wx.navigateTo({
        url: "/pages/auth/index",
      });
    } else {
      try {
        console.log("一登录长江东路");
        // 创建订单
        const { order_number } = await this.creatOrder();
        console.log(1);
        // 订单预支付
        const { pay } = await this.createPayData(order_number);
        console.log(2);
        // 唤起微信支付
        const { errMsg } = await this.requestPaymen(pay);
        console.log(3);
        // 订单查询
        const res = await this.checkOrderp(order_number);
        console.log(res);
        // 支付成功后的操作
        this.payOrderSuccess();
      } catch (error) {
        wx.showToast({
          title: "错误支付失败",
          icon: "icon",
        });
      }
    }
  },
  // 创建订单
  creatOrder() {
    const { cart, totalPrice, address } = this.data;

    const goods = cart
      .filter((v) => v.isSelect)
      .map((v) => ({
        goods_id: v.goods_id,
        goods_number: v.count,
        goods_price: v.goods_price,
      }));

    return axios({
      url: "/my/orders/create",
      method: "post",

      data: {
        // 订单总价格
        order_price: totalPrice,
        consignee_addr: address.addressDetail,
        // 注意 goods 参数的格式，需要按文档接口要求来传递
        goods: goods,
      },
    });
  },
  // 与支付
  createPayData(order_number) {
    return axios({
      url: "/my/orders/req_unifiedorder",
      method: "POST",
      data: {
        order_number,
      },
    });
  },
  // 发起微信我支付
  requestPaymen(pay) {
    return new Promise((resolve, reject) => {
      // 微信支付的 API
      wx.requestPayment({
        ...pay,
        success: (res) => {
          resolve(res);
        },
        fail: (err) => {
          reject(err);
        },
      });
    });
  },
  //查询订单状态
  checkOrderp(order_number) {
    return axios({
      url: "/my/orders/chkOrder",
      method: "post",

      data: { order_number },
    });
  },
  payOrderSuccess() {
    //   1. 清除购物车选中商品
    const { cart } = this.data;
    // 反选没有支付的商品
    const newCart = cart.filter((v) => !v.isSelect);
    wx.setStorageSync("cart", newCart);
    wx.redirectTo({
      url: "/pages/order/index",
    });
  },
});
