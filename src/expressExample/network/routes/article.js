const { Router } = require('express')
const { nanoid } = require('nanoid')
const jwt = require('jsonwebtoken')
/**
 * @param {Object} article
 * @param {String} article.name
 * @param {String} article.description
 * @param {String} article.image
 * @param {Number} article.price
 * @returns saved article
 */
const { mongo: { queries } } = require('../../database')
const response = require('./response')

const ArticleRouter = Router()
const {
  article: {
    getAllArticles,
    saveArticle,
    removeOneArticle,
    updateOneArticle,
    getOneArticle
  }
} = queries

ArticleRouter.route('/article/login')
.get(async (req, res) => {
  try {
    const {
      headers: { authorization }
    } = req
    const payload = { sub: '1234567890', name: 'John Doe' }
    const token = jwt.sign(payload, process.env.SECRET, {
      expiresIn: '2min'
    })

    console.log('token', token)

    response({ error: false, message: null, res, status: 200 })
  } catch (error) {
    console.error(error)
    response({ message: 'Internal server error', res })
  }
})

ArticleRouter.route('/article')
  .get(async (req, res) => {
    try {
      const {
        headers: { authorization }
      } = req

      if (!authorization) throw new httpErrors.Unauthorized('You are not allowed')

    const [tokenType, token] = authorization.split(' ')

    if (tokenType !== 'Bearer')
      throw new httpErrors.Unauthorized('You are not allowed')

    const payload = jwt.verify(token, process.env.SECRET)

    console.log(payload)

      const articles = await getAllArticles()

      response({ error: false, message: articles, res, status: 200 })
    } catch (error) {
      console.error(error)
      response({ message: 'Internal server error', res })
    }
  })
  .post(async (req, res) => {
    try {
      const { body: { name, description, image, price } } = req

      await saveArticle({
        id: nanoid(),
        name,
        description,
        image,
        price
      })
      response({ error: false, message: await getAllArticles(), res, status: 201 })
    } catch (error) {
      console.error(error)
      response({ message: 'Internal server error', res })
    }
  })

ArticleRouter.route('/article/:id')
  .get(async (req, res) => {
    try {
      const { params: { id } } = req
      const article = await getOneArticle(id)

      response({ error: false, message: article, res, status: 200 })
    } catch (error) {
      console.error(error)
      response({ message: 'Internal server error', res })
    }
  })
  .delete(async (req, res) => {
    try {
      const { params: { id } } = req

      await removeOneArticle(id)
      response({ error: false, message: await getAllArticles(), res, status: 200 })
    } catch (error) {
      console.error(error)
      response({ message: 'Internal server error', res })
    }
  })
  .patch(async (req, res) => {
    const {
      body: { name, description, image, price  },
      params: { id }
    } = req

    try {
      await updateOneArticle({ id, name, description, image, price })
      response({ error: false, message: await getAllArticles(), res, status: 200 })
    } catch (error) {
      console.error(error)
      response({ message: 'Internal server error', res })
    }
  })

module.exports = ArticleRouter

// JSON - DIC - BSON