import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Input, Select, Button, Pagination, Spin, Empty } from 'antd'
import { SearchOutlined, FilterOutlined } from '@ant-design/icons'
import { useSearchParams, useParams } from 'react-router-dom'
import './PoetryList.css'

const { Option } = Select
const { Search } = Input

const PoetryList = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { dynasty: routeDynasty } = useParams()
  const [poetryList, setPoetryList] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    dynasty: routeDynasty || searchParams.get('dynasty') || '',
    author: searchParams.get('author') || '',
    page: parseInt(searchParams.get('page')) || 1
  })

  const dynasties = ['全部', '唐代', '宋代', '元代', '明代', '清代']
  const authors = ['全部', '李白', '杜甫', '苏轼', '李清照', '白居易']

  useEffect(() => {
    const newParams = new URLSearchParams()
    if (filters.search) newParams.set('search', filters.search)
    if (filters.dynasty && filters.dynasty !== '全部') newParams.set('dynasty', filters.dynasty)
    if (filters.author && filters.author !== '全部') newParams.set('author', filters.author)
    if (filters.page !== 1) newParams.set('page', filters.page)
    setSearchParams(newParams)
    fetchPoetryData()
  }, [filters, routeDynasty])

  const fetchPoetryData = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.search) params.append('q', filters.search) // json-server uses 'q' for full-text search
      if (filters.dynasty && filters.dynasty !== '全部') params.append('dynasty', filters.dynasty)
      if (filters.author && filters.author !== '全部') params.append('author', filters.author)
      params.append('_page', filters.page)
      params.append('_limit', 12) // Assuming 12 items per page

      const response = await fetch(`http://localhost:3001/poetry?${params.toString()}`)
      const data = await response.json()
      setPoetryList(data)
    } catch (error) {
      console.error("Error fetching poetry data:", error)
      setPoetryList([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value) => {
    setFilters(prev => ({ ...prev, search: value, page: 1 }))
  }

  const handleFilterChange = (key, value) => {
    if (routeDynasty && key === 'dynasty') return // Prevent changing dynasty if it's from route params
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }))
  }

  // Removed updateSearchParams as it's now handled in useEffect


  return (
    <div className="poetry-list-page">
      <div className="page-header">
        <h1>诗词浏览</h1>
        <p>探索中国古典诗词的博大精深</p>
      </div>

      {/* 搜索和筛选 */}
      <div className="filter-section">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="搜索诗词标题、内容..."
              enterButton={<SearchOutlined />}
              size="large"
              defaultValue={filters.search}
              onSearch={handleSearch}
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              placeholder="选择朝代"
              size="large"
              value={filters.dynasty || undefined}
              onChange={(value) => handleFilterChange('dynasty', value)}
              style={{ width: '100%' }}
              disabled={!!routeDynasty} // Disable if dynasty is from route params
            >
              {dynasties.map(dynasty => (
                <Option key={dynasty} value={dynasty === '全部' ? '' : dynasty}>
                  {dynasty}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              placeholder="选择作者"
              size="large"
              value={filters.author || undefined}
              onChange={(value) => handleFilterChange('author', value)}
              style={{ width: '100%' }}
            >
              {authors.map(author => (
                <Option key={author} value={author === '全部' ? '' : author}>
                  {author}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Button 
              type="default" 
              size="large" 
              icon={<FilterOutlined />}
              onClick={() => {
                setFilters({ search: '', dynasty: '', author: '', page: 1 })
                setSearchParams({})
              }}
            >
              重置筛选
            </Button>
          </Col>
        </Row>
      </div>

      {/* 诗词列表 */}
      <div className="poetry-list">
        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
            <p>正在加载诗词数据...</p>
          </div>
        ) : poetryList.length > 0 ? (
          <>
            <Row gutter={[24, 24]}>
              {poetryList.map(poetry => (
                <Col xs={24} sm={12} lg={8} key={poetry.id}>
                  <Card 
                    hoverable
                    className="poetry-card"
                    onClick={() => window.location.href = `/poetry/${poetry.id}`}
                  >
                    <div className="poetry-header">
                      <h3 className="poetry-title">{poetry.title}</h3>
                      <span className="poetry-meta">{poetry.author} · {poetry.dynasty}</span>
                    </div>
                    <div className="poetry-content">
                      {poetry.content}
                    </div>
                    <div className="poetry-footer">
                      <span className="likes-count">❤️ {poetry.likes}</span>
                      <Button type="link" size="small">查看详情</Button>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
            
            {/* 分页 */}
            <div className="pagination-section">
              <Pagination
                current={filters.page}
                total={100}
                pageSize={12}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          </>
        ) : (
          <Empty description="暂无相关诗词" />
        )}
      </div>
    </div>
  )
}

export default PoetryList