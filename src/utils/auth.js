import Cookies from 'js-cookie'

const TokenKey = 'AGENT_SESSION_ID'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  document.cookie = 'AGENT_SESSION_ID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;' // 用于快速登录删除cookies
  return Cookies.remove(TokenKey)
}
