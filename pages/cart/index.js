// pages/cart/index.js
Page({
  // 页面数据
  data: {
    cart: [],
    bl: true,
    // 全选状态
    allSelect: false,
    // 选中的商品个数
    selectCount: 0,
    // 商品总金额
    totalPrice: 0,
  },
  // 在哪个生命周期函数中，获取本地购物车数据比较合适
  // 购物车页面是个 tabBar 页，第一次打开的时候是加载，但 tabBar 切换的时候只是把页面隐藏了起来
  // onLoad 页面第一次加载的时候执行 - 不适合，只加载一次
  // onLoad() {
  //     console.log('onLoad读取购物车数据');
  // },
  // onShow 页面显示的时候执行 - 适合，每次打开都拿最新的本地存储数据
  onShow() {
    // 获取本地存储数据
    const cart = wx.getStorageSync("cart") || [];
    this.setData({ cart, bl: false });
    // 计算购物车的数据
    this.computedCart(cart);
  },
  // 单个商品选择状态切换
  changeItemSelect(e) {
    // 获取当前点击的是第几个
    const { index } = e.currentTarget.dataset;
    // 获取页面购物车数据
    const { cart } = this.data;

    // 把原值拿过来取反，再重新赋值修改
    cart[index].isSelect = !cart[index].isSelect;

    // 更新视图和本地存储
    this.computedCart(cart);
  },
  // 单个商品计数器操作
  changeItemCount(e) {
    // 获取事件的参数
    const { number, index } = e.currentTarget.dataset;
    // 获取页面购物车数据
    const { cart } = this.data;
    // 根据 number 数据区别点击了加号还是减号
    if (number === -1) {
      if (cart[index].count === 1) {
        console.log("提示");
        // 显示模态对话框
        wx.showModal({
          content: "是否删除商品?",
          showCancel: true,
          cancelText: "取消",
          cancelColor: "#000",
          confirmText: "删除",
          confirmColor: "#ccc",
          // 异步回调函数
          success: ({ confirm }) => {
            console.log("是否点了确定", confirm);
            if (confirm) {
              console.log("执行删除操作");
              // 删除数组中的某一项
              cart.splice(index, 1);
              // 更新视图和本地存储
              this.computedCart(cart);
            }
          },
        });
      } else {
        console.log("减少");
        cart[index].count -= 1;
      }
    } else {
      console.log("你点击了加号");
      cart[index].count += 1;
    }
    // 更新视图和本地存储
    this.computedCart(cart);
  },

  // 更新视图数据和本地存储数据的方法封装
  computedCart(cart) {
    // 假设默认为假
    let allSelect = false,
      selectCount = 0,
      totalPrice = 0;

    // 遍历购物车的选中元素
    cart.forEach((item) => {
      // 选中的商品
      if (item.isSelect) {
        // 选中个数累加
        selectCount++;
        // 选中商品价格累加   +=  商品单价 * 商品数量
        totalPrice += item.goods_price * item.count;
      }
    });

    // 如果购物车的长度和选中的长度相等，就变成真
    if (cart.length === selectCount) {
      allSelect = true;
    }

    // 更新购物车列表视图
    this.setData({ cart, allSelect, selectCount, totalPrice });
    // 更新本地存储购物车数据
    wx.setStorageSync("cart", cart);
  },

  // 点击改变全选状态
  changeAllSelect() {
    // 获取选中状态
    let { allSelect, cart } = this.data;

    // 取反
    allSelect = !allSelect;

    // 自己的状态发生变化
    this.setData({ allSelect });

    // 购物车列表的状态跟随当前的全选按钮的状态切换
    cart.forEach((item) => {
      item.isSelect = allSelect;
    });

    // 更新购物车视图和本地存储
    this.computedCart(cart);
  },

  // 跳转到订单结算页面
  // 要处理两种情况：
  //      1. 如果商品数量为 0，提示用户： 您还没有选择商品哦
  //      2. 如果商品数量不为0，才跳转到订单结算页面
  goToPay() {
    // 获取选中的商品数量
    const { selectCount } = this.data;

    if (selectCount === 0) {
      // 1. 如果商品数量为 0，提示用户： 您还没有选择商品哦
      wx.showToast({
        title: "您还没有选择商品哦",
        icon: "none",
      });
    } else {
      // 2. 如果商品数量不为0，才跳转到订单结算页面
      wx.navigateTo({
        url: "/pages/pay/index",
      });
    }
  },
});
