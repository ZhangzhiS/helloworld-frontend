import { request } from 'umi';
import type { ProductItem } from './data.d';

export async function getProductList(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<ProductItem[]>('/api/v1/jd/try/sku', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function pushOrder(
  data: any,
  options?: { [key: string]: any },
) {
  return request('/api/v1/add/auto/order', {
    method: "POST",
    data: data,
    ...(options || {}),
  })
}
