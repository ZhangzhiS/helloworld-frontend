import React from 'react';
import {
  ProFormSelect,
  ProFormTreeSelect,
  // ProFormCascader,
  ProFormText,
  ModalForm,
} from '@ant-design/pro-form';

import { getGroupMember } from '@/services/wechat/api';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<API.RobotRule>;

export type UpdateFormProps = {
  title: string;
  onCancel: (flag: boolean) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.RobotRule>;
  contactsSelectInfo: any;
  ruleSelectInfo: any;
  robot_id?: number;
};

const MsgTypeMap = {
  1: '文本消息',
  3: '图片消息',
  34: '语音消息',
  37: '好友申请',
  42: '用户名片',
  47: '动态表情',
  48: '位置信息',
  49: '分享链接消息',
  2000: '转账',
  2001: '红包',
  2002: '小程序',
  2003: '进群邀请',
  2004: '文件消息',
  2005: '撤回消息',
  10000: '系统消息',
  10001: '服务消息',
};

const EditForm: React.FC<UpdateFormProps> = (props) => {
  const getGroupMemberSelect = async (params: any) => {
    if (params.target_wxid.indexOf('chatroom') === -1) {
      return [];
    }
    const data = await getGroupMember({ robot_id: props.robot_id, group_wxid: params.target_wxid });
    return data;
  };

  return (
    <ModalForm
      title={props.title}
      width="600px"
      visible={props.updateModalVisible}
      onFinish={props.onSubmit}
      onVisibleChange={props.onCancel}
      onValuesChange={(v) => console.log(v)}
      modalProps={{
        destroyOnClose: true,
      }}
    >
      <ProFormText disabled name="id" label="ID" initialValue={props.values.id} placeholder="" />
      <ProFormSelect
        name="rule_type"
        label="规则类型"
        valueEnum={{
          1: '转发',
          2: '收集',
          3: '定时',
        }}
        rules={[{ required: true, message: '请选择规则' }]}
      />
      <ProFormSelect
        name="rule_code"
        label="规则"
        valueEnum={props.ruleSelectInfo}
        rules={[{ required: true, message: '请选择规则' }]}
      />
      <ProFormSelect
        rules={[
          {
            required: true,
            message: '消息类型必选',
          },
        ]}
        name="message_type"
        label="消息类型"
        valueEnum={MsgTypeMap}
        initialValue={props.values.message_type}
      />
      <ProFormText
        name="message_filter"
        label="简易正则过滤器，可不填"
        initialValue={props.values.message_filter}
        placeholder="如 'test(.*?)res'"
      />
      <ProFormTreeSelect
        rules={[
          {
            required: true,
          },
        ]}
        width="md"
        request={() => props.contactsSelectInfo}
        name="target_wxid"
        label="抓取目标"
        cacheForSwr={true}
        secondary={true}

        // initialValue={props.values.parent_id}
      />
      <ProFormSelect
        name="group_member_wxid"
        label="群成员"
        dependencies={['target_wxid']}
        request={getGroupMemberSelect}
        placeholder="可不选"
      />
      <ProFormTreeSelect
        width="md"
        request={() => props.contactsSelectInfo}
        name="forward_wxid"
        label="转发目标"
        cacheForSwr={true}
        secondary={true}
      />
    </ModalForm>
  );
};

export default EditForm;
