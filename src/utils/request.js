import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  timeout: 10000, // 请求超时时间
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

// request拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['AGENT_SESSION_ID'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    if (config.method === 'get' || config.method === 'delete') {
      config.data = true // 强制配置项生效（为了解决 headers 中 Content-Type 设置无效）
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非10000是抛错 可结合自己业务进行修改
     */
    const res = response.data
    if (res.code !== 10000) {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })

      // 401 退出
      if (res.code === 401) {
        MessageBox.confirm(
          '你已被登出，可以取消继续留在该页面，或者重新登录',
          '确定登出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.assign(location.origin) // 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error) // for debug
    if (error.response.status === 401) {
      Message({
        message: '登录过期,请重新登录',
        type: 'error',
        duration: 5 * 1000
      })
      setTimeout(function() {
        store.dispatch('FedLogOut').then(() => {
          location.assign(location.origin) // 为了重新实例化vue-router对象 避免bug
        })
      }, 1000)
    } else {
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

const API = {
  get(url, params, callback) {
    return new Promise((resolve, reject) => {
      service.get(url, {
        params: params
      }).then((response) => {
        if (response.code === 10000) {
          callback && callback(response)
          resolve(response)
        } else {
          reject(response)
        }
      }).catch((error) => {
        reject(error)
      })
    })
  },
  getDirect(url, params, callback) {
    return new Promise((resolve, reject) => {
      service.get(url + '/' + params).then((response) => {
        if (response.code === 10000) {
          callback && callback(response)
          resolve(response)
        } else {
          reject(response)
        }
      }).catch((error) => {
        reject(error)
      })
    })
  },
  post(url, params, callback) {
    return new Promise((resolve, reject) => {
      service.post(url, params).then((response) => {
        if (response.code === 10000) {
          callback && callback(response)
          resolve(response)
        } else {
          reject(response)
        }
      }).catch((error) => {
        reject(error)
      })
    })
  },
  delete(url, params, callback) {
    return new Promise((resolve, reject) => {
      service.delete(url, {
        params: params
      }).then((response) => {
        if (response.code === 10000) {
          callback && callback(response)
          resolve(response)
        } else {
          reject(response)
        }
      }).catch((error) => {
        reject(error)
      })
    })
  },
  deleteDirect(url, params, callback) {
    return new Promise((resolve, reject) => {
      service.delete(url + '/' + params).then((response) => {
        if (response.code === 10000) {
          callback && callback(response)
          resolve(response)
        } else {
          reject(response)
        }
      }).catch((error) => {
        reject(error)
      })
    })
  },
  put(url, params, callback) {
    return new Promise((resolve, reject) => {
      service.put(url, params).then((response) => {
        if (response.code === 10000) {
          callback && callback(response)
          resolve(response)
        } else {
          reject(response)
        }
      }).catch((error) => {
        reject(error)
      })
    })
  },
  upload(url, params, callback) {
    return new Promise((resolve, reject) => {
      service.post(url, params, { headers: { 'Content-Type': 'multipart/form' }}).then((response) => {
        if (response.code === 10000) {
          callback && callback(response)
          resolve(response)
        } else {
          reject(response)
        }
      }).catch((error) => {
        reject(error)
      })
    })
  },
  download(url, params, callback) {
    window.location.href = url + params
  }
}

export { API }
