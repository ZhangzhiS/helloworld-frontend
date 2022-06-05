import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
// import { Md5 } from 'ts-md5'
import { Md5 } from "ts-md5/dist/md5";

import { addJDUser, getJDUserList, removeJDUser, updateJDUser } from './services'
import { JDUserItem } from './data.d';

import type { FormValueType } from './EditForm';
import EditForm from './EditForm';

const handleAdd = async (fields: JDUserItem) => {
  const hide = message.loading('正在添加');
  try {
    await addJDUser({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败,请重试');
    return false;
  }
};

const handleRemove = async (selectedRow: JDUserItem) => {
  const hide = message.loading('正在删除');
  if (!selectedRow) return true;

  try {
    await removeJDUser(selectedRow.id);
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败');
    return false;
  }
};

const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('Configuring');
  try {
    await updateJDUser({
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

const JDUser: React.FC = () => {
  // const [createModalVisible, handleModalVisible] = useState<boolean>(false);

  // const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<JDUserItem>();
  // const [selectedRowsState, setSelectedRows] = useState<JDUserItem[]>([]);

  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [editModalTitle, setEditModatTitle] = useState<string>("新建账号");
  const [editType, setEditType] = useState<number>(1)

  const onSubmitModalForm = async (value: any) => {

    value.pwd = Md5.hashStr(value.pwd)

    if (editType === 1) {
      const success = await handleAdd(value as JDUserItem);
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


  const columns: ProColumns<JDUserItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      sorter: true,
      hideInForm: true,
    },
    {
      title: '备注',
      dataIndex: 'desc',
    },
    {
      title: 'pt_pin',
      dataIndex: 'pt_pin',
    },
    {
      title: 'pt_key',
      dataIndex: 'pt_key',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Button
          key="config"
          onClick={() => {
            handleUpdateModalVisible(true);
            setEditModatTitle("修改")
            setEditType(2)
            setCurrentRow(record);
            console.log("fix", record)
          }}
        >
          修改
        </Button>,
        <Button
          key="del"
          onClick={async () => {
            await handleRemove(record);
            actionRef.current?.reloadAndRest?.();
          }}
        >
          删除
        </Button>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<JDUserItem, API.PageParams>
        headerTitle={'JD用户列表'}
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
              setEditModatTitle("新建")
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={getJDUserList}
        columns={columns}
        rowSelection={false}
      />
      <EditForm
        title={editModalTitle}
        onCancel={(tag: boolean) => {
          handleUpdateModalVisible(tag);
          console.log('close', currentRow);
          if (!tag) {
            setCurrentRow(undefined);
          }
        }}
        onSubmit={onSubmitModalForm}
        updateModalVisible={updateModalVisible}
        values={currentRow || {}}
      />

    </PageContainer>
  );
};

export default JDUser;
