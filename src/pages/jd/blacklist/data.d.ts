export type BlackListItem = {
  id: number;
  activity_type: number;
  type: number;
  keyword: string;
};

export type BlackListItemList = {
  data?: BlackListItem[];
  total?: number;
  success?: boolean;
};
