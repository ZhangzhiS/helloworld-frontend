import { request } from 'umi';
import type { JDUserItem, JDUserList } from './data.d';

export async function getJDUserList(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<JDUserItem[]>('/api/v1/jd/user/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function addJDUser(data: any, options?: { [key: string]: any }) {
  return request<JDUserList>('/api/v1/jd/user/add', {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
}

export async function removeJDUser(item_id: number, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/v1/jd/user/del', {
    method: 'DELETE',
    data: { item_id: item_id },
    ...(options || {}),
  });
}

export async function updateJDUser(data:any, options?: { [key: string]: any }) {
  return request<JDUserItem>('/api/v1/jd/user/edit', {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
}
