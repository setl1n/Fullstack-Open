const { test, after , beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/Blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  for (let blog of helper.initialBlogs) {
    let newBlog = new Blog(blog)
    await newBlog.save()
  }
})

describe('when there are blogs saved', () => {
  test('blogs are returned as json', async () => {
    const res = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    assert.equal(res.body.length, helper.initialBlogs.length)
  })

  test('unique identifier is id', async () => {
    const res = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    assert.equal(res.body[0].id, helper.initialBlogs[0]._id)
  })
  describe('posting a new blog', () => {
    test('(valid) adds to database', async () => {
      let newBlog =
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  }

      const res = await api.post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      // check same length
      const blogsAfterAdding = await helper.blogsInDb()
      assert.strictEqual(blogsAfterAdding.length, helper.initialBlogs.length + 1)

      // check content is correct
      assert.strictEqual(res.body.title, newBlog.title)
      assert.strictEqual(res.body.author, newBlog.author)
      assert.strictEqual(res.body.url, newBlog.url)
      assert.strictEqual(res.body.likes, newBlog.likes)
    })

    test(' without "likes" defaults "likes" to 0', async () => {
      let newBlog =
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
  }

      const res = await api.post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      // check same length
      const blogsAfterAdding = await helper.blogsInDb()
      assert.strictEqual(blogsAfterAdding.length, helper.initialBlogs.length + 1)

      // check content is correct
      assert.strictEqual(res.body.title, newBlog.title)
      assert.strictEqual(res.body.author, newBlog.author)
      assert.strictEqual(res.body.url, newBlog.url)
      assert.strictEqual(res.body.likes, 0)
    })

    test(' with empty title returns 400 bad request', async () => {
      let newBlog =
  {
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  }
      await api.post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogListAfterAdding = await helper.blogsInDb()
      assert.strictEqual(blogListAfterAdding.length, helper.initialBlogs.length)
    })

    test(' with empty url returns 400 bad request', async () => {
      let newBlog =
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    likes: 2,
  }
      await api.post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogListAfterAdding = await helper.blogsInDb()
      assert.strictEqual(blogListAfterAdding.length, helper.initialBlogs.length)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})