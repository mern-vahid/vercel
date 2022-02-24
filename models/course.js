const mongoose = require('mongoose')
const Yup = require('yup')

const model_schema = new mongoose.Schema(
    {
        name: {
            type: String,
            min: 3,
            max: 40,
            required: true,
            trim: true,
            unique: true,
        },
        slug: {
            type: String,
            required: true,
        },
        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        category: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'category',
                required: true,
            },
        ],
        status: {
            type: Boolean,
            default: false,
        },
        thumbnail: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
)

const valid_schema = Yup.object().shape({
    name: Yup.string().min(3).max(40).required().trim(),
})

model_schema.statics.valid = async (data) => {
    return valid_schema.validate(data, { abortEarly: false })
}

model_schema.statics.findError = async (id) => {
    if (id.length != 24) return false

    const find = await mongoose.model('course').findById(id)

    if (!find) return false
    else return find
}

const Courses = mongoose.model('course', model_schema)

module.exports = Courses
