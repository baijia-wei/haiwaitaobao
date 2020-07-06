// pages/auth/index.js
import axios from "../../request/myAxios";
Page({
  getdata(e) {
    const { signature, iv, rawData, encryptedData } = e.detail;

    wx.login({
      success: ({ code }) => {
        console.log(code);

        this.params = {
          signature,
          iv,
          rawData,
          encryptedData,
          code,
        };

        this.getken();
      },
    });
  },
  getken() {
    axios({
      url: "/users/wxlogin",
      method: "post",
      data: this.params,
    }).then((res) => {
      if (!res) {
        wx.showToast({
          title: "授权失败，请重试",
          icon: "none",
        });
      } else {
        const { token } = res;
        wx.setStorageSync("token", token);
        // 返回上一个页面
        wx.navigateBack();
      }
    });
  },
  /**
   * 页面的初始数据
   */

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
});
