import { Button, message } from 'antd';
import { Card, Descriptions, Tag, Space } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { history, useLocation } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
// import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
// import ProDescriptions from '@ant-design/pro-descriptions';

import {
  getWechatContacts,
  removeWechatRobotRule,
  // refreshWechatRobot,
  addWechatRobotRule,
  getWechatRobotRule,
  updateWechatRobotRule,
  getRobotRuleSelect,
} from '@/services/wechat/api';
import type { FormValueType } from './EditForm';

import EditForm from './EditForm';

const handleAdd = async (fields: API.RobotRule) => {
  const hide = message.loading('正在添加');
  try {
    await addWechatRobotRule({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败,请重试');
    return false;
  }
};

const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('Configuring');
  try {
    await updateWechatRobotRule({
      ...fields,
    });
    hide();
    message.success('更新成功');
    return true;
  } catch (error) {
    hide();
    message.error('更新失败');
    return false;
  }
};

const handleRemove = async (selectedRow: API.RobotRule) => {
  const hide = message.loading('正在删除');
  if (!selectedRow) return true;
  try {
    await removeWechatRobotRule(selectedRow.id);
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败');
    return false;
  }
};

interface QueryState {
  r?: number;
  w?: string;
  o?: number;
  n?: string;
}

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

const Robots: React.FC = () => {
  const queryInfo = useLocation<QueryState>();

  // const [createModalVisible, handleModalVisible] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();

  const [currentRow, setCurrentRow] = useState<API.RobotRule>();

  // const [selectedRowsState, setSelectedRows] = useState<API.RobotRule[]>([]);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [getContactStatus, setGetContactStatus] = useState<boolean>(false);

  const [wechatContacts, setWechatContacts] = useState<API.WechatContactResp>();

  const [ruleConfigSelect, setRuleConfigSelect] = useState<any>();

  const [editModalTitle, setEditModatTitle] = useState<string>('新建规则');
  const [editType, setEditType] = useState<number>(1);

  const onSubmitModalForm = async (value: any) => {
    value.robot_id = queryInfo.state.r;
    console.log(value);
    if (editType === 1) {
      const success = await handleAdd(value as API.RobotRule);
      if (success) {
        handleUpdateModalVisible(false);

        if (actionRef.current) {
          actionRef.current.reload();
        }
      }
    } else {
      const success = await handleUpdate(value);
      if (success) {
        handleUpdateModalVisible(false);

        if (actionRef.current) {
          actionRef.current.reload();
        }
      }
    }
  };

  // const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    if (typeof queryInfo.state === 'undefined') {
      history.push('/wechat/robot');
    } else {
    }
  }, []);

  const initEditInfo = async () => {
    // 初始化编辑规则需要的数据

    // 获取机器人的联系人信息
    const data = await getWechatContacts({ robot_id: queryInfo.state?.r });
    setGetContactStatus(true);
    setWechatContacts(data);

    const rule_select = await getRobotRuleSelect();
    setRuleConfigSelect(rule_select);

    // console.log(contactsSelectInfo)
    // const selectInfo = {}
    // 获取系统支持的规则配置
    // const rule = await getRobotRule({ current: 1, pageSize: 100 })
    // setRobotRuleConfigs(rule?.data)

    // 组合联系人selectTree的信息
  };

  const columns: ProColumns<API.RobotRule>[] = [
    {
      title: '规则code',
      dataIndex: 'rule_code',
      readonly: true,
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
      title: '消息发送至',
      dataIndex: 'forward_nickname',
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={async () => {
            handleUpdateModalVisible(true);
            setEditModatTitle('修改规则');
            setEditType(2);
            setCurrentRow(record);
          }}
        >
          修改
        </a>,
        <a
          key="del"
          onClick={async () => {
            await handleRemove(record);
            console.log(record);
            actionRef.current?.reloadAndRest?.();
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  const queryWechatRobotRule = async (params: API.PageParams) => {
    const data = await getWechatRobotRule({
      robot_id: queryInfo.state?.r,
      ...params,
    });
    return data;
  };

  return (
    <PageContainer
      header={{
        title: '机器人规则配置',
        ghost: true,
        breadcrumb: {
          routes: [
            {
              path: '',
              breadcrumbName: '微信相关',
            },
            {
              path: '/wechat/robto',
              breadcrumbName: '机器人',
            },
            {
              path: '',
              breadcrumbName: '机器人配置',
            },
          ],
        },
      }}
    >
      <ProTable<API.RobotRule, API.PageParams>
        headerTitle={'机器人配置'}
        actionRef={actionRef}
        rowKey="id"
        search={false}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCurrentRow(undefined);
              handleUpdateModalVisible(true);
              setEditModatTitle('新建规则');
              console.log(wechatContacts?.select);
            }}
            disabled={getContactStatus ? false : true}
          >
            {getContactStatus ? '新建' : '请先获取微信联系人'}
          </Button>,
        ]}
        tableExtraRender={() => {
          return (
            <>
              <Card>
                <Descriptions size="middle" column={3} layout="vertical" bordered>
                  <Descriptions.Item label="昵称">{queryInfo.state?.n}</Descriptions.Item>
                  <Descriptions.Item label="微信wxid">{queryInfo.state?.w}</Descriptions.Item>
                  <Descriptions.Item label="在线状态">
                    <Tag color={onlineStatusMap[queryInfo.state?.o ? 1 : 0].color}>
                      {onlineStatusMap[queryInfo.state?.o ? 1 : 0].text}
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
                      总计联系人{wechatContacts?.total || 0}
                    </Tag>
                    <Tag color={getContactStatus ? 'green' : 'red'}>
                      好友{wechatContacts?.friend_list || 0}
                    </Tag>
                    <Tag color={getContactStatus ? 'green' : 'red'}>
                      群聊{wechatContacts?.group_list || 0}
                    </Tag>
                    <Tag color={getContactStatus ? 'green' : 'red'}>
                      公众号{wechatContacts?.mp_list || 0}
                    </Tag>
                  </Space>
                </Card>
              </Card>
            </>
          );
        }}
        request={queryWechatRobotRule}
        columns={columns}
        rowSelection={false}
      />
      <EditForm
        title={editModalTitle}
        onSubmit={onSubmitModalForm}
        onCancel={(tag: boolean) => {
          handleUpdateModalVisible(tag);
          console.log('close', currentRow);
          if (!tag) {
            setCurrentRow(undefined);
          }
        }}
        updateModalVisible={updateModalVisible}
        values={currentRow || {}}
        contactsSelectInfo={wechatContacts?.select}
        ruleSelectInfo={ruleConfigSelect}
        robot_id={queryInfo.state?.r}
      />
    </PageContainer>
  );
};

export default Robots;
