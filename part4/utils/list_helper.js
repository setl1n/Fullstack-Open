const _ = require('lodash')

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }
  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const maxReducer = (maxSoFar, blog) => {
    return blog.likes > maxSoFar.likes ? blog : maxSoFar
  }
  return blogs.length === 0 ? null : blogs.reduce(maxReducer, blogs[0])
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  const mostWrittenAuthorWithBlogs = _.chain(blogs)
    .groupBy('author')
    .mapValues(group => _.size(group))
    .toPairs()
    .maxBy(pair => pair[1])
    .value()
  return {
    author: mostWrittenAuthorWithBlogs[0],
    blogs: mostWrittenAuthorWithBlogs[1]
  }
}

module.exports = {
  totalLikes, favoriteBlog, mostBlogs
}