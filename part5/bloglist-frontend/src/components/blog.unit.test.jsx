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
let container

beforeEach(() => {
  container = render(
    <Blog blog={sampleBlog}/>
  ).container
})

describe('rendering blogs by default', () => {
  test('renders the blog\'s title', () => {
    const renderedTitle = screen.getByText('My christmas story', { exact: false })
    expect(renderedTitle).toBeDefined()
  })
  test('renders the blog\'s author', async () => {
    const renderedAuthor = screen.getByText('Santa Claus', { exact: false })
    expect(renderedAuthor).toBeDefined()
  })
  test('does not render the blog\'s likes and URL', () => {
    const hiddenLikes = container.querySelector('.likesAndUrl')
    expect(hiddenLikes).toHaveStyle('display: none')
  })
})

test('clicking view shows URL and likes', async () => {
  const user = userEvent.setup()
  const showButton = screen.getByText('view')
  await user.click(showButton)
  const likesAndUrlDiv = container.querySelector('.likesAndUrl')
  expect(likesAndUrlDiv).not.toHaveStyle('display: none')
})