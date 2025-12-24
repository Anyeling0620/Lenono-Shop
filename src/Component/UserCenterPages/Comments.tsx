import React, { useState } from 'react';
// TODO: 服务器配置完成后，取消下面这行的注释，并删除 useState 中的 useEffect（如果已添加）
// import React, { useState, useEffect } from 'react';
import { Row, Col, Rate, Button, Card, Image, Typography, Checkbox, Space } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { EvaluationDetail } from '../../types/afterSale';
// TODO: 服务器配置完成后，取消下面这行的注释
// import { getEvaluations, deleteEvaluation } from '../../services/afterSale';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

const { Text, Title, Paragraph } = Typography;

// 格式化日期为 MM-DD HH:mm
const formatDate = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${month}-${day} ${hours}:${minutes}`;
};

// ==================== 模拟数据区域 ====================
// TODO: 服务器配置完成后，删除下面的模拟数据，改用 API 获取数据
// 模拟数据：3个商品评价，使用 EvaluationDetail 类型
const initialComments: EvaluationDetail[] = [
  {
    id: '1',
    userId: 'user1',
    productId: 'product1',
    configId: 'config1',
    star: 4,
    content: '这款笔记本性能出色，电池续航很长，键盘手感一流，值得推荐！',
    status: '正常',
    createdAt: new Date('2024-12-08T18:12:00'),
    updatedAt: new Date('2024-12-08T18:12:00'),
    images: [
      {
        id: 'img1',
        image: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
    ],
    product: {
      id: 'product1',
      name: '联想ThinkPad X1 Carbon',
      mainImage: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      brand: {
        id: 'brand1',
        name: '联想',
      },
      category: {
        id: 'cat1',
        name: '笔记本电脑',
      },
    },
    config: {
      id: 'config1',
      config1: '16GB内存',
      config2: '512GB SSD',
      config3: 'i7处理器',
      salePrice: 9999.00,
      originalPrice: 11999.00,
      configImage: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
  },
  {
    id: '2',
    userId: 'user1',
    productId: 'product2',
    configId: 'config2',
    star: 5,
    content: '轻薄便携，屏幕显示效果优秀，性价比高，非常满意！',
    status: '正常',
    createdAt: new Date('2024-12-08T00:45:00'),
    updatedAt: new Date('2024-12-08T00:45:00'),
    images: [
      {
        id: 'img2',
        image: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
      {
        id: 'img3',
        image: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
    ],
    product: {
      id: 'product2',
      name: '联想小新Air 14',
      mainImage: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      brand: {
        id: 'brand1',
        name: '联想',
      },
      category: {
        id: 'cat1',
        name: '笔记本电脑',
      },
    },
    config: {
      id: 'config2',
      config1: '8GB内存',
      config2: '256GB SSD',
      config3: 'i5处理器',
      salePrice: 5999.00,
      originalPrice: 6999.00,
      configImage: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
  },
  {
    id: '3',
    userId: 'user1',
    productId: 'product3',
    configId: 'config3',
    star: 3,
    content: '游戏性能强劲，但风扇噪音较大，希望优化一下散热。',
    status: '正常',
    createdAt: new Date('2024-12-06T20:20:00'),
    updatedAt: new Date('2024-12-06T20:20:00'),
    images: [],
    product: {
      id: 'product3',
      name: '联想拯救者游戏本',
      mainImage: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      brand: {
        id: 'brand1',
        name: '联想',
      },
      category: {
        id: 'cat1',
        name: '笔记本电脑',
      },
    },
    config: {
      id: 'config3',
      config1: '16GB内存',
      config2: '1TB SSD',
      config3: 'RTX 3060',
      salePrice: 7999.00,
      originalPrice: 8999.00,
      configImage: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
  },
];

const Comments: React.FC = () => {
  // TODO: 服务器配置完成后，将下面的 initialComments 改为 []
  const [comments, setComments] = useState<EvaluationDetail[]>(initialComments);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

  // ==================== API 调用区域 ====================
  // TODO: 服务器配置完成后，取消下面代码的注释，用于从 API 获取评价列表
  /*
  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        // 获取评价列表，可以根据需要传入查询参数
        // 例如：getEvaluations({ status: '正常' })
        const data = await getEvaluations();
        setComments(data);
      } catch (error) {
        console.error('获取评价列表失败:', error);
        // 可以添加错误提示，例如使用 message.error('获取评价列表失败')
      }
    };
    fetchEvaluations();
  }, []);
  */

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
    // TODO: 服务器配置完成后，取消下面代码的注释，使用 API 删除评价
    /*
    try {
      // 批量删除选中的评价
      await Promise.all(selectedIds.map(id => deleteEvaluation(id)));
      // 删除成功后，重新获取评价列表
      const data = await getEvaluations();
      setComments(data);
      setSelectedIds([]);
      // 可以添加成功提示，例如使用 message.success('删除成功')
    } catch (error) {
      console.error('删除评价失败:', error);
      // 可以添加错误提示，例如使用 message.error('删除评价失败')
    }
    */
    
    // 临时模拟删除（服务器配置完成后删除此代码）
    setComments(prev => prev.filter(c => !selectedIds.includes(c.id)));
    setSelectedIds([]);
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

  return (
    <div style={{ 
      padding: '24px', 
      background: 'linear-gradient(to bottom, #fafafa 0%, #ffffff 100%)',
      minHeight: '100vh'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Title 
          level={2} 
          style={{ 
            marginBottom: '16px',
            fontWeight: 600,
            color: '#1a1a1a',
            letterSpacing: '0.5px',
            fontSize: '20px'
          }}
        >
          我的评价
        </Title>
        
        <Card
          style={{
            marginBottom: '16px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            border: 'none'
          }}
          bodyStyle={{ padding: '12px 20px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Checkbox
              indeterminate={indeterminate}
              checked={allChecked}
              onChange={onSelectAllChange}
              style={{ fontSize: '15px' }}
            >
              <span style={{ fontWeight: 500 }}>全选</span>
            </Checkbox>
            <Button 
              type="primary" 
              danger 
              disabled={selectedIds.length === 0}
              onClick={onDelete}
              size="middle"
              style={{
                borderRadius: '6px',
                fontWeight: 500,
                boxShadow: selectedIds.length > 0 ? '0 2px 8px rgba(255,77,79,0.3)' : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              批量删除
            </Button>
          </div>
        </Card>

        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          {comments.map((comment) => {
            const id = comment.id;
            const isSelected = selectedIds.includes(id);
            const isExpanded = expandedKeys.has(id);
            return (
              <Card
                key={id}
                style={{
                  marginBottom: 0,
                  borderRadius: '12px',
                  boxShadow: isSelected 
                    ? '0 3px 16px rgba(24,144,255,0.12)' 
                    : '0 2px 8px rgba(0,0,0,0.06)',
                  border: isSelected ? '1px solid #1890ff' : '1px solid #e8e8e8',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  overflow: 'hidden',
                  background: '#ffffff'
                }}
                bodyStyle={{ padding: 0 }}
                hoverable
              >
                <div style={{ padding: '16px' }}>
                  <Row gutter={16} align="middle">
                    <Col span={1}>
                      <Checkbox
                        checked={isSelected}
                        onChange={(e) => onSelectChange(id, e.target.checked)}
                        style={{ margin: 0 }}
                      />
                    </Col>
                    <Col span={11}>
                      <Row gutter={12} align="middle">
                        <Col>
                          <div
                            style={{
                              width: '60px',
                              height: '60px',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                              border: '1px solid #f0f0f0',
                              background: '#fafafa',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            <Image
                              src={comment.product.mainImage || 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'}
                              width={58}
                              height={58}
                              preview={true}
                              style={{ 
                                borderRadius: '7px',
                                objectFit: 'cover'
                              }}
                            />
                          </div>
                        </Col>
                        <Col flex="auto">
                          <div>
                            <Title 
                              level={5} 
                              style={{ 
                                margin: 0, 
                                marginBottom: '4px',
                                lineHeight: 1.3,
                                fontWeight: 600,
                                color: '#1a1a1a',
                                fontSize: '14px'
                              }}
                            >
                              {comment.product.name}
                            </Title>
                            <div style={{ marginBottom: '4px' }}>
                              <Text 
                                style={{ 
                                  fontSize: '16px',
                                  fontWeight: 600,
                                  color: '#ff4d4f'
                                }}
                              >
                                ¥{comment.config.salePrice.toFixed(2)}
                              </Text>
                            </div>
                            <Text 
                              type="secondary" 
                              style={{ 
                                fontSize: '12px',
                                color: '#8c8c8c'
                              }}
                            >
                              {formatDate(comment.createdAt)}
                            </Text>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={12} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', gap: '8px' }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        background: 'linear-gradient(135deg, #fff5f5 0%, #fff 100%)',
                        borderRadius: '8px',
                        border: '1px solid #ffe0e0'
                      }}>
                        <Rate 
                          disabled 
                          defaultValue={comment.star} 
                          style={{ 
                            fontSize: '16px',
                            color: '#ffa940'
                          }}
                        />
                        <Text 
                          style={{ 
                            marginLeft: '6px',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#ff7a00'
                          }}
                        >
                          {comment.star}分
                        </Text>
                      </div>
                      <Button 
                        type="text"
                        onClick={() => onExpand(id)}
                        icon={isExpanded ? <UpOutlined /> : <DownOutlined />}
                        style={{
                          color: '#1890ff',
                          padding: '2px 6px',
                          height: 'auto',
                          borderRadius: '4px',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px'
                        }}
                      />
                    </Col>
                  </Row>
                </div>
                
                {isExpanded && (
                  <div 
                    style={{ 
                      padding: '16px',
                      background: 'linear-gradient(to bottom, #fafafa 0%, #ffffff 100%)',
                      borderTop: '1px solid #f0f0f0',
                      animation: 'slideDown 0.3s ease-out'
                    }}
                  >
                    <style>{`
                      @keyframes slideDown {
                        from {
                          opacity: 0;
                          transform: translateY(-10px);
                        }
                        to {
                          opacity: 1;
                          transform: translateY(0);
                        }
                      }
                    `}</style>
                    <Paragraph
                      style={{
                        marginBottom: comment.images.length > 0 ? '12px' : 0,
                        fontSize: '14px',
                        lineHeight: 1.6,
                        color: '#434343',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word'
                      }}
                    >
                      {comment.content}
                    </Paragraph>
                    {comment.images.length > 0 && (
                      <div style={{ marginTop: '12px' }}>
                        <Row gutter={[8, 8]} wrap>
                          {comment.images.map((imgInfo) => (
                            <Col key={imgInfo.id}>
                              <div
                                style={{
                                  width: '100px',
                                  height: '100px',
                                  borderRadius: '8px',
                                  overflow: 'hidden',
                                  boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                                  border: '1px solid #f0f0f0',
                                  cursor: 'pointer',
                                  transition: 'all 0.3s ease',
                                  background: '#fafafa'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform = 'scale(1.05)';
                                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = 'scale(1)';
                                  e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)';
                                }}
                              >
                                <Image
                                  src={imgInfo.image}
                                  width={100}
                                  height={100}
                                  preview={true}
                                  style={{ 
                                    borderRadius: '7px',
                                    objectFit: 'cover'
                                  }}
                                />
                              </div>
                            </Col>
                          ))}
                        </Row>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </Space>
      </div>
    </div>
  );
};

export default Comments;