import React from 'react';
import {
  ProFormSelect,
  ProFormTreeSelect,
  // ProFormCascader,
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
} & Partial<API.RuleListItem>;
export type UpdateFormProps = {
  title: string;
  onCancel: (flag: boolean) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.RuleListItem>;
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
      <ProFormText
        rules={[
          {
            required: true,
            message: '权限标识为必填项',
          },
        ]}
        name="unique_code"
        label="标识"
        initialValue={props.values.unique_code}
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
      <ProFormText
        rules={[
          {
            required: true,
            message: '地址为必填项',
          },
        ]}
        name="path"
        label="地址"
        initialValue={props.values.path}
      />
      <ProFormSelect
        name="is_menu"
        label="是否是菜单"
        initialValue={props.values.is_menu}
        request={async () => [{"label":"是","value":1},{"label":"否","value":0}]}
        placeholder="请选择是否是菜单"
        rules={[{ required: true, message: '请选择是否为菜单' }]}
      />
      <ProFormTreeSelect
        width="md"
        request={getMenuTree}
        name="parent_id"
        label="父级权限ID"
        cacheForSwr={true}
        secondary={true}
        initialValue={props.values.parent_id}
      />
    </ModalForm>

  );
};

export default EditForm;

