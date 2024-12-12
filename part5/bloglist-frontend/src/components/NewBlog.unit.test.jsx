import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewBlog from './NewBlog'

test('submit form submits with correct inputs', async () => {
  const createNewBlog = vi.fn()
  const user = userEvent.setup()
  let container = render(<NewBlog createNewBlog={createNewBlog}/>)
  const titleInput = screen.getByPlaceholderText('title of blog')
  await user.type(titleInput, 'Title of New Blog')
  const authorInput = screen.getByPlaceholderText('author')
  await user.type(authorInput, 'A Smart Fella')
  const urlInput = screen.getByPlaceholderText('link to blog')
  await user.type(urlInput, 'UrlofNewBlog.com')

  const submitButton = screen.getByText('create')
  screen.debug()
  await user.click(submitButton)
  expect(createNewBlog.mock.calls).toHaveLength(1)
  expect(createNewBlog.mock.calls[0][0].title).toBe('Title of New Blog')
  expect(createNewBlog.mock.calls[0][0].author).toBe('A Smart Fella')
  expect(createNewBlog.mock.calls[0][0].url).toBe('UrlofNewBlog.com')
})