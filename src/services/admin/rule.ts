// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取权限列表 GET /api/v1/rule */
export async function getRule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/v1/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 删除权限 DELETE /api/v1/rule/del */
export async function removeRule(rule_ids:number[], options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/v1/rule/del', {
    method: 'DELETE',
    data: {rule_ids: rule_ids},
    ...(options || {}),
  });
}

/** 新建权限 POST /api/v1/rule/create */
export async function addRule(data:any, options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/v1/rule/create', {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
}

/** 修改用户信息 PUT /api/v1/rule/update */
export async function updateRule(data: any, options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/v1/rule/update', {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
}


/** 获取菜单树形结构 GET /api/v1/menu/tree */
export async function getMenuTree(
  options?: { [key: string]: any },
) {
  return request<API.MenuTree>('/api/v1/menu/tree', {
    method: 'GET',
    ...(options || {}),
  });
}


