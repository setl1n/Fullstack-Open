import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import NewBlog from './components/NewBlog'
import Togglable from './components/Togglable'
import { ErrorNotification, SuccessNotification } from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [successNotification, setSuccessNotification] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  useEffect(async () => {
    async function fetchBlogs() {
      let blogs = await blogService.getAll()
      setBlogs(blogs.sort((blog1, blog2) => blog2.likes - blog1.likes))

    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedInUser', JSON.stringify(user)
      )
      setUser(user)
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    console.log('logging out')
    window.localStorage.removeItem('loggedInUser')
    blogService.setToken(null)
    setUser(null)
  }

  const createNewBlog = async (newBlog) => {
    try {
      console.log("new blog received on app:", newBlog)
      const retBlog = await (blogService.create(newBlog))
      console.log("retBlog: ", retBlog)
      blogFormRef.current.toggleVisibility()
      setBlogs(blogs.concat(retBlog))
      setSuccessNotification(`a new blog ${retBlog.name} by ${retBlog.author} added`)
      setTimeout(() => {
        setSuccessNotification(null)
      }, 5000)
    } catch (error) {
      setErrorMessage('Could not create new blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      throw new Error(error.message)
    }
  }

  const likeBlog = async (newlyLikedBlog) => {
    try {
      const retBlog = await (blogService.update(newlyLikedBlog))
      console.log("newly liked returned: ", retBlog)
      setBlogs(blogs.map((blog) => blog.id === newlyLikedBlog.id ? retBlog : blog).sort((blog1, blog2) => blog2.likes - blog1.likes))
    } catch (error) {
      setErrorMessage('Could not like blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      throw new Error(error.message)
    }
  }

  if (!user)
    return (
      <>
        <h2>log in to application</h2>
        <ErrorNotification message={errorMessage} />
        <SuccessNotification message={successNotification} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </>
    )
  return (
    <div>
      <ErrorNotification message={errorMessage} />
      <SuccessNotification message={successNotification} />
      <h2>blogs</h2>
      <div>{user.name} logged in
        <button type="button" onClick={handleLogout}>log out</button>
      </div>
      <br />
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <NewBlog createNewBlog={createNewBlog} />
      </Togglable>
      <br />
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} likeBlog={likeBlog}/>
      )}
    </div>
  )
}

export default App