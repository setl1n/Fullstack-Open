const { test, expect, beforeEach, describe } = require('@playwright/test')

beforeEach(async ({ page, request }) => {
  await request.post('/api/testing/reset')
  await request.post('/api/users', {
    data: {
      name: "Mr Test",
      username:'testUser',
      password:"StrongPassword"
    }
  })
  await page.goto('/')
})

describe('When logged in', () => {
  beforeEach(async ({ page }) => {
    await page.getByTestId('username-field').fill('testUser')
    await page.getByTestId('password-field').fill('StrongPassword')
    await page.getByRole('button', {name: 'login'}).click()
  })

  test('a new blog can be created', async ({ page }) => {
    await page.getByRole('button', {name: 'new blog'}).click()
    await page.getByPlaceholder('title of blog').fill('A blog about testing')
    await page.getByPlaceholder('author').fill('An amazing guy')
    await page.getByPlaceholder('link to blog').fill('google.com')
    await page.getByRole('button', {name: 'create'}).click()
    await expect(page.getByText('A blog about testing - by An amazing guy')).toBeVisible()
  })
})