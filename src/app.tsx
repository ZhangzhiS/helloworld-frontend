import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
// import { SettingDrawer } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
import { history } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { currentUser as queryCurrentUser } from './services/admin/api';
import defaultSettings from '../config/defaultSettings';
import { errorHandler, authHeaderInterceptor, preResponseInterceptors } from './services/tools';

import { RequestConfig } from 'umi';

const loginPath = '/auth/login';

export const request: RequestConfig = {
  errorHandler,
  // 新增自动添加AccessToken的请求前拦截器
  requestInterceptors: [authHeaderInterceptor],
  responseInterceptors: [preResponseInterceptors],
};

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const res = await queryCurrentUser();
      return res;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.nickname,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {!props.location?.pathname?.includes('/login')}
        </>
      );
    },
    ...initialState?.settings,
  };
};
