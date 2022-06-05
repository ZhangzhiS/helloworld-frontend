import React from 'react';
import {
  // ProFormTreeSelect,
  ProFormCascader,
  ProFormText,
  ModalForm,
  ProFormTextArea
} from '@ant-design/pro-form';
import { getMenuTree } from '@/services/admin/rule'
export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<API.RoleListItem>;
export type UpdateFormProps = {
  title: string;
  onCancel: (flag: boolean) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.RoleListItem>;
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
            message: '名称为必填项',
          },
        ]}
        name="name"
        label="名称"
        initialValue={props.values.name}
      />
      <ProFormTextArea
        name="desc"
        label="描述"
        rules={[
          {
            required: true,
            message: '描述为必填项',
          },
        ]}
        initialValue={props.values.desc}
      />
      <ProFormCascader
        width="md"
        request={getMenuTree}
        name="rule_ids"
        label="权限管理"
        initialValue={props.values.rule_ids}
        fieldProps={{"multiple": true}}
        cacheForSwr={true}
      />
    </ModalForm>

  );
};

export default EditForm;


