import React from 'react'
import { Card, Row, Col, Typography, Button, Space } from 'antd'
import { BookOutlined, HeartOutlined, StarOutlined } from '@ant-design/icons'
import ChatAssistant from '../components/ChatAssistant/ChatAssistant'

const { Title, Paragraph } = Typography

const Home = () => {
  const featuredPoems = [
    {
      title: '静夜思',
      author: '李白',
      dynasty: '唐代',
      excerpt: '床前明月光，疑是地上霜。举头望明月，低头思故乡。'
    },
    {
      title: '春晓',
      author: '孟浩然',
      dynasty: '唐代',
      excerpt: '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。'
    },
    {
      title: '水调歌头',
      author: '苏轼',
      dynasty: '宋代',
      excerpt: '明月几时有？把酒问青天。不知天上宫阙，今夕是何年。'
    }
  ]

  return (
    <div style={{ padding: '24px 0' }}>
      {/* 欢迎区域 */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <Title level={1} style={{ color: '#1890ff', marginBottom: 16 }}>
          诗词赏析网
        </Title>
        <Paragraph style={{ fontSize: '1.2em', color: '#666', maxWidth: 600, margin: '0 auto' }}>
          探索千年诗词文化，品味古典文学魅力。在这里，您可以欣赏经典诗词，学习诗词赏析，感受中华文化的博大精深。
        </Paragraph>
      </div>

      {/* 特色功能 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 48 }}>
        <Col xs={24} sm={8}>
          <Card 
            hoverable 
            style={{ textAlign: 'center', height: '100%' }}
            cover={<BookOutlined style={{ fontSize: 48, color: '#1890ff', marginTop: 24 }} />}
          >
            <Card.Meta
              title="诗词浏览"
              description="浏览数千首经典诗词，涵盖唐诗、宋词、元曲等各个时期"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card 
            hoverable 
            style={{ textAlign: 'center', height: '100%' }}
            cover={<HeartOutlined style={{ fontSize: 48, color: '#ff4d4f', marginTop: 24 }} />}
          >
            <Card.Meta
              title="诗词赏析"
              description="专业的诗词解析和赏析，帮助您深入理解诗词内涵"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card 
            hoverable 
            style={{ textAlign: 'center', height: '100%' }}
            cover={<StarOutlined style={{ fontSize: 48, color: '#faad14', marginTop: 24 }} />}
          >
            <Card.Meta
              title="个人收藏"
              description="收藏您喜欢的诗词，创建个人诗词库"
            />
          </Card>
        </Col>
      </Row>

      {/* 推荐诗词 */}
      <div style={{ marginBottom: 48 }}>
        <Title level={2} style={{ marginBottom: 24 }}>推荐诗词</Title>
        <Row gutter={[24, 24]}>
          {featuredPoems.map((poem, index) => (
            <Col xs={24} sm={8} key={index}>
              <Card 
                hoverable 
                title={poem.title}
                extra={<span style={{ color: '#999' }}>{poem.dynasty}</span>}
              >
                <Paragraph style={{ color: '#666', fontStyle: 'italic' }}>
                  "{poem.excerpt}"
                </Paragraph>
                <div style={{ textAlign: 'right', color: '#1890ff' }}>
                  —— {poem.author}
                </div>
                <div style={{ marginTop: 16 }}>
                  <Space>
                    <Button type="primary" size="small">查看详情</Button>
                    <Button size="small">收藏</Button>
                  </Space>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* 快速开始 */}
      <Card style={{ background: 'linear-gradient(135deg, #f6ffed 0%, #e6f7ff 100%)' }}>
        <div style={{ textAlign: 'center' }}>
          <Title level={3}>开始您的诗词之旅</Title>
          <Paragraph style={{ fontSize: '1.1em', marginBottom: 24 }}>
            立即注册账号，解锁更多功能，体验完整的诗词赏析服务
          </Paragraph>
          <Space>
            <Button type="primary" size="large">立即注册</Button>
            <Button size="large">浏览诗词</Button>
          </Space>
        </div>
      </Card>

      <ChatAssistant />
    </div>
  )
}

export default Home