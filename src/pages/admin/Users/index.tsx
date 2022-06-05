import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Drawer } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-form';
import type { ProFormInstance } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './UpdateForm';
import UpdateForm from './UpdateForm';
import { getUser, removeUser, updateUser, addUser } from '@/services/admin/user';
import { getRole } from '@/services/admin/role';

/**
 * 添加用户
 * @param fields
 */

const handleAdd = async (fields: API.UserListItem) => {
  const hide = message.loading('正在添加');

  try {
    await addUser({ ...fields });
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};

/**
 * 更新用户信息
 *
 * @param fields
 */

const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('Configuring');

  try {
    await updateUser({
      ...fields,
    });
    hide();
    message.success('Configuration is successful');
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
};

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */

const handleRemove = async (selectedRows: API.UserListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;

  try {
    await removeUser({
      key: selectedRows.map((row) => row.id),
    });
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};

const Users: React.FC = () => {
  /**
   * @zh-CN 新建窗口的弹窗
   *
   */

  const [createModalVisible, handleModalVisible] = useState<boolean>(false);

  /**
   * @zh-CN 分布更新窗口的弹窗
   *
   */

  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.UserListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.UserListItem[]>([]);

  const formRef = useRef<ProFormInstance>();

  const checkPassword = (_: any, value: string) => {
    const promise = Promise;
    if (value && value !== formRef.current?.getFieldValue('password')) {
      return promise.reject('两次输入的密码不匹配!');
    }
    return promise.resolve();
  };

  const getRoleSelect = async () => {
    const roles = await getRole({ current: 1, pageSize: 20 });
    const roleSelect: any = [];
    roles.data?.forEach((item) => {
      roleSelect.push({ label: item.name, value: item.id });
    });
    return roleSelect;
  };

  const columns: ProColumns<API.UserListItem>[] = [
    {
      title: '账户',
      dataIndex: 'account',
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
      title: '昵称',
      dataIndex: 'nickname',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      sorter: true,
      hideInForm: true,
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      sorter: true,
      hideInForm: true,
    },
    {
      title: '状态',
      dataIndex: 'is_active',
      hideInForm: true,
      valueEnum: {
        1: {
          text: '正常',
          status: 'Success',
        },
        0: {
          text: '禁用',
          status: 'Error',
        },
      },
    },
    {
      title: '是否是超级用户',
      dataIndex: 'is_superuser',
      hideInForm: true,
      valueEnum: {
        1: {
          text: '超级管理员',
          status: 'Success',
        },
        0: {
          text: '普通用户',
          status: 'Processing',
        },
      },
    },

    {
      title: '上次登录时间',
      dataIndex: 'last_at',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalVisible(true);
            setCurrentRow(record);
          }}
        >
          配置
        </a>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.UserListItem, API.PageParams>
        headerTitle={'用户列表'}
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
        request={getUser}
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
          const success = await handleAdd(value as API.UserListItem);

          if (success) {
            handleModalVisible(false);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '登录名称为必填项',
            },
          ]}
          width="md"
          name="account"
        />
        <ProFormText.Password
          name="password"
          label={'密码'}
          width="md"
          rules={[
            {
              required: true,
              message: '请输入密码！',
            },
          ]}
        />
        <ProFormText.Password
          name="confirm"
          label={'确认密码'}
          width="md"
          rules={[
            {
              required: true,
              message: '请输入密码！',
            },
            {
              validator: checkPassword,
            },
          ]}
        />
        <ProFormText
          name="real_name"
          width="md"
          label={'真实姓名'}
          placeholder={'请输入员工真实姓名'}
          rules={[
            {
              required: true,
              message: '请输入员工真实姓名！',
            },
          ]}
        />
        <ProFormSelect
          width="md"
          request={getRoleSelect}
          name="role_id"
          label="用户角色"
          cacheForSwr={true}
        />
      </ModalForm>
      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value);

          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={(tag: boolean) => {
          handleUpdateModalVisible(tag);
          if (!tag) {
            setCurrentRow(undefined);
          }
        }}
        updateModalVisible={updateModalVisible}
        values={currentRow || {}}
        selectRequest={getRoleSelect}
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
          <ProDescriptions<API.UserListItem>
            column={2}
            title={currentRow?.nickname}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.nickname,
            }}
            columns={columns as ProDescriptionsItemProps<API.UserListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default Users;
