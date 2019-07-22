import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  { path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  { path: '/forgetPassword',
    component: () => import('@/views/forgetPassword'),
    hidden: true
  },
  { path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/school/index',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'index',
      component: () => import('@/views/index/index')
    }]
  }
]

export const asyncRouterMap = [
  {
    path: '/index',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '',
        name: 'Index',
        component: () => import('@/views/index/index'),
        meta: { title: '首页', icon: 'example' }
      }
    ]
  },
  {
    path: '/editPassword',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '',
        name: 'EditPassword',
        component: () => import('@/views/editPassword'),
        meta: { title: '修改后台密码' }
      }
    ]
  },
  {
    path: '/editBookCasePassword',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '',
        name: 'EditBookCasePassword',
        component: () => import('@/views/editBookCasePassword'),
        meta: { title: '修改书柜密码' }
      }
    ]
  },
  {
    path: '/message',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '',
        name: 'Message',
        component: () => import('@/views/message'),
        meta: { title: '信息管理' }
      }
    ]
  },
  {
    path: '/school',
    component: Layout,
    name: 'School',
    redirect: '/school/index',
    meta: { title: '学校列表', icon: 'example' },
    children: [
      {
        path: 'index',
        name: 'SchoolList',
        component: () => import('@/views/school/index')
      },
      {
        path: 'detail',
        name: 'SchoolDetail',
        component: () => import('@/views/school/detail'),
        hidden: true,
        meta: { title: '学校信息' }
      },
      {
        path: 'bookcaseDetail',
        name: 'BookcaseDetail',
        component: () => import('@/views/school/bookcaseDetail'),
        hidden: true,
        meta: { title: '书柜详情' }
      }
    ]
  },
  {
    path: '/schoolManage',
    component: Layout,
    name: 'SchoolManage',
    redirect: '/schoolManage/index',
    hidden: true,
    meta: { title: '学校管理' },
    children: [
      {
        path: 'index',
        name: '',
        component: () => import('@/views/schoolManage/index'),
        children: [
          {
            path: 'grade',
            name: 'Grade',
            component: () => import('@/views/schoolManage/grade')
          },
          {
            path: 'class',
            name: 'Class',
            component: () => import('@/views/schoolManage/class')
          },
          {
            path: 'studentParent',
            name: 'StudentParent',
            component: () => import('@/views/schoolManage/studentParent')
          }
        ]
      }
    ]
  },
  {
    path: '/equipment',
    component: Layout,
    name: 'Equipment',
    redirect: '/equipment/bookcaseManage',
    meta: { title: '设备管理', icon: 'example' },
    children: [
      {
        path: 'bookcaseManage',
        name: 'BookcaseManage',
        component: () => import('@/views/equipment/bookcaseManage'),
        meta: { title: '书柜管理' }
      },
      {
        path: 'borrowCardManage',
        name: 'BorrowCardManage',
        component: () => import('@/views/equipment/borrowCardManage'),
        meta: { title: '借阅卡管理' }
      },
      {
        path: 'bookcaseDetail',
        name: 'bookcaseDetail',
        component: () => import('@/views/equipment/detail'),
        hidden: true,
        meta: { title: '书柜详情' }
      }
    ]
  },
  {
    path: '/borrowingRecords',
    component: Layout,
    name: 'BorrowingRecords',
    redirect: '/borrowingRecords/index',
    meta: { title: '借阅记录', icon: 'example' },
    children: [
      {
        path: 'index',
        name: '',
        component: () => import('@/views/borrowingRecords/index')
      },
      {
        path: 'personalDetail',
        name: 'PersonalDetail',
        component: () => import('@/views/borrowingRecords/personalDetail'),
        hidden: true,
        meta: { title: '个人借阅记录' }
      },
      {
        path: 'bookcaseNumDetail',
        name: 'BookcaseNumDetail',
        component: () => import('@/views/borrowingRecords/bookcaseNumDetail'),
        hidden: true,
        meta: { title: '柜号借阅记录' }
      },
      {
        path: 'bookDetail',
        name: 'BookDetail',
        component: () => import('@/views/borrowingRecords/bookDetail'),
        hidden: true,
        meta: { title: '书籍借阅记录' }
      }
    ]
  },
  {
    path: '/books',
    component: Layout,
    hidden: true,
    name: 'Books',
    redirect: '/books/index',
    meta: { title: '书籍管理', icon: 'example' },
    children: [
      {
        path: 'index',
        name: '',
        component: () => import('@/views/books/index')
      },
      {
        path: 'addBooks',
        name: 'AddBooks',
        component: () => import('@/views/books/addBooks'),
        hidden: true,
        meta: { title: '书籍信息' }
      },
      {
        path: 'booksNumber',
        name: 'BooksNumber',
        component: () => import('@/views/books/booksNumber'),
        hidden: true,
        meta: { title: '入库数量' }
      },
      {
        path: 'booksStatus',
        name: 'BooksStatus',
        component: () => import('@/views/books/booksStatus'),
        hidden: true,
        meta: { title: '书籍状态' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const routes = [...constantRouterMap]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: routes
})
