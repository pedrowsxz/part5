import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')

  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationClass, setNotificationClass] = useState(null)


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])
  
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      
      blogService.setToken(user.token)
      setUser(user)
      setPassword('')

      setNotificationClass('success')
      setNotificationMessage('logged in')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    } catch (exception) {
      console.error('Login error:', exception.response.data.error)
      setNotificationClass('error')
      setNotificationMessage('Wrong name or password')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }

  const createBlog = async (blogObject) => {
    const blog = await blogService.create(blogObject)
    setBlogs(blogs.concat(blog))

    setNotificationClass('success')
    setNotificationMessage(`a new blog ${blog.title} by ${user.name} added`)
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
  }

  const deleteBlog = async (id) => {
    const selectedBlog = blogs.find(blog => blog.id === id)
    if (confirm(`Remove ${selectedBlog.title} by ${user.name}?`) === true) {
      const response = await blogService.remove(selectedBlog.id)
      const blogsFiltered = [...blogs].filter(blog => blog.id !== selectedBlog.id)
      setBlogs(blogsFiltered)

      setNotificationClass('success')
      setNotificationMessage(`blog ${selectedBlog.title} by ${user.name} removed`)
      setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
    } else {
      return
    }
  }

  const handleLike = async (id) => {
    const selectedBlog = blogs.find(blog => blog.id === id)
    const likedBlog = {
      ...selectedBlog,
      likes: selectedBlog.likes + 1
    }
    const response = await blogService.update(id, likedBlog)
    const updatedBlogs = blogs.map(blog => blog.id === response.id ? response : blog)
    setBlogs(updatedBlogs)
  }

  if (user === null) {
    return (
      <div>
        <Notification className={notificationClass} message={notificationMessage} />
        <LoginForm onSubmit={handleLogin} 
                  onUsernameChange={({ target }) => setUsername(target.value)} 
                  onPasswordChange={({ target }) => setPassword(target.value)} 
                  username={username} 
                  password={password} />
      </div>
    )
  }

  return (
    <div>
      <Notification className={notificationClass} message={notificationMessage} />
      <h2>blogs</h2>
      <p>
        {user.username} logged in
        <button onClick={handleLogout}>logout</button>  
      </p>
      <Togglable buttonLabel={'new blog'} buttonLabel2={'cancel'}>
        <BlogForm createBlog={createBlog} />
      </Togglable>
      {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} user={user} handleDeleteButton={deleteBlog} handleLikeButton={handleLike}/>
      )}
    </div>
  )
}

export default App