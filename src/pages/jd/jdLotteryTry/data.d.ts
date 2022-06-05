export type ProductItem = {
  id: int;
  activity_id: string;
  trial_name: string;
  trial_sku_id: string;
  order_price: number;
  price: number;
  activity_type: number;
  large_image: string;
  activity_start_time: number;
  shop_id: number;
  create_time?: string;
  update_time?: string;
};

export type ProductList = {
  data?: ProductItem[];
  total?: number;
  success?: boolean;
};
