
const vFilter = {
  toRMB: value => {
    return `￥${(value / 100).toFixed(2)}`
  },
  toCents: value => {
    return `${value * 100}`
  },
  toSpotScore: value => {
    if (!value) return ''
    return `${(value / 10).toFixed(1)}`
  },
  toScore: value => {
    return `${value * 10}`
  }
}

export default vFilter
