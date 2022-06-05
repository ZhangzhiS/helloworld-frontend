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

/** 获取封面列表 GET /api/v1/packet */
export async function getPacket(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.PacketList>('/api/v1/packet', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 修改封面信息 PUT /api/v1/packet/edit */
export async function updatePacket(data: any, options?: { [key: string]: any }) {
  return request<API.PacketListItem>('/api/v1/packet/edit', {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
}

/** 新建封面 POST /api/v1/packet/create */
export async function addPacket(data: any, options?: { [key: string]: any }) {
  return request<API.PacketListItem>('/api/v1/packet/create', {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
}
/** 删除封面 DELETE /api/v1/packet/del */
export async function removePacket(packet_ids:number[],options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/v1/packet/del', {
    method: 'DELETE',
    data: {packet_ids: packet_ids},
    ...(options || {}),
  });
}
