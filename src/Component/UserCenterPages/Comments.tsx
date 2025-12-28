import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Rate,
  Button,
  Card,
  Image,
  Typography,
  Checkbox,
  Empty,
  Tag,
  Spin,
  Tooltip,
  Popconfirm
} from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { EvaluationDetail } from '../../types/afterSale';
import {
  DownOutlined,
  UpOutlined,
  StarFilled,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  CalendarOutlined,
  ShoppingOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { deleteEvaluation, getEvaluations } from '../../services/afterSale';
import globalErrorHandler from '../../utils/globalAxiosErrorHandler';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../utils/imageConfig';

const { Paragraph } = Typography;



// 格式化日期
// 格式化日期
const formatDate = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);

  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    return '无效日期';
  }

  const diff = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diff / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  // 使用本地时间格式
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false // 使用24小时制
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  };

  if (diffSeconds < 60) {
    return '刚刚';
  } else if (diffMinutes < 60) {
    return `${diffMinutes}分钟前`;
  } else if (diffHours < 24) {
    return `${diffHours}小时前`;
  } else if (diffDays === 0) {
    return `今天 ${date.toLocaleTimeString('zh-CN', timeOptions)}`;
  } else if (diffDays === 1) {
    return `昨天 ${date.toLocaleTimeString('zh-CN', timeOptions)}`;
  } else if (diffDays < 7) {
    return `${diffDays}天前`;
  } else {
    return date.toLocaleDateString('zh-CN', dateOptions);
  }
};


// 星级颜色映射
const getStarColor = (star: number) => {
  if (star >= 4.5) return '#52c41a'; // 绿色
  if (star >= 3.5) return '#faad14'; // 橙色
  if (star >= 2.5) return '#fa8c16'; // 深橙色
  return '#ff4d4f'; // 红色
};

// 星级标签样式
const getStarTagStyle = (star: number) => {
  const color = getStarColor(star);
  return {
    backgroundColor: `${color}15`,
    color: color,
    borderColor: `${color}30`,
    fontWeight: 600,
    borderRadius: '12px',
    padding: '2px 10px'
  };
};

