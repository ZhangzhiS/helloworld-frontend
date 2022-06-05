import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-form';
import type { ProFormInstance } from '@ant-design/pro-form';

import { getBlackList, addBlackList, removeBlackList } from './services'

import type { BlackListItem } from './data.d';
// import EditForm from './EditForm';

const handleAdd = async (fields: BlackListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addBlackList({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败,请重试');
    return false;
  }
};

const handleRemove = async (selectedRow: BlackListItem) => {
  const hide = message.loading('正在删除');
  if (!selectedRow) return true;

  try {
    await removeBlackList(selectedRow.id, selectedRow.activity_type);
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败');
    return false;
  }
};

const BlackList: React.FC = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();


  const formRef = useRef<ProFormInstance>();

  const columns: ProColumns<BlackListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      sorter: true,
      hideInForm: true,
    },
    {
      title: "试用类型",
      dataIndex: 'activity_type',
    },
    {
      title: "关键字",
      dataIndex: 'keyword',
    },
    {
      title: '黑名单类型',
      dataIndex: "type",
      valueEnum: {
        2: {
          text: '店铺名称',
        },
        1: {
          text: '店铺id',
        },
        0: {
          text: '商品关键字',
        },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="del"
          onClick={async () => {
            await handleRemove(record);
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
      <ProTable<BlackListItem, API.PageParams>
        headerTitle={'黑名单管理'}
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
        request={getBlackList}
        columns={columns}
        rowSelection={false}
      />
      <ModalForm
        width="400px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        formRef={formRef}
        onFinish={async (value) => {
          const success = await handleAdd(value as BlackListItem);
          if (success) {
            handleModalVisible(false);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          label="试用类型"
          rules={[
            {
              required: true,
            },
          ]}
          width="md"
          name="activity_type"
        />
        <ProFormSelect
          label="黑名单类型"
          rules={[
            {
              required: true,
            },
          ]}
          width="md"
          name="type"
          valueEnum={{
            0: '商品关键字',
            1: '店铺id',
            2: '店铺关键字',
          }}
        />
        <ProFormText
          name="keyword"
          label="关键字"
          width="md"
          rules={[
            {
              required: true,
              message: '黑名单关键字或者黑名单店铺的id',
            },
          ]}
        />
      </ModalForm>
    </PageContainer>
  );
};

export default BlackList;
