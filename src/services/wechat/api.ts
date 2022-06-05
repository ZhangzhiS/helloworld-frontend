// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取微信联系人信息 GET /api/v1/wechat/contacts */
export async function getWechatContacts(
  params: {
    robot_id?: number;
  },
  options?: { [key: string]: any },
) {
  return request('/api/v1/wechat/contacts', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取群成员列表
export async function getGroupMember(
  params: {
    robot_id?: number;
    group_wxid: string;
  },
  options?: { [key: string]: any },
) {
  return request('/api/v1/wechat/group/member', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 刷新机器人信息
export async function refreshWechatRobot(robot_id: number, options?: { [key: string]: any }) {
  return request<API.WechatRobotItem>('/api/v1/wechat/refresh', {
    method: 'GET',
    params: {
      ...{ robot_id: robot_id },
    },
    ...(options || {}),
  });
}

// 获取预设的机器人规则
export async function getRobotRule(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RobotRuleConfigList>('/api/v1/robot/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 获取预设规则的map
export async function getRobotRuleSelect(options?: { [key: string]: any }) {
  return request('/api/v1/robot/rule/select', {
    method: 'GET',
    ...(options || {}),
  });
}

// 增加预设机器人规则
export async function addRobotRule(data: any, options?: { [key: string]: any }) {
  return request<API.RobotRuleConfig>('/api/v1/robot/rule/create', {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
}

/** 删除预设规则 DELETE /api/v1/rule/del */
export async function removeRobotRule(rule_id: number, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/v1/robot/rule/del', {
    method: 'DELETE',
    data: { rule_id: rule_id },
    ...(options || {}),
  });
}

//获取机器人已经配置的规则
export async function getWechatRobotRule(
  params: {
    robot_id?: number;
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RobotRuleList>('/api/v1/wechat/robot/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 删除权限 DELETE /api/v1/rule/del */
export async function removeWechatRobotRule(rule_id: number, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/v1/wechat/robot/rule/del', {
    method: 'DELETE',
    data: { robot_rule_id: rule_id },
    ...(options || {}),
  });
}

/** 给机器人配置规则 */
export async function addWechatRobotRule(data: any, options?: { [key: string]: any }) {
  return request<API.RobotRule>('/api/v1/wechat/robot/rule/create', {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
}

/** 修改用户信息 PUT /api/v1/rule/update */
export async function updateWechatRobotRule(data: any, options?: { [key: string]: any }) {
  return request<API.RobotRule>('/api/v1/wechat/robot/rule/update', {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
}

export async function getWechatRobot(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.WechatRobotList>('/api/v1/wechat', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function removeWechatRobot(
  params: {
    robot_rule_id: number;
  },
  options?: { [key: string]: any },
) {
  return request<Record<string, any>>('/api/v1/wechat/del', {
    method: 'DELETE',
    data: params,
    ...(options || {}),
  });
}

// 增加微信机器人
export async function addWechatRobot(data: any, options?: { [key: string]: any }) {
  return request<API.WechatRobotItem>('/api/v1/wechat/create', {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
}
