import { useState } from 'react'

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle} >
      <div>
        {blog.title}
        <button style={hideWhenVisible} onClick={toggleVisibility}>view</button>
        <button style={showWhenVisible}onClick={toggleVisibility}>hide</button>
      </div>
      <div style={showWhenVisible}>
        {blog.author}
        <br/>
        {blog.url}
        <br/>
        likes {blog.likes} <button>like</button>
        <br/>
        {blog.user.name}
      </div>
    </div >
  )
}

export default Blog