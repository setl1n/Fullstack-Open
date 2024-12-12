import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { describe } from 'vitest'
let sampleBlog = {
  'title': 'My christmas story',
  'author': 'Santa Claus',
  'url': 'google.com/a-merry-christmas',
  'likes': 7,
  'user': {
    'username': 'root',
    'name': 'Superuser',
    'id': '67586e5a494b2c6118ec05a1'
  },
  'id': '67586e65494b2c6118ec05a4'
}

describe('rendering blogs by default', () => {
  test('renders the blog\'s title', () => {
    render(<Blog blog={sampleBlog}/>)
    const renderedTitle = screen.getByText('My christmas story', { exact: false })
    expect(renderedTitle).toBeDefined()
  })
  test('renders the blog\'s author', async () => {
    render(<Blog blog={sampleBlog}/>)
    const renderedAuthor = screen.getByText('Santa Claus', { exact: false })
    expect(renderedAuthor).toBeDefined()
  })
  test('does not render the blog\'s likes and URL', () => {
    let container = render(
      <Blog blog={sampleBlog}/>
    ).container
    const hiddenLikes = container.querySelector('.likesAndUrl')
    expect(hiddenLikes).toHaveStyle('display: none')
  })
})

test('clicking view shows URL and likes', async () => {
  let container = render(
    <Blog blog={sampleBlog}/>
  ).container
  const user = userEvent.setup()
  const showButton = screen.getByText('view')
  await user.click(showButton)
  const likesAndUrlDiv = container.querySelector('.likesAndUrl')
  expect(likesAndUrlDiv).not.toHaveStyle('display: none')
})

test('clicking like twice triggers event handler twice', async () => {
  const user = userEvent.setup()
  let likeBlogMock = vi.fn()
  render(<Blog blog={sampleBlog} likeBlog={likeBlogMock}/>)
  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)
  expect(likeBlogMock.mock.calls).toHaveLength(2)
})