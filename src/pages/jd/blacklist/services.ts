import { request } from 'umi';
import type { BlackListItem, BlackListItemList } from './data.d';

export async function getBlackList(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<BlackListItem[]>('/api/v1/jd/black-list/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function addBlackList(data: any, options?: { [key: string]: any }) {
  return request<BlackListItemList>('/api/v1/jd/black-list/add', {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
}

export async function removeBlackList(item_id: number, activity_type: number, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/v1/jd/black-list/del', {
    method: 'DELETE',
    data: { item_id: item_id, activity_type: activity_type },
    ...(options || {}),
  });
}
