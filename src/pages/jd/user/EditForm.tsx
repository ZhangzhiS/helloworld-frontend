import React from 'react';
import {
  ProFormSelect,
  ProFormText,
  ModalForm,
  ProFormTextArea
} from '@ant-design/pro-form';

// import { getMenuTree } from '@/services/admin/rule'

import { JDUserItem } from './data.d';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<JDUserItem>;
export type UpdateFormProps = {
  title: string;
  onCancel: (flag: boolean) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<JDUserItem>;
};

const EditForm: React.FC<UpdateFormProps> = (props) => {
  return (
    <ModalForm
      title={props.title}
      width="600px"
      visible={props.updateModalVisible}
      onFinish={props.onSubmit}
      onVisibleChange={props.onCancel}
      modalProps={{
        destroyOnClose: true
      }}
    >
      <ProFormText
        disabled
        name="id"
        label="ID"
        initialValue={props.values.id}
        placeholder=""
      />
      <ProFormText
        rules={[
          {
            required: true,
          },
        ]}
        name="pt_key"
        label="pt_key"
        initialValue={props.values.pt_key}
      />
      <ProFormText
        rules={[
          {
            required: true,
          },
        ]}
        name="pt_pin"
        label="pt_pin"
        initialValue={props.values.pt_pin}
      />
      <ProFormTextArea
        name="desc"
        label="描述"
        rules={[
          {
            required: true,
          },
        ]}
        initialValue={props.values.desc}
      />
      <ProFormText
        rules={[
          {
            required: true,
          },
        ]}
        name="pwd"
        label="pwd"
        initialValue={props.values.pwd}
      />
      <ProFormSelect
        name="notice_type"
        label="notice_type"
        initialValue={props.values.notice_type}
        placeholder="请选择是否是菜单"
        rules={[{ required: true }]}
        valueEnum={{
            0: "Server酱",
            1: "",
          }}
      />
      <ProFormText
        name="notice_key"
        label="notice_key"
        initialValue={props.values.notice_key}
      />
    </ModalForm>

  );
};

export default EditForm;

