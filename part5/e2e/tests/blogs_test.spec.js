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
  await request.post('/api/users', {
    data: {
      name: "Mr Kay Poh",
      username:'kayPohUser',
      password:"KayPohPassword"
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

  test('blogs are ordered by likes', async ({ page }) => {
    await createNewBlog(page, 'A blog about testing', 'An amazing guy', 'google.com' )
    await createNewBlog(page, 'A second blog about testing', 'Another amazing guy', 'google.com' )
    await createNewBlog(page, 'A third blog about testing', 'Last amazing guy', 'google.com' )
    await page.getByText('A second blog about testing - by Another amazing guy').locator('..').getByRole('button', { name: 'view' }).click()
    await page.getByText('A second blog about testing - by Another amazing guy').locator('..').locator('..').getByRole('button', { name: 'like' }).click()
    await page.getByText('A second blog about testing - by Another amazing guy').locator('..').locator('..').getByRole('button', { name: 'like' }).click()
    await page.getByText('A third blog about testing - by Last amazing guy').locator('..').getByRole('button', { name: 'view' }).click()
    await page.getByText('A third blog about testing - by Last amazing guy').locator('..').locator('..').getByRole('button', { name: 'like' }).click()
    await page.getByText('A third blog about testing - by Last amazing guy').locator('..').locator('..').getByRole('button', { name: 'like' }).click()
    await page.getByText('A third blog about testing - by Last amazing guy').locator('..').locator('..').getByRole('button', { name: 'like' }).click()
    await page.getByText('likes 3').waitFor()
    const titles = await page.getByTestId('blog-title').allTextContents();
    const expectedOrder = ['A third blog about testing - by Last amazing guy', 'A second blog about testing - by Another amazing guy', 'A blog about testing - by An amazing guy']
    expect(titles).toEqual(expectedOrder);
  })
})

test('only user who added blog can see delete button', async ({ page }) => {
  await loginWith(page, 'testUser', 'StrongPassword')
  await createNewBlog(page, 'A blog about testing', 'An amazing guy', 'google.com' )
  await page.getByRole('button', {name: 'log out'}).click()
  await loginWith(page, 'kayPohUser', 'KayPohPassword')
  await page.getByRole('button', {name: 'view'}).click()

  await expect(page.getByRole('button', {name: 'delete'})).toBeHidden()
})
