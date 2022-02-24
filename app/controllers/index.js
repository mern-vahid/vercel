const Course = require('../../models/course')
const Users = require('../../models/users')
const whois = require('../../utils/whois')

exports.index = async (req, res) => {
    const courses = await Course.find({ status: true })
    const users = await Users.find({})
    console.log(users.id)
    console.log(courses.length)
    res.page('app/index', { title: 'Home', courses, users, whois })
}
