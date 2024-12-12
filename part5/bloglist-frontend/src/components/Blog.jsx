import { useState } from 'react'

const Blog = ({ blog, likeBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLikeButton = async (event) => {
    event.preventDefault()
    let newlyLikedBlog = { id: blog.id , user: blog.user.id, likes: blog.likes + 1, author: blog.author, title: blog.title, url: blog.url }
    await likeBlog(newlyLikedBlog)
  }


  return (
    <div style={blogStyle} >
      <div>
        {blog.title}
        <button style={hideWhenVisible} onClick={toggleVisibility}>view</button>
        <button style={showWhenVisible} onClick={toggleVisibility}>hide</button>
      </div>
      <div style={showWhenVisible}>
        {blog.author}
        <br />
        {blog.url}
        <br />
        likes {blog.likes} <button onClick={handleLikeButton}>like</button>
        <br />
        {blog.user.name}
      </div>
    </div >
  )
}

export default Blog