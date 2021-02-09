// implement your posts router here
const express = require('express')
const router = express.Router()
const Post = require('./posts-model')

router.get('/', (req, res) => {
  Post.find()
    .then(post => {
      res.status(200).json(post)
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

router.get('/:id', (req, res) => {
  const id = req.params.id
  Post.findById(id)
    .then(post => {
      if (!post) {
        res.status(404).json({ message: 'No post found with given ID' })
      } else {
        res.status(200).json(post)
      }
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

router.post('/', (req, res) => {
  const { title, contents } = req.body
  if (!title || !contents) {
    res.status(404).json({ message: 'Please include title and content' })
  } else {
    Post.insert({ title, contents })
      .then(post => {
        Post.findById(post.id).then(post => {
          res.status(201).json(post)
        })
      })
      .catch(err => {
        res.status(500).json(err)
      })
  }
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  const { title, contents } = req.body
  if (!title || !contents) {
    res.status(404).json({ message: 'Please include title and content' })
  } else {
    Post.update(id, { title, contents })
      .then(post => {
        if (!post) {
          res.status(404).json({ message: 'No post found with given ID' })
        } else {
          Post.findById(id).then(post => {
            res.status(201).json(post)
          })
        }
      })
      .catch(err => {
        res.status(500).json(err)
      })
  }
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  Post.remove(id)
    .then(post => {
      if (!post) {
        res.status(404).json({ message: 'no post found with given id' })
      } else {
        res
          .status(200)
          .json({ message: `post with id ${id} deleted successfully` })
      }
    })
    .catch(() => {
      res.status(500).json({ message: `failed to delete post` })
    })
})

router.get('/:id/comments', (req, res) => {
  const id = req.params.id
  Post.findPostComments(id)
    .then(post => {
      if (!post) {
        res.status(404).json({ message: `no post found id ${id}` })
      } else if (post.length === 0) {
        res
          .status(404)
          .json({ message: `no comments associated with post id ${id}` })
      } else {
        res.status(200).json(post)
      }
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: 'there was an error retrieving comments' })
    })
})

module.exports = router
