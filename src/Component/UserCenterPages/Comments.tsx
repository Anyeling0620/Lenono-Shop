import React, { useState } from 'react';
import { Row, Col, Rate, Button, Collapse, Image, Typography } from 'antd';
import type { CollapseProps } from 'antd/es/collapse';

const { Text, Title } = Typography;
//const { Panel } = Collapse;

// 模拟数据：3个商品评论
const mockComments = [
  {
    id: 1,
    product: {
      image: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png', // 模拟商品图片
      name: '联想ThinkPad X1 Carbon',
      price: '¥9999.00',
    },
    rating: 4,
    text: '这款笔记本性能出色，电池续航很长，键盘手感一流，值得推荐！',
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
  },
];

const Comments: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string[]>([]);

  const onChange = (key: string | string[]) => {
    setActiveKey(Array.isArray(key) ? key : [key]);
  };

  const items: CollapseProps['items'] = mockComments.map((comment) => ({
    key: comment.id.toString(),
    showArrow: false, // 隐藏默认展开箭头
    label: (
      <div 
        style={{ padding: '16px' }}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
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
                </div>
              </Col>
            </Row>
          </Col>
          <Col span={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Rate disabled defaultValue={comment.rating} style={{ fontSize: 20 }} />
          </Col>
        </Row>
        <Row justify="center" style={{ marginTop: 12 }}>
          <Col>
            <Button 
              type="link" 
              onClick={(e) => {
                e.stopPropagation();
                const newKey = activeKey.includes(comment.id.toString()) 
                  ? activeKey.filter(k => k !== comment.id.toString()) 
                  : [...activeKey, comment.id.toString()];
                setActiveKey(newKey);
              }}
            >
              {activeKey.includes(comment.id.toString()) ? '收起评价' : '展开评价'}
            </Button>
          </Col>
        </Row>
      </div>
    ),
    children: (
      <div style={{ padding: '0 16px 16px' }}>
        <Text>{comment.text}</Text>
      </div>
    ),
    style: { marginBottom: 16 },
  }));

  return (
    <div style={{ padding: '24px' }}>
      <Title level={3}>我的评价</Title>
      <Collapse 
        activeKey={activeKey}
        items={items} 
        onChange={onChange} 
        bordered={false}
      />
    </div>
  );
};

export default Comments;