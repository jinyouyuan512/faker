import React from 'react'
import { Layout, Menu, Input, Button, Avatar, Dropdown } from 'antd'
import { SearchOutlined, UserOutlined, LoginOutlined, LogoutOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../AuthContext'
import './Header.css'

const { Header: AntHeader } = Layout
const { Search } = Input

const Header = () => {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const menuItems = [
    { key: '1', label: <Link to="/">首页</Link> },
    { key: '2', label: <Link to="/poetrylist">诗词浏览</Link> },
    { key: '3', label: <Link to="/tang-poetry">唐诗</Link> },
    { key: '4', label: <Link to="/song-poetry">宋词</Link> },
    { key: '5', label: <Link to="/yuan-qu">元曲</Link> }
  ]

  const userMenuItems = [
    { key: '1', icon: <UserOutlined />, label: '个人中心' },
    { key: '2', icon: <LogoutOutlined />, label: '退出登录' }
  ]

  const onSearch = (value) => {
    if (value.trim()) {
      navigate(`/poetry?search=${encodeURIComponent(value)}`)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const userMenu = (
    <Menu items={userMenuItems} onClick={({ key }) => {
      if (key === '1') navigate('/user')
      if (key === '2') handleLogout()
    }} />
  )

  return (
    <AntHeader className="app-header">
      <div className="header-content">
        <div className="logo">
          <Link to="/" className="logo-link">
            <span className="logo-text">诗词赏析网</span>
          </Link>
        </div>
        
        <Menu 
          theme="dark" 
          mode="horizontal" 
          items={menuItems}
          className="nav-menu"
        />
        
        <div className="header-actions">
          <Search
            placeholder="搜索诗词、作者..."
            onSearch={onSearch}
            className="search-input"
            enterButton={<SearchOutlined />}
          />
          
          {currentUser ? (
            <Dropdown overlay={userMenu} placement="bottomRight">
              <Avatar 
                size="large" 
                src={currentUser.avatar} // Use currentUser.avatar
                icon={<UserOutlined />}
                className="user-avatar"
              />
            </Dropdown>
          ) : (
            <div className="auth-buttons">
              <Button type="link" onClick={() => navigate('/login')}>
                <LoginOutlined /> 登录
              </Button>
              <Button type="primary" onClick={() => navigate('/register')}>
                注册
              </Button>
            </div>
          )}
        </div>
      </div>
    </AntHeader>
  )
}

export default Header