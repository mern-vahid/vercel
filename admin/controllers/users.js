const layout = './layouts/admin'
const Users = require('../../models/users')
const check = require('../../utils/is')

exports.dashboadr = async (req, res) => {
    try {
        return res.page('auth/dashboard', { title: 'Dashboard' })
    } catch (error) {}
}

exports.users = async (req, res) => {
    try {
        const users = await Users.find({ is_admin: false, is_owner: false })
        return res.page('admin/users/index', {
            title: `Admin | Users`,
            layout,
            users,
            check,
        })
    } catch (error) {}
}

exports.admin = async (req, res) => {
    try {
        let admin = {}
        if (req.user.is_owner == true) {
            admin = await Users.find({
                $or: [{ is_admin: true }, { is_owner: true }],
            })
        } else {
            admin = await Users.find({ is_admin: true })
        }
        return res.page('admin/users/admin', {
            title: 'Admin Panel',
            layout,
            admin,
            check,
        })
    } catch (error) {}
}

exports.status = async (req, res) => {
    const { id, status } = req.params

    try {
        const user = await Users.findOne({ _id: id })
        if (!user) return res.code()
        if (status == 'active') {
            user.is_active = !user.is_active
            user.save()
        } else if (req.user.is_owner == true) {
            if (status == 'admin') {
                user.is_admin = !user.is_admin
            }
            if (status == 'vip') {
                user.is_vip = !user.is_vip
            }
            if (status == 'teacher') {
                user.is_tech = !user.is_tech
            }
            user.save()
        } else {
            return res.code()
        }
        return res.redirect('back')
    } catch (error) {}
}
