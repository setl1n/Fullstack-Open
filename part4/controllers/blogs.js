const blogsRouter = require('express').Router()
const Blog = require('../models/Blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
require('express-async-errors')
const logger = require('../utils/logger')

blogsRouter.get('', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogsRouter.post('', async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
  const blog = new Blog(body)
  logger.info('adding: ', body)

  blog.user = user.id
  logger.info('user for blog: ', user.username)

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const loggedInUser = await User.findById(decodedToken.id)
  const foundBlog = await Blog.findById(request.params.id)
  if (foundBlog.user.toString() !== loggedInUser.id.toString()) {
    return response.status(403).json({ error: 'you`re not the author, you`re not authorised to delete this note! ' })
  }
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