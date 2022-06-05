import { request } from 'umi';
import type { ProductItem } from './data.d';

export async function getProductList(
  params: {
    current?: number;
    pageSize?: number;
    activity_type?: number
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
