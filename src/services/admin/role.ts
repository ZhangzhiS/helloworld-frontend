// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取角色列表 GET /api/v1/role */
export async function getRole(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RoleList>('/api/v1/role', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 删除用户 DELETE /api/v1/role/del */
export async function removeRole(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/v1/role/del', {
    method: 'DELETE',
    ...(options || {}),
  });
}

/** 新建用户 POST /api/v1/role/create */
export async function addRole(data:any, options?: { [key: string]: any }) {
  return request<API.RoleListItem>('/api/v1/role/create', {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
}

/** 修改用户信息 PUT /api/v1/role/edit */
export async function updateRole(data:any, options?: { [key: string]: any }) {
  return request<API.RoleListItem>('/api/v1/role/update', {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
}


