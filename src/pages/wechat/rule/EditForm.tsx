import React from 'react';
import { ProFormSelect, ProFormText, ModalForm } from '@ant-design/pro-form';
export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<API.RobotRuleConfig>;
export type UpdateFormProps = {
  title: string;
  onCancel: (flag: boolean) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.RobotRuleConfig>;
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
        destroyOnClose: true,
      }}
    >
      <ProFormText disabled name="id" label="ID" initialValue={props.values.id} placeholder="" />
      <ProFormText
        rules={[
          {
            required: true,
            message: '规则名称为必填项',
          },
        ]}
        name="rule_name"
        label="名称"
        initialValue={props.values?.rule_name}
      />
      <ProFormText
        rules={[
          {
            required: true,
            message: '规则标识为必填项',
          },
        ]}
        name="rule_code"
        label="规则标识"
        initialValue={props.values?.rule_code}
      />
      <ProFormText
        rules={[
          {
            required: true,
            message: '权限标识为必填项',
          },
        ]}
        name="rule_api"
        label="规则API"
        initialValue={props.values?.rule_code}
      />
      <ProFormSelect
        name="rule_type"
        label="规则类型"
        initialValue={props.values?.rule_type}
        request={async () => [
          { label: '转发', value: 1 },
          { label: '收集', value: 2 },
          { label: '定时', value: 3 },
        ]}
        placeholder="配置规则类型"
        rules={[{ required: true, message: '请选择规则的类型' }]}
      />
    </ModalForm>
  );
};

export default EditForm;
