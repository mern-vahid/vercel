const mongoose = require('mongoose')
const Yup = require('yup')

const model_schema = new mongoose.Schema(
    {
        name: {
            type: String,
            min: 2,
            max: 15,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'course',
            required: true,
        },
        status: {
            type: Boolean,
            default: false,
        },
        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
    },
    { timestamps: true }
)

const valid_schema = Yup.object().shape({
    name: Yup.string().min(3).max(30).required().trim(),
})

model_schema.statics.valid = (body) => {
    return valid_schema.validate(body, { abortEarly: false })
}

model_schema.statics.findError = async (id) => {
    if (id.length != 24) return false

    const find = await mongoose.model('lesson_category').findById(id)

    if (!find) return false
    else return find
}

const Lesson_category = mongoose.model('lesson_category', model_schema)

module.exports = Lesson_category
