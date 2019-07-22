const currentHost = window.location.host
// 测试环境，联调环境，测试环境域名
const hosts = ['192.168.3.5', '192.168.3.2', '192.168.3.3', 'opr.xiaohebook.com', '112.124.194.197']
let prefix = hosts.find(host => {
  return currentHost.indexOf(host) > -1
})
// 如果是IP地址，并且是192.168.3开头，则默认为开发环境，否则为线上环境
if (!!prefix && currentHost.indexOf('192.168.3.3') > -1) {
  prefix = 'test'
} else if (!!prefix && currentHost.indexOf('192.168.3') > -1) {
  prefix = 'dev'
} else if (!!prefix && (currentHost.indexOf('opr.xiaohebook.com') > -1 || currentHost.indexOf('112.124.194.197') > -1)) {
  prefix = 'pro'
}
let BASE_API = ''
switch (prefix) {
  case 'dev':
    BASE_API = 'http://192.168.3.2:8082'
    break
  case 'test':
    BASE_API = 'http://192.168.3.3:8180'
    break
  case 'pro':
    BASE_API = 'https://opr.xiaohebook.com/server'
    break
  default:
    BASE_API = 'http://192.168.3.2:8082'
    break
}

const path = _path => BASE_API + _path

export const SYSTEM = {
  // 省市区
  AREA: {
    PROVINCE: path('/area/province'),
    CITY: path('/area/city'),
    COUNTRY: path('/area/country')
  },
  // 用户相关
  USER: {
    // 登录url
    LOGIN: path('/login'),
    // 用户信息
    INFO: path('/agent'),
    // 修改密码
    CHANGEPASSWORD: path('/agent/resetPwd'),
    // 修改书柜密码
    CHANGEBOOKCASEPASSWORD: path('/agent/resetBookcasePwd')
  },
  // 首页统计数据
  INDEX: path('/school/list'),
  DOWNLOAD: path(''),
  // 学校管理（学校）
  SCHOOL: {
    // 学校列表
    LIST: path('/school/list'),
    // 学校详情信息
    DETAIL: path('/school'),
    // 新增学校
    ADD: path('/school'),
    // 导入学校
    IMPORTSCHOOL: path('/school/import'),
    // 修改学校
    EDIT: path('/school'),
    // 禁用学校
    PROHIBIT: path('/school/enable'),
    // 学校书柜数据详情
    BOOKCASELIST: path('/bookcase/school/list'),
    // 学校书柜编码列表
    BOOKCASECODE: path('/bookcase/agent/list/binding'),
    // 学校书柜绑定解绑
    BOOKCASEBINDING: path('/bookcase/school/binding'),
    // 充值设置
    RECHARGESET: path('/school/pay/project/list'),
    // 充值设置更新
    UPDATE: path('/school/pay/project')
  },
  // 设备管理
  EQUIPMENT: {
    // 书柜管理
    BOOKCASEMANAGE: {
      // 书柜列表
      LIST: path('/bookcase/agent/list'),
      // 书柜详情
      DETAIL: path('/school/list')
    },
    // 借阅卡管理
    BORROWCARD: {
      // 借阅卡列表
      LIST: path('/borrowCard/page'),
      // 借阅卡挂失/取消挂失
      REPORTLOSE: path('/borrowCard/loss'),
      // 借阅卡删除
      DELETE: path('/borrowCard'),
      // 借阅卡解绑
      UNBOUND: path('/borrowCard/binding')
    }
  },
  // 书籍管理
  BOOKS: {
    LIST: path('/agent/book/page'),
    // 书籍详情信息
    DETAIL: path('/book/template'),
    // 书籍数量详情
    NUMBER: path('/agent/book/list')
  },
  // 字典查询
  DICTIONARY: path('/dict'),
  // 学校管理（年级，班级，学长家长）
  SCHOOLMANAGE: {
    GRADE: {
      // 年级列表
      LIST: path('/grade/page'),
      // 新增年级
      ADD: path('/grade'),
      // 修改年级
      EDIT: path('/grade'),
      // 删除年级
      DELETE: path('/grade'),
      // 获取年级详情
      DETAIL: path('/grade'),
      // 获取所有年级
      ALL: path('/grade/list')
    },
    CLASS: {
      // 班级列表
      LIST: path('/class/page'),
      // 新增班级
      ADD: path('/class'),
      // 修改班级
      EDIT: path('/class'),
      // 删除班级
      DELETE: path('/class'),
      // 获取班级详情
      DETAIL: path('/class/gc'),
      // 获取所有班级
      ALL: path('/class/list')
    },
    STUDENTPARENT: {
      // 学生列表
      LISTSTUDENT: path('/student/page'),
      // 添加学生
      ADDSTUDENT: path('/student'),
      // 修改学生
      EDITSTUDENT: path('/student'),
      // 删除学生
      DELETESTUDENT: path('/student'),
      // 充值
      RECHARGE: path('/grade/page'),
      // 学生详情
      DETAILSTUDENT: path('/student'),
      // 家长列表
      LISTPARENT: path('/student/parent'),
      // 添加家长
      ADDPARENT: path('/student/parent'),
      // 修改家长
      EDITPARENT: path('/student/parent'),
      // 删除家长
      DELETEPARENT: path('/student/parent'),
      // 家长详情
      DETAILPARENT: path('/student/parent/detail'),
      // 批量导入学生
      IMPORTSTUDENT: path('/student/import')
    }
  },
  BORROWRECORD: {
    // 查询学校/账号
    SEARCHSCHOOL: path('/school/search/combo'),
    // 查询书籍
    SEARCHBOOKS: path('/book/template/search/combo'),
    // 查询学生
    SEARCHSTUDENT: path('/student/search/combo'),
    // 借阅记录列表
    LIST: path('/book/borrowed/page')
  }
}
