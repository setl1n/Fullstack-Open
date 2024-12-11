const { test, after , beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/Blog')
const bcrypt = require('bcrypt')
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()
  const passwordHash2 = await bcrypt.hash('sekret2', 10)
  const user2 = new User({ username: 'root2', passwordHash : passwordHash2 })
  await user2.save()
  await Blog.deleteMany({})
  for (let i = 0; i < 3; i++) {
    let newBlog = new Blog(helper.initialBlogs[i])
    newBlog.user = user._id
    await newBlog.save()
    user.blogs = user.blogs.concat(newBlog._id)
    await user.save()
  }
  for (let i = 3; i < helper.initialBlogs.length ; i++) {
    let newBlog = new Blog(helper.initialBlogs[i])
    newBlog.user = user2._id
    await newBlog.save()
    user2.blogs = user2.blogs.concat(newBlog._id)
    await user2.save()
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

  describe('posting a new blog', async () => {
    describe('not logged in', () => {
      test('(that is valid) returns 401', async () => {
        let newBlog =
          {
            title: 'Type wars',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
            likes: 2,
          }
        const res = await api.post('/api/blogs')
          .send(newBlog)
          .expect(401)
          .expect('Content-Type', /application\/json/)
        // check same length
        const blogsAfterAdding = await helper.blogsInDb()
        assert.strictEqual(blogsAfterAdding.length, helper.initialBlogs.length)
        assert(res.body.error.includes('missing token'))
      })

      test(' with empty title returns 401, not authenticated', async () => {
        let newBlog =
        {
          author: 'Robert C. Martin',
          url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
          likes: 2,
        }
        const res = await api.post('/api/blogs')
          .send(newBlog)
          .expect(401)

        const blogListAfterAdding = await helper.blogsInDb()
        assert.strictEqual(blogListAfterAdding.length, helper.initialBlogs.length)
        assert(res.body.error.includes('missing token'))
      })
    })

    describe('logged in', async () => {
      test('(that is valid), creates new blog', async () => {
        let newBlog =
        {
          title: 'Type wars',
          author: 'Robert C. Martin',
          url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
          likes: 2,
        }
        const loginReq = await api.post('/api/login')
          .send({ username: 'root2', password: 'sekret2' })
          .expect(200)

        const res = await api.post('/api/blogs')
          .set('Authorization', `Bearer ${loginReq.body.token}`)
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

      test('without "likes" defaults "likes" to 0', async () => {
        let newBlog =
          {
            title: 'Type wars',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
          }
        const loginReq = await api.post('/api/login')
          .send({ username: 'root2', password: 'sekret2' })
          .expect(200)

        const res = await api.post('/api/blogs')
          .set('Authorization', `Bearer ${loginReq.body.token}`)
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
        const loginReq = await api.post('/api/login')
          .send({ username: 'root2', password: 'sekret2' })
          .expect(200)
        await api.post('/api/blogs')
          .set('Authorization', `Bearer ${loginReq.body.token}`)
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
        const loginReq = await api.post('/api/login')
          .send({ username: 'root2', password: 'sekret2' })
          .expect(200)
        await api.post('/api/blogs')
          .set('Authorization', `Bearer ${loginReq.body.token}`)
          .send(newBlog)
          .expect(400)

        const blogListAfterAdding = await helper.blogsInDb()
        assert.strictEqual(blogListAfterAdding.length, helper.initialBlogs.length)
      })
    })
  })

  describe('deleting a blog', () => {
    test('(valid) reduces length of bloglist by 1', async () => {
      const idToDelete = '5a422a851b54a676234d17f7' // Assume this exists in the setup
      const loginReq = await api.post('/api/login')
        .send({ username: 'root', password: 'sekret' })
        .expect(200)
      await api
        .delete(`/api/blogs/${idToDelete}`)
        .set('Authorization', `Bearer ${loginReq.body.token}`) // Use valid token
        .expect(204)

      const blogListAfterDeleting = await helper.blogsInDb()
      assert.strictEqual(blogListAfterDeleting.length, helper.initialBlogs.length - 1)
    })

    test('that does not exist, does not change length of bloglist', async () => {
      const idToDelete = '5a422a851b54a676234d17f8' // Non-existent ID
      const loginReq = await api.post('/api/login')
        .send({ username: 'root', password: 'sekret' })
        .expect(200)
      await api
        .delete(`/api/blogs/${idToDelete}`)
        .set('Authorization', `Bearer ${loginReq.body.token}`)
        .expect(204)

      const blogListAfterDeleting = await helper.blogsInDb()
      assert.strictEqual(blogListAfterDeleting.length, helper.initialBlogs.length)
    })

    test('with invalid id returns 400', async () => {
      const idToDelete = 'invalid id' // Invalid format
      const loginReq = await api.post('/api/login')
        .send({ username: 'root', password: 'sekret' })
        .expect(200)
      await api
        .delete(`/api/blogs/${idToDelete}`)
        .set('Authorization', `Bearer ${loginReq.body.token}`)
        .expect(400)

      const blogListAfterDeleting = await helper.blogsInDb()
      assert.strictEqual(blogListAfterDeleting.length, helper.initialBlogs.length)
    })

    test('fails with invalid token', async () => {
      const idToDelete = '5a422a851b54a676234d17f7'
      await api
        .delete(`/api/blogs/${idToDelete}`)
        .set('Authorization', 'Bearer invalidtoken') // Invalid token
        .expect(401)
    })

    test('fails with expired token', async () => {
      const expiredToken =
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjY3NTg2ZTVhNDk0YjJjNjExOGVjMDVhMSIsImlhdCI6MTczMzg1MTUzMSwiZXhwIjoxNzMzODUxNTM2fQ.E7Wpcyxid1Wl2SZli8xcDloKsmFTD6VLvtRpjgu4G1g' // Example expired token
      const idToDelete = '5a422a851b54a676234d17f7'
      await api
        .delete(`/api/blogs/${idToDelete}`)
        .set('Authorization', expiredToken)
        .expect(401)
    })

    test('fails without token', async () => {
      const idToDelete = '5a422a851b54a676234d17f7'
      await api
        .delete(`/api/blogs/${idToDelete}`)
        .expect(401) // Unauthorized without token
    })
  })

  describe('updating likes of a blog', () => {
    test('with valid id updates in database', async () => {
      let idToUpdate = '5a422a851b54a676234d17f7'
      let updatedBlog =
        {
          title: 'React patterns',
          author: 'Michael Chan',
          url: 'https://reactpatterns.com/',
          likes: 2
        }
      let res = await api.put(`/api/blogs/${idToUpdate}`)
        .send(updatedBlog)
        .expect(200)

      assert.strictEqual(res.body.likes, 2)
    })

    test('that doesnt exists returns 404', async () => {
      // id does not exist
      let idToUpdate = '5a422a851b54a676234d17f8'
      let updatedBlog =
        {
          title: 'React patterns',
          author: 'Michael Chan',
          url: 'https://reactpatterns.com/',
          likes: 2
        }
      await api.put(`/api/blogs/${idToUpdate}`)
        .send(updatedBlog)
        .expect(404)
    })

    test('with invalid id returns 400', async () => {
      // id has wrong format
      let idToDelete = 'invalid id'
      let updatedBlog =
      {
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 2
      }
      await api.put(`/api/blogs/${idToDelete}`)
        .send(updatedBlog)
        .expect(400)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})