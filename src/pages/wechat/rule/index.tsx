import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
// import { ModalForm, ProFormText, ProFormTextArea, ProFormSelect } from '@ant-design/pro-form';
import type { FormValueType } from './EditForm';
import EditForm from './EditForm';
import {
  removeRobotRule,
  updateWechatRobotRule,
  addRobotRule,
  getRobotRule,
} from '@/services/wechat/api';

/**
 * 添加用户
 * @param fields
 */

const handleAdd = async (fields: API.RobotRuleConfig) => {
  const hide = message.loading('正在添加');
  try {
    await addRobotRule({ ...fields });
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

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */

const handleRemove = async (selectedRow: API.RobotRuleConfig) => {
  const hide = message.loading('正在删除');
  if (!selectedRow) return true;

  try {
    await removeRobotRule(selectedRow.id);
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
  // const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.RobotRuleConfig>();

  const [editModalTitle, setEditModatTitle] = useState<string>('添加规则');
  const [editType, setEditType] = useState<number>(1);

  const onSubmitModalForm = async (value: any) => {
    if (editType === 1) {
      const success = await handleAdd(value as API.RobotRuleConfig);
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

  const columns: ProColumns<API.RobotRuleConfig>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      sorter: true,
      hideInForm: true,
    },
    {
      title: '名称',
      dataIndex: 'rule_name',
    },
    {
      title: '规则标识',
      dataIndex: 'rule_code',
    },
    {
      title: '规则地址',
      dataIndex: 'rule_api',
    },
    {
      title: '规则类型',
      dataIndex: 'rule_type',
      valueEnum: {
        1: {
          text: '转发',
        },
        2: {
          text: '收集',
        },
        3: {
          text: '定时',
        },
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
            setEditModatTitle('修改规则');
            setEditType(2);
            setCurrentRow(record);
            console.log('fix', record);
          }}
        >
          修改
        </a>,
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
      <ProTable<API.RobotRuleConfig, API.PageParams>
        headerTitle={'规则列表'}
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
              setEditModatTitle('新建规则');
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={getRobotRule}
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
      />
    </PageContainer>
  );
};

export default Rules;
