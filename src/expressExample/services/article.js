const { mongo: { queries } } = require('../database')
const { article: { getOneArticle } } = queries

class ArticleService {
  #articleId

  /**
   * @param {String|undefined} articleId
   */
  constructor(articleId = '') {
    this.#articleId = articleId
  }

  async verifyArticleExists() {
    if (!this.#articleId)
      throw new Error('Missing required field: articleId')

    const article = await getOneArticle(this.#articleId)

    if (!article) throw new Error('Article not found')

    return article
  }
}

module.exports = ArticleService
