import React, { useRef, useState } from 'react';
import { Button, Image } from 'antd'
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';

import { getProductList, pushOrder } from './services';

import { ProductItem } from './data';
import { addBlackList } from '../blacklist/services';
import AutoPushOrder from './autoPushOrder';

// import EditForm from './EditForm';

const Robots: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const [autoOrderModalVisible, handleAutoOrderModalVisible] = useState<boolean>(false);

  const [autoSku, setAutoSku] = useState<ProductItem>();

  const columns: ProColumns<ProductItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 50,
      sorter: true,
      hideInForm: true,
      search: false
    },
    {
      title: '商品标题',
      dataIndex: 'trial_name',
      ellipsis: true,
      search: false
      // width: 500
    },
    {
      title: '商品sku',
      width: 120,
      dataIndex: 'trial_sku_id',
      search: false
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
      title: '试用类型',
      dataIndex: 'activity_type',
      width: 80,
      search: false
    },
    {
      title: '商品图片',
      dataIndex: 'large_image',
      width: 150,
      // valueType: 'image',
      search: false,
      render: (record) => {
        return <Image width={50} src={"https:" + record} />
      }
    },
    {
      title: '开始时间',
      dataIndex: 'activity_start_time',
      valueType: 'dateTime',
      width: 160,
    },
    {
      title: '结束时间',
      dataIndex: 'activity_end_time',
      valueType: 'dateTime',
      width: 160,
      search: false
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="del"
          onClick={async () => {
            console.log(record);
            setAutoSku(record)
            handleAutoOrderModalVisible(true)
          }}
        >
          自动下单
        </a>,
        <a
          key="addBlacklist"
          onClick={async () => {
            await addBlackList({ activity_type: 21, type: 1, keyword: record.shop_id })
          }}
        >
          店铺加入黑名单
        </a>,
      ],
    },
  ];

  const autoPushOrderReq = async (values: any) => {
    for (let v of values) {

      v["start_time"] = autoSku?.activity_start_time
      v["sku_id"] = autoSku?.trial_sku_id
      console.log(1111, v)
    }
    await pushOrder(values)
  }

  return (
    <PageContainer>
      <ProTable<ProductItem, API.PageParams>
        headerTitle={'付费试用商品列表'}
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
            脚本配置
          </Button>,
        ]}
        request={getProductList}
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
