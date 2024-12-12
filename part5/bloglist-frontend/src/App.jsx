import { useState, useEffect } from 'react'
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

  useEffect(() => {
    blogService.getAll().then(blogs => {
      console.log(blogs)
      setBlogs(blogs)
    }
    )
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
    event.preventDefault()
    try {
      console.log("new blog received on app:", newBlog)
      const retBlog = await (blogService.create(newBlog))
      console.log("retBlog: ", retBlog)
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
      <Togglable></Togglable>

      <br />
      <NewBlog createNewBlog={createNewBlog}/>
      <br></br>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App