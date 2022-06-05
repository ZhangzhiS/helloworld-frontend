import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Drawer } from 'antd';
import React, { useState, useRef } from 'react';
import { history } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import type { ProFormInstance } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';

import {
  getWechatRobot,
  removeWechatRobot,
  refreshWechatRobot,
  addWechatRobot,
} from '@/services/wechat/api';

import EditForm from './EditForm';

const handleAdd = async (fields: API.WechatRobotItem) => {
  const hide = message.loading('正在添加');
  try {
    await addWechatRobot({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败,请重试');
    return false;
  }
};

const handleRemove = async (selectedRows: API.WechatRobotItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;

  try {
    await removeWechatRobot(selectedRows.map((row) => row.id));
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败');
    return false;
  }
};

const Robots: React.FC = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.WechatRobotItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.WechatRobotItem[]>([]);

  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const formRef = useRef<ProFormInstance>();

  const columns: ProColumns<API.WechatRobotItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      sorter: true,
      hideInForm: true,
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '账号的wxid',
      dataIndex: 'account_wxid',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      valueEnum: {
        0: {
          text: '保密',
        },
        1: {
          text: '男',
        },
        2: {
          text: '女',
        },
      },
    },
    {
      title: '状态',
      dataIndex: 'online',
      valueEnum: {
        1: {
          text: '在线',
          status: 'Success',
        },
        0: {
          text: '离线',
          status: 'Error',
        },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="refresh"
          onClick={async () => {
            await refreshWechatRobot(record.id);
            console.log('fix', record);
            // actionRef
            actionRef.current?.reload();
          }}
        >
          刷新信息
        </a>,
        <a
          key="config"
          onClick={async () => {
            // handleUpdateModalVisible(true);
            // setCurrentRow(record);
            history.push({
              pathname: '/wechat/edit-robot',
              state: {
                n: record.nickname,
                o: record.online,
                w: record.account_wxid,
                r: record.id,
              },
            });
            // actionRef.current?.reloadAndRest?.();
          }}
        >
          配置规则
        </a>,
        <a
          key="del"
          onClick={async () => {
            await handleRemove([record]);
            actionRef.current?.reloadAndRest?.();
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.WechatRobotItem, API.PageParams>
        headerTitle={'机器人列表'}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={getWechatRobot}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项 &nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
          <Button type="primary">批量审批</Button>
        </FooterToolbar>
      )}
      <ModalForm
        width="400px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        formRef={formRef}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.WechatRobotItem);
          if (success) {
            handleModalVisible(false);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          label={'httpapi中配置的token'}
          rules={[
            {
              required: true,
              message: 'httpApi的token为必填项',
            },
          ]}
          width="md"
          name="token"
        />
        <ProFormText
          name="api_host"
          label={'httpApi地址'}
          width="md"
          rules={[
            {
              required: true,
              message: '请输入httpApi的请求地址',
            },
          ]}
        />
      </ModalForm>
      <EditForm
        onSubmit={async () => {}}
        onCancel={(tag: boolean) => {
          handleUpdateModalVisible(tag);
          console.log('close', currentRow);
          if (!tag) {
            setCurrentRow(undefined);
          }
        }}
        updateModalVisible={updateModalVisible}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.nickname && (
          <ProDescriptions<API.WechatRobotItem>
            column={2}
            title={currentRow?.nickname}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              nickname: currentRow?.nickname,
            }}
            columns={columns as ProDescriptionsItemProps<API.WechatRobotItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default Robots;
