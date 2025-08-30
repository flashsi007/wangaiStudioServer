import axios from "axios"

const request = axios.create({
    baseURL: import.meta.env.VITE_AXIOS_BASE_URL,
    withCredentials: false,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },

})

/**
 * @description 请求拦截器
 */
request.interceptors.request.use(
    (config) => {
        let token = window.localStorage.getItem('token');
        config.headers['Authorization'] = 'Bearer ' + token
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)



/**
 * @description 响应拦截器
 */
request.interceptors.response.use(
    (response) => {

        // @ts-ignore   

        //  window.$dialog.error({
        //     title: '错误',
        //     content: response.data.errors.message || response.data.message || "系统故障！",
        //     positiveText: '知道了',
        //   }) 

        return response.data
    },
    (error) => {
        console.log(error)

        return Promise.reject(error)
    }
)

export const http = {

    get(url, config) {
        return request.get(url, config)
    },
    post(url, data, config) {
        return request.post(url, data, config)
    },
    delete(url, config) {
        return request.delete(url, config)
    },
    put(url, data, config) {
        return request.put(url, data, config)
    }
}
