/**
 * request 网络请求工具
 */
import { notification } from 'antd';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
/**
 * 异常处理程序
 */

export const errorHandler = (error: any) => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    // notification.error({
    //   description: '您的网络发生异常，无法连接服务器',
    //   message: '网络异常',
    // });
  }

  return response;
};


export const authHeaderInterceptor = (url: string, options: any) => {
  const loginPath = '/auth/login';
  const token = localStorage.getItem("access-token")
  const authHeader = { Authorization: `Bearer ${token}` };
  if (url === "/api/v1/login/access-token") {
    return {
      url: `${url}`,
      options: { ...options, interceptors: true },
    };
  }
  if (token === null) {
    window.location.href = loginPath;
  }
  return {
    url: `${url}`,
    options: { ...options, interceptors: true, headers: authHeader },
  };
};

export const preResponseInterceptors = async (response: Response, _: any) => {
  // 统一处理返回数据，判断异常请求，返回正确的数据格式
  const resp = await response.json();
  if (resp && resp.code && resp.code != 20000) {
    notification.error({
      message: `请求错误码 ${resp.code}`,
      description: resp.msg,
    });
  }
  return resp.data;
};
