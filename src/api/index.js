import axios from '../plugins/axios'
export default {
    /*****************详情*******************************/
    bill_detail(params) {
        //发单详情
        return axios.post("/cz/h5/publish/detail/get", params);
      },
}