import axios from 'axios';
import {
    Toast
} from 'vant';
const instance = axios.create({
    baseURL: process.env.VUE_APP_API_URL_INSURANCE,
    timeout: 60000,
    headers: { 'Content-Type': 'application/json' }
});
instance.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
//http response 拦截器
instance.interceptors.response.use(
    response => {
        if (response.data.result && response.data.result === 'fail') {
            return Promise.reject(response);
        } else if (response.data.code == '200') {
            return response.data;
        }
        // else if (response.data.code == '710') {
        //     // 特殊处理 被拒不满90天的  90天内被新核心拒绝过
        //     return response.data
        // } else if (responsey.data.code == '420') {
        //     return response.data;//行驶证ocr车300查不到数据
        // } else if (response.data.code == '409') {
        //     return response.data;//行驶证ocr不在业务范围
        // }
        else {
            const msgA = response.data.message || "";
            const msgB = response.data.msg || "";
            if (msgA === '' && msgB === '') {
                Toast('请求失败，请稍后再试');
            } else {
                Toast(`${msgA} ${msgB}`);
            }
            return Promise.reject(response);
        }
    },
    error => {
        return Promise.reject(error)
    }
)

export default instance;
