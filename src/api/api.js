import { API } from '@/utils/request'
import { SYSTEM } from './apiMaps'

export default {
  /** =================================================  公共 =========================================================*/
  /**
   * @method: getProvince
   * @description: 获取 省 数据
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params 无
   * @return {Object} 省 list
   */
  getProvince(params, callback) {
    return API.get(SYSTEM.AREA.PROVINCE, params, callback)
  },
  /**
   * @method: getCity
   * @description: 获取 市 数据
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {string} params 省ID
   * @return {Object} 市 list
   */
  getCity(params, callback) {
    return API.getDirect(SYSTEM.AREA.CITY, params, callback)
  },
  /**
   * @method: getCountry
   * @description: 获取 区/县 数据
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {string} params 市ID
   * @return {Object} 区/县 list
   */
  getCountry(params, callback) {
    return API.getDirect(SYSTEM.AREA.COUNTRY, params, callback)
  },
  /**
   * @method: download
   * @description: 下载资源
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {string} params 资源URL
   * @return {Object} 下载资源
   */
  download(params, callback) {
    return API.download(SYSTEM.DOWNLOAD, params, callback)
  },
  /**
   * @method: getDictionary
   * @description: 字典查询
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {string} params key,多个逗号隔开
   * @return{Object}  被查询字典数组集合
   */
  getDictionary(params, callback) {
    return API.getDirect(SYSTEM.DICTIONARY, params, callback)
  },
  /** ================================================   用户相关 =====================================================*/
  /**
   * @method: login
   * @description: 登录接口
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params {agentAccount:'账号',pwd:'加密密码'}
   * @return{Object} 成功与否
   */
  login(params, callback) {
    return API.post(SYSTEM.USER.LOGIN, params, callback)
  },
  /**
   * @method: getUserInfo
   * @description: 获取用户信息，角色权限
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params 无
   * @return{Object} 返回用户当前角色信息以及权限
   */
  getUserInfo(params, callback) {
    return API.get(SYSTEM.USER.INFO, params, callback)
  },
  /**
   * @method: changePassword
   * @description: 更改密码
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params {oldPwd:'旧密码（加密）',newPwd:'新密码（加密）',confirmNewPwd:'确认新密码（加密）'}
   * @return{Object} 返回用户当前角色信息以及权限
   */
  changePassword(params, callback) {
    return API.put(SYSTEM.USER.CHANGEPASSWORD, params, callback)
  },
  /**
   * @method: changeBookCasePassword
   * @description: 更改密码
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params {oldPwd:'旧密码（加密）',newPwd:'新密码（加密）',confirmNewPwd:'确认新密码（加密）'}
   * @return{Object} 返回成功与否
   */
  changeBookCasePassword(params, callback) {
    return API.put(SYSTEM.USER.CHANGEBOOKCASEPASSWORD, params, callback)
  },

  // 首页统计
  getIndexStatistics(params, callback) {
    return API.get(SYSTEM.INDEX, params, callback)
  },
  /** ===============================================  学校管理 =======================================================*/
  /**
   * @method: getSchoolList
   * @description: 学校管理 => 列表
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params
   * @return{Object} 学校列表
   */
  getSchoolList(params, callback) {
    return API.get(SYSTEM.SCHOOL.LIST, params, callback)
  },
  /**
   * @method: getSchoolDetail
   * @description: 学校管理 => 获取学校详情
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params {schoolId:'学校ID'}
   * @return{Object} 学校详情信息
   */
  getSchoolDetail(params, callback) {
    return API.getDirect(SYSTEM.SCHOOL.DETAIL, params, callback)
  },
  /**
   * @method: addSchool
   * @description: 学校管理 => 添加学校
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params
   * @return{Object} 成功与否
   */
  addSchool(params, callback) {
    return API.post(SYSTEM.SCHOOL.ADD, params, callback)
  },
  /**
   * @method: editSchool
   * @description: 学校管理 => 修改学校信息
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params
   * @return{Object} 成功与否
   */
  editSchool(params, callback) {
    return API.put(SYSTEM.SCHOOL.EDIT, params, callback)
  },
  /**
   * @method: prohibitSchool
   * @description: 学校管理 => 启用/禁用学校
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params {schoolId:'当前学校ID', enableFlag: 0/1}
   * @return{Object} 成功与否
   */
  prohibitSchool(params, callback) {
    return API.put(SYSTEM.SCHOOL.PROHIBIT, params, callback)
  },
  /**
   * @method: getSchoolBookcaseList
   * @description: 学校管理 => 绑定书柜 => 绑定书柜列表数据
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params
   * @return{Object} 当前学校书柜列表
   */
  getSchoolBookcaseList(params, callback) {
    return API.get(SYSTEM.SCHOOL.BOOKCASELIST, params, callback)
  },
  /**
   * @method: schoolBookcaseCode
   * @description: 学校管理 => 绑定书柜 => 获取可绑定书柜列表
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params {bookcaseStatus:0}
   * @return{Object} 可绑定书柜列表
   */
  schoolBookcaseCode(params, callback) {
    return API.get(SYSTEM.SCHOOL.BOOKCASECODE, params, callback)
  },
  /**
   * @method: schoolBookcaseBinding
   * @description: 学校管理 => 绑定书柜 => 绑定/取消绑定书柜
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params {schoolId:'学校ID',bookcaseId:'书柜ID',bookcaseStatus:0/1}
   * @return{Object} 成功与否
   */
  schoolBookcaseBinding(params, callback) {
    return API.post(SYSTEM.SCHOOL.BOOKCASEBINDING, params, callback)
  },
  /**
   * @method: getDetailRecharge
   * @description: 学校管理 => 充值设置 => 获取列表信息
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params {schoolId:'学校ID'}
   * @return{Object} 充值设置列表信息
   */
  getDetailRecharge(params, callback) {
    return API.get(SYSTEM.SCHOOL.RECHARGESET, params, callback)
  },
  /**
   * @method: updateRechargeSet
   * @description: 学校管理 => 充值设置 => 更新设置
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params
   * @return{Object} 成功与否
   */
  updateRechargeSet(params, callback) {
    return API.put(SYSTEM.SCHOOL.UPDATE, params, callback)
  },
  /** ===============================================   设备管理 ======================================================*/
  /**
   * @method: getEquipmentBookcaseList
   * @description: 设备管理 => 书柜管理 => 列表
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params
   * @return{Object} 书柜管理列表
   */
  getEquipmentBookcaseList(params, callback) {
    return API.get(SYSTEM.EQUIPMENT.BOOKCASEMANAGE.LIST, params, callback)
  },
  /**
   * @method: getEquipmentBookcaseDetail
   * @description: 设备管理 => 书柜管理 => 书柜详情（该页面暂无开发）
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params
   * @return{Object} 书柜详情
   */
  getEquipmentBookcaseDetail(params, callback) {
    return API.get(SYSTEM.EQUIPMENT.BOOKCASEMANAGE.DETAIL, params, callback)
  },
  /**
   * @method: getEquipmentBorrowCardList
   * @description: 设备管理 => 借阅卡管理 => 借阅卡列表
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params
   * @return{Object} 借阅卡列表
   */
  getEquipmentBorrowCardList(params, callback) {
    return API.get(SYSTEM.EQUIPMENT.BORROWCARD.LIST, params, callback)
  },
  /**
   * @method: equipmentBorrowCardLose
   * @description: 设备管理 => 借阅卡管理 => 借阅卡挂失/取消挂失
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params {borrowCardId:'借阅卡ID',cardStatus: 1/0}
   * @return{Object} 成功与否
   */
  equipmentBorrowCardLose(params, callback) {
    return API.put(SYSTEM.EQUIPMENT.BORROWCARD.REPORTLOSE, params, callback)
  },
  /**
   * @method: equipmentBorrowCardDelete
   * @description: 设备管理 => 借阅卡管理 => 删除
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params {borrowCardId:'借阅卡ID'}
   * @return{Object} 成功与否
   */
  equipmentBorrowCardDelete(params, callback) {
    return API.deleteDirect(SYSTEM.EQUIPMENT.BORROWCARD.DELETE, params, callback)
  },
  /**
   * @method: equipmentBorrowCardUnBound
   * @description: 设备管理 => 借阅卡管理 => 解除绑定
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params {borrowCardId:'借阅卡ID'}
   * @return{Object} 成功与否
   */
  equipmentBorrowCardUnBound(params, callback) {
    return API.deleteDirect(SYSTEM.EQUIPMENT.BORROWCARD.UNBOUND, params, callback)
  },
  /** ============================================  学校管理 => 书籍管理 ===============================================*/
  /**
   * @method: getBooksList
   * @description: 学校管理 => 书籍管理 => 列表数据
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params
   * @return{Object} 书籍管理列表数据
   */
  getBooksList(params, callback) {
    return API.get(SYSTEM.BOOKS.LIST, params, callback)
  },
  /**
   * @method: getBooksDetail
   * @description: 学校管理 => 书籍管理 => 书籍详情
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params {bookTemplateId:'书籍模版ID'}
   * @return{Object} 书籍详情
   */
  getBooksDetail(params, callback) {
    return API.getDirect(SYSTEM.BOOKS.DETAIL, params, callback)
  },
  /**
   * @method: getBooksNumber
   * @description: 学校管理 => 书籍管理 => 书籍入库数量
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {String} params {bookTemplateId:'书籍模版ID'}
   * @return{Object} 书籍入库数量列表
   */
  getBooksNumber(params, callback) {
    return API.getDirect(SYSTEM.BOOKS.NUMBER, params, callback)
  },
  /** ============================================  学校管理 => 学校管理 ===============================================*/
  /**
   * @method: getGradeList
   * @description: 学校管理 => 学校管理 => 年级管理
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params {schoolId:'学校ID',gradeName:'年级名称',pageNum:1,pageSize:10}
   * @return{Object} 年级列表数据
   */
  getGradeList(params, callback) {
    return API.get(SYSTEM.SCHOOLMANAGE.GRADE.LIST, params, callback)
  },
  /**
   * @method: addGrade
   * @description: 学校管理 => 学校管理 => 年级管理 => 新增年级
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params
   * @return{Object} 成功与否
   */
  addGrade(params, callback) {
    return API.post(SYSTEM.SCHOOLMANAGE.GRADE.ADD, params, callback)
  },
  /**
   * @method: editGrade
   * @description: 学校管理 => 学校管理 => 年级管理 => 修改年级
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params
   * @return{Object} 成功与否
   */
  editGrade(params, callback) {
    return API.put(SYSTEM.SCHOOLMANAGE.GRADE.EDIT, params, callback)
  },
  /**
   * @method: deleteGrade
   * @description: 学校管理 => 学校管理 => 年级管理 => 删除年级
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params
   * @return{Object} 成功与否
   */
  deleteGrade(params, callback) {
    return API.deleteDirect(SYSTEM.SCHOOLMANAGE.GRADE.DELETE, params, callback)
  },
  /**
   * @method: getGradeDetail
   * @description: 学校管理 => 学校管理 => 年级管理 => 获取年级详情
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params {gradeId:'年级ID'}
   * @return{Object} 年级详情
   */
  getGradeDetail(params, callback) {
    return API.getDirect(SYSTEM.SCHOOLMANAGE.GRADE.DETAIL, params, callback)
  },
  /**
   * @method: getClassList
   * @description: 学校管理 => 学校管理 => 班级管理
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params
   * @return{Object} 班级管理列表
   */
  getClassList(params, callback) {
    return API.get(SYSTEM.SCHOOLMANAGE.CLASS.LIST, params, callback)
  },
  /**
   * @method: getAllGrade
   * @description: 学校管理 => 学校管理 => 班级管理 => 获取学校所有年级
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params {schoolId:'学校ID'}
   * @return{Object} 学校所有年级list
   */
  getAllGrade(params, callback) {
    return API.getDirect(SYSTEM.SCHOOLMANAGE.GRADE.ALL, params, callback)
  },
  /**
   * @method: getAllClass
   * @description: 学校管理 => 学校管理 => 班级管理 => 获取学校所有班级
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params {gradeId:'年级ID'}
   * @return{Object} 学校所有班级list
   */
  getAllClass(params, callback) {
    return API.get(SYSTEM.SCHOOLMANAGE.CLASS.ALL, params, callback)
  },
  /**
   * @method: addClass
   * @description: 学校管理 => 学校管理 => 班级管理 => 新增班级
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params
   * @return{Object} 成功与否
   */
  addClass(params, callback) {
    return API.post(SYSTEM.SCHOOLMANAGE.CLASS.ADD, params, callback)
  },
  /**
   * @method: editClass
   * @description: 学校管理 => 学校管理 => 班级管理 => 修改班级
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params
   * @return{Object} 成功与否
   */
  editClass(params, callback) {
    return API.put(SYSTEM.SCHOOLMANAGE.CLASS.EDIT, params, callback)
  },
  /**
   * @method: deleteClass
   * @description: 学校管理 => 学校管理 => 班级管理 => 删除班级
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params {classId:'班级ID'}
   * @return{Object} 成功与否
   */
  deleteClass(params, callback) {
    return API.deleteDirect(SYSTEM.SCHOOLMANAGE.CLASS.DELETE, params, callback)
  },
  /**
   * @method: getClassDetail
   * @description: 学校管理 => 学校管理 => 班级管理 => 获取班级详情
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params
   * @return{Object} 班级详情
   */
  getClassDetail(params, callback) {
    return API.getDirect(SYSTEM.SCHOOLMANAGE.CLASS.DETAIL, params, callback)
  },
  /**
   * @method: getStudentList
   * @description: 学校管理 => 学校管理 => 学生家长管理 => 学生列表
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params
   * @return{Object} 学生列表list
   */
  getStudentList(params, callback) {
    return API.get(SYSTEM.SCHOOLMANAGE.STUDENTPARENT.LISTSTUDENT, params, callback)
  },
  /**
   * @method: addStudent
   * @description: 学校管理 => 学校管理 => 学生家长管理 => 新增学生
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params
   * @return{Object} 成功与否
   */
  addStudent(params, callback) {
    return API.post(SYSTEM.SCHOOLMANAGE.STUDENTPARENT.ADDSTUDENT, params, callback)
  },
  /**
   * @method: editStudent
   * @description: 学校管理 => 学校管理 => 学生家长管理 => 修改学生
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params
   * @return{Object} 成功与否
   */
  editStudent(params, callback) {
    return API.put(SYSTEM.SCHOOLMANAGE.STUDENTPARENT.EDITSTUDENT, params, callback)
  },
  /**
   * @method: deleteStudent
   * @description: 学校管理 => 学校管理 => 学生家长管理 => 删除学生
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params
   * @return{Object} 成功与否
   */
  deleteStudent(params, callback) {
    return API.delete(SYSTEM.SCHOOLMANAGE.STUDENTPARENT.DELETESTUDENT, params, callback)
  },
  /**
   * @method: deleteStudent
   * @description: 学校管理 => 学校管理 => 学生家长管理 => 获取学生详情
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params
   * @return{Object} 学生详情信息
   */
  getStudentDetail(params, callback) {
    return API.get(SYSTEM.SCHOOLMANAGE.STUDENTPARENT.DETAILSTUDENT, params, callback)
  },
  /**
   * @method: rechargeStudent
   * @description: 学校管理 => 学校管理 => 学生家长管理 => 学生充值（暂无开发）
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params
   * @return{Object} 成功与否
   */
  rechargeStudent(params, callback) {
    return API.post(SYSTEM.SCHOOLMANAGE.STUDENTPARENT.RECHARGE, params, callback)
  },
  /**
   * @method: getParentList
   * @description: 学校管理 => 学校管理 => 学生家长管理 => 学生家长列表
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params
   * @return{Object} 学生家长列表list
   */
  getParentList(params, callback) {
    return API.get(SYSTEM.SCHOOLMANAGE.STUDENTPARENT.LISTPARENT, params, callback)
  },
  /**
   * @method: addParent
   * @description: 学校管理 => 学校管理 => 学生家长管理 => 新增家长
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params
   * @return{Object} 成功与否
   */
  addParent(params, callback) {
    return API.post(SYSTEM.SCHOOLMANAGE.STUDENTPARENT.ADDPARENT, params, callback)
  },
  /**
   * @method: editParent
   * @description: 学校管理 => 学校管理 => 学生家长管理 => 修改家长
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params
   * @return{Object} 成功与否
   */
  editParent(params, callback) {
    return API.put(SYSTEM.SCHOOLMANAGE.STUDENTPARENT.EDITPARENT, params, callback)
  },
  /**
   * @method: deleteParent
   * @description: 学校管理 => 学校管理 => 学生家长管理 => 删除家长
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params
   * @return{Object} 成功与否
   */
  deleteParent(params, callback) {
    return API.delete(SYSTEM.SCHOOLMANAGE.STUDENTPARENT.DELETEPARENT, params, callback)
  },
  /**
   * @method: getParentDetail
   * @description: 学校管理 => 学校管理 => 学生家长管理 => 获取家长详情
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} params
   * @return{Object} 家长详情信息
   */
  getParentDetail(params, callback) {
    return API.get(SYSTEM.SCHOOLMANAGE.STUDENTPARENT.DETAILPARENT, params, callback)
  },
  /** ================================================  借阅记录 ======================================================*/
  /**
   * @method: getSearchSchool
   * @description: 借阅记录 => 学校名称搜索
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} {searchKey:'搜索关键字'}
   * @return{Object} 家长详情信息
   */
  getSearchSchool(params, callback) {
    return API.get(SYSTEM.BORROWRECORD.SEARCHSCHOOL, params, callback)
  },
  /**
   * @method: getSearchBooks
   * @description: 借阅记录 => 书籍搜索
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} {searchKey:'搜索关键字'}
   * @return{Object} 家长详情信息
   */
  getSearchBooks(params, callback) {
    return API.get(SYSTEM.BORROWRECORD.SEARCHBOOKS, params, callback)
  },
  /**
   * @method: getSearchStudent
   * @description: 借阅记录 => 学生搜索
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} {searchKey:'搜索关键字'}
   * @return{Object} 家长详情信息
   */
  getSearchStudent(params, callback) {
    return API.get(SYSTEM.BORROWRECORD.SEARCHSTUDENT, params, callback)
  },
  /**
   * @method: getBorrowRecordList
   * @description: 借阅记录 => 列表
   * @author: ProudBin
   * @update: 2019-06-04
   * @param {Object} {searchKey:'搜索关键字'}
   * @return{Object} 家长详情信息
   */
  getBorrowRecordList(params, callback) {
    return API.get(SYSTEM.BORROWRECORD.LIST, params, callback)
  }
}
