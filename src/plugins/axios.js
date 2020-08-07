import axios from 'axios';
import { Toast } from 'vant';
let devBaseUrl = 'http://192.168.13.241:3001'
let proBaseUrl = 'http://49.233.16.84:3001'
console.log("node-env:"+process.env.NODE_ENV)
const instance = axios.create({
    withCredentials: true,
    baseURL: process.env.NODE_ENV == 'production' ? proBaseUrl : devBaseUrl,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json; charset=UTF-8'
    },
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