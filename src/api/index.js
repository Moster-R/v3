import axios from "axios";

// 创建请求对象
const request = axios.create({
    // 后端接口ip
    baseURL: 'http://localhost:8466',
    // 超时时间
    timeout: 3000,
    // 自定义当成功处理的http状态码范围
    validateStatus: function (status) {
        return status < 500;
    }
})

// request 拦截器
request.interceptors.request.use(config => {
    config.headers['content-type'] = 'application/json;charset=utf-8';
    return config
}, error => {
    return Promise.reject(error)
})

// response 拦截器
request.interceptors.response.use(response => {
    let res = response.data;
    // 如果返回的是文件
    if (response.config.responseType === 'blob') {
        return res
    }
    // 兼容服务端返回的字符串
    if (typeof res === 'string') {
        res = res ? JSON.parse(res) : res
    }
    return res
}, error => {
    console.log('err' + error)
    return Promise.reject(error)
})

const api = {

    /**
     * 注册
     * @param param
     * @returns {Promise<axios.AxiosResponse<any>>}
     */
    register(param){
        return request.post('/user/register', param)
    },

    /**
     * 登录
     * @returns {Promise<axios.AxiosResponse<any>>}
     * @param param
     */
    login(param) {
        return request.post('/user/login',param)
    },

    findPassword(param){
        return request.post('/user/findPassword', param)
    },

    /**
     * 分页查询
     * @param pageNum
     * @param pageSize
     * @param username
     * @param email
     * @param address
     * @returns {Promise<axios.AxiosResponse<any>>}
     */
    pageQuery(pageNum, pageSize, username, email, address) {
        return request.get(`/user/page?pageNum=${pageNum}&pageSize=${pageSize}&username=${username}&email=${email}&address=${address}`)
    },


    /**
     * 新增和修改
     * @param params
     * @returns {Promise<axios.AxiosResponse<any>>}
     */
    add(params) {
        return request.post('/user', params)
    },

    /**
     * 删除
     * @param id
     * @returns {Promise<axios.AxiosResponse<any>>}
     */
    del(id) {
        return request.delete(`/user/${id}`)
    },

    /**
     * 批量删除
     * @param ids
     * @returns {Promise<axios.AxiosResponse<any>>}
     */
    delBatch(ids) {
        return request.post('/user/del/batch', ids)
    },

    /**
     * 获取请求权限
     * @param email
     * @returns {Promise<axios.AxiosResponse<any>>}
     */
    getRequestCode(email) {
        return request({
            url: '/common/code/request',
            method: 'post',
            data: {
                email: email
            }
        })
    },
    /**
     * 2.获取邮箱验证码
     * @param {*} email
     * @param code
     * @returns
     */
    getEmailCode(email, code) {
        let param = {}
        param.email = email
        param.code = code
        return request.post('/common/code/email',param)
    }

}

export default api