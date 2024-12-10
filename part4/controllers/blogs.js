const blogsRouter = require('express').Router()
const Blog = require('../models/Blog')
const logger = require('../utils/logger')

blogsRouter.get('', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('', (request, response) => {
  const blog = new Blog(request.body)
  logger.info(request.body)
  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})
module.exports = blogsRouter