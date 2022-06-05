import React from 'react';
import {
  ProFormSelect,
  ProFormText,
  ModalForm,
} from '@ant-design/pro-form';
import { getMenuTree } from '@/services/admin/rule'
export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<API.UserListItem>;
export type UpdateFormProps = {
  onCancel: (flag: boolean) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.UserListItem>;
  selectRequest: () => Promise<void>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  console.log(props.values)
  return (
    <ModalForm
      title="配置用户信息"
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
            message: '名称为必填项',
          },
        ]}
        name="name"
        label="名称"
        initialValue={props.values.username}
      />
      <ProFormText
        name="real_name"
        label="真实姓名"
        rules={[
          {
            required: true,
            message: '真实姓名为必填项',
          },
        ]}
        initialValue={props.values.real_name}
      />
      <ProFormSelect
        width="md"
        request={getMenuTree}
        name="role_id"
        label="用户角色"
        initialValue={props.values.role_id}
        cacheForSwr={true}
      />
    </ModalForm>

  );
};

export default UpdateForm;


