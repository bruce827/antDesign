/** 
 * 路由
 * name 和 icon分别代表生成菜单项的文本和图标。
 * hideChildrenInMenu 用于隐藏不需要在菜单中展示的子路由。用法可以查看 分步表单 的配置。
 * hideInMenu 可以在菜单中不展示这个路由，包括子路由。效果可以查看 exception/trigger页面。
 * hideInBreadcrumb: 当前路由在面包屑中不展现，默认 false。
 * authority 用来配置这个路由的权限，如果配置了将会验证当前用户的权限，并决定是否展示。
 *
 *  默认提供李两种布局，UserLayout和basicLayout其中登陆后的内容页面均为后者，
 *  也可以自定义布局
 *
 *  由于 umi 的限制，在 router.config.js 是不能直接只是用组件的，Pro 中暂时支持 
 *  使用 ant.design 本身的 icon type，和传入一个 img 的 url。只需要直接在 icon 属性上配置即可，
 *  如果是个 url，Pro 会自动处理为一个 img 标签。
 *
 *
 *   参数依赖umi，参见：https://umijs.org/zh/guide/router.html，umi默认将src/pages下的目录结构
 *   解析为路由，使用自定义配置路由后，umi不会对src/pages下的目录做任何解析
 *
 * */
export default [
  // user
  {
    path: '/user',

    component: '../layouts/UserLayout',
    routes: [{
        path: '/user',
        redirect: '/user/login'
      },
      {
        path: '/user/login',
        name: 'login',
        component: './User/Login'
      },
      {
        path: '/user/register',
        name: 'register',
        component: './User/Register'
      },
      {
        path: '/user/register-result',
        name: 'register.result',
        component: './User/RegisterResult',
      },
      {
        component: '404',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // 默认重定向到首页
      {
        path: '/',
        redirect: '/dashboard/analysis',
        authority: ['admin', 'user']
      },
      // 首页
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        routes: [{
            path: '/dashboard/analysis',
            name: 'analysis',
            component: './Dashboard/Analysis',
          },
          {
            path: '/dashboard/monitor',
            name: 'monitor',
            component: './Dashboard/Monitor',
          },
          {
            path: '/dashboard/workplace',
            name: 'workplace',
            component: './Dashboard/Workplace',
          },
        ],
      },
      // forms
      {
        path: '/form',
        icon: 'form',
        name: 'form',
        routes: [{
            path: '/form/basic-form',
            name: 'basicform',
            component: './Forms/BasicForm',
          },
          {
            path: '/form/step-form',
            name: 'stepform',
            component: './Forms/StepForm',
            hideChildrenInMenu: true,
            routes: [{
                path: '/form/step-form',
                redirect: '/form/step-form/info',
              },
              {
                path: '/form/step-form/info',
                name: 'info',
                component: './Forms/StepForm/Step1',
              },
              {
                path: '/form/step-form/confirm',
                name: 'confirm',
                component: './Forms/StepForm/Step2',
              },
              {
                path: '/form/step-form/result',
                name: 'result',
                component: './Forms/StepForm/Step3',
              },
            ],
          },
          {
            path: '/form/advanced-form',
            name: 'advancedform',
            authority: ['admin'],
            component: './Forms/AdvancedForm',
          },
          {
            path: '/form/addContract-form',
            name: 'addContractform',
            authority: ['admin'],
            component: './Forms/AddContractform',
          },
        ],
      },
      // list
      {
        path: '/list',
        icon: 'table',
        name: 'list',
        routes: [{
            path: '/list/table-list',
            name: 'searchtable',
            component: './List/TableList',
          },
          {
            path: '/list/basic-list',
            name: 'basiclist',
            component: './List/BasicList',
          },
          {
            path: '/list/card-list',
            name: 'cardlist',
            component: './List/CardList',
          },

          {
            path: '/list/search',
            name: 'searchlist',
            component: './List/List',
            routes: [{
                path: '/list/search',
                redirect: '/list/search/articles',
              },
              {
                path: '/list/search/articles',
                name: 'articles',
                component: './List/Articles',
              },
              {
                path: '/list/search/projects',
                name: 'projects',
                component: './List/Projects',
              },
              {
                path: '/list/search/applications',
                name: 'applications',
                component: './List/Applications',
              },
            ],
          },
          // 合同列表
          {
            path: '/list/contract',
            name: 'contract',
            component: './List/contract',
          },
        ],
      },
      {
        path: '/profile',
        name: 'profile',
        icon: 'profile',
        routes: [
          // profile
          {
            path: '/profile/basic',
            name: 'basic',
            component: './Profile/BasicProfile',
          },
          {
            path: '/profile/basic/:id',
            name: 'basic',
            hideInMenu: true,
            component: './Profile/BasicProfile',
          },
          {
            path: '/profile/advanced',
            name: 'advanced',
            authority: ['admin'],
            component: './Profile/AdvancedProfile',
          },
        ],
      },
      {
        name: 'result',
        icon: 'check-circle-o',
        path: '/result',
        routes: [
          // result
          {
            path: '/result/success',
            name: 'success',
            component: './Result/Success',
          },
          {
            path: '/result/fail',
            name: 'fail',
            component: './Result/Error'
          },
        ],
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        name: 'account',
        icon: 'user',
        path: '/account',
        routes: [{
            path: '/account/center',
            name: 'center',
            component: './Account/Center/Center',
            routes: [{
                path: '/account/center',
                redirect: '/account/center/articles',
              },
              {
                path: '/account/center/articles',
                component: './Account/Center/Articles',
              },
              {
                path: '/account/center/applications',
                component: './Account/Center/Applications',
              },
              {
                path: '/account/center/projects',
                component: './Account/Center/Projects',
              },
            ],
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: './Account/Settings/Info',
            routes: [{
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
              },
              {
                path: '/account/settings/security',
                component: './Account/Settings/SecurityView',
              },
              {
                path: '/account/settings/binding',
                component: './Account/Settings/BindingView',
              },
              {
                path: '/account/settings/notification',
                component: './Account/Settings/NotificationView',
              },
            ],
          },
        ],
      },
      //  editor
      {
        name: 'editor',
        icon: 'highlight',
        path: '/editor',
        routes: [{
            path: '/editor/flow',
            name: 'flow',
            component: './Editor/GGEditor/Flow',
          },
          {
            path: '/editor/mind',
            name: 'mind',
            component: './Editor/GGEditor/Mind',
          },
          {
            path: '/editor/koni',
            name: 'koni',
            component: './Editor/GGEditor/Koni',
          },
        ],
      },
      {
        component: '404',
      }
    ],
  },
];