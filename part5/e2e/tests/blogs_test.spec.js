const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith , createNewBlog } = require('./helper')

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
    await loginWith(page, 'testUser', 'StrongPassword')
  })

  test('a new blog can be created', async ({ page }) => {
    await createNewBlog(page, 'A blog about testing', 'An amazing guy', 'google.com' )
    await expect(page.getByText('A blog about testing - by An amazing guy')).toBeVisible()
  })
})