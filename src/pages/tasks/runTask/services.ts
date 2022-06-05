import { request } from 'umi';
import type { TaskItem } from './data.d';

export async function getTaskList(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<TaskItem[]>('/api/v1/tasks', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
