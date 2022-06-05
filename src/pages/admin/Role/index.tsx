import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Drawer } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './UpdateForm';
import EditForm from './UpdateForm';
import { getRole, removeRole, updateRole, addRole } from '@/services/admin/role'

/**
 * 添加
 * @param fields
 */

const handleAdd = async (fields: API.RoleListItem) => {
  const hide = message.loading('正在添加');
  console.log(4444, fields)

  try {
    await addRole({ ...fields });
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
 * 更新
 *
 * @param fields
 */

const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('Configuring');

  try {
    await updateRole({
      ...fields
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
 * @zh-CN 删除
 *
 * @param selectedRows
 */

const handleRemove = async (selectedRows: API.RoleListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;

  try {
    await removeRole({
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

const Roles: React.FC = () => {
  /**
   * @zh-CN 新建窗口的弹窗
   *  
   */

  // const [createModalVisible, handleModalVisible] = useState<boolean>(false);

  /**
   * @zh-CN 分布更新窗口的弹窗
   * 
   */

  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.RoleListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.RoleListItem[]>([]);
  const [editType, setEditType] = useState<number>(1)
  const [editModalTitle, setEditModatTitle] = useState<string>("新建角色");

  const onSubmitModalForm = async (value: any) => {
    if (editType === 1) {
      const success = await handleAdd(value as API.RoleListItem);
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
    
  }


  const columns: ProColumns<API.RoleListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '角色',
      dataIndex: 'name',
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
      title: '描述',
      dataIndex: 'desc',
      valueType: 'textarea',
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
      title: '创建时间',
      dataIndex: 'create_time',
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
            setEditModatTitle("修改角色")
            setEditType(2)
            setCurrentRow(record);
          }}
        >
          修改
        </a>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.RoleListItem, API.PageParams>
        headerTitle={'查询表格'}
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
              setCurrentRow(undefined);
              handleUpdateModalVisible(true);
              setEditType(1)
              setEditModatTitle("新建角色")
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={getRole}
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
            type="primary"
            danger
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}
      <EditForm
        title={editModalTitle}
        onSubmit={onSubmitModalForm}
        onCancel={(tag: boolean) => {
          handleUpdateModalVisible(tag);
          console.log("close", currentRow)
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
        {currentRow?.name && (
          <ProDescriptions<API.RoleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.RoleListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default Roles;


