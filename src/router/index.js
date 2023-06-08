import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * roles: ['admin', 'common']       // 访问路由的角色权限
 * permissions: ['a:a:a', 'b:b:b']  // 访问路由的菜单权限
 * meta : {
    noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register'),
    hidden: true
  },
  {
    path: '/platform',
    component: () => import('@/views/platform'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    meta:{
      platform:'index'
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/index'),
        name: 'Index',
        meta: { title: '首页', icon: 'dashboard', affix: true },
        children:[]
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: () => import('@/views/system/user/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  }
]

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = [
  {
    path: '/system/user-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:user:edit'],
    children: [
      {
        path: 'role/:userId(\\d+)',
        component: () => import('@/views/system/user/authRole'),
        name: 'AuthRole',
        meta: { title: '分配角色', activeMenu: '/system/user' }
      }
    ]
  },
  {
    path: '/system/role-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:role:edit'],
    children: [
      {
        path: 'user/:roleId(\\d+)',
        component: () => import('@/views/system/role/authUser'),
        name: 'AuthUser',
        meta: { title: '分配用户', activeMenu: '/system/role' }
      }
    ]
  },
  {
    path: '/system/dict-data',
    component: Layout,
    hidden: true,
    permissions: ['system:dict:list'],
    children: [
      {
        path: 'index/:dictId(\\d+)',
        component: () => import('@/views/system/dict/data'),
        name: 'Data',
        meta: { title: '字典数据', activeMenu: '/system/dict' }
      }
    ]
  },
  {
    path: '/monitor/job-log',
    component: Layout,
    hidden: true,
    permissions: ['monitor:job:list'],
    children: [
      {
        path: 'index/:jobId(\\d+)',
        component: () => import('@/views/monitor/job/log'),
        name: 'JobLog',
        meta: { title: '调度日志', activeMenu: '/monitor/job' }
      }
    ]
  },
  {
    path: '/tool/gen-edit',
    component: Layout,
    hidden: true,
    permissions: ['tool:gen:edit'],
    children: [
      {
        path: 'index/:tableId(\\d+)',
        component: () => import('@/views/tool/gen/editTable'),
        name: 'GenEdit',
        meta: { title: '修改生成配置', activeMenu: '/tool/gen' }
      }
    ]
  }
]

// 环境检测子系统
export const environmentRoutes = [
  {
    component:Layout,
    meta:{
      platform:'environment'
    },
    path:"/environment",
    redirect:'/environment/dashboard',
    children:[{
      path:"dashboard",
      component: () => import('@/views/environment/dashboard/index.vue')
    },{
      path:"device",
      component: () => import('@/views/environment/device')
    },{
      path:"weather-data",
      component: () => import('@/views/environment/weather-monitor/data.vue')
    },{
      path:"weather-history",
      component: () => import('@/views/environment/weather-history/index.vue')
    },{
      path:"weather-publish",
      component: () => import('@/views/environment/weather-publish')
    },{
      path:"setting",
      component: () => import('@/views/environment/setting')
    }]
  }
]

// 井盖
export const wellLidRoutes = [
  {
    component:Layout,
    meta:{
      platform:'wellLid'
    },
    path:"/wellLid",
    redirect:'/wellLid/dashboard',
    children:[{
      path:"dashboard",
      component: () => import('@/views/wellLid/dashboard/index.vue')
    },{
      path:"device",
      component: () => import('@/views/wellLid/device')
    },{
      path:"inspect",
      component: () => import('@/views/wellLid/inspect')
    },{
      path:'alarms',
      component: () => import('@/views/wellLid/alarms')
    },{
      path:'fortify',
      component: () => import('@/views/wellLid/fortify')
    },{
      path:'fortify-history',
      component: () => import('@/views/wellLid/fortify-history')
    },{
      path:'setting',
      component: () => import('@/views/wellLid/setting')
    }]
  }
]

// 视频
export const videoRoutes = [
  {
    component:Layout,
    meta:{
      platform:'video'
    },
    path:"/video",
    redirect:'/video/dashboard',
    children:[{
      path:"dashboard",
      component: () => import('@/views/video/dashboard/index.vue')
    },{
      path:"device",
      component: () => import('@/views/video/device')
    },{
      path:"monitor",
      component: () => import('@/views/video/monitor')
    },{
      path:'setting',
      component: () => import('@/views/video/setting')
    }]
  }
]

// 积水
export const hydropsRoutes = [
  {
    component:Layout,
    meta:{
      platform:'hydrops'
    },
    path:"/hydrops",
    redirect:'/hydrops/dashboard',
    children:[{
      path:"dashboard",
      component: () => import('@/views/hydrops/dashboard/index.vue')
    },{
      path:"device",
      component: () => import('@/views/hydrops/device')
    },{
      path:"monitor",
      component: () => import('@/views/hydrops/monitor')
    },{
      path:'alarms-list',
      component: () => import('@/views/hydrops/alarms-list')
    },{
      path:'alarms-history',
      component: () => import('@/views/hydrops/alarms-history')
    },{
      path:'setting',
      component: () => import('@/views/hydrops/setting')
    }]
  }
]

// 灯杆系统
export const lampPostRoutes = [
  {
    component:Layout,
    meta:{
      platform:'lampPost'
    },
    path:"/lampPost",
    redirect:'/lampPost/dashboard',
    children:[{
      path:'dashboard',
      component: () => import('@/views/lampPost/dashboard/index.vue')
    },{
      path:'device',
      component: () => import('@/views/lampPost/device')
    },{
      path:'analysis/lamp',
      component: () => import('@/views/lampPost/analysis/lamp.vue')
    },{
      path:'analysis/mount',
      component: () => import('@/views/lampPost/analysis/mount.vue')
    },{
      path:'analysis/device-count',
      component: () => import('@/views/lampPost/analysis/device-count.vue')
    },{
      path:'analysis/device-state',
      component: () => import('@/views/lampPost/analysis/device-state.vue')
    },{
      path:'analysis/device-energy',
      component: () => import('@/views/lampPost/analysis/device-energy.vue')
    },{
      path:'analysis/device-energy-list',
      component: () => import('@/views/lampPost/analysis/device-energy-list.vue')
    },{
      path:'analysis/depart',
      component: () => import('@/views/lampPost/analysis/depart.vue')
    },{
      path:'alarm/list',
      component: () => import('@/views/lampPost/alarm/list.vue')
    },{
      path:'alarm/history',
      component: () => import('@/views/lampPost/alarm/history.vue')
    },{
      path:'alarm/record',
      component: () => import('@/views/lampPost/alarm/record.vue')
    },{
      path:'workflow/my-audit',
      component: () => import('@/views/lampPost/workflow/my-audit.vue')
    },{
      path:'workflow/my-apply',
      component: () => import('@/views/lampPost/workflow/my-apply.vue')
    },{
      path:'workflow/my-order',
      component: () => import('@/views/lampPost/workflow/my-order.vue')
    },{
      path:'workflow/analysis',
      component: () => import('@/views/lampPost/workflow/analysis.vue')
    },{
      path:'workflow/analysis-apply',
      component: () => import('@/views/lampPost/workflow/analysis-apply.vue')
    },{
      path:'workflow/analysis-device',
      component: () => import('@/views/lampPost/workflow/analysis-device.vue')
    },{
      path:'workflow/analysis-workflow',
      component: () => import('@/views/lampPost/workflow/analysis-workflow.vue')
    },{
      path:'workflow/depart-setting',
      component: () => import('@/views/lampPost/workflow/depart-setting.vue')
    },{
      path:'conserve/apply',
      component: () => import('@/views/lampPost/conserve/apply.vue')
    },{
      path:'conserve/content-list',
      component: () => import('@/views/lampPost/conserve/content-list.vue')
    },{
      path:'conserve/plan-list',
      component: () => import('@/views/lampPost/conserve/plan-list.vue')
    },{
      path:'conserve/plan-history',
      component: () => import('@/views/lampPost/conserve/plan-history.vue')
    },{
      path:'conserve/person-list',
      component: () => import('@/views/lampPost/conserve/person-list.vue')
    },{
      path:'conserve/analysis',
      component: () => import('@/views/lampPost/conserve/analysis.vue')
    },{
      path:'conserve/analysis-person',
      component: () => import('@/views/lampPost/conserve/analysis-person.vue')
    },{
      path:'conserve/analysis-time',
      component: () => import('@/views/lampPost/conserve/analysis-time.vue')
    },{
      path:'conserve/analysis-address',
      component: () => import('@/views/lampPost/conserve/analysis-address.vue')
    },{
      path:'log/list',
      component: () => import('@/views/lampPost/log/list.vue')
    }]
  }
]

// 驾驶舱
export const cockpit = [
  {
    path: '/cockpit',
    component: () => import('@/views/cockpit/dashboard'),
    hidden: true
  },
]

// 防止连续点击多次路由报错
let routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(err => err)
}

export default new Router({
  mode: 'history', // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    ...constantRoutes,
    ...environmentRoutes,
    ...wellLidRoutes,
    ...videoRoutes,
    ...hydropsRoutes,
    ...lampPostRoutes,
    ...cockpit
  ]
})
