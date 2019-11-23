import Cookies from 'js-cookie'

const TokenKey = 'AGENT_SESSION_ID'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  try {
    Cookies.remove(TokenKey, { path: '/', domain: 'xiaohebook.com' })// 用于快速登录删除cookies
  } catch (e) {
    console.log(e)
  }
  return Cookies.remove(TokenKey)
}
