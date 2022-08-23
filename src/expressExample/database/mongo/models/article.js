const { model, Schema } = require('mongoose')
//price, image, description, name
const ArticleSchema = new Schema(
  {
    id: {
      required: true,
      type: String,
      unique: true
    },
    name: {
      required: true,
      type: String
    },
    description: {
      required: false,
      type: String
    },
    image: {
      required: true,
      type: String
    },
    price: {
      required: true,
      type: Number
    }
  },
  {
    timestamps: true,
    versionKey: false,
    toObject: {
      transform: (_, ret) => {
        delete ret._id
      }
    }
    /*virtuals: {
      fullName: {
        get() {
          return `${this.name} ${this.lastName}`
        }
      }
    }*/
  }
)

const ArticleModel = model('articles', ArticleSchema)

module.exports = ArticleModel
