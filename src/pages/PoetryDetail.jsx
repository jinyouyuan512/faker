import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Row, Col, Card, Button, Divider, List, Input, Avatar, Spin, message } from 'antd'
import { Comment } from '@ant-design/compatible'
import { HeartOutlined, ShareAltOutlined, BookOutlined, PlayCircleOutlined } from '@ant-design/icons'
import { useAuth } from '../AuthContext'
import './PoetryDetail.css'

const { TextArea } = Input

const PoetryDetail = () => {
  const { id } = useParams()
  const { currentUser } = useAuth()
  const [poetry, setPoetry] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [isFavorite, setIsFavorite] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetchPoetryDetail()
    fetchComments()
    fetchUserAndCheckFavorite()
  }, [id])

  const fetchPoetryDetail = async () => {
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:3001/poetry/${id}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setPoetry(data)
    } catch (error) {
      console.error("Error fetching poetry detail:", error)
      setPoetry(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    // 模拟评论数据
    setComments([
      {
        id: 1,
        author: '诗词爱好者',
        avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=1',
        content: '这首诗表达了游子思乡之情，语言朴素却意味深长。',
        datetime: '2024-01-15 10:30'
      },
      {
        id: 2,
        author: '文学研究者',
        avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=2',
        content: '李白通过简单的场景描写，展现了深刻的思乡情感。',
        datetime: '2024-01-14 15:20'
      }
    ])
  }

  const fetchUserAndCheckFavorite = async () => {
    // 暂时硬编码用户ID为1
    const userId = 1 
    try {
      const userResponse = await fetch(`http://localhost:3001/users/${userId}`)
      if (!userResponse.ok) {
        throw new Error(`HTTP error! status: ${userResponse.status}`)
      }
      const userData = await userResponse.json()
      setUser(userData)
      if (userData.favorites && userData.favorites.includes(parseInt(id))) {
        setIsFavorite(true)
      } else {
        setIsFavorite(false)
      }
    } catch (error) {
      console.error("Error fetching user data or checking favorite status:", error)
    }
  }

  const handleLike = () => {
    setPoetry(prev => prev ? { ...prev, likes: prev.likes + 1 } : null)
  }

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        author: currentUser ? currentUser.username : '当前用户',
        avatar: currentUser ? currentUser.avatar : 'https://api.dicebear.com/7.x/miniavs/svg?seed=3',
        content: newComment,
        datetime: new Date().toLocaleString()
      }
      setComments(prev => [comment, ...prev])
      setNewComment('')
      message.success('评论成功')
    } else {
      message.warning('评论内容不能为空')
    }
  }

  const handleToggleFavorite = async () => {
    if (!user) {
      message.warning('请先登录才能收藏')
      return
    }

    try {
      let updatedFavorites
      if (isFavorite) {
        updatedFavorites = user.favorites.filter(favId => favId !== parseInt(id))
      } else {
        updatedFavorites = [...user.favorites, parseInt(id)]
      }

      const response = await fetch(`http://localhost:3001/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ favorites: updatedFavorites })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setIsFavorite(!isFavorite)
      setUser(prev => ({ ...prev, favorites: updatedFavorites }))
      message.success(isFavorite ? '已取消收藏' : '收藏成功')
    } catch (error) {
      message.error('操作失败，请稍后再试')
      console.error("Error toggling favorite status:", error)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <p>正在加载诗词详情...</p>
      </div>
    )
  }

  if (!poetry) {
    return <div>诗词不存在</div>
  }

  return (
    <div className="poetry-detail-page">
      <Row gutter={[32, 32]}>
        {/* 左侧诗词内容 */}
        <Col xs={24} lg={14}>
          <Card className="poetry-card">
            <div className="poetry-header">
              <h1 className="poetry-title">{poetry.title}</h1>
              <div className="poetry-meta">
                <span className="author">{poetry.author}</span>
                <span className="dynasty">· {poetry.dynasty}</span>
              </div>
            </div>

            <Divider />

            <div className="poetry-content">
              <pre className="poetry-text">{poetry.content}</pre>
              
              <div className="poetry-actions">
                <Button type="primary" icon={<PlayCircleOutlined />} size="large">
                  朗读诗词
                </Button>
                <Button 
                  type={poetry.liked ? 'primary' : 'default'} 
                  icon={<HeartOutlined />} 
                  size="large"
                  onClick={handleLike}
                >
                  喜欢 ({poetry.likes})
                </Button>
                <Button type="default" icon={<ShareAltOutlined />} size="large">
                  分享
                </Button>
                <Button 
                  type={isFavorite ? 'primary' : 'default'} 
                  icon={<BookOutlined />} 
                  size="large"
                  onClick={handleToggleFavorite}
                >
                  {isFavorite ? '已收藏' : '收藏'}
                </Button>
              </div>
            </div>

            {/* 创作背景 */}
            <div className="background-section">
              <h3>创作背景</h3>
              <p>{poetry.background}</p>
            </div>

            {/* 诗词赏析 */}
            <div className="analysis-section">
              <h3>诗词赏析</h3>
              <p>{poetry.analysis}</p>
            </div>
          </Card>
        </Col>

        {/* 右侧相关信息 */}
        <Col xs={24} lg={10}>
          {/* 评论区域 */}
          <Card title="评论互动" className="comments-card">
            <div className="comment-input">
              <TextArea
                rows={4}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="写下您的评论..."
              />
              <Button 
                type="primary" 
                onClick={handleCommentSubmit}
                style={{ marginTop: 16 }}
                disabled={!newComment.trim()}
              >
                发表评论
              </Button>
            </div>

            <Divider />

            <List
              className="comment-list"
              itemLayout="horizontal"
              dataSource={comments}
              renderItem={item => (
                <li>
                  <Comment
                    author={item.author}
                    avatar={<Avatar src={item.avatar} alt={item.author} />}
                    content={item.content}
                    datetime={item.datetime}
                  />
                </li>
              )}
            />
          </Card>

          {/* 相关推荐 */}
          <Card title="相关推荐" className="recommend-card">
            <List
              dataSource={[
                { title: '月下独酌', author: '李白' },
                { title: '望庐山瀑布', author: '李白' },
                { title: '早发白帝城', author: '李白' }
              ]}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={<a href="#">{item.title}</a>}
                    description={item.author}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default PoetryDetail