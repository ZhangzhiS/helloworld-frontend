export default [
  {
    path: '/auth',
    layout: false,
    custom_field: 'hello',
    routes: [
      {
        path: '/auth',
        routes: [{ name: '登录', path: '/auth/login', component: './admin/Login' }],
      },
      { component: './404' },
    ],
  },
  { path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome' },
  // { path: '/packets', name: '封面管理', icon: 'switcher', component: './Packet' },
  {
    path: '/red-cover',
    name: '封面管理',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      {
        path: '/red-cover/packets',
        name: '封面列表',
        icon: 'switcher',
        component: './red-cover/Packets',
      },
    ],
  },
  {
    path: '/tasks',
    name: '任务管理',
    icon: 'crown',
    access: 'canAdmin',
    component: './tasks/runTask'
  },
  {
    path: '/jd',
    name: '京东相关',
    icon: 'crown',
    // access: 'canAdmin',
    routes: [
      {
        path: '/jd/try',
        name: '付费试用列表',
        icon: 'smile',
        component: './jd/jdTry',
      },
      {
        path: '/jd/lottery-try',
        name: '抽奖试用列表',
        icon: 'smile',
        component: './jd/jdLotteryTry',
      },
      {
        path: '/jd/blacklist',
        name: '试用黑名单管理',
        icon: 'smile',
        component: './jd/blacklist',
      },
      {
        path: '/jd/user',
        name: '京东账户管理',
        icon: 'smile',
        component: './jd/user',
      },
    ],
  },
  {
    path: '/wechat',
    name: '微信相关',
    icon: 'crown',
    // access: 'canAdmin',
    routes: [
      {
        path: '/wechat/robot',
        name: '机器人管理',
        icon: 'smile',
        component: './wechat/robot',
      },
      {
        path: '/wechat/edit-robot',
        name: '机器人配置',
        component: './wechat/robotEdit',
        hideInMenu: true,
      },
      {
        path: '/wechat/rule',
        name: '机器人规则',
        icon: 'smile',
        component: './wechat/rule',
      },
    ],
  },
  {
    path: '/admin',
    name: '系统管理',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      { path: '/admin/user', name: '用户管理', icon: 'smile', component: './admin/Users' },
      { path: '/admin/role', name: '角色管理', icon: 'smile', component: './admin/Role' },
      { path: '/admin/rule', name: '权限管理', icon: 'smile', component: './admin/Rule' },
    ],
  },

  // {
  //   path: '/operate',
  //   name: '运营管理',
  //   icon: 'smile',
  //   component: './Welcome',
  //   routes: [
  //     { path: '/operate/banner', name: 'banner管理', icon: 'smile', component: './Welcome' },
  //   ],
  // },
  // {
  //   path: '/user',
  //   name: '用户管理',
  //   icon: 'smile',
  //   component: './Welcome',
  //   routes: [{ path: '/user/list', name: '用户列表', icon: 'smile', component: './Welcome' }],
  // },
  {
    path: '/app',
    name: 'APP管理',
    icon: 'smile',
    routes: [],
  },
  { path: '/', redirect: '/welcome' },
  { component: './404' },
];
