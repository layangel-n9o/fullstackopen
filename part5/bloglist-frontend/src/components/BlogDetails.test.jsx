import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, test, expect, vi } from 'vitest'
import BlogDetails from './BlogDetails'

const blog = {
  id: '123',
  title: 'Testing React apps',
  author: 'Test Author',
  url: 'http://example.com',
  likes: 7,
  user: { username: 'author', name: 'Blog Author' },
}

const renderDetails = (user, onLike = vi.fn(), onRemove = vi.fn()) => {
  render(
    <MemoryRouter initialEntries={[`/blogs/${blog.id}`]}>
      <Routes>
        <Route
          path="/blogs/:id"
          element={
            <BlogDetails
              blogs={[blog]}
              user={user}
              onLike={onLike}
              onRemove={onRemove}
            />
          }
        />
      </Routes>
    </MemoryRouter>
  )
}

describe('<BlogDetails />', () => {
  test('shows url, likes and author name to a visitor', () => {
    renderDetails(null)

    expect(screen.getByText('Testing React apps')).toBeDefined()
    expect(screen.getByText('http://example.com')).toBeDefined()
    expect(screen.getByText('7 likes')).toBeDefined()
    expect(screen.getByText('added by Blog Author')).toBeDefined()
  })

  test('does not show like or remove buttons to a visitor', () => {
    renderDetails(null)

    expect(screen.queryByRole('button', { name: 'like' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
  })

  test('shows the like button to a logged in user', () => {
    renderDetails({ username: 'someone', name: 'Someone Else' })

    expect(
      screen.getByRole('button', { name: 'like' })
    ).toBeDefined()
    expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
  })

  test('shows like and remove buttons to the author', () => {
    renderDetails({ username: 'author', name: 'Blog Author' })

    expect(screen.getByRole('button', { name: 'like' })).toBeDefined()
    expect(screen.getByRole('button', { name: 'remove' })).toBeDefined()
  })

  test('calls the like handler once per click', async () => {
    const onLike = vi.fn()
    const user = userEvent.setup()

    renderDetails({ username: 'someone', name: 'Someone Else' }, onLike)

    const likeButton = screen.getByRole('button', { name: 'like' })
    await user.click(likeButton)
    await user.click(likeButton)

    expect(onLike.mock.calls).toHaveLength(2)
  })
})
