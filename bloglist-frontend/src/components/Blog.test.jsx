import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'

test('renders the blog title and author, but does not render its URL or number of likes by default', () => {
  const blog = {
    title: 'test title',
    author: 'test author',
    url: 'test url',
    likes: 15
  }

  render(<Blog blog={blog} />)

  expect(screen.getByText('test title')).toBeDefined()
  expect(screen.getByText('test author')).toBeDefined()
  expect(screen.queryByText('test url')).not.toBeDefined()
  expect(screen.queryByText('15')).not.toBeDefined()
})

test('blog URL and number of likes are shown when the button view is clicked', async () => {

  const blog = {
    title: 'test title',
    author: 'test author',
    url: 'test url',
    likes: 15
  }

  render(<Blog blog={blog} />)


  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  expect(screen.queryByText('test url')).toBeDefined()
  expect(screen.queryByText('15')).toBeDefined()
})

test('if the like button is clicked twice, the event handler the component received as props is called twice', async () => {
  const blog = {
    title: 'test title',
    author: 'test author',
    url: 'test url',
    likes: 15
  }
  
  const mockHandler = vi.fn()

  render(
    <Blog blog={blog} handleLikeButton={mockHandler} />
  )

  const user = userEvent.setup()
  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)

  expect(screen.getByText('17')).toBeDefined()
})

test('form calls the event handler it received as props with the right details when a new blog is created', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  const { container } = render(<BlogForm createBlog={createBlog} />)

  const inputTitle = container.querySelector('#title-input')
  const inputAuthor = container.querySelector('#author-input')
  const inputUrl = container.querySelector('#url-input')
  
  const createButton = screen.getByText('create')

  await user.type(inputTitle, 'test title')
  await user.type(inputAuthor, 'test author')
  await user.type(inputUrl, 'testurl.com')

  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('test title')
  expect(createBlog.mock.calls[0][0].author).toBe('test author')
  expect(createBlog.mock.calls[0][0].url).toBe('testurl.com')
})
