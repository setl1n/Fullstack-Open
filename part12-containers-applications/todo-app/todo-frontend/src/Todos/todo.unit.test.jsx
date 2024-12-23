import { render, screen } from '@testing-library/react'
import Todo from './Todo'

let sampleTodo = {
    "text": "Write code 2",
    "done": true
}
test('renders the blog\'s title', () => {
    render(<Todo todo={sampleTodo} />)
    const renderedTitle = screen.getByText('Write code 2', { exact: false })
    expect(renderedTitle).toBeDefined()
})