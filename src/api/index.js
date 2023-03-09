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
    // 分页查询
    pageQuery(pageNum,pageSize,username,email,address){
        return request.get(`/user/page?pageNum=${pageNum}&pageSize=${pageSize}&username=${username}&email=${email}&address=${address}`)
    },

    // 新增或者修改
    add(params){
        return request.post('/user',params)
    },
    // 删除
    del(id){
        return request.delete(`/user/${id}`)
    },
    // 批量删除
    delBatch(ids) {
        return request.post('/user/del/batch',ids)
    },


    // 导入
    leadingIn(){
        return request.post('/user/upload')
    }

}

export default api