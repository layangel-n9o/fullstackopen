import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Navigation from './components/Navigation'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Blog from './components/Blog'
import BlogDetails from './components/BlogDetails'

const Page = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  font-family: 'Segoe UI', Arial, sans-serif;
`

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notify = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      notify(`Welcome back, ${user.name}`)
      navigate('/')
    } catch (error) {
      notify('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
    navigate('/')
  }

  const createBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      returnedBlog.user = {
        id: user.id,
        username: user.username,
        name: user.name,
      }
      setBlogs(blogs.concat(returnedBlog))
      notify(
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`
      )
      navigate('/')
    } catch (error) {
      const message =
        error.response?.data?.error || 'creating the blog failed'
      notify(message, 'error')
    }
  }

  const likeBlog = async (blog) => {
    const updatedBlog = await blogService.update(blog.id, {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user?.id || blog.user,
    })
    updatedBlog.user = blog.user
    setBlogs(blogs.map((b) => (b.id === blog.id ? updatedBlog : b)))
  }

  const removeBlog = async (blog) => {
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      return
    }

    try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter((b) => b.id !== blog.id))
      notify(`Removed ${blog.title}`)
      navigate('/')
    } catch (error) {
      notify('removing the blog failed', 'error')
    }
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <Page>
      <Navigation user={user} onLogout={handleLogout} />
      <Notification notification={notification} />

      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h2>blogs</h2>
              {sortedBlogs.map((blog) => (
                <Blog key={blog.id} blog={blog} />
              ))}
            </div>
          }
        />
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/" />
            ) : (
              <div>
                <h2>log in to application</h2>
                <LoginForm onSubmit={handleLogin} />
              </div>
            )
          }
        />
        <Route
          path="/new"
          element={
            user ? (
              <div>
                <h2>create new</h2>
                <BlogForm onCreate={createBlog} />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/blogs/:id"
          element={
            <BlogDetails
              blogs={sortedBlogs}
              user={user}
              onLike={likeBlog}
              onRemove={removeBlog}
            />
          }
        />
      </Routes>
    </Page>
  )
}

export default App
