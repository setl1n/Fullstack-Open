const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
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

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    await expect(page.getByRole('button', {name: 'login'})).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByTestId('username-field').fill('testUser')
      await page.getByTestId('password-field').fill('StrongPassword')
      await page.getByRole('button', {name: 'login'}).click()
      await expect(page.getByText('Mr Test logged in')).toBeVisible()
    })

    test('fails with wrong username', async ({ page }) => {
      await page.getByTestId('username-field').fill('wrongUsername')
      await page.getByTestId('password-field').fill('StrongPassword')
      await page.getByRole('button', {name: 'login'}).click()
      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('Wrong credentials')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
    })

    test('fails with wrong password', async ({ page }) => {
      await page.getByTestId('username-field').fill('testUser')
      await page.getByTestId('password-field').fill('wrongPassword')
      await page.getByRole('button', {name: 'login'}).click()
      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('Wrong credentials')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
    })
  })
})