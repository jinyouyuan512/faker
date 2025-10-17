import React from 'react'
import { Layout, Row, Col, Divider } from 'antd'
import { HeartOutlined } from '@ant-design/icons'
import './Footer.css'

const { Footer: AntFooter } = Layout

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <AntFooter className="app-footer">
      <div className="footer-content">
        <Row gutter={[32, 16]}>
          <Col xs={24} sm={8}>
            <div className="footer-section">
              <h3>关于我们</h3>
              <p>致力于传承和推广中国古典诗词文化，提供专业的诗词赏析和学习平台。</p>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div className="footer-section">
              <h3>快速链接</h3>
              <ul className="footer-links">
                <li><a href="/">首页</a></li>
                <li><a href="/poetry">诗词浏览</a></li>
                <li><a href="/user">个人中心</a></li>
              </ul>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div className="footer-section">
              <h3>联系我们</h3>
              <p>邮箱: contact@poetry.com</p>
              <p>电话: 400-123-4567</p>
            </div>
          </Col>
        </Row>
        
        <Divider />
        
        <div className="footer-bottom">
          <p>
            Made with <HeartOutlined style={{ color: '#ff4d4f' }} /> 
            © {currentYear} 诗词赏析网. 保留所有权利.
          </p>
        </div>
      </div>
    </AntFooter>
  )
}

export default Footer