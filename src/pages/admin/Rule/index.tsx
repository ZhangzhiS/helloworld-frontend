import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Input, Drawer } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
// import { ModalForm, ProFormText, ProFormTextArea, ProFormSelect } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './EditForm';
import EditForm from './EditForm';
import { getRule, removeRule, updateRule, addRule } from '@/services/admin/rule'

/**
 * 添加用户
 * @param fields
 */

const handleAdd = async (fields: API.RuleListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addRule({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败,请重试');
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
    await updateRule({
      ...fields
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

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */

const handleRemove = async (selectedRows: API.RuleListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;

  try {
    await removeRule(
      selectedRows.map((row) => row.id),
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

const Rules: React.FC = () => {
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
  const [currentRow, setCurrentRow] = useState<API.RuleListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);

  const [editModalTitle, setEditModatTitle] = useState<string>("新建规则");
  const [editType, setEditType] = useState<number>(1)

  const onSubmitModalForm = async (value: any) => {
    if (editType === 1) {
      const success = await handleAdd(value as API.RuleListItem);
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

  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      sorter: true,
      hideInForm: true,
    },
    {
      title: '权限',
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
      title: '父权限ID',
      dataIndex: 'parent_id',
    },
    {
      title: '描述',
      dataIndex: 'desc',
      valueType: 'textarea',
    },
    {
      title: '是否是菜单',
      dataIndex: 'is_menu',
      hideInForm: true,
      valueEnum: {
        1: {
          text: '菜单',
        },
        0: {
          text: '非菜单',
        },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      valueType: 'dateTime',
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status');

        if (`${status}` === '0') {
          return false;
        }

        if (`${status}` === '3') {
          return <Input {...rest} placeholder={'请输入异常原因！'} />;
        }

        return defaultRender(item);
      },
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
            setEditModatTitle("修改规则")
            setEditType(2)
            setCurrentRow(record);
            console.log("fix", record)
          }}
        >
          修改
        </a>,
        <a
          key="del"
          onClick={async () => {
            await handleRemove([record])
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
      <ProTable<API.RuleListItem, API.PageParams>
        headerTitle={'权限列表'}
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
              console.log("new")
              setCurrentRow(undefined);
              handleUpdateModalVisible(true);
              setEditModatTitle("新建权限")
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={getRule}
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
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default Rules;

