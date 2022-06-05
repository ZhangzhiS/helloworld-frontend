import React from 'react';
import {
  ProFormDateTimePicker,
  ProFormText,
  ProFormRadio,
  ModalForm,
} from '@ant-design/pro-form';
import { getMenuTree } from '@/services/admin/rule'
export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<API.PacketListItem>;
export type UpdateFormProps = {
  onCancel: (flag: boolean) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.PacketListItem>;
  selectRequest: () => Promise<void>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  console.log(props.values)
  return (
    <ModalForm
      title="配置封面信息"
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
        name="packet_name"
        label="封面名称"
        initialValue={props.values.packet_name}
      />
      <ProFormText
        name="packet_url"
        label="领取链接"
        rules={[
          {
            required: true,
            message: '领取链接为必填项',
          },
        ]}
        initialValue={props.values.packet_url}
      />
      <ProFormText
        name="packet_source_image"
        label="封面图片"
        initialValue={props.values.packet_source_image}
      />
      <ProFormDateTimePicker
        name="start_date"
        label="日期时间"
        fieldProps={{
          format: (value) => value.format('YYYY-MM-DD HH:mm'),
        }}
        initialValue={props.values.start_date}
      />
      <ProFormRadio.Group
        label="领取状态"
        name="packet_ret"
        options={[
          { label: '可领取', value: 0 },
          { label: '已领完', value: 1 },
        ]}
        initialValue={props.values.packet_ret}
      />

    </ModalForm>

  );
};

export default UpdateForm;


