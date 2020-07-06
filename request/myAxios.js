// 1. 参考之前 axios 库，直接通过 Promise对象 + wx.request() API 进行封装。
// 2. 根路径封装，在调用的时候省略根路径。
// 3. 请求的时候，在窗口导航添加 loading 提示，请求完成后隐藏提示。
// 4. 失败的情况统一处理。

const baseURL = "https://api-hmugo-web.itheima.net/api/public/v1";

let requestCount = 0;

const axios = (params) => {
  // 自己手写拦截器如果路径中包含了。my
  if (params.url.indexOf("/my/") > -1) {
    const token = wx.getStorageSync("token");
    if (!token) {
      // 跳转页面
      wx.navigateTo({ url: "/pages/auth/index" });
    } else {
      // 在请求参数中，添加请求头 Authorization: token
      params.header = {
        Authorization: token,
      };
    }
  }

  requestCount++;
  return new Promise((resolve, reject) => {
    wx.request({
      // 把所有参数解构
      ...params,
      // url = 基地址 + API 地址
      url: baseURL + params.url,
      success: (result) => {
        // 执行 resolve 回调函数
        // 直接把返回的数据处理，提取出来，作为 then 的接收的参数
        // 当前小程序所有返回的接口都是这个结构的数据
        // 如有有 data 就直接返回 data.message
        if (result.data) {
          resolve(result.data.message);
        } else {
          resolve(result);
        }
      },
      fail: (error) => {
        wx.showToast({
          // 失败的时候弹出消息提示框
          title: "数据获取失败",
          icon: "none",
        });
        // 执行 reject 回调函数
        reject(error);
      },
      // 不管成功失败
      complete: () => {
        requestCount--;
        // 计数器变 0 的时候，就是所有请求都完成了
        if (requestCount === 0) {
          // 隐藏 loading 加载状态
          wx.hideNavigationBarLoading();
        }
      },
    });
  });
};
// 导出 axios 函数
export default axios;
