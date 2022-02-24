const mongoose = require('mongoose')
const Yup = require('yup')

const model_schema = new mongoose.Schema(
    {
        //* User Information
        first_name: {
            type: String,
            minlength: 2,
            maxlength: 20,
            required: true,
        },
        last_name: {
            type: String,
            minlength: 3,
            maxlength: 20,
            required: true,
        },
        user_name: {
            type: String,
            maxlength: 30,
            minlength: 3,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            minlength: 6,
            // maxlength: 50,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        thumbnail: {
            type: String,
            default: '',
        },
        //* Perrmisions
        is_admin: {
            type: Boolean,
            default: false,
        },
        is_owner: {
            type: Boolean,
            default: false,
        },
        is_vip: {
            type: Boolean,
            default: false,
        },
        is_tech: {
            type: Boolean,
            default: false,
        },
        is_active: {
            type: Boolean,
            default: true,
        },
        is_verify: {
            type: Boolean,
            default: false,
        },
        //* Token
        verify_token: {
            type: String,
            default: null,
        },
        forgot_token: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
)

const vaild_schema = Yup.object().shape({
    first_name: Yup.string().min(2).max(20).required(),
    last_name: Yup.string().min(3).max(20).required(),
    user_name: Yup.string().min(3).max(20).required(),
    email: Yup.string().email().required(),
    password: Yup.string().min(6).max(50).required(),
    password_confirm: Yup.string()
        .oneOf([Yup.ref('password')], 'password !== password confirm')
        .required(),
})

model_schema.statics.valid = (body) => {
    return vaild_schema.validate(body, { abortEarly: false })
}

const Users = mongoose.model('user', model_schema)

module.exports = Users
