import Togglable from "./Togglable"

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5
}

const Blog = ({ blog, user, handleDeleteButton, handleLikeButton }) => (
  <div style={blogStyle} className='blog'>
    {blog.title} {blog.author}
    <Togglable buttonLabel={'view'} buttonLabel2={'hide'}>
      {blog.url}<br/>
      <div>
        <span>{blog.likes}</span><button onClick={() => handleLikeButton(blog.id)}>like</button>
      </div>
      {user.name}<br/>
      {user.username === blog.user.username && <button onClick={() => handleDeleteButton(blog.id)}>remove</button>}
    </Togglable>
  </div>  
)

export default Blog