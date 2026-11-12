const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

const tokenFor = async (username = 'root', password = 'sekret') => {
  const response = await api
    .post('/api/login')
    .send({ username, password })
  return response.body.token
}

describe('when there are initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({
      username: 'root',
      name: 'Superuser',
      passwordHash,
    })
    await user.save()

    const blogs = helper.initialBlogs.map((blog) => ({
      ...blog,
      user: user._id,
    }))
    await Blog.insertMany(blogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('blogs have an id field, not _id', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach((blog) => {
      assert(blog.id)
      assert.strictEqual(blog._id, undefined)
    })
  })

  describe('addition of a new blog', () => {
    test('succeeds with valid data and a valid token', async () => {
      const token = await tokenFor()

      const newBlog = {
        title: 'Testing is fun',
        author: 'Test Author',
        url: 'http://example.com/testing',
        likes: 5,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map((blog) => blog.title)
      assert(titles.includes('Testing is fun'))
    })

    test('likes defaults to 0 when the property is missing', async () => {
      const token = await tokenFor()

      const newBlog = {
        title: 'Blog without likes',
        author: 'No Likes',
        url: 'http://example.com/nolikes',
      }

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)

      assert.strictEqual(response.body.likes, 0)
    })

    test('fails with 400 when title is missing', async () => {
      const token = await tokenFor()

      const newBlog = {
        author: 'No Title',
        url: 'http://example.com/notitle',
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('fails with 400 when url is missing', async () => {
      const token = await tokenFor()

      const newBlog = {
        title: 'No url',
        author: 'No Url',
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('fails with 401 when no token is provided', async () => {
      const newBlog = {
        title: 'No token blog',
        author: 'Anonymous',
        url: 'http://example.com/notoken',
      }

      await api.post('/api/blogs').send(newBlog).expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status 204 when the user is the creator', async () => {
      const token = await tokenFor()
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

      const ids = blogsAtEnd.map((blog) => blog.id)
      assert(!ids.includes(blogToDelete.id))
    })

    test('fails with 401 when no token is provided', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('updating a blog', () => {
    test('succeeds in updating the likes', async () => {
      const token = await tokenFor()
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ ...blogToUpdate, likes: blogToUpdate.likes + 10 })
        .expect(200)

      assert.strictEqual(response.body.likes, blogToUpdate.likes + 10)
    })

    test('fails with 401 when no token is provided', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send({ ...blogToUpdate, likes: 999 })
        .expect(401)
    })
  })

  describe('when the token belongs to a deleted user', () => {
    test('creating a blog fails with 401', async () => {
      const token = await tokenFor()
      const users = await helper.usersInDb()
      await User.findByIdAndDelete(users[0].id)

      const newBlog = {
        title: 'Ghost blog',
        author: 'Ghost',
        url: 'http://example.com/ghost',
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('deleting a blog fails with 401', async () => {
      const token = await tokenFor()
      const blogsAtStart = await helper.blogsInDb()
      const users = await helper.usersInDb()
      await User.findByIdAndDelete(users[0].id)

      await api
        .delete(`/api/blogs/${blogsAtStart[0].id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })
})

describe('when there is initially one user in the db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'jdoe',
      name: 'John Doe',
      password: 'password123',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map((user) => user.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper status code and message if username is already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Duplicate',
      password: 'password123',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails if username is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ab',
      name: 'Too Short',
      password: 'password123',
    }

    await api.post('/api/users').send(newUser).expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails if password is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'validname',
      name: 'Short Password',
      password: 'ab',
    }

    const result = await api.post('/api/users').send(newUser).expect(400)

    assert(result.body.error.includes('password'))
    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
