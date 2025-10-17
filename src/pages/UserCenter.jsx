import React, { useState, useEffect } from 'react'
import { Card, Avatar, List, Button, message, Modal, Spin, Tabs, Tag, Empty } from 'antd'
import { UserOutlined, DeleteOutlined, ExclamationCircleOutlined, HeartOutlined, MessageOutlined, BookOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../AuthContext'
import './UserCenter.css'

const { confirm } = Modal
const { TabPane } = Tabs

const UserCenter = () => {
  const { currentUser, loading: authLoading } = useAuth()
  const [userProfile, setUserProfile] = useState(null)
  const [collectedPoems, setCollectedPoems] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserProfileAndFavorites = async () => {
      if (currentUser) {
        setLoading(true)
        try {
          // Fetch user profile from 'users' table
          const { data: profileData, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', currentUser.id)
            .single()

          if (profileError) {
            throw profileError
          }
          setUserProfile(profileData)

          // Fetch collected poems based on favorites array
          if (profileData && profileData.favorites && profileData.favorites.length > 0) {
            const { data: poemsData, error: poemsError } = await supabase
              .from('poetry')
              .select('*')
              .in('id', profileData.favorites)

            if (poemsError) {
              throw poemsError
            }
            setCollectedPoems(poemsData)
          } else {
            setCollectedPoems([])
          }
        } catch (error) {
          message.error('获取用户数据失败：' + error.message)
          console.error('Error fetching user data:', error)
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    fetchUserProfileAndFavorites()
  }, [currentUser])

  const handleRemoveFavorite = (poemId) => {
    confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: '确定要从收藏中移除这首诗吗？',
      async onOk() {
        try {
          if (!userProfile) {
            message.error('用户数据未加载。')
            return
          }

          const updatedFavorites = userProfile.favorites.filter(id => id !== poemId)

          const { error } = await supabase
            .from('users')
            .update({ favorites: updatedFavorites })
            .eq('id', currentUser.id)

          if (error) {
            throw error
          }

          setUserProfile({ ...userProfile, favorites: updatedFavorites })
          setCollectedPoems(collectedPoems.filter(poem => poem.id !== poemId))
          message.success('已从收藏中移除。')
        } catch (error) {
          message.error('移除收藏失败：' + error.message)
          console.error('Error removing favorite:', error)
        }
      },
    })
  }

  if (authLoading || loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <p>正在加载个人中心...</p>
      </div>
    )
  }

  if (!currentUser) {
    return <div className="user-center-container">请先登录以查看个人中心。</div>
  }

  const userInfo = {
    username: userProfile?.username || '加载中...',
    avatar: userProfile?.avatar || 'https://api.dicebear.com/7.x/miniavs/svg?seed=1',
    joinDate: '2024-01-01',
    level: '普通用户',
    points: 0
  }

  const myComments = [
    { id: 1, poetry: '静夜思', content: '这首诗表达了深刻的思乡情感', date: '2024-01-15' },
    { id: 2, poetry: '春晓', content: '描写春天的美好景象', date: '2024-01-14' }
  ]

  return (
    <div className="user-center-page">
      <Card className="user-profile-card">
        <div className="profile-header">
          <Avatar size={80} src={userInfo.avatar} icon={<UserOutlined />} />
          <div className="profile-info">
            <h2>{userInfo.username}</h2>
            <div className="profile-meta">
              <Tag color="blue">{userInfo.level}</Tag>
              <span>积分: {userInfo.points}</span>
              <span>加入时间: {userInfo.joinDate}</span>
            </div>
          </div>
          <Button type="primary">编辑资料</Button>
        </div>
      </Card>

      <Card className="user-content-card">
        <Tabs defaultActiveKey="1">
          <TabPane 
            tab={
              <span>
                <HeartOutlined />
                我的收藏
              </span>
            } 
            key="1"
          >
            {collectedPoems.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={collectedPoems}
                renderItem={item => (
                  <List.Item
                    actions={[
                      <Button type="link" onClick={() => navigate(`/poetrydetail/${item.id}`)}>查看</Button>,
                      <Button type="link" danger onClick={() => handleRemoveFavorite(item.id)}>取消收藏</Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<BookOutlined style={{ fontSize: '24px', color: '#d4af37' }} />}
                      title={<a onClick={() => navigate(`/poetrydetail/${item.id}`)}>{item.title}</a>}
                      description={`${item.author} · ${item.dynasty}`}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="暂无收藏" />
            )}
          </TabPane>

          <TabPane 
            tab={
              <span>
                <MessageOutlined />
                我的评论
              </span>
            } 
            key="2"
          >
            {myComments.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={myComments}
                renderItem={item => (
                  <List.Item
                    actions={[<Button type="link">查看原文</Button>]}
                  >
                    <List.Item.Meta
                      title={<a href={`/poetry/1`}>{item.poetry}</a>}
                      description={
                        <div>
                          <p>{item.content}</p>
                          <small>评论时间: {item.date}</small>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="暂无评论" />
            )}
          </TabPane>

          <TabPane 
            tab={
              <span>
                <BookOutlined />
                学习记录
              </span>
            } 
            key="3"
          >
            <div className="learning-stats">
              <div className="stat-item">
                <div className="stat-number">25</div>
                <div className="stat-label">已学习诗词</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">15</div>
                <div className="stat-label">已背诵诗词</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">85%</div>
                <div className="stat-label">测验正确率</div>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  )
}

export default UserCenter