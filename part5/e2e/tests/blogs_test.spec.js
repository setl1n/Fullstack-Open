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

  test('a new blog can be liked', async ({ page }) => {
    await createNewBlog(page, 'A blog about testing', 'An amazing guy', 'google.com' )
    await page.getByRole('button', {name: 'view'}).click()
    await page.getByRole('button', {name: 'like'}).click()
    await expect(page.getByText('likes 1')).toBeVisible()
  })

  test('a new blog can be deleted', async ({ page }) => {
    // have to add listener before trigger event for confirmation dialogs
    page.on('dialog', async (dialog) => {
      expect(dialog.type()).toBe('confirm'); // Ensure it's a confirmation dialog
      expect(dialog.message()).toBe('Remove blog A blog about testing by An amazing guy ?'); // Check the dialog message
      await dialog.accept(); // Simulate clicking "OK"
    });
    await createNewBlog(page, 'A blog about testing', 'An amazing guy', 'google.com' )
    await page.getByRole('button', {name: 'view'}).click()
    await page.getByRole('button', {name: 'delete'}).click()

    await expect(page.getByText('A blog about testing - by An amazing guy')).not.toBeVisible()
  })
})