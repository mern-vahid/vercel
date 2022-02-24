const mongoose = require('mongoose')
const Yup = require('yup')

const model_schema = new mongoose.Schema(
    {
        name: {
            type: String,
            min: 2,
            max: 15,
            required: true,
            unique: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
        },
        root: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'category',
            default: null,
        },
        status: {
            type: Boolean,
            default: true,
        },
        create_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
    },
    { timestamps: true }
)

const valid_schema = Yup.object().shape({
    name: Yup.string().min(2).max(15).required().trim(),
})

model_schema.statics.valid = (body) => {
    return valid_schema.validate(body, { abortEarly: false })
}

model_schema.statics.findError = async (id) => {
    if (id.length != 24) return false

    const find = await mongoose.model('category').findById(id)

    if (!find) return false
    else return find
}

const Category = mongoose.model('category', model_schema)

module.exports = Category
