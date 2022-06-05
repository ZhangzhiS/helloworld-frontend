// @ts-ignore
/* eslint-disable */

declare namespace API {
  type CurrentUser = {
    id?: string;
    account?: string;
    nickname?: string;
    avatar_url?: string;
    wechat_id?: string;
    email?: string;
    mobile?: string;
    is_active?: boolean;
    user_type?: number;
    remark?: string;
  };

  type LoginResult = {
    access_token?: string;
    token_type?: string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type UserListItem = {
    id?: string;
    account?: string;
    nickname?: string;
    avatar_url?: string;
    wechat_id?: string;
    email?: string;
    mobile?: string;
    is_active?: boolean;
    user_type?: number;
    remark?: string;
  };

  type PacketListItem = {
    id?: number;
    packet_id?: string;
    packet_name?: string;
    packet_url?: string;
    serial_code?: string;
    packet_source_image?: string;
    packet_source?: number;
    packet_ret?: number;
    start_date?: number;
    is_lower_version?: boolean;
    is_temp_cover?: boolean;
    packet_type?: number;
    user_id?: number;
  };

  type PacketList = {
    data?: PacketListItem[];
    /** 列表的内容总数 */
    total: number;
  };

  type UserList = {
    data?: UserListItem[];
    /** 列表的内容总数 */
    total: number;
  };

  type RuleListItem = {
    id: number;
    parent_id: number;
    name?: string;
    desc?: string;
    unique_code: string;
    is_menu?: number;
    path?: path;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
  };

  type Menu = {
    lable: string;
    value: number;
    children?: MenuTree;
  };

  type MenuTree = Menu[];

  type RoleListItem = {
    id: number;
    name?: string;
    desc?: string;
    rule_ids?: number[][];
  };

  type RoleList = {
    data?: RoleListItem[];
    total?: number;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };

  type WechatRobotRule = {};
}
