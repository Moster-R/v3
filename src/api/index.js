import axios from "axios";
import router from "@/router";
import store from "@/store";


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
    if(config.url!== '/login/'){
        const token = sessionStorage.getItem('token')
        if(token) {
            config.headers['token'] = token
        }
    }
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
    if (error.response.status === 2001){// 如果返回 401 错误，表示 token 无效或已过期
        router.replace('/login').then(()=>{ // 跳转到登录页面
            store.commit('deleteUserInfo')
            // 处理 Promise 的返回结果
            console.log('跳转到登录页面成功');
        })
    }
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

    /**
     * 找回密码
     * @param param
     * @returns {Promise<axios.AxiosResponse<any>>}
     */
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
     * 查询用户信息
     * @param username
     * @returns {Promise<axios.AxiosResponse<any>>}
     */
    findName(username){
        return request.get(`/user/username/${username}`)
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
    },

    /**
     * 文件分页查询
     * @param pageNum
     * @param pageSize
     * @param name
     * @returns {Promise<axios.AxiosResponse<any>>}
     */
    FilePageQuery(pageNum, pageSize,name) {
        return request.get(`/files/page?pageNum=${pageNum}&pageSize=${pageSize}&name=${name}`)
    },

    /**
     * 文件删除
     * @param id
     * @returns {Promise<axios.AxiosResponse<any>>}
     */
    FileDel(id) {
        return request.delete(`/files/${id}`)
    },

    /**
     * 文件批量删除
     * @param ids
     * @returns {Promise<axios.AxiosResponse<any>>}
     */
    FileDelBatch(ids) {
        return request.post('/files/del/batch', ids)
    },
    /**
     * 链接是否启用
     * @param params
     * @returns {Promise<axios.AxiosResponse<any>>}
     */
    updateIsEnable(params) {
        return request.post('/files/updateIsEnable', params)
    }

}

export default api