export type JDUserItem = {
  id: number;
  pt_pin: string;
  pt_key: string;
  desc: string;
  pwd: string;
  notice_type: number;
  notice_key?: string;
};

export type JDUserList = {
  data?: JDUserItem[];
  total?: number;
  success?: boolean;
};
