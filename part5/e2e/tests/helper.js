const loginWith = async (page, username, password)  => {
  await page.getByTestId('username-field').fill(username)
  await page.getByTestId('password-field').fill(password)
  await page.getByRole('button', {name: 'login'}).click()
}

const createNewBlog = async (page, title, author, url) => {
  await page.getByRole('button', {name: 'new blog'}).click()
  await page.getByPlaceholder('title of blog').fill(title)
  await page.getByPlaceholder('author').fill(author)
  await page.getByPlaceholder('link to blog').fill(url)
  await page.getByRole('button', {name: 'create'}).click()
}

export { loginWith , createNewBlog }