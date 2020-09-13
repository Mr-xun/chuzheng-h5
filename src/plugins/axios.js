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
            case 503:
                Toast('服务器异常，请求超时');
                break
        }
    }
    return Promise.reject(error.response && error.response.data)
})
export default instance