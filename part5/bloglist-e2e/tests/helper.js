const { expect } = require('@playwright/test')

const loginWith = async (page, username, password) => {
  await page.goto('/login')
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await Promise.all([
    page.waitForResponse((response) =>
      response.url().includes('/api/login')
    ),
    page.getByRole('button', { name: 'login' }).click(),
  ])
}

const createBlog = async (page, { title, author, url }) => {
  await page.getByRole('link', { name: 'new blog' }).click()
  await page.getByLabel('title').fill(title)
  await page.getByLabel('author').fill(author)
  await page.getByLabel('url').fill(url)
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes('/api/blogs') &&
        response.request().method() === 'POST'
    ),
    page.getByRole('button', { name: 'create' }).click(),
  ])
  await expect(
    page.getByRole('link', { name: `${title} ${author}` })
  ).toBeVisible()
}

const openBlog = async (page, title, author) => {
  await page.goto('/')
  await page.getByRole('link', { name: `${title} ${author}` }).click()
}

module.exports = { loginWith, createBlog, openBlog }
