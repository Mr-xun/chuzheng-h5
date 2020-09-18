import axios from 'axios';
import { Toast } from 'vant';
let devBaseUrl = "/api";
let proBaseUrl = "http://www.chuzheng.online";
console.log("node-env:"+process.env.NODE_ENV)
const instance = axios.create({
    withCredentials: true,
    baseURL: process.env.NODE_ENV == 'production' ? proBaseUrl : devBaseUrl,
    timeout: 10000,
    headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
    },transformRequest: [
        function(data) {
          // 请求参数的格式
          let newData = "";
          for (let k in data) {
            newData +=
              encodeURIComponent(k) + "=" + encodeURIComponent(data[k]) + "&";
          }
          return newData;
        }
      ]
});
instance.interceptors.request.use((config) => {
    return config
}, (error) => {
    return Promise.reject(error)
})
instance.interceptors.response.use((response) => {
    const res = response.data;
    if (res.code != 0) {
        Toast( res.msg || "Error");
        return Promise.reject(new Error(res.msg || "Error"));
    } else {
        return response
    }
}, (error) => {
    console.log(error)
    if (error.response) {
        switch (error.response.status) {
        case 400:
          Toast("错误请求");
          break;
        case 401:
          Toast("当前用户未登录");
          break;
        case 403:
          Toast("拒绝访问");
          break;
        case 404:
          Toast("请求错误,未找到该资源");
          break;
        case 405:
          Toast("请求方法未允许");
          break;
        case 408:
          Toast("请求超时");
          break;
        case 500:
          Toast("服务器端出错");
          break;
        case 501:
          Toast("服务器端异常，网络未实现");
          break;
        case 502:
          Toast("服务器端异常，网络错误");
          break;
        case 503:
          Toast("服务器端异常，服务不可用");
          break;
        case 504:
          Toast("服务器端异常，网络超时");
          break;
        case 503:
            Toast('服务器异常，请求超时');
        break;
        }
    }
    return Promise.reject(error.response && error.response.data)
})
export default instance