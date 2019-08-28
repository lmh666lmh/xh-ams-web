
export function isvalidUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function regPhone(telphone) {
  return /^1(1|3|4|5|6|7|8|9)\d{9}$/.test(telphone)
}
