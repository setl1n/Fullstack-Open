const blogsRouter = require('express').Router()
const Blog = require('../models/Blog')
const User = require('../models/user')
require('express-async-errors')
const logger = require('../utils/logger')

blogsRouter.get('', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogsRouter.post('', async (request, response) => {
  const blog = new Blog(request.body)
  logger.info('adding: ', request.body)

  const user = (await User.find({}))[0]
  blog.user = user.id
  logger.info('user for blog: ', user.username)

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).send()
})

blogsRouter.put('/:id', async (request, response) => {
  let sentBlog = request.body
  let updatedBlog = await Blog.findByIdAndUpdate(request.params.id, sentBlog, { new: true })
  if (!updatedBlog) {
    return response.status(404).send({ error: 'Blog not found' })
  }
  response.send(updatedBlog)
})

module.exports = blogsRouter