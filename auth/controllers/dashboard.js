const { v4: uuid4 } = require('uuid')

const Users = require('../../models/users')

const { upload_image, delete_file } = require('../../utils/upload_image')

exports.profile = async (req, res) => {
    try {
        return res.page('auth/dashboard', { title: 'Dashboard' })
    } catch (error) {
        return res.code(500)
    }
}

exports._profile = async (req, res) => {
    const { first_name, last_name } = req.body
    try {
        const user = await Users.findById(req.user.id)

        const thumbnail = req.files ? req.files.thumbnail : {}
        console.log(thumbnail)
        if (thumbnail.data) {
            const now = new Date()
            const file_name = `${uuid4()}-${now.getFullYear()}-${now.getMonth()}-${now.getDay()}.${
                thumbnail.mimetype.split('/')[1]
            }`

            upload_image(
                '/static' + '/upload' + '/thumbnail',
                file_name,
                thumbnail.data
            )

            if (user.thumbnail.length > 0) {
                delete_file('/static/upload/thumbnail', user.thumbnail)
            }
            user.thumbnail = file_name
            await user.save()
        }

        first_name.length >= 3 ? (user.first_name = first_name) : null
        last_name.length >= 3 ? (user.last_name = last_name) : null
        user.save()
        return res.redirect('back')
    } catch (error) {
        console.log(error)
        return res.code(500)
    }
}

exports.delete_thumbnail = async (req, res) => {
    try {
        const user = await Users.findById(req.user.id)

        if (user.thumbnail.length > 0) {
            delete_file('/static/upload/thumbnail', user.thumbnail)
            user.thumbnail = ''
            user.save()
        }
        return res.redirect('back')
    } catch (error) {}
}
