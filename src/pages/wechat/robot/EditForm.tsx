import React, { useState } from 'react';
import { Card, Descriptions, Modal, Tag, Button, Space } from 'antd';
import // ProFormSelect,
// ProFormTreeSelect,
// ProFormCascader,
// ProFormText,
// ModalForm,
// ProFormTextArea,
'@ant-design/pro-form';
import {
  getWechatContacts,
  getRobotRule,
  // getWechatRobotRule
} from '@/services/wechat/api';

import { EditableProTable } from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<API.WechatRobotItem>;

export type UpdateFormProps = {
  // title: string;
  onCancel: (flag: boolean) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.WechatRobotItem>;
};

const onlineStatusMap = {
  0: {
    color: '#f50',
    text: '离线',
  },
  1: {
    color: '#87d068',
    text: '在线',
  },
};

const EditForm: React.FC<UpdateFormProps> = (props) => {
  // const actionRef = useRef<ActionType>();
  const columns: ProColumns<API.RobotRule>[] = [
    {
      title: '规则ID',
      dataIndex: 'id',
      editable: false,
    },
    {
      title: '抓取目标',
      dataIndex: 'target_nickname',
      valueType: 'select',
    },
    {
      title: '抓取群成员',
      dataIndex: 'group_member_nickname',
    },
    {
      title: '规则code',
      dataIndex: 'rule_code',
      readonly: true,
    },
    {
      title: '规则名称',
      dataIndex: 'rule_name',
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        // <a
        //   key="config"
        //   onClick={async () => {
        // await refreshWechatRobot(record);
        // console.log('fix', record);
        //   }}
        // >
        //   刷新信息
        // </a>,
        <a
          key="del"
          onClick={async () => {
            // await handleRemove([record]);
            console.log(record);
            // actionRef.current?.reloadAndRest?.();
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  // 微信联系人数据
  const [wechatContacts, setWechatContacts] = useState<API.WechatContactResp>();
  // 获取微信联系人的状态
  const [getContactStatus, setGetContactStatus] = useState<boolean>(false);

  const [robotRuleConfigs, setRobotRuleConfigs] = useState<API.RobotRuleConfig[]>();

  const initEditInfo = async () => {
    // 初始化编辑规则需要的数据

    // 获取机器人的联系人信息
    const data = await getWechatContacts({ robot_id: props.values.id });
    setWechatContacts(data.data);
    setGetContactStatus(true);
    console.log(robotRuleConfigs);

    // 获取系统支持的规则配置
    const rule = await getRobotRule({ current: 1, pageSize: 100 });
    setRobotRuleConfigs(rule?.data);
  };

  const getSpiderRules = async (v: any) => {
    console.log(v);
    // const data = await getWechatRobotRule()
    // console.log(2222, wechatContacts.length, typeof (wechatContacts) === undefined)
    // if (data.data) {
    //   return data.data
    // }
    return [];
  };

  const onCancel = (v: any) => {
    props.onCancel(false);
    console.log(v);
  };

  return (
    <Modal
      title={props.values.nickname}
      visible={props.updateModalVisible}
      onCancel={onCancel}
      destroyOnClose={true}
      width={800}
    >
      <EditableProTable<API.RobotRule, API.PageParams>
        columns={columns}
        request={getSpiderRules}
        rowKey="id"
        tableExtraRender={(_, data) => {
          console.log(_, data);
          return (
            <>
              <Card>
                <Descriptions size="middle" column={3} layout="vertical" bordered>
                  <Descriptions.Item label="昵称">{props.values.nickname}</Descriptions.Item>
                  <Descriptions.Item label="微信wxid">
                    {props.values.account_wxid}
                  </Descriptions.Item>
                  <Descriptions.Item label="在线状态">
                    <Tag color={onlineStatusMap[props.values.online ? 1 : 0].color}>
                      {onlineStatusMap[props.values.online ? 1 : 0].text}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
                <Card>
                  <Space size="middle">
                    <Button
                      type="primary"
                      size="small"
                      key="primary"
                      onClick={async () => {
                        await initEditInfo();
                      }}
                    >
                      获取联系人信息
                    </Button>
                    <Tag color={getContactStatus ? 'green' : 'red'}>
                      总计联系人{wechatContacts?.count || 0}
                    </Tag>
                    <Tag color={getContactStatus ? 'green' : 'red'}>
                      好友{wechatContacts?.friend_list.length || 0}
                    </Tag>
                    <Tag color={getContactStatus ? 'green' : 'red'}>
                      群聊{wechatContacts?.group_list.length || 0}
                    </Tag>
                    <Tag color={getContactStatus ? 'green' : 'red'}>
                      公众号{wechatContacts?.mp_list.length || 0}
                    </Tag>
                  </Space>
                </Card>
              </Card>
            </>
          );
        }}
        recordCreatorProps={{
          newRecordType: 'dataSource',
          record: () => {
            return { id: +1 };
          },
        }}
        toolBarRender={false}
        search={false}
      />
    </Modal>
  );
};

export default EditForm;
