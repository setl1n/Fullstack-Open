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

module.exports = {
  totalLikes, favoriteBlog
}