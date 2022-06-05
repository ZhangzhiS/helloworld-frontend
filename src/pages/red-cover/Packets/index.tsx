import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Drawer, Popconfirm } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormDateTimePicker, ProFormRadio } from '@ant-design/pro-form';
import type { ProFormInstance } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './UpdateForm';
import UpdateForm from './UpdateForm';
import { getPacket, removePacket, updatePacket, addPacket } from '@/services/admin/packet';
import { getRole } from '@/services/admin/role';

/**
 * 添加用户
 * @param fields
 */

const handleAdd = async (fields: API.PacketListItem) => {
  const hide = message.loading('正在添加');

  try {
    await addPacket({ ...fields });
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
 * 更新封面信息
 *
 * @param fields
 */

const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('Configuring');

  try {
    await updatePacket({
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

const handleRemove = async (selectedRows: API.PacketListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    console.log(selectedRows)
    await removePacket(
      selectedRows.map((row:any) => row.id),
    );
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败');
    return false;
  }
};

const Packets: React.FC = () => {
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
  const [currentRow, setCurrentRow] = useState<API.PacketListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.PacketListItem[]>([]);

  const formRef = useRef<ProFormInstance>();

  const getRoleSelect = async () => {
    const roles = await getRole({ current: 1, pageSize: 20 });
    const roleSelect: any = [];
    roles.data?.forEach((item) => {
      roleSelect.push({ label: item.name, value: item.id });
    });
    return roleSelect;
  };

  const columns: ProColumns<API.PacketListItem>[] = [
    {
      title: '封面名称',
      dataIndex: 'packet_name',
    },
    {
      title: '领取链接',
      dataIndex: 'packet_url',
      hideInForm: true,
      width: 430,
      copyable: true,
      ellipsis: true,
    },
    {
      title: '封面图片',
      dataIndex: 'packet_source_image',
      valueType: 'image',
      hideInForm: true,
    },
    {
      title: '状态',
      dataIndex: 'packet_ret',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '可领取',
          status: 'Processing',
        },
        1: {
          text: '已领完',
          status: 'Error',
        },
      },
    },
    {
      title: '开始时间',
      dataIndex: 'start_date',
      sorter: true,
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
          更新
        </a>,
        <Popconfirm
          title={`确认删除吗?`}
          onConfirm={async () => {
            await handleRemove([record])
            actionRef.current?.reloadAndRest?.();
          }}
        >
          <a>删除</a>
        </Popconfirm>
        ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.PacketListItem, API.PageParams>
        headerTitle={'封面列表'}
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
        request={getPacket}
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
        title="新增封面"
        width="400px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        formRef={formRef}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.PacketListItem);

          if (success) {
            handleModalVisible(false);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          name="packet_name"
          label="封面名称"
        />
        <ProFormText
          name="packet_url"
          label="领取链接"
          rules={[
            {
              required: true,
              message: '领取链接为必填项',
            },
          ]}
        />
        <ProFormText
          name="packet_source_image"
          label="封面图片"
        />
        <ProFormDateTimePicker
          name="start_date"
          label="开始时间"
          fieldProps={{
            format: (value) => value.format('YYYY-MM-DD HH:mm'),
          }}
        />
        <ProFormRadio.Group
          label="领取状态"
          name="packet_ret"
          options={[
            { label: '可领取', value: 0 },
            { label: '已领完', value: 1 },
          ]}
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
        {currentRow?.packet_name && (
          <ProDescriptions<API.PacketListItem>
            column={2}
            title={currentRow?.packet_name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.packet_name,
            }}
            columns={columns as ProDescriptionsItemProps<API.PacketListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default Packets;
