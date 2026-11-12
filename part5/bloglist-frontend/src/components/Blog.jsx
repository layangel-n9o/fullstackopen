import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Row = styled.div`
  padding: 10px 14px;
  border: 1px solid #cfd8dc;
  border-radius: 6px;
  margin-bottom: 8px;

  a {
    color: #37474f;
    text-decoration: none;
    font-weight: 500;
  }

  &:hover {
    background: #f5f5f5;
  }
`

const Blog = ({ blog }) => {
  return (
    <Row className="blog">
      <Link to={`/blogs/${blog.id}`}>
        {blog.title} {blog.author}
      </Link>
    </Row>
  )
}

export default Blog
