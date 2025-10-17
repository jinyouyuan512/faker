import React from 'react'
import { Card, Form, Input, Button, Checkbox, Divider, message } from 'antd'
import { UserOutlined, LockOutlined, WechatOutlined, QqOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import './Auth.css'

const Login = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { login } = useAuth()

  const onFinish = async (values) => {
    try {
      await login(values.username, values.password)
      message.success('登录成功！')
      navigate('/') // 登录成功后跳转到首页
    } catch (error) {
      message.error(error.message || '登录失败，请稍后再试。')
      console.error('Login error:', error)
    }
  }

  return (
    <div className="auth-page">
      <Card className="auth-card" title="用户登录">
        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名或邮箱!' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="用户名或邮箱" 
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住我</Checkbox>
            </Form.Item>
            <Link to="/forgot-password" className="forgot-link">
              忘记密码？
            </Link>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              登录
            </Button>
          </Form.Item>
        </Form>

        <Divider>或</Divider>

        <div className="social-login">
          <Button 
            icon={<WechatOutlined />} 
            size="large"
            className="social-btn wechat-btn"
          >
            微信登录
          </Button>
          <Button 
            icon={<QqOutlined />} 
            size="large"
            className="social-btn qq-btn"
          >
            QQ登录
          </Button>
        </div>

        <div className="auth-footer">
          还没有账号？ <Link to="/register">立即注册</Link>
        </div>
      </Card>
    </div>
  )
}

export default Login