import React, { useState } from 'react';
import // ModalForm,
  '@ant-design/pro-form';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { FooterToolbar } from '@ant-design/pro-layout';
import { Button, Modal } from 'antd';
import { JDUserItem } from '../user/data';
import { getJDUserList } from '../user/services';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<JDUserItem>;
export type UpdateFormProps = {
  title: string;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.RuleListItem>;
};

const AutoPushOrder: React.FC<UpdateFormProps> = (props) => {
  // const getLessonSesect = async () => {
  //   // 获取课程列表
  //   const data = await getLessonList({current:1 , pageSize: 20})
  // }
  const [selectedRows, setSelectedRows] = useState<JDUserItem[]>([]);

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
  ];

  return (
    <Modal
      title="添加自动下单"
      width="1000px"
      visible={props.updateModalVisible}
      onCancel={props.onCancel}
      onOk={() => {
        props.onSubmit(selectedRows)
        props.onCancel
      }}
    >
      <ProTable<JDUserItem, API.PageParams>
        headerTitle={'用户列表'}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={false}
        request={getJDUserList}
        columns={columns}
        rowSelection={{
          onChange: (_, selected) => {
            setSelectedRows(selected);
          },
        }}
      />
    </Modal>
  );
};

export default AutoPushOrder;

