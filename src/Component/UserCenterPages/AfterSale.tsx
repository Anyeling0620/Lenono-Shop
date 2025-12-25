import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Input,
  Select,
  DatePicker,
  message,
  Badge,
  Tooltip,
  Modal
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
  RedoOutlined,
  SyncOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { AfterSaleListItem, AfterSaleQueryParams, AfterSaleStatus, AfterSaleType, ReapplyState } from '../../types/afterSale';
import { afterSaleService } from '../../services/afterSale';
import globalErrorHandler from '../../utils/globalAxiosErrorHandler';
import toast from 'react-hot-toast';

const { RangePicker } = DatePicker;
const { Option } = Select;

const AfterSaleList: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AfterSaleListItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

  // 状态配置 - 联想红色主题
  const statusConfig: Record<AfterSaleStatus, { color: string; text: string }> = {
    '申请中': { color: '#ff6b35', text: '申请中' },
    '已同意': { color: '#52c41a', text: '已同意' },
    '已拒绝': { color: '#ff4d4f', text: '已拒绝' },
    '已寄出': { color: '#1890ff', text: '已寄出' },
    '已寄回': { color: '#722ed1', text: '已寄回' },
    '已退款': { color: '#13c2c2', text: '已退款' },
    '已完成': { color: '#fa8c16', text: '已完成' }
  };

  // 类型配置
  const typeConfig: Record<AfterSaleType, { color: string; text: string }> = {
    '退货': { color: '#ff4d4f', text: '退货' },
    '换货': { color: '#1890ff', text: '换货' },
    '维修': { color: '#52c41a', text: '维修' }
  };

  // 获取售后列表
  const fetchAfterSales = async () => {
    try {
      setLoading(true);
      const query: AfterSaleQueryParams  = {};

      if (filterStatus !== 'all') {
        query.status = filterStatus;
      }

      if (searchText) {
        query.orderId = searchText;
      }

      if (dateRange) {
        query.startDate = dateRange[0].format('YYYY-MM-DD');
        query.endDate = dateRange[1].format('YYYY-MM-DD');
      }

      const result = await afterSaleService.getAfterSales(query);
      setData(result);
    } catch (error) {
      message.error('获取售后列表失败');
      console.error('获取售后列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 取消售后
  const handleCancelAfterSale = async (id: string) => {
    Modal.confirm({
      title: '确认取消售后？',
      icon: <ExclamationCircleOutlined />,
      content: '取消后无法恢复，请确认是否继续？',
      okText: '确认',
      cancelText: '取消',
      okButtonProps: {
        style: { backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }
      },
      onOk: async () => {
        try {
          await afterSaleService.cancelAfterSale(id);
          message.success('售后已取消');
          fetchAfterSales();
        } catch (error) {
          globalErrorHandler.handle(error, toast.error)
        }
      }
    });
  };

  // 查看详情
  // 修正后的查看详情跳转
  const handleViewDetail = (record: AfterSaleListItem) => {
    navigate(`/after-sale/${record.id}`);
    // 或者如果需要传递完整记录
    // navigate(`/after-sale/${record.id}`, { state: { record } });
  };

  // 重新申请
const handleReapply = (record: AfterSaleListItem) => {
    const state: ReapplyState = {
      orderId: record.orderId,
      orderItemId: record.orderItemId
    };
    navigate('/after-sale/apply', { state });
  };


  // 表格列定义
  const columns = [
    {
      title: '售后单号',
      dataIndex: 'afterSaleNo',
      key: 'afterSaleNo',
      width: 150,
      render: (text: string) => (
        <span className="font-medium  text-gray-900">{text}</span>
      )
    },
    {
      title: '订单信息',
      key: 'orderInfo',
      render: (_: unknown, record: AfterSaleListItem) => (
        <div className="space-y-1">
          <div className="text-sm">
            <span className="text-gray-500">订单号：</span>
            <span className="font-medium">{record.order.orderNo}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">商品：</span>
            <span className="font-medium">{record.orderItem.productName}</span>
          </div>
        </div>
      )
    },
    {
      title: '售后类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: AfterSaleType) => (
        <Tag color={typeConfig[type].color} className="font-medium">
          {typeConfig[type].text}
        </Tag>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: AfterSaleStatus) => (
        <Badge
          color={statusConfig[status].color}
          text={
            <span className="font-medium" style={{ color: statusConfig[status].color }}>
              {statusConfig[status].text}
            </span>
          }
        />
      )
    },
    {
      title: '申请原因',
      dataIndex: 'reason',
      key: 'reason',
      ellipsis: true,
      width: 180,
      render: (text: string) => (
        <Tooltip title={text}>
          <span className="text-gray-700">{text}</span>
        </Tooltip>
      )
    },
    {
      title: '申请时间',
      dataIndex: 'applyTime',
      key: 'applyTime',
      width: 150,
      render: (date: Date) => (
        <span className="text-gray-600">
          {dayjs(date).format('YYYY-MM-DD HH:mm')}
        </span>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: unknown, record: AfterSaleListItem) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
            className="text-red-600 hover:text-red-800"
          >
            查看详情
          </Button>

          {record.status === '申请中' && (
            <Button
              type="link"
              size="small"
              danger
              onClick={() => handleCancelAfterSale(record.id)}
            >
              取消申请
            </Button>
          )}

          {['已拒绝', '已取消'].includes(record.status) && (
            <Button
              type="link"
              size="small"
              icon={<RedoOutlined />}
              onClick={() => handleReapply(record)}
              className="text-blue-600 hover:text-blue-800"
            >
              重新申请
            </Button>
          )}
        </Space>
      )
    }
  ];

  // 初始化加载
  useEffect(() => {
    fetchAfterSales();
  }, []);

  return (
    <div className="w-[880px] mx-auto ">
      {/* 联想风格头部 */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">我的售后</h1>
        <p className="text-gray-600">管理您的售后申请和进度</p>
      </div>

      <Card className=" shadow-sm border-0">
        <div className="flex flex-nowrap items-center gap-2">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="搜索订单号"
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="w-40">
            <Select
              value={filterStatus}
              onChange={setFilterStatus}
              placeholder="选择状态"
              className="w-full"
            >
              <Option value="all">全部状态</Option>
              <Option value="申请中">申请中</Option>
              <Option value="已同意">已同意</Option>
              <Option value="已拒绝">已拒绝</Option>
              <Option value="已寄出">已寄出</Option>
              <Option value="已寄回">已寄回</Option>
              <Option value="已退款">已退款</Option>
              <Option value="已完成">已完成</Option>
            </Select>
          </div>

          <div className="w-64">
            <RangePicker
              className="w-full"
              onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
            />
          </div>

          <Space className="flex-shrink-0">
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={fetchAfterSales}
              style={{ backgroundColor: '#ff6b35', borderColor: '#ff6b35' }}
            >
              搜索
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setFilterStatus('all');
                setSearchText('');
                setDateRange(null);
                fetchAfterSales();
              }}
            >
              重置
            </Button>
          </Space>
        </div>

      </Card>

      {/* 数据表格 */}
      <Card className="shadow-sm border-0">
        <div className="flex justify-between items-center mb-4">
          <div className="text-gray-600">
            共 <span className="font-bold text-red-600">{data.length}</span> 条售后记录
          </div>
          <Button
            icon={<SyncOutlined />}
            onClick={fetchAfterSales}
            loading={loading}
          >
            刷新
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          size="small"  // 添加这行
          pagination={{
            pageSize: 3,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`
          }}
          scroll={{ x: '1200px' }}
        />

      </Card>


    </div>
  );
};

export default AfterSaleList;
