import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getTaskList } from './services';
import { TaskItem } from './data';


const Tasks: React.FC = () => {

  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<TaskItem[]>([]);



  const columns: ProColumns<TaskItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '运行时间',
      dataIndex: 'run_time',
      hideInForm: true,
      search: false,
      valueType: 'dateTime',
    },
    {
      title: '任务名称',
      dataIndex: 'name',
      hideInForm: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '未执行',
          status: 'Processing',
        },
        1: {
          text: '成功',
          status: 'Success',
        },
        2: {
          text: '失败',
          status: 'Error',
        },
        3: {
          text: '异常',
          status: 'Error',
        },
      },
    },
    {
      title: '任务备注',
      dataIndex: 'remarks',
      sorter: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Button
          key="config"
          onClick={() => {
          }}
        >
          停止
        </Button>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<TaskItem, API.PageParams>
        headerTitle={'任务列表'}
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
              // handleModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={getTaskList}
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
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}
    </PageContainer>
  );
};

export default Tasks;
