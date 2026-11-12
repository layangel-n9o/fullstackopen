import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    id: '123',
    title: 'Testing React apps',
    author: 'Test Author',
    url: 'http://example.com',
    likes: 7,
    user: { username: 'tester', name: 'Test User' },
  }

  test('renders title and author as a link to the details page', () => {
    render(
      <MemoryRouter>
        <Blog blog={blog} />
      </MemoryRouter>
    )

    const link = screen.getByRole('link', {
      name: 'Testing React apps Test Author',
    })
    expect(link).toHaveAttribute('href', '/blogs/123')
  })

  test('does not render url or likes in the list view', () => {
    const { container } = render(
      <MemoryRouter>
        <Blog blog={blog} />
      </MemoryRouter>
    )

    expect(container).not.toHaveTextContent('http://example.com')
    expect(container).not.toHaveTextContent('likes')
  })
})
