const axios = require('axios')
const {sendEmailFromQQ} = require('../utils')
const service = axios.create({
    baseURL: 'https://api.juejin.cn',
    timeout: 5000
})

service.interceptors.request.use(
    config => {
        config.headers['cookie'] = process.env.JUE_JIN_TOKEN
        return config
    }
)

service.interceptors.response.use(
    response => {
        if (response.data.err_no === 0) {
            return response.data.data
        } else {
            sendEmailFromQQ('签到出错', response.data.err_msg)
            return Promise.reject(response.data.err_msg)
        }
    },
    error => {
        return Promise.reject(error)
    }
)

module.exports = service
