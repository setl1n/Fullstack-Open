import { render, screen } from '@testing-library/react'
import Blog from './Blog'

describe('rendering blogs by default', () => {
  let component

  beforeEach(() => {
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
    component = render(<Blog blog={sampleBlog}/>)
  })
  test('renders the blog\'s title', () => {
    const renderedTitle = component.getByText(/My christmas story/)
    expect(renderedTitle).toBeDefined()
  })
  test('renders the blog\'s author', async () => {
    const renderedAuthor = component.getByText(/Santa Claus/)
    expect(renderedAuthor).toBeDefined()
  })
  test('does not render the blog\'s likes and URL', () => {
    const hiddenLikes = component.container.querySelector('.likesAndUrl')
    expect(hiddenLikes).toHaveStyle('display: none')
  })
})