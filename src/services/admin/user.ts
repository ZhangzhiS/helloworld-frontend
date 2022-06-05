// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取当前的用户 GET /api/v1/user/me */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/v1/user/me', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取用户列表 GET /api/v1/user */
export async function getUser(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.UserList>('/api/v1/user', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 删除用户 DELETE /api/v1/user/del */
export async function removeUser(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/v1/user/del', {
    method: 'DELETE',
    ...(options || {}),
  });
}

/** 新建用户 POST /api/v1/user/create */
export async function addUser(data: any, options?: { [key: string]: any }) {
  return request<API.UserListItem>('/api/v1/user/create', {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
}

/** 修改用户信息 PUT /api/v1/user/edit */
export async function updateUser(data: any, options?: { [key: string]: any }) {
  return request<API.UserListItem>('/api/v1/user/edit', {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
}
