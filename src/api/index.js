import axios from '../plugins/axios'
export default {
    /*****************用户*******************************/
    user_login(params) {
        //登录
        return axios.post('/user/login', params);
    },
    user_logout() {
        //退出登录
        return axios.get('/user/logout');
    },
    user_info() {
        //信息
        return axios.get('/user/currentUser')
    },
    user_list(params) {
        //列表
        return axios.post('/user/list', params);
    },
    user_register(params) {
        //注册
        return axios.post('/user/register', params);
    },
    user_update(params) {
        //更新
        return axios.post('/user/update', params);
    },
    user_del(params) {
        //删除用户
        return axios.post('/user/del', params);
    },
    user_resetPwd(params) {
        //重置密码
        return axios.post('/user/resetpwd', params);
    },
}