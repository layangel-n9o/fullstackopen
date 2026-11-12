import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { test, expect, vi } from 'vitest'
import BlogForm from './BlogForm'

test('<BlogForm /> calls onCreate with the right details', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm onCreate={createBlog} />)

  await user.type(screen.getByLabelText('title'), 'A great title')
  await user.type(screen.getByLabelText('author'), 'Some Author')
  await user.type(screen.getByLabelText('url'), 'http://example.com/post')
  await user.click(screen.getByRole('button', { name: 'create' }))

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog).toHaveBeenCalledWith({
    title: 'A great title',
    author: 'Some Author',
    url: 'http://example.com/post',
  })
})
