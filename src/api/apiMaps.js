const currentHost = window.location.host
// 测试环境，联调环境，测试环境域名
const hosts = ['192.168.3.3:8180', '192.168.3.3:8980', 'agent.xiaohebook.com', '47.110.223.200']
let prefix = hosts.find(host => {
  return currentHost.indexOf(host) > -1
})
// 如果是IP地址，并且是192.168.3开头，则默认为开发环境，否则为线上环境
if (!!prefix && currentHost.indexOf('192.168.3.3:8180') > -1) {
  prefix = 'test'
} else if (!!prefix && currentHost.indexOf('192.168.3.3:8980') > -1) {
  prefix = 'dev'
} else if (!!prefix && (currentHost.indexOf('agent.xiaohebook.com') > -1 || currentHost.indexOf('47.110.223.200') > -1)) {
  prefix = 'pro'
}
let BASE_API = ''
switch (prefix) {
  case 'dev':
    BASE_API = 'http://192.168.3.3:8980'
    break
  case 'test':
    BASE_API = 'http://192.168.3.3:8180'
    break
  case 'pro':
    BASE_API = 'https://agent.xiaohebook.com/server'
    break
  default:
    BASE_API = 'http://192.168.3.3:8180'
    break
}

const path = _path => BASE_API + _path

export const SYSTEM = {
  // 获取七牛云图片上传权限 type=img/voice/video
  TOKEN: path('/qiniu/token'),
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
    CHANGEBOOKCASEPASSWORD: path('/agent/resetBookcasePwd'),
    // 新增支付密码
    ADDPAYPASSWORD: path('/agent/initPayPwd'),
    // 修改支付密码
    EDITPAYPASSWORD: path('/agent/resetPayPwd')
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
      ALL: path('/class/list'),
      // 所有班级和年级（分组）
      ALLCLASSGROUP: path('/class/all')
    },
    STUDENTPARENT: {
      // 学生列表
      LISTSTUDENT: path('/student/page'),
      // 添加学生
      ADDSTUDENT: path('/student'),
      // 添加学生（验证学生重复性）
      ADDSTUDENTTESTREPEAT: path('/student/v2'),
      // 加入家庭组
      JOINFAMILY: path('/student/joinFamily'),
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
    },
    TEACHER: {
      // 老师列表
      PAGETEACHER: path('/teacher/page'),
      // 老师学生
      ADDTEACHER: path('/teacher'),
      // 修改老师
      EDITTEACHER: path('/teacher'),
      // 删除老师
      DELETETEACHER: path('/teacher'),
      // 详情
      DETAILTEACHER: path('/teacher')
    }
  },
  // 借阅查询
  BORROWRECORD: {
    // 查询学校/账号
    SEARCHSCHOOL: path('/combo/search/school'),
    // 查询书籍
    SEARCHBOOKS: path('/combo/search/book/template'),
    // 查询学生
    SEARCHSTUDENT: path('/combo/search/student'),
    // 借阅记录列表
    LIST: path('/book/borrowed/page'),
    // 个人借阅记录
    PERSONABORROWLLIST: path('/book/borrowed/student/page'),
    // 书籍借阅记录
    BOOKBORROWLLIST: path('/book/borrowed/book/page'),
    // 柜号借阅记录
    BOOKCASENUMBORROWLLIST: path('/book/borrowed/grid/page'),
    // 导出借阅记录
    EXPORTBORROWRECORD: path('/book/borrowed/export')
  },
  // 异常维护
  SYSTEMANOMALOUS: {
    // 异常维护-借阅异常列表
    BORROWLIST: path('/borrowed/error/page'),
    // 异常维护-借阅异常-详情查看
    BORROWLISTDETAIL: path('/borrowed/error/detail'),
    // 异常维护-借阅异常-开启/关闭家长自助处理
    SELFHELP: path('/borrowed/error/selfHelp'),
    // 异常维护-书籍报修列表
    BOOKREPAIRLIST: path('/repair/page'),
    // 异常维护-书籍报修详情列表
    BOOKREPAIRDETAILLIST: path('/repair/detail/page'),
    // 异常维护-书籍报修详情列表-提交异常
    BOOKREPAIRDETAILSUBMIT: path('/repair/deal')
  },
  // 试用管理
  PROBATION: {
    // 系统维护-借阅异常列表
    LIST: path('/trial/school/page'),
    // 添加试用学生列表
    PROBATIONSTUDENTLIST: path('/student/trial/page'),
    // 试用人数列表/试用转付费人数
    PROBATIONNUMLIST: path('/trial/student/page'),
    // 试用人数统计导出
    PROBATIONNUMEXPORT: path('/trial/student/export'),
    // 新增试用学生
    ADDPROBATIONSTUDENT: path('/trial/student'),
    // 试用配置信息
    PROBATIONCONFIG: path('/trial/config')
  },
  // 付费管理
  PAYMANAGE: {
    // 订单查询
    ORDERQUERY: {
      // 后台充值订单
      LIST: path('/order/page'),
      // 订单详情
      DETAIL: path('/order/detail/page'),
      // 导出后台订单
      EXPORTWEB: path('/order/export'),
      // 导出详情
      EXPORTDETAIL: path('/order/detail/export'),
      // 购买套餐类型
      PACKAGETYPE: path('/school/allPackage')
    },
    // 充值管理
    RECHARGEMANAGE: {
      // 列表
      LIST: path('/school/pagePayInfo'),
      // 学生总数/学生充值列表
      STUDENTLIST: path('/student/pay/page'),
      // 批量充值
      BATCHREAHARGE: path('/pay/student/batch'),
      // 套餐类型
      PACKAGETYPE: path('/school/pay/project/packageType'),
      // 代理商资金
      CAPITAL: path('/agent/capital')
    }
  },
  SYSTEMSETTING: {
    // 客服管理
    CUSTOMER: {
      // 列表
      LIST: path('/support/getSupportList/page'),
      // 新增客服
      ADD: path('/support'),
      // 修改客服
      EDIT: path('/support'),
      // 删除客服
      DELETE: path('/support'),
      // 获取客服信息
      DETAIL: path('/support/getSupport'),
      // 已绑定学校列表
      BINDSCHOOLLIST: path('/support/getBindSchool/page'),
      // 未绑定学校列表
      UNBINDSCHOOLLIST: path('/support/getUnbindSchool/page'),
      // 客服绑定/批量绑定学校
      BINDSCHOOL: path('/support/batchBind'),
      // 客服解绑/批量解绑学校
      UNBINDSCHOOL: path('/support/batchUnbind')
    }
  }

}
