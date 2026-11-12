const { test, expect, describe, beforeEach } = require('@playwright/test')
const { loginWith, createBlog, openBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Test User',
        username: 'tester',
        password: 'secret',
      },
    })

    await page.goto('/')
  })

  test('front page shows the blog list and a login link', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'blogs' })
    ).toBeVisible()
    await expect(page.getByRole('link', { name: 'login' })).toBeVisible()
  })

  test('login form is shown on the login page', async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()

    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'tester', 'secret')
      await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'tester', 'wrong')

      await expect(
        page.getByText('wrong username or password')
      ).toBeVisible()
      await expect(
        page.getByText('Test User logged in')
      ).not.toBeVisible()
    })
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'tester', 'secret')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, {
        title: 'A blog created by playwright',
        author: 'Playwright',
        url: 'http://example.com/e2e',
      })

      await expect(
        page.getByRole('link', {
          name: 'A blog created by playwright Playwright',
        })
      ).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, {
        title: 'Blog to like',
        author: 'Playwright',
        url: 'http://example.com/like',
      })

      await openBlog(page, 'Blog to like', 'Playwright')
      await page.getByRole('button', { name: 'like' }).click()

      await expect(page.getByText('1 likes')).toBeVisible()
    })

    test('the creator can delete the blog', async ({ page }) => {
      await createBlog(page, {
        title: 'Blog to delete',
        author: 'Playwright',
        url: 'http://example.com/delete',
      })

      await openBlog(page, 'Blog to delete', 'Playwright')

      page.on('dialog', (dialog) => dialog.accept())
      await Promise.all([
        page.waitForResponse(
          (response) =>
            response.url().includes('/api/blogs') &&
            response.request().method() === 'DELETE' &&
            response.status() === 204
        ),
        page.getByRole('button', { name: 'remove' }).click(),
      ])

      await expect(page).toHaveURL('/')
      await expect(
        page.getByRole('link', { name: 'Blog to delete Playwright' })
      ).not.toBeVisible()

      await page.reload()
      await expect(
        page.getByRole('link', { name: 'Blog to delete Playwright' })
      ).not.toBeVisible()
    })

    test('only the creator sees the remove button', async ({
      page,
      request,
    }) => {
      await createBlog(page, {
        title: 'Blog of tester',
        author: 'Playwright',
        url: 'http://example.com/owner',
      })

      await page.getByRole('button', { name: 'logout' }).click()

      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Other User',
          username: 'other',
          password: 'secret',
        },
      })
      await loginWith(page, 'other', 'secret')

      await openBlog(page, 'Blog of tester', 'Playwright')

      await expect(
        page.getByRole('button', { name: 'like' })
      ).toBeVisible()
      await expect(
        page.getByRole('button', { name: 'remove' })
      ).not.toBeVisible()
    })

    test('blogs are ordered by likes, most liked first', async ({
      page,
    }) => {
      await createBlog(page, {
        title: 'First blog',
        author: 'Playwright',
        url: 'http://example.com/1',
      })
      await createBlog(page, {
        title: 'Second blog',
        author: 'Playwright',
        url: 'http://example.com/2',
      })
      await createBlog(page, {
        title: 'Third blog',
        author: 'Playwright',
        url: 'http://example.com/3',
      })

      await openBlog(page, 'Second blog', 'Playwright')
      await page.getByRole('button', { name: 'like' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('2 likes')).toBeVisible()

      await openBlog(page, 'Third blog', 'Playwright')
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('1 likes')).toBeVisible()

      await page.goto('/')
      const blogs = page.locator('.blog')

      await expect(blogs.nth(0)).toContainText('Second blog')
      await expect(blogs.nth(1)).toContainText('Third blog')
      await expect(blogs.nth(2)).toContainText('First blog')
    })
  })
})
