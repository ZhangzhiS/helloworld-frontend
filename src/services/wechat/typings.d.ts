// @ts-ignore
/* eslint-disable */

declare namespace API {
  /** 系统预设机器人规则 */
  type RobotRuleConfig = {
    id: number;
    rule_code?: string;
    rule_name?: string;
    rule_api?: string;
    rule_type?: number;
  };

  type RobotRuleConfigList = {
    data?: RobotRuleConfig[];
    /** 列表的内容总数 */
    total: number;
  };

  // 微信机器人
  type WechatRobotItem = {
    id: number;
    nickname?: string;
    account_wxid?: string;
    sex?: number;
    online?: number;
  };

  type WechatRobotList = {
    data?: WechatRobotItem[];
    total?: number;
  };

  // 配置的机器人规则
  type RobotRule = {
    id: number;
    robot_id: number;
    status: number;
    message_type: number;
    message_filter: string;
    target_wxid: string;
    target_nickname: string;
    group_member_wxid?: string;
    group_member_nickname?: string;
    forward_wxid: string;
    forward_nickname: string;
    rule_code: string;
    rule_name: string;
  };

  type RobotRuleList = {
    data?: RobotRule[];
    total: number;
  };

  // 微信联系人
  export type WechatContactResp = {
    total: number;
    friend_list: number;
    mp_list: number;
    group_list: number;
    select: SelectInfo[];
  };

  export type SelectInfo = {
    title: string;
    value: string;
    children?: selectInfo[];
  };
}
