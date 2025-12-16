import React, { useState } from 'react';
import { Row, Col, Rate, Button, Card, Image, Typography, Checkbox } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

const { Text, Title } = Typography;

// 模拟数据：3个商品评论，添加图片和时间
const initialComments = [
  {
    id: 1,
    product: {
      image: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png', // 模拟商品图片
      name: '联想ThinkPad X1 Carbon',
      price: '¥9999.00',
    },
    rating: 4,
    text: '这款笔记本性能出色，电池续航很长，键盘手感一流，值得推荐！',
    images: ['https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'],
    date: '12-08 18:12',
  },
  {
    id: 2,
    product: {
      image: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png', // 模拟商品图片
      name: '联想小新Air 14',
      price: '¥5999.00',
    },
    rating: 5,
    text: '轻薄便携，屏幕显示效果优秀，性价比高，非常满意！',
    images: ['https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png', 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'],
    date: '12-08 00:45',
  },
  {
    id: 3,
    product: {
      image: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png', // 模拟商品图片
      name: '联想拯救者游戏本',
      price: '¥7999.00',
    },
    rating: 3,
    text: '游戏性能强劲，但风扇噪音较大，希望优化一下散热。',
    images: [],
    date: '12-06 20:20',
  },
];

interface Comment {
  id: number;
  product: {
    image: string;
    name: string;
    price: string;
  };
  rating: number;
  text: string;
  images: string[];
  date: string;
}

const Comments: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

  const onSelectAllChange = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      setSelectedIds(comments.map(c => c.id.toString()));
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

  const onDelete = () => {
    setComments(prev => prev.filter(c => !selectedIds.includes(c.id.toString())));
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
    <div style={{ padding: '24px' }}>
      <Title level={3}>我的评价</Title>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Checkbox
          indeterminate={indeterminate}
          checked={allChecked}
          onChange={onSelectAllChange}
        >
          全选
        </Checkbox>
        <Button 
          type="primary" 
          danger 
          disabled={selectedIds.length === 0}
          onClick={onDelete}
        >
          批量删除
        </Button>
      </div>
      <div>
        {comments.map((comment) => {
          const id = comment.id.toString();
          const isSelected = selectedIds.includes(id);
          const isExpanded = expandedKeys.has(id);
          return (
            <Card
              key={id}
              style={{ marginBottom: 16, borderRadius: 8 }}
              bordered
              bodyStyle={{ padding: 0 }}
            >
              <div style={{ padding: 16 }}>
                <Row gutter={16} align="middle" style={{ marginBottom: 12 }}>
                  <Col span={2}>
                    <Checkbox
                      checked={isSelected}
                      onChange={(e) => onSelectChange(id, e.target.checked)}
                      style={{ margin: 0 }}
                    />
                  </Col>
                  <Col span={10}>
                    <Row gutter={8} align="middle">
                      <Col>
                        <Image
                          src={comment.product.image}
                          width={50}
                          height={50}
                          preview={false}
                          style={{ borderRadius: 4 }}
                        />
                      </Col>
                      <Col flex="auto">
                        <div>
                          <Title level={5} style={{ margin: 0, lineHeight: 1.2 }}>{comment.product.name}</Title>
                          <Text type="secondary" style={{ display: 'block', marginTop: 4 }}>{comment.product.price}</Text>
                          <Text type="secondary" style={{ display: 'block', marginTop: 2, fontSize: 12 }}>{comment.date}</Text>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Rate disabled defaultValue={comment.rating} style={{ fontSize: 20 }} />
                  </Col>
                </Row>
                <Row justify="center">
                  <Col>
                    <Button 
                      type="link" 
                      onClick={() => onExpand(id)}
                    >
                      {isExpanded ? '收起评价' : '展开评价'}
                    </Button>
                  </Col>
                </Row>
              </div>
              {isExpanded && (
                <div style={{ padding: '0 16px 16px', borderTop: '1px solid #f0f0f0' }}>
                  <Text style={{ display: 'block', marginBottom: 12 }}>{comment.text}</Text>
                  {comment.images.length > 0 && (
                    <Row gutter={8} wrap>
                      {comment.images.map((imgSrc, index) => (
                        <Col key={index}>
                          <Image
                            src={imgSrc}
                            width={100}
                            height={100}
                            preview={false}
                            style={{ borderRadius: 4 }}
                          />
                        </Col>
                      ))}
                    </Row>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Comments;