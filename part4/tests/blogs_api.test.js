const { test, after , beforeEach } = require('node:test')
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
  console.log('all blogs from test file loaded onto mongoDB')
})

test('notes are returned as json', async () => {
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

after(async () => {
  await mongoose.connection.close()
})