import { useParams, Link } from 'react-router-dom'
import styled from 'styled-components'

const Card = styled.div`
  border: 1px solid #cfd8dc;
  border-radius: 8px;
  padding: 20px 24px;
  max-width: 560px;
  background: #fafafa;
`

const Title = styled.h2`
  margin-top: 0;
  color: #263238;
`

const Likes = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 12px 0;
`

const LikeButton = styled.button`
  background: #2e7d32;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
`

const RemoveButton = styled.button`
  background: #c62828;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  margin-top: 12px;
`

const AddedBy = styled.p`
  color: #607d8b;
  font-style: italic;
`

const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: 16px;
  color: #37474f;
`

const BlogDetails = ({ blogs, user, onLike, onRemove }) => {
  const { id } = useParams()
  const blog = blogs.find((b) => b.id === id)

  if (!blog) {
    return null
  }

  const isAuthor =
    user && blog.user && blog.user.username === user.username

  return (
    <div>
      <BackLink to="/">&larr; back to blogs</BackLink>
      <Card>
        <Title>{blog.title}</Title>
        <a href={blog.url}>{blog.url}</a>
        <Likes>
          {blog.likes} likes
          {user && (
            <LikeButton onClick={() => onLike(blog)}>like</LikeButton>
          )}
        </Likes>
        <AddedBy>added by {blog.user ? blog.user.name : 'unknown'}</AddedBy>
        {isAuthor && (
          <RemoveButton onClick={() => onRemove(blog)}>remove</RemoveButton>
        )}
      </Card>
    </div>
  )
}

export default BlogDetails