const Comments: React.FC = () => {
  const [comments, setComments] = useState<EvaluationDetail[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<boolean>(true);
  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        setLoading(true);
        const data = await getEvaluations();
        setComments(data);
      } catch (error) {
        globalErrorHandler.handle(error, toast.error);
      } finally {

        setLoading(false);
      }
    };
    fetchEvaluations();
  }, []);

  const onSelectAllChange = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      setSelectedIds(comments.map(c => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const onSelectChange = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(s => s !== id));
    }
  };

  const onDelete = async () => {
    if (selectedIds.length === 0) return;

    try {
      setDeleting(true);
      await Promise.all(selectedIds.map(id => deleteEvaluation(id)));
      const data = await getEvaluations();
      setComments(data);
      setSelectedIds([]);
      toast.success(`成功删除 ${selectedIds.length} 条评价`);
    } catch (error) {
      globalErrorHandler.handle(error, toast.error);
    } finally {
      setDeleting(false);
    }
  };

  const onExpand = (id: string) => {
    setExpandedKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const allChecked = comments.length > 0 && selectedIds.length === comments.length;
  const indeterminate = selectedIds.length > 0 && selectedIds.length < comments.length;


  if (loading) {
    return (
      <div className=" bg-gradient-to-b from-gray-50 to-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Spin size="large" tip="加载评价中..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-gradient-to-b from-gray-50 to-white p-6">
      <div className=" mx-auto">
        {/* 页面标题 */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <StarFilled className="text-xl text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">我的评价</h1>
            </div>
          </div>
        </div>


        {/* 操作栏 */}
        <Card className="shadow-sm border-0 rounded-xl mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <Checkbox
                indeterminate={indeterminate}
                checked={allChecked}
                onChange={onSelectAllChange}
                className="text-base"
              >
                <span className="font-medium text-gray-700">全选</span>
              </Checkbox>
              <span className="text-sm text-gray-500">
                已选择 <span className="font-bold text-blue-600">{selectedIds.length}</span> 条评价
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Popconfirm
                title="确认删除"
                description={`确定要删除选中的 ${selectedIds.length} 条评价吗？此操作不可恢复。`}
                onConfirm={onDelete}
                okText="确定"
                cancelText="取消"
                okButtonProps={{ danger: true, loading: deleting }}
              >
                <Button
                  type="primary"
                  danger
                  disabled={selectedIds.length === 0}
                  loading={deleting}
                  icon={<DeleteOutlined />}
                  className="flex items-center gap-2"
                >
                  批量删除
                </Button>
              </Popconfirm>
            </div>
          </div>
        </Card>

        {comments.length === 0 ? (
          <Card className="shadow-sm border-0 rounded-xl">
            <Empty
              className="py-16"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div className="text-center">
                  <p className="text-gray-600 mb-2">暂无评价记录</p>
                  <p className="text-gray-400 text-sm">您还没有发表过任何商品评价</p>
                  <Button type="primary" className="mt-4" onClick={() => window.location.href = '/orders'}>
                    去评价已购商品
                  </Button>
                </div>
              }
            />
          </Card>
        ) : (
          <div className="h-[450px] overflow-y-auto pr-[6px] 
    [&::-webkit-scrollbar]:w-1
    [&::-webkit-scrollbar-track]:rounded-xl
    [&::-webkit-scrollbar-track]:bg-gray-100
    [&::-webkit-scrollbar-thumb]:rounded-xl
    [&::-webkit-scrollbar-thumb]:bg-gray-300
    [&::-webkit-scrollbar-thumb:hover]:bg-gray-400
    [&::-webkit-scrollbar-button]:hidden
">
            <div className="space-y-4">
              {comments.map((comment) => {
                const id = comment.id;
                const isSelected = selectedIds.includes(id);
                const isExpanded = expandedKeys.has(id);
                const starColor = getStarColor(comment.star);

                return (
                  <Card
                    key={id}
                    className={`shadow-sm border-0 rounded-xl transition-all duration-300 hover:shadow-md ${isSelected ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''
                      } ${isExpanded ? 'border border-blue-200' : ''}`}
                    bodyStyle={{ padding: 0 }}
                  >
                    {/* 评价卡片头部 */}
                    <div className="p-5">
                      <Row gutter={16} align="middle">
                        {/* 选择框 */}
                        <Col xs={2} sm={1}>
                          <Checkbox
                            checked={isSelected}
                            onChange={(e) => onSelectChange(id, e.target.checked)}
                            className="transform scale-125"
                          />
                        </Col>

                        {/* 商品信息 */}
                        <Col xs={22} sm={11}>
                          <div className="flex items-start gap-4">
                            {/* 商品图片 */}
                            <div className="relative group">
                              <div className="w-20 h-20 rounded-xl overflow-hidden shadow-md border border-gray-200 bg-white">
                                <Image
                                  src={getImageUrl(comment.product.mainImage) }
                                  width={80}
                                  height={80}
                                  preview={{
                                    mask: (
                                      <div className="flex items-center justify-center text-white">
                                        <EyeOutlined className="mr-2" />
                                        查看大图
                                      </div>
                                    )
                                  }}
                                  className="object-cover hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              {comment.images && comment.images.length > 0 && (
                                <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                                  {comment.images.length}
                                </div>
                              )}
                            </div>

                            {/* 商品详情 */}
                            <div className="flex-1">

                              <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-1">
                                {comment.product.name}
                              </h3>

                              <div className="flex items-center gap-4 mb-2">
                                <div className="flex items-center gap-1">
                                  <span className="text-lg font-bold text-red-600">
                                    ¥{comment.config.salePrice.toFixed(2)}
                                  </span>
                                  {comment.config.originalPrice > comment.config.salePrice && (
                                    <span className="text-sm text-gray-400 line-through">
                                      ¥{comment.config.originalPrice.toFixed(2)}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-3 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <CalendarOutlined className="text-gray-400" />
                                  {formatDate(comment.createdAt)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <ShoppingOutlined className="text-gray-400" />
                                  {comment.config.config1}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Col>

                        {/* 评分和操作 */}
                        <Col xs={24} sm={12} className="mt-4 sm:mt-0">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between h-full gap-4">
                            {/* 评分区域 */}
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  <Rate
                                    disabled
                                    value={comment.star}
                                    character={<StarFilled />}
                                    className="text-lg"
                                    style={{ color: starColor }}
                                  />
                                  <Tag style={getStarTagStyle(comment.star)}>
                                    {comment.star}分
                                  </Tag>
                                </div>
                              </div>

                              {/* 配置信息 */}
                              <div className="mt-3 flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                  {comment.config.config1}
                                </span>
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                  {comment.config.config2}
                                </span>
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                  {comment.config.config3}
                                </span>
                              </div>
                            </div>

                            {/* 操作按钮 */}
                            <div className="flex items-center gap-2">
                              <Tooltip title={isExpanded ? "收起详情" : "查看详情"}>
                                <Button
                                  type="text"
                                  icon={isExpanded ? <UpOutlined /> : <DownOutlined />}
                                  onClick={() => onExpand(id)}
                                  className="text-gray-500 hover:text-blue-600"
                                />
                              </Tooltip>

                              <Tooltip title="编辑评价">
                                <Button
                                  type="text"
                                  icon={<EditOutlined />}
                                  className="text-gray-500 hover:text-blue-600"
                                  onClick={() => {
                                    // 编辑评价逻辑
                                    toast.success('编辑功能开发中');
                                  }}
                                />
                              </Tooltip>

                              <Popconfirm
                                title="确认删除"
                                description="确定要删除这条评价吗？此操作不可恢复。"
                                onConfirm={() => {
                                  setSelectedIds([id]);
                                  onDelete();
                                }}
                                okText="确定"
                                cancelText="取消"
                              >
                                <Tooltip title="删除评价">
                                  <Button
                                    type="text"
                                    icon={<DeleteOutlined />}
                                    className="text-gray-500 hover:text-red-600"
                                  />
                                </Tooltip>
                              </Popconfirm>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>

                    {/* 展开的评价详情 */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 bg-gradient-to-b from-gray-50 to-white animate-fadeIn">
                        <div className="p-5">
                          {/* 评价内容 */}
                          <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                              <CheckCircleOutlined className="text-green-500" />
                              <h4 className="text-sm font-medium text-gray-700">评价内容</h4>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                              <Paragraph className="text-gray-800 leading-relaxed whitespace-pre-wrap m-0">
                                {comment.content}
                              </Paragraph>
                            </div>
                          </div>

                          {/* 评价图片 */}
                          {comment.images && comment.images.length > 0 && (
                            <div className="mb-6">
                              <div className="flex items-center gap-2 mb-3">
                                <EyeOutlined className="text-blue-500" />
                                <h4 className="text-sm font-medium text-gray-700">
                                  评价图片 ({comment.images.length}张)
                                </h4>
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {comment.images.map((imgInfo, index) => (
                                  <div
                                    key={imgInfo.id}
                                    className="relative group cursor-pointer"
                                  >
                                    <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                                      <Image
                                        src={getImageUrl(imgInfo.image)}
                                        alt={`评价图片 ${index + 1}`}
                                        width="100%"
                                        height="100%"
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        preview={{
                                          mask: (
                                            <div className="flex items-center justify-center text-white">
                                              <EyeOutlined className="mr-2" />
                                              查看大图
                                            </div>
                                          )
                                        }}
                                      />
                                    </div>
                                    <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                      {index + 1}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 评价状态和时间 */}
                          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <CalendarOutlined />
                                发表时间: {new Date(comment.createdAt).toLocaleString('zh-CN')}
                              </span>

                            </div>

                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        )}

      </div>


    </div>
  );
};

export default Comments;
