import React, { useRef, useState } from 'react';
import { Button, Image, Typography, Popconfirm, message } from 'antd'
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';

import { getProductList } from './services';

import { ProductItem } from './data.d';
import AutoPushOrder from './autoPushOrder';
import { pushOrder } from '../jdLotteryTry/services';
import { addBlackList } from '../blacklist/services';

const { Paragraph } = Typography;
// import EditForm from './EditForm';

const Robots: React.FC = () => {

  const actionRef = useRef<ActionType>();
  const [autoOrderModalVisible, handleAutoOrderModalVisible] = useState<boolean>(false);
  const [autoSku, setAutoSku] = useState<ProductItem>();

  const columns: ProColumns<ProductItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 70,
      sorter: true,
      hideInForm: true,
    },
    {
      title: '商品标题',
      dataIndex: 'trial_name',
      ellipsis: true,
      width: 380,
    },
    {
      title: 'Copy',
      dataIndex: 'create_time',
      ellipsis: true,
      width: 80,
      render: (text, record) => (
        <Paragraph
          key="copy"
          copyable={
            {
              text: 'https://pro.m.jd.com/mall/active/3mpGVQDhvLsMvKfZZumWPQyWt83L/index.html?has_native=0&activityId=' + record.activity_id
            }
          }>
        </Paragraph>
      )
    },
    {
      title: 'activityId',
      width: 120,
      dataIndex: 'activity_id',
    },
    {
      title: '试用价',
      dataIndex: 'order_price',
      width: 70,
      valueType: 'money',
    },
    {
      title: '原价',
      dataIndex: 'price',
      valueType: 'money',
      width: 100,
      search: false
    },
    {
      title: '份数',
      dataIndex: 'supply_count',
      width: 70,
    },
    {
      title: '商品图片',
      dataIndex: 'large_image',
      width: 150,
      search: false,
      // valueType: 'image',
      render: (record) => {
        return <Image width={50} src={"https:" + record} />
      }
    },
    {
      title: '店铺类型',
      dataIndex: 'shop_type',
      width: 80,
      valueEnum: {
        0: { text: '第三方', status: 'Error' },
        1: { text: '自营', status: 'Processing' },
      },
    },
    {
      title: '开始时间',
      dataIndex: 'activity_start_time',
      valueType: 'dateTime',
      width: 160,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Button
          key="del"
          onClick={async () => {
            console.log(record);
            setAutoSku(record)
            handleAutoOrderModalVisible(true)
          }}
        >
          下单
        </Button>,
        <Popconfirm
          key="add_blacklist"
          title={`确认拉黑吗?`}
          onConfirm={async () => {
            await addBlackList({ activity_type: 21, type: 2, keyword: record.shop_name })
            message.success("拉黑成功")
            actionRef.current?.reloadAndRest?.();
          }}
        >
          <Button>店铺拉黑</Button>
        </Popconfirm>
      ],
    },
  ];

  const activity_type = 21

  const getProductListByType = async (params: any) => {
    params["activity_type"] = activity_type
    return getProductList(params)
  }

  const autoPushOrderReq = async (values: any) => {
    await pushOrder({ users: values, sku_db_id: autoSku?.id })
    handleAutoOrderModalVisible(false)
  }

  return (
    <PageContainer>
      <ProTable<ProductItem, API.PageParams>
        headerTitle={'试用商品列表'}
        actionRef={actionRef}
        rowKey="activity_id"
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
            脚本配置
          </Button>,
        ]}
        request={getProductListByType}
        columns={columns}
        rowSelection={false}
      />
      <AutoPushOrder
        title={'添加自动下单任务'}
        onSubmit={autoPushOrderReq}
        onCancel={async () => {
          handleAutoOrderModalVisible(false);
        }}
        updateModalVisible={autoOrderModalVisible}
        values={{}}
      />
    </PageContainer>
  );
};

export default Robots;
