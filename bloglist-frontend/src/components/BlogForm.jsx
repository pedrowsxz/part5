import { useState } from 'react'

const BlogForm = ({ createBlog }) => {

  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  
  const handleCreateBlog = async (event) => {
    event.preventDefault()
    
    const newBlogObject = { title: newTitle, author: newAuthor, url: newUrl }
    createBlog(newBlogObject)

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  const handleInputTitle = (event) => {
    setNewTitle(event.target.value)
  }
  const handleInputAuthor = (event) => {
    setNewAuthor(event.target.value)
  }
  const handleInputUrl = (event) => {
    setNewUrl(event.target.value)
  }

  return (
    <div className="formDiv">
      <h2>create new</h2>
      <form>
        <div>
          title:<input type="text" value={newTitle} name="Title" onChange={handleInputTitle} id='title-input'/>
        </div>
        <div>
          author:<input type="text" value={newAuthor} name="Author" onChange={handleInputAuthor} id='author-input'/>
        </div>
        <div>
          url:<input type="text" value={newUrl} name="Url" onChange={handleInputUrl} id='url-input'/>
        </div>
        <button type="submit" onClick={handleCreateBlog}>create</button>
      </form>
    </div>
  )
}

export default BlogForm